import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress } from "@heroui/react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Component bảo vệ routes - chỉ cho phép truy cập khi đã đăng nhập
 * 
 * Logic:
 * - Nếu đang loading (kiểm tra auth state) -> Hiển thị Spinner
 * - Nếu chưa đăng nhập (!currentUser) -> Chuyển hướng về /login
 * - Nếu đã đăng nhập (currentUser) -> Render Outlet (các route con)
 */
const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  // Đang kiểm tra trạng thái đăng nhập
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <CircularProgress
          size="lg"
          aria-label="Đang tải..."
          classNames={{
            svg: "w-12 h-12",
          }}
        />
      </div>
    );
  }

  // Chưa đăng nhập -> Chuyển hướng về trang đăng nhập
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập -> Render các route con
  return <Outlet />;
};

export default PrivateRoute;

