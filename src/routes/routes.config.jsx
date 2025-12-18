import { lazy } from "react";

/**
 * Lazy load tất cả pages
 * Giúp tối ưu performance bằng code splitting
 */
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Statistics = lazy(() => import("../pages/Statistics/Statistics"));
const DataTools = lazy(() => import("../pages/DataTools/DataTools"));
const Login = lazy(() => import("../pages/Login"));
const Planning = lazy(() => import("../pages/Planning/Planning"));
const NotFound = lazy(() => import("../pages/NotFound"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../pages/TermsOfService"));

/**
 * Cấu hình routes của ứng dụng
 * Chia thành 3 loại: public, private, error
 */
export const routesConfig = {
  /**
   * Public Routes - Không cần đăng nhập
   */
  public: [
    {
      path: "/login",
      element: Login,
      title: "Đăng nhập",
      description: "Đăng nhập vào Ví Vi Vu",
    },
    {
      path: "/privacy-policy",
      element: PrivacyPolicy,
      title: "Chính sách bảo mật",
      description: "Chính sách bảo mật của Ví Vi Vu",
    },
    {
      path: "/terms-of-service",
      element: TermsOfService,
      title: "Điều khoản dịch vụ",
      description: "Điều khoản sử dụng Ví Vi Vu",
    },
  ],

  /**
   * Private Routes - Cần đăng nhập mới truy cập được
   * Tất cả routes này sẽ được wrap bởi Layout component
   */
  private: [
    {
      path: "/",
      element: Dashboard,
      title: "Trang chủ",
      description: "Tổng quan chi tiêu",
      index: true,
    },
    {
      path: "statistics",
      element: Statistics,
      title: "Thống kê",
      description: "Phân tích chi tiêu",
    },
    {
      path: "planning",
      element: Planning,
      title: "Kế hoạch",
      description: "Ngân sách và mục tiêu",
    },
    {
      path: "data-tools",
      element: DataTools,
      title: "Công cụ dữ liệu",
      description: "Import/Export dữ liệu",
    },
  ],

  /**
   * Error Routes - Xử lý lỗi
   */
  error: [
    {
      path: "*",
      element: NotFound,
      title: "Không tìm thấy",
      description: "Trang không tồn tại",
    },
  ],
};

export default routesConfig;
