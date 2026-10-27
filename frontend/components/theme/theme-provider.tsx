"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("nexwealth_theme") as Theme) || "dark";
    setThemeState(saved);
    applyThemeClass(saved);
    setMounted(true);
  }, []);

  const applyThemeClass = (t: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;
    if (t === "light") {
      root.classList.add("theme-light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      if (body) {
        body.classList.add("theme-light");
        body.classList.remove("dark");
        body.setAttribute("data-theme", "light");
      }
    } else {
      root.classList.remove("theme-light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      if (body) {
        body.classList.remove("theme-light");
        body.classList.add("dark");
        body.setAttribute("data-theme", "dark");
      }
    }
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem("nexwealth_theme", t);
    } catch {
      // Ignore
    }
    applyThemeClass(t);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
