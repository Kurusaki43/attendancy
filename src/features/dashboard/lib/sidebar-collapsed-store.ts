const STORAGE_KEY = 'attendancy-sidebar-collapsed';

const listeners = new Set<() => void>();

export function getSidebarCollapsedServerSnapshot() {
  return false;
}

export function getSidebarCollapsed() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function setSidebarCollapsed(value: boolean) {
  localStorage.setItem(STORAGE_KEY, String(value));
  listeners.forEach((listener) => listener());
}

export function subscribeSidebarCollapsed(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
