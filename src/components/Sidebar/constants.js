import { LayoutDashboard, PieChart, Database, PiggyBank } from "lucide-react";

/**
 * Tên ứng dụng hiển thị trên Sidebar
 * @type {string}
 */
export const APP_NAME = "ExpenseTracker";

/**
 * Danh sách các menu items cho navigation
 * @type {Array<{path: string, label: string, icon: React.ComponentType}>}
 */
export const MENU_ITEMS = [
  {
    path: "/",
    label: "Tổng Quan",
    icon: LayoutDashboard,
  },
  {
    path: "/statistics",
    label: "Thống Kê",
    icon: PieChart,
  },
  {
    path: "/planning",
    label: "Kế hoạch",
    icon: PiggyBank,
  },
  {
    path: "/data-tools",
    label: "Công cụ",
    icon: Database,
  },
];
