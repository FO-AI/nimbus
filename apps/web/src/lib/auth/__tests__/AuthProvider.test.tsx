import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  accounts: [] as Array<{ name?: string; username: string }>,
  instance: {
    acquireTokenSilent: vi.fn(),
    acquireTokenRedirect: vi.fn(),
    getActiveAccount: vi.fn(() => null),
    loginRedirect: vi.fn(async () => undefined),
    logoutRedirect: vi.fn(async () => undefined),
    setActiveAccount: vi.fn(),
    ssoSilent: vi.fn(async () => ({})),
  },
}));

vi.mock("@azure/msal-browser", () => ({
  BrowserCacheLocation: { LocalStorage: "localStorage", SessionStorage: "sessionStorage" },
  InteractionRequiredAuthError: class InteractionRequiredAuthError extends Error {},
  InteractionStatus: { None: "none" },
  PublicClientApplication: class PublicClientApplication {
    constructor() {
      return authMocks.instance;
    }
  },
}));

vi.mock("@azure/msal-react", () => ({
  MsalProvider: ({ children }: { children: ReactNode }) => children,
  useIsAuthenticated: () => false,
  useMsal: () => ({
    instance: authMocks.instance,
    accounts: authMocks.accounts,
    inProgress: "none",
  }),
}));

vi.mock("@/lib/config", () => ({
  config: {
    authDisabled: false,
    entra: {
      apiScope: "api://test/access",
      clientId: "test-client",
      redirectUri: "http://localhost:3000",
      tenantId: "test-tenant",
    },
  },
}));

import { AuthProvider, useAuth } from "@/lib/auth/AuthProvider";
import { msalConfig } from "@/lib/auth/msalConfig";

function LoginProbe() {
  const { login, isReady } = useAuth();
  return (
    <>
      <button type="button" onClick={() => login("/home")}>
        Sign in
      </button>
      <span data-testid="ready">{String(isReady)}</span>
    </>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  authMocks.accounts = [];
});

it("passes the requested post-login page to MSAL", async () => {
  const user = userEvent.setup();
  render(
    <AuthProvider>
      <LoginProbe />
    </AuthProvider>,
  );

  await user.click(screen.getByRole("button", { name: "Sign in" }));

  expect(authMocks.instance.loginRedirect).toHaveBeenCalledWith({
    scopes: ["https://graph.microsoft.com/User.Read"],
    redirectStartPage: `${window.location.origin}/home`,
  });
});

describe("session persistence", () => {
  it("caches tokens in localStorage so a sign-in survives closing the tab", () => {
    expect(msalConfig.cache?.cacheLocation).toBe("localStorage");
  });

  it("mirrors redirect auth state into cookies", () => {
    expect(msalConfig.cache?.storeAuthStateInCookie).toBe(true);
    // Interaction state itself stays per-tab, not in long-lived storage.
    expect(msalConfig.cache?.temporaryCacheLocation).toBe("sessionStorage");
  });

  it("never starts a background MSAL interaction", async () => {
    // Regression: a speculative ssoSilent probe held MSAL's single interaction
    // slot for up to its 10s iframe timeout, during which `login()` returned
    // early and the "Sign in" button did nothing at all.
    render(
      <AuthProvider>
        <LoginProbe />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("ready")).toHaveTextContent("true"));
    expect(authMocks.instance.ssoSilent).not.toHaveBeenCalled();
  });

  it("can sign in immediately after load", async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <LoginProbe />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(authMocks.instance.loginRedirect).toHaveBeenCalledTimes(1);
  });
});
