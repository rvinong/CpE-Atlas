import { useSyncExternalStore } from 'react';
const noSubscription = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const reducedSnapshot = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
export function useBrowserReady() {
  return useSyncExternalStore(noSubscription, clientSnapshot, serverSnapshot);
}
export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, reducedSnapshot, serverSnapshot);
}
