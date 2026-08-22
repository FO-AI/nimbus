import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  instance: {
    acquireTokenSilent: vi.fn(),
    acquireTokenRedirect: vi.fn(),
    getActiveAccount: vi.fn(() => null),
    loginRedirect: vi.fn(),
    logoutRedirect: vi.fn(),
    setActiveAccount: vi.fn(),
  },
}));

vi.mock("@azure/msal-browser", () => ({
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
    accounts: [],
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

function LoginProbe() {
  const { login } = useAuth();
  return (
    <button type="button" onClick={() => login("/home")}>
      Sign in
    </button>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
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
