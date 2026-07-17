import { useEffect, useState } from "react";

const STORAGE_KEY = "scan2order-theme";

export function useDarkMode(defaultDark = true) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return defaultDark;
    }

    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (storedTheme === "dark") return true;
    if (storedTheme === "light") return false;
    return defaultDark;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      window.localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      root.classList.remove("dark");
      window.localStorage.setItem(STORAGE_KEY, "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return {
    isDark,
    toggleTheme,
  };
}
