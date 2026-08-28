import { LayoutDashboard, Compass, ListChecks, Send, Radar, BarChart3, FileText, Settings } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { TKey } from "@/lib/i18n/strings";

// Single source of truth for the app's primary destinations — shared by the
// desktop sidebar and the mobile nav so they can never drift. Labels are
// translation keys; components render them through useT().
export type NavItem = {
  href: string;
  labelKey: TKey;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  chipKey?: TKey;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "nav.today", icon: LayoutDashboard },
  { href: "/explore", labelKey: "nav.explore", icon: Compass, chipKey: "nav.newChip" },
  { href: "/pipeline", labelKey: "nav.pipeline", icon: ListChecks },
  { href: "/followups", labelKey: "nav.followups", icon: Send },
  { href: "/portals", labelKey: "nav.portals", icon: Radar },
  { href: "/analytics", labelKey: "nav.analytics", icon: BarChart3 },
  { href: "/cv", labelKey: "nav.cv", icon: FileText },
  { href: "/config", labelKey: "nav.config", icon: Settings },
];

export function isActivePath(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
