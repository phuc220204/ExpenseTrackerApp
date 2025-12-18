import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Spinner } from "@heroui/react";

/**
 * AuthGuard - Component bảo vệ routes cần xác thực
 * Redirect về /login nếu chưa đăng nhập
 * Lưu vị trí hiện tại để redirect lại sau khi login
 */
const AuthGuard = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Đang kiểm tra trạng thái đăng nhập
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner size="lg" color="primary" label="Đang kiểm tra đăng nhập..." />
      </div>
    );
  }

  // Chưa đăng nhập -> redirect về login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Đã đăng nhập -> render children
  return <Outlet />;
};

export default AuthGuard;
