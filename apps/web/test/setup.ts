import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * jsdom 24 implements neither layout nor the `<dialog>` top layer, so these
 * platform APIs are simply absent and any component touching them throws.
 * The shims restore just enough of the observable contract (the `open`
 * attribute and the `close` event) for component tests; what they cannot
 * reproduce — the modal focus trap, `::backdrop`, background inertness — is
 * covered by the Playwright specs, which run in a real browser.
 */
function shim<T extends object>(proto: T, key: keyof T, value: T[keyof T]) {
  if (typeof proto[key] === "function") return;
  Object.defineProperty(proto, key, { value, writable: true, configurable: true });
}

shim(Element.prototype, "scrollIntoView", function scrollIntoView() {});
shim(HTMLDialogElement.prototype, "showModal", function showModal(this: HTMLDialogElement) {
  this.setAttribute("open", "");
});
shim(HTMLDialogElement.prototype, "close", function close(this: HTMLDialogElement) {
  if (!this.hasAttribute("open")) return;
  this.removeAttribute("open");
  this.dispatchEvent(new Event("close"));
});

afterEach(() => {
  cleanup();
});
