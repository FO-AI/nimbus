import { render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  isAuthenticated: false,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock("@/lib/auth/AuthProvider", () => ({
  useAuth: () => ({ isAuthenticated: mocks.isAuthenticated }),
}));

import { useSignedInRedirect } from "@/lib/auth/useSignedInRedirect";

function Probe() {
  useSignedInRedirect("/home");
  return <p>Landing page</p>;
}

const initialUrl = window.location.href;

beforeEach(() => {
  vi.clearAllMocks();
  mocks.isAuthenticated = false;
});

afterEach(() => {
  window.history.replaceState({}, "", initialUrl);
});

it("leaves signed-out visitors on the public page", () => {
  render(<Probe />);
  expect(mocks.replace).not.toHaveBeenCalled();
});

it("sends a signed-in visitor straight to the app", () => {
  mocks.isAuthenticated = true;
  render(<Probe />);
  expect(mocks.replace).toHaveBeenCalledWith("/home");
});

it("honours an in-page anchor so section links still work", () => {
  mocks.isAuthenticated = true;
  window.history.replaceState({}, "", "/#steering-committee");
  render(<Probe />);
  expect(mocks.replace).not.toHaveBeenCalled();
});

it("honours an explicit ?stay=1 opt-out", () => {
  mocks.isAuthenticated = true;
  window.history.replaceState({}, "", "/?stay=1");
  render(<Probe />);
  expect(mocks.replace).not.toHaveBeenCalled();
});
