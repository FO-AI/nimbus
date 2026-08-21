// Per-service deployment: Key Vault + seed secrets.
//
// Group-scoped — deploys into an EXISTING resource group (never creates one).
//   az deployment group create -g rg-nimbus \
//     --template-file infra/bicep/deploy/key-vault.bicep \
//     --parameters dbAdminPassword=$SQL_ADMIN_PASSWORD
//
// Dependency order: requires `identity`, `observability`, and `postgres` —
// they are looked up by their deterministic names in this resource group so
// the seed secrets (appinsights-connection-string, database-url) can be
// composed here without a state file.
targetScope = 'resourceGroup'

@description('Prefix for resource names.')
param resourcePrefix string = 'nimbus'

@allowed(['dev', 'prod'])
param environmentName string = 'dev'

@description('Azure region. Defaults to the resource group location.')
param location string = resourceGroup().location

@description('PostgreSQL administrator login name (must match the postgres deployment).')
param dbAdminLogin string = 'citus'

@description('PostgreSQL administrator password (must match the postgres deployment). Used to compose the database-url seed secret.')
@secure()
param dbAdminPassword string

@description('Application database name (must match the postgres deployment).')
param databaseName string = 'nimbus0dev'

@description('PostgreSQL flexible server name override, for servers not deployed via deploy-postgres.sh (defaults to the deterministic pg-<prefix>-<env> name).')
param postgresServerName string = ''

@description('Azure AI Foundry API key, seeded as the foundry-api-key secret. Leave empty to skip (e.g. when using managed identity auth instead).')
@secure()
param foundryApiKey string = ''

var namePrefix = '${resourcePrefix}-${environmentName}'
var tags = {
  application: 'nimbus'
  environment: environmentName
}

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' existing = {
  name: 'id-${namePrefix}'
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' existing = {
  name: 'appi-${namePrefix}'
}

resource pg 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' existing = {
  name: !empty(postgresServerName) ? postgresServerName : 'pg-${namePrefix}'
}

// Full SQLAlchemy URL, delivered to the API via Key Vault (it embeds the
// admin password, so it must never appear as a plain env var).
var databaseUrl = 'postgresql+psycopg://${dbAdminLogin}:${dbAdminPassword}@${pg.properties.fullyQualifiedDomainName}:5432/${databaseName}?sslmode=require'

var baseSecrets = {
  'appinsights-connection-string': appInsights.properties.ConnectionString
  'database-url': databaseUrl
}

module keyVault '../modules/key-vault.bicep' = {
  name: 'keyVault'
  params: {
    namePrefix: namePrefix
    location: location
    tags: tags
    appPrincipalId: identity.properties.principalId
    seedSecrets: empty(foundryApiKey) ? baseSecrets : union(baseSecrets, { 'foundry-api-key': foundryApiKey })
  }
}

output keyVaultName string = keyVault.outputs.keyVaultName
output keyVaultUri string = keyVault.outputs.keyVaultUri
output keyVaultId string = keyVault.outputs.keyVaultId
