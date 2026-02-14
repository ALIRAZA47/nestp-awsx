import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpenText,
  Braces,
  Cable,
  Cloud,
  Database,
  Download,
  KeyRound,
  Mail,
  MessageSquare,
  Route,
  Settings2,
  TerminalSquare,
  Wrench,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const docsNavigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/", icon: BookOpenText },
      { title: "Installation", href: "/installation", icon: Download },
      { title: "Web Analytics", href: "/web-analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "Core Config", href: "/configuration", icon: Settings2 },
      { title: "Credentials", href: "/credentials", icon: KeyRound },
      { title: "Dependency Injection", href: "/dependency-injection", icon: Cable },
    ],
  },
  {
    title: "Services",
    items: [
      { title: "Overview", href: "/services", icon: Cloud },
      { title: "S3", href: "/services/s3", icon: Database },
      { title: "SQS", href: "/services/sqs", icon: MessageSquare },
      { title: "SES", href: "/services/ses", icon: Mail },
      { title: "Route53", href: "/services/route53", icon: Route },
    ],
  },
  {
    title: "Tooling",
    items: [
      { title: "CLI", href: "/cli", icon: TerminalSquare },
      { title: "Examples", href: "/examples", icon: Wrench },
      { title: "API Reference", href: "/api-reference", icon: Braces },
    ],
  },
];
