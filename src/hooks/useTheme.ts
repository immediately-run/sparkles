import { useCallback, useEffect, useState } from 'react';

// Custom hooks live in their own files (NOT alongside components) to satisfy the
// React Fast Refresh rule. `localStorage` is NOT guaranteed in the sandbox: the
// preview iframe can run with an opaque origin (no `allow-same-origin`), and
// touching `localStorage` then throws a SecurityError. Always access it through
// the guarded helpers below so the app degrades to an in-memory default instead
// of crashing on load.

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'immediately-run-app-theme';

function safeGetTheme(): Theme | null {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : null;
  } catch {
    return null;
  }
}

function safeSetTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (sandboxed/opaque origin) — theme stays in-memory.
  }
}

function readInitialTheme(): Theme {
  return safeGetTheme() ?? 'dark';
}

// Persists the color theme to localStorage and reflects it on <html> as a
// `data-theme` attribute, matching the CSS in index.css. `dark` is the default,
// represented by the absence of the attribute.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    safeSetTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggle };
}
