import { LayoutDashboard, PieChart, Database } from "lucide-react";

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
    path: "/data-tools",
    label: "Công cụ Dữ liệu",
    icon: Database,
  },
];

/**
 * Tên ứng dụng hiển thị trên Sidebar
 * @type {string}
 */
export const APP_NAME = "ExpenseTracker";

