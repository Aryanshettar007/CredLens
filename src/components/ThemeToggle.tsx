"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const order: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const current = order.indexOf(theme);
    const next = order[(current + 1) % order.length];
    setTheme(next);
  };

  return (
    <button
      id="theme-toggle"
      onClick={cycleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-full
                 border border-border bg-secondary text-foreground
                 transition-all hover:bg-muted hover:scale-105
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Current theme: ${theme}. Click to switch.`}
      title={`Theme: ${theme}`}
    >
      {/* Sun icon */}
      <svg
        className={`h-4 w-4 transition-all ${
          theme === "light" ? "scale-100 rotate-0" : "scale-0 rotate-90"
        }`}
        style={{ position: theme === "light" ? "relative" : "absolute" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Moon icon */}
      <svg
        className={`h-4 w-4 transition-all ${
          theme === "dark" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
        }`}
        style={{ position: theme === "dark" ? "relative" : "absolute" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>

      {/* System icon */}
      <svg
        className={`h-4 w-4 transition-all ${
          theme === "system" ? "scale-100 rotate-0" : "scale-0 rotate-90"
        }`}
        style={{ position: theme === "system" ? "relative" : "absolute" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    </button>
  );
}
