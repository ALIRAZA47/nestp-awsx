import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    gettingStarted: true,
    configuration: true,
    usage: true,
    tooling: true,
    advanced: true,
  });

  const groups = useMemo(
    () => [
      {
        id: "gettingStarted",
        title: "Getting Started",
        links: [
          { to: "/", label: "Overview" },
          { to: "/quickstart", label: "Quick Start" },
        ],
      },
      {
        id: "configuration",
        title: "Configuration",
        links: [
          { to: "/config", label: "Config Files" },
          { to: "/credentials", label: "Credentials" },
        ],
      },
      {
        id: "usage",
        title: "Usage",
        links: [
          { to: "/services", label: "Services" },
          { to: "/examples", label: "Examples" },
        ],
      },
      {
        id: "tooling",
        title: "Tooling",
        links: [{ to: "/cli", label: "CLI" }],
      },
      {
        id: "advanced",
        title: "Advanced",
        links: [{ to: "/overrides", label: "Overrides & Tokens" }],
      },
    ],
    [],
  );

  const toggleGroup = (id: string) => {
    setOpenGroups((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div>
          <div className="logo">AWSX</div>
          <span className="subtitle">Docs</span>
        </div>
      </div>
      <div className="sidebar-section">
        {groups.map((group) => (
          <div key={group.id} className="sidebar-group">
            <button
              className="sidebar-group-toggle"
              type="button"
              onClick={() => toggleGroup(group.id)}
              aria-expanded={openGroups[group.id]}
            >
              <span>{group.title}</span>
              <span className="chevron">{openGroups[group.id] ? "−" : "+"}</span>
            </button>
            <div
              className={`sidebar-links ${
                openGroups[group.id] ? "sidebar-links--open" : ""
              }`}
            >
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    ["sidebar-link", isActive ? "active" : ""].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <span className="caption">Current</span>
        <span className="current-route">{location.pathname}</span>
      </div>
    </aside>
  );
};

export default Sidebar;
