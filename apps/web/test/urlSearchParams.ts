import { useSyncExternalStore } from "react";

/**
 * Stand-in for `next/navigation`'s `useSearchParams` for jsdom tests.
 *
 * The App Router patches `history.replaceState` so query changes made that way
 * re-render `useSearchParams` consumers; this mirrors that contract on top of
 * `window.location` so page tests can assert on real URL round-trips.
 */
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const snapshot = () => window.location.search;
const originalReplaceState = window.history.replaceState;

export function useSearchParamsMock() {
  const search = useSyncExternalStore(subscribe, snapshot, snapshot);
  return new URLSearchParams(search);
}

/** Patch `replaceState` to notify subscribers, like the App Router does. Returns a restore fn. */
export function installHistorySync() {
  window.history.replaceState = function replaceState(
    this: History,
    ...args: Parameters<History["replaceState"]>
  ) {
    originalReplaceState.apply(this, args);
    notify();
  };
  return () => {
    window.history.replaceState = originalReplaceState;
  };
}

/** Set the current URL as if the page had been loaded (or navigated back) to it. */
export function setUrl(path: string) {
  originalReplaceState.call(window.history, null, "", path);
  notify();
}
