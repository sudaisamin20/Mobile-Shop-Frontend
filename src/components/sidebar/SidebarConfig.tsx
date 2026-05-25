// components/ui/SidebarConfig.tsx
// ─────────────────────────────────────────────
// BMZ Nav config — one place to define all routes for every admin role.
// Add/remove items here and every page using <Sidebar> updates automatically.
//
// Usage:
//   import { SidebarConfig } from "../../components/ui/SidebarConfig";
//   import type { BMZRole }   from "../../components/ui/SidebarConfig";
//
//   const role: BMZRole = "superadmin";          // from your auth store
//   const navItems = SidebarConfig[role];
// ─────────────────────────────────────────────

import {
  LayoutDashboard,
  Smartphone,
  ShoppingBag,
  Users,
  Wrench,
  ScanBarcode,
  BarChart3,
  Settings,
  Package,
  Tag,
  MessageSquare,
  UserCog,
  Store,
} from "lucide-react";
import type { NavItem } from "./Sidebar";

// ── Roles ─────────────────────────────────────
// Add new roles here as your app grows

export type BMZRole = "ADMIN" | "USER";

// ── Config ────────────────────────────────────

export const SidebarConfig: Record<BMZRole, NavItem[]> = {

  // ─── Super Admin — full access ───────────────
  ADMIN: [
    {
      key:   "dashboard",
      label: "Dashboard",
      icon:  LayoutDashboard,
      href:  "/admin/dashboard",
    },
    {
      key:   "phones",
      label: "Phones",
      icon:  Smartphone,
      href:  "/admin/phones",
      badge: 0,           // set dynamically from your store e.g. low-stock count
    },
    {
      key:   "orders",
      label: "Orders",
      icon:  ShoppingBag,
      href:  "/admin/orders",
      badge: 0,           // pending orders count
    },
    {
      key:   "inventory",
      label: "Inventory",
      icon:  Package,
      href:  "/admin/inventory",
    },
    {
      key:   "customers",
      label: "Customers",
      icon:  Users,
      href:  "/admin/customers",
    },
    {
      key:   "repairs",
      label: "Repairs",
      icon:  Wrench,
      href:  "/admin/repairs",
      badge: 0,           // pending repair jobs
    },
    {
      key:   "imei",
      label: "IMEI Scanner",
      icon:  ScanBarcode,
      href:  "/admin/imei-scanner",
    },
    {
      key:          "reports",
      label:        "Reports",
      icon:         BarChart3,
      href:         "/admin/reports",
      dividerAbove: true,
    },
    {
      key:   "staff",
      label: "Staff",
      icon:  UserCog,
      href:  "/admin/staff",
    },
    {
      key:   "settings",
      label: "Settings",
      icon:  Settings,
      href:  "/admin/settings",
    },
  ],

  // ─── Manager — no staff management ──────────
  manager: [
    {
      key:   "dashboard",
      label: "Dashboard",
      icon:  LayoutDashboard,
      href:  "/admin/dashboard",
    },
    {
      key:   "phones",
      label: "Phones",
      icon:  Smartphone,
      href:  "/admin/phones",
      badge: 0,
    },
    {
      key:   "orders",
      label: "Orders",
      icon:  ShoppingBag,
      href:  "/admin/orders",
      badge: 0,
    },
    {
      key:   "inventory",
      label: "Inventory",
      icon:  Package,
      href:  "/admin/inventory",
    },
    {
      key:   "customers",
      label: "Customers",
      icon:  Users,
      href:  "/admin/customers",
    },
    {
      key:   "repairs",
      label: "Repairs",
      icon:  Wrench,
      href:  "/admin/repairs",
      badge: 0,
    },
    {
      key:   "imei",
      label: "IMEI Scanner",
      icon:  ScanBarcode,
      href:  "/admin/imei-scanner",
    },
    {
      key:          "reports",
      label:        "Reports",
      icon:         BarChart3,
      href:         "/admin/reports",
      dividerAbove: true,
    },
  ],

  // ─── Staff — day-to-day operations only ──────
  staff: [
    {
      key:   "dashboard",
      label: "Dashboard",
      icon:  LayoutDashboard,
      href:  "/admin/dashboard",
    },
    {
      key:   "phones",
      label: "Phones",
      icon:  Smartphone,
      href:  "/admin/phones",
    },
    {
      key:   "orders",
      label: "Orders",
      icon:  ShoppingBag,
      href:  "/admin/orders",
      badge: 0,
    },
    {
      key:   "repairs",
      label: "Repairs",
      icon:  Wrench,
      href:  "/admin/repairs",
      badge: 0,
    },
    {
      key:   "imei",
      label: "IMEI Scanner",
      icon:  ScanBarcode,
      href:  "/admin/imei-scanner",
    },
  ],
};

export default SidebarConfig;