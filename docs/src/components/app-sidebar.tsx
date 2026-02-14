import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { docsNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export function AppSidebar({ collapsed, onNavigate }: AppSidebarProps) {
  const initialOpen = useMemo(
    () => docsNavigation.reduce<Record<string, boolean>>((acc, section) => {
      acc[section.title] = true;
      return acc;
    }, {}),
    [],
  );
  const flatItems = useMemo(
    () => docsNavigation.flatMap((section) => section.items),
    [],
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpen);

  return (
    <aside
      className={cn(
        "sticky top-0 self-start h-screen shrink-0 overflow-hidden border-r border-white/20 bg-card/35 shadow-[8px_0_30px_rgba(15,23,42,0.18)] backdrop-blur-3xl transition-all duration-300",
        collapsed ? "w-[84px]" : "w-[300px]",
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4">
        <img
          src="/awsx-logo.svg"
          alt="AWSX Logo"
          className="h-9 w-9 rounded-md border border-white/25 shadow-md shadow-slate-900/30"
        />
        {!collapsed ? (
          <div>
            <p className="text-sm font-semibold">AWSX Docs</p>
            <p className="text-xs text-muted-foreground">Guide</p>
          </div>
        ) : null}
      </div>
      <Separator className="bg-white/20" />
      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="space-y-4 p-3">
          {!collapsed ? <Badge variant="secondary">Documentation</Badge> : null}

          {collapsed ? (
            <div className="space-y-1">
              {flatItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        "flex h-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground",
                        isActive && "bg-accent/70 text-foreground",
                      )
                    }
                    title={item.title}
                  >
                    <ItemIcon className="h-4 w-4" />
                  </NavLink>
                );
              })}
            </div>
          ) : (
            docsNavigation.map((section) => (
              <Collapsible.Root
                key={section.title}
                open={openGroups[section.title]}
                onOpenChange={(value) =>
                  setOpenGroups((state) => ({
                    ...state,
                    [section.title]: value,
                  }))
                }
              >
                <Collapsible.Trigger
                  className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-accent/40"
                >
                  <span>{section.title}</span>
                  {openGroups[section.title] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Collapsible.Trigger>
                <Collapsible.Content className="mt-1 space-y-1">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground",
                            isActive && "bg-accent/60 font-medium text-foreground",
                          )
                        }
                      >
                        <ItemIcon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </NavLink>
                    );
                  })}
                </Collapsible.Content>
              </Collapsible.Root>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
