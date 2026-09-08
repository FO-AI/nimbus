"use client";

/**
 * App-wide authentication boundary.
 *
 * Exposes a small, MSAL-agnostic `useAuth()` context so components never touch
 * MSAL directly. This keeps all MSAL hooks inside `EntraAuthBridge`, which is
 * only mounted when auth is enabled — so local dev (`NEXT_PUBLIC_AUTH_DISABLED`)
 * needs no Entra configuration and no MSAL provider.
 */
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";
import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { apiRequest, getMsalInstance, loginRequest } from "@/lib/auth/msalConfig";
import { config } from "@/lib/config";

export interface AuthAccount {
  name: string;
  email: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  /**
   * False until MSAL has finished restoring any existing session. Callers must
   * wait for it before treating `isAuthenticated: false` as "signed out",
   * otherwise a returning user sees a flash of the signed-out UI.
   */
  isReady: boolean;
  authDisabled: boolean;
  account: AuthAccount | null;
  login: (redirectTo?: string) => void;
  logout: () => void;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

/** Local-dev value: a fixed, clearly-fake principal and a no-op token. */
const DISABLED_VALUE: AuthContextValue = {
  isAuthenticated: true,
  isReady: true,
  authDisabled: true,
  account: { name: "Local Developer", email: "dev@localhost" },
  login: () => {},
  logout: () => {},
  getToken: async () => null,
};

/** Server-render / pre-hydration value: nothing known yet, nothing signed in. */
const PENDING_VALUE: AuthContextValue = {
  isAuthenticated: false,
  isReady: false,
  authDisabled: false,
  account: null,
  login: () => {},
  logout: () => {},
  getToken: async () => null,
};

/** Bridges MSAL state into our AuthContext. Only mounted under MsalProvider. */
function EntraAuthBridge({ children }: { children: ReactNode }) {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const active = useMemo(() => instance.getActiveAccount() ?? accounts[0] ?? null, [instance, accounts]);
  const redirectStartedRef = useRef(false);
  const [restoreAttempted, setRestoreAttempted] = useState(false);

  useEffect(() => {
    if (!instance.getActiveAccount() && accounts[0]) {
      instance.setActiveAccount(accounts[0]);
    }
  }, [instance, accounts]);

  /*
   * Silent session restore.
   *
   * The persistent token cache covers a returning user whose tokens are still
   * cached. When the cache is empty but Entra still holds a session for this
   * browser, `ssoSilent` redeems that session in a hidden iframe (prompt=none)
   * and signs the user in with no interaction. It legitimately fails — no
   * session, or a browser blocking third-party cookies — in which case we fall
   * through to the normal sign-in button rather than forcing a redirect on a
   * visitor who may just be reading the public page.
   */
  useEffect(() => {
    if (restoreAttempted || inProgress !== InteractionStatus.None) return;
    // A cached account already settles the question — see `sessionSettled`.
    if (accounts.length > 0) return;

    let cancelled = false;
    void (async () => {
      try {
        await instance.ssoSilent(loginRequest);
      } catch {
        // Expected whenever there is no reusable Entra session.
      } finally {
        if (!cancelled) setRestoreAttempted(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accounts.length, inProgress, instance, restoreAttempted]);

  const login = useCallback((redirectTo?: string) => {
    if (inProgress !== InteractionStatus.None) return;

    const redirectStartPage = redirectTo
      ? new URL(redirectTo, window.location.origin).href
      : undefined;
    void instance.loginRedirect({ ...loginRequest, redirectStartPage });
  }, [instance, inProgress]);

  const logout = useCallback(() => {
    if (inProgress !== InteractionStatus.None) return;
    // Name the account so Entra ends this user's session rather than prompting
    // for an account picker, and clear the local cache with it.
    void instance.logoutRedirect({ account: instance.getActiveAccount() ?? undefined });
  }, [instance, inProgress]);

  const getToken = useCallback(async () => {
    if (!active || inProgress !== InteractionStatus.None) return null;

    try {
      const result = await instance.acquireTokenSilent({ ...apiRequest, account: active });
      return result.accessToken;
    } catch (error) {
      if (!(error instanceof InteractionRequiredAuthError)) {
        throw error;
      }

      if (redirectStartedRef.current) return null;
      redirectStartedRef.current = true;

      try {
        await instance.acquireTokenRedirect({ ...apiRequest, account: active });
      } catch (redirectError) {
        redirectStartedRef.current = false;
        throw redirectError;
      }
      return null;
    }
  }, [active, inProgress, instance]);

  // The session question is answered once MSAL has an account for us, or once
  // the silent restore has run and come back empty.
  const sessionSettled = accounts.length > 0 || restoreAttempted;

  const value = useMemo<AuthContextValue>(() => {
    const account: AuthAccount | null = active
      ? { name: active.name ?? active.username, email: active.username }
      : null;

    return {
      isAuthenticated,
      isReady: sessionSettled && inProgress === InteractionStatus.None,
      authDisabled: false,
      account,
      login,
      logout,
      getToken,
    };
  }, [active, getToken, inProgress, isAuthenticated, login, logout, sessionSettled]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Stable per-config choice — not a conditional hook.
  const instance = useMemo(() => (config.authDisabled ? null : getMsalInstance()), []);

  if (config.authDisabled) {
    return <AuthContext.Provider value={DISABLED_VALUE}>{children}</AuthContext.Provider>;
  }

  if (!instance) {
    // Server render: no browser storage to read, so no session to restore yet.
    return <AuthContext.Provider value={PENDING_VALUE}>{children}</AuthContext.Provider>;
  }

  return (
    <MsalProvider instance={instance}>
      <EntraAuthBridge>{children}</EntraAuthBridge>
    </MsalProvider>
  );
}
