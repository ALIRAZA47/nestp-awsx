import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

type ThemeMode = "light" | "dark";

const DEFAULT_THEME: ThemeMode = "light";

const readStoredTheme = (): ThemeMode => {
  const stored = window.localStorage.getItem("awsx-theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return DEFAULT_THEME;
};

const Layout = () => {
  const [theme, setTheme] = useState<ThemeMode>(DEFAULT_THEME);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("awsx-theme", theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 960px)");
    const handleChange = () => {
      setIsMobile(media.matches);
      setSidebarOpen(!media.matches);
    };
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const toggleThemeLabel = useMemo(
    () => (theme === "light" ? "Switch to dark" : "Switch to light"),
    [theme],
  );

  return (
    <div className={`layout ${sidebarOpen ? "" : "layout--collapsed"}`}>
      <Sidebar onNavigate={() => (isMobile ? setSidebarOpen(false) : null)} />
      <div className="content">
        <header className="topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((current) => !current)}
            type="button"
          >
            {sidebarOpen ? "Hide" : "Menu"}
          </button>
          <div className="topbar-actions">
            <button
              className="theme-toggle"
              onClick={() =>
                setTheme((current) => (current === "light" ? "dark" : "light"))
              }
              type="button"
            >
              {toggleThemeLabel}
            </button>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
