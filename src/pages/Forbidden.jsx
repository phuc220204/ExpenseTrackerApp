import { Button } from "@heroui/react";
import { ShieldAlert, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Forbidden = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <ShieldAlert className="w-24 h-24 text-danger mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          403
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Không có quyền truy cập
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
          viên nếu bạn nghĩ đây là lỗi.
        </p>
        <Button
          as={Link}
          to="/"
          color="primary"
          variant="shadow"
          startContent={<Home className="w-4 h-4" />}
        >
          Trở về Trang chủ
        </Button>
      </div>
    </div>
  );
};

export default Forbidden;
