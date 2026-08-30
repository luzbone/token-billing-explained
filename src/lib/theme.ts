export type Theme = "dark" | "light";

/** Keep in sync with the blocking script in index.html. */
export const THEME_STORAGE_KEY = "token-bill-theme";

export function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    /* private mode / blocked storage */
  }
  return "dark";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}
