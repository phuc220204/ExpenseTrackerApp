import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Button } from "@heroui/react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { Wallet } from "lucide-react";

/**
 * Component trang đăng nhập
 * Hiển thị form đăng nhập với Google Authentication
 */
const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Xử lý đăng nhập bằng Google
   * Sử dụng signInWithPopup để mở popup đăng nhập Google
   * Sau khi thành công, chuyển hướng về Dashboard
   */
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Gọi signInWithPopup để đăng nhập bằng Google
      await signInWithPopup(auth, googleProvider);

      // Đăng nhập thành công, chuyển hướng về Dashboard
      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage =
          "Bạn đã đóng cửa sổ đăng nhập. Vui lòng thử lại và hoàn tất quá trình đăng nhập.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage =
          "Cửa sổ đăng nhập bị chặn bởi trình duyệt. Vui lòng cho phép popup và thử lại.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Yêu cầu đăng nhập đã bị hủy. Vui lòng thử lại.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody className="p-8 space-y-6">
          {/* Logo và Tiêu đề */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <img
                  src="/logoApp.png"
                  alt="Ví Vi Vu Logo"
                  className="w-12 h-12"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Ví Vi Vu
              </h1>
              <p className="text-lg font-medium text-primary-600 dark:text-primary-400 mt-2">
                Sống vi vu, không lo túi
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                Quản lý thu chi thông minh với AI, từ kế hoạch du lịch đến chi
                tiêu hằng ngày
              </p>
            </div>
          </div>

          {/* Nút đăng nhập Google */}
          <Button
            color="primary"
            size="lg"
            className="w-full"
            onPress={handleGoogleSignIn}
            isLoading={isLoading}
            startContent={
              !isLoading && (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )
            }
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập bằng Google"}
          </Button>

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-sm text-danger-600 dark:text-danger-400">
                {error}
              </p>
            </div>
          )}

          {/* Thông tin bổ sung */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Bằng cách đăng nhập, bạn đồng ý với các điều khoản sử dụng của chúng
            tôi
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
