import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "scan2order-theme";

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(defaultDark: boolean): boolean {
  if (typeof window === "undefined") {
    return defaultDark;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === "dark") return true;
  if (storedTheme === "light") return false;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return true;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return false;

  return defaultDark;
}

export function ThemeProvider({
  children,
  defaultDark = true,
}: {
  children: ReactNode;
  defaultDark?: boolean;
}) {
  const [isDark, setIsDark] = useState(() => getInitialTheme(defaultDark));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    window.localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
