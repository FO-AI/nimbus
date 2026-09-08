/** MSAL (Microsoft Entra ID) browser configuration. */
import { BrowserCacheLocation, PublicClientApplication, type Configuration } from "@azure/msal-browser";

import { config } from "@/lib/config";

/** True only in the browser over HTTPS — used to force the cookie `Secure` flag. */
function isSecureOrigin(): boolean {
  return typeof window !== "undefined" && window.location.protocol === "https:";
}

export const msalConfig: Configuration = {
  auth: {
    clientId: config.entra.clientId,
    authority: `https://login.microsoftonline.com/${config.entra.tenantId}`,
    redirectUri: config.entra.redirectUri,
    postLogoutRedirectUri: config.entra.redirectUri,
    // Only ever hand tokens back to redirect URIs registered on the app.
    navigateToLoginRequestUrl: true,
  },
  cache: {
    /*
     * localStorage (not sessionStorage) is what makes a sign-in persist: the
     * token cache survives closing the tab or the browser, so a returning user
     * is restored silently instead of clicking "Sign in" again. Access tokens
     * are short-lived and the refresh token Entra issues to a SPA is
     * single-use and rotating, which bounds the blast radius of the XSS
     * exposure that browser-side storage inherently carries.
     */
    cacheLocation: BrowserCacheLocation.LocalStorage,
    // Interaction state (nonce/state/PKCE verifier) stays per-tab.
    temporaryCacheLocation: BrowserCacheLocation.SessionStorage,
    /*
     * Mirror that interaction state into cookies so the redirect round-trip to
     * login.microsoftonline.com survives browsers that partition or clear
     * storage across a top-level navigation (Safari ITP, strict privacy modes).
     */
    storeAuthStateInCookie: true,
    // Force `Secure` on those cookies wherever the origin can carry it.
    secureCookies: isSecureOrigin(),
  },
};

/** Scopes requested at login (OIDC basics). */
export const loginRequest = {
  scopes: ["https://graph.microsoft.com/User.Read"],
};

/** Scope requested to call the backend API. */
export const apiRequest = {
  scopes: [config.entra.apiScope],
};

let browserInstance: PublicClientApplication | null = null;

/**
 * Lazily-created MSAL singleton.
 *
 * One instance per browser tab, created outside React so StrictMode double
 * renders and fast refresh can't produce a second cache-owning client.
 * Returns null during server rendering, where there is no storage to read.
 */
export function getMsalInstance(): PublicClientApplication | null {
  if (typeof window === "undefined") return null;
  browserInstance ??= new PublicClientApplication(msalConfig);
  return browserInstance;
}
