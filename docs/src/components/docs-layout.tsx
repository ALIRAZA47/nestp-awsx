import { Github, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ThemeMode = "light" | "dark";

const DEFAULT_THEME: ThemeMode = "light";

const getInitialTheme = (): ThemeMode => {
  const saved = window.localStorage.getItem("awsx-docs-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : DEFAULT_THEME;
};

export function DocsLayout() {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");
    const listener = () => {
      setMobile(media.matches);
      setCollapsed(media.matches);
    };
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("awsx-docs-theme", theme);
  }, [theme]);

  const title = useMemo(() => "NestP AWSX", []);

  return (
    <div className="min-h-screen bg-background/85 text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[linear-gradient(140deg,rgba(34,211,238,0.22),rgba(16,185,129,0.08)_35%,rgba(0,0,0,0)_70%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.22),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.2),transparent_40%)]" />
      <div className="flex min-h-screen">
        <AppSidebar collapsed={collapsed} onNavigate={mobile ? () => setCollapsed(true) : undefined} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/20 bg-background/45 px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.16)] backdrop-blur-3xl md:px-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCollapsed((v) => !v)}>
                  {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
                <img
                  src="/awsx-logo.svg"
                  alt="AWSX Logo"
                  className="h-9 w-9 rounded-md border border-white/25 shadow-md shadow-slate-900/25"
                />
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">Complete package guide</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://github.com/ALIRAZA47/nestp-awsx" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Button>
                </a>
                <ThemeToggle
                  theme={theme}
                  onToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                />
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 lg:px-12">
            <div className="mx-auto w-full max-w-5xl space-y-6 rounded-2xl border border-white/15 bg-card/35 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.16)] backdrop-blur-3xl md:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Separator className="opacity-0" />
    </div>
  );
}
