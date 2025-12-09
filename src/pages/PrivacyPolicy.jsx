import { Card, CardBody, CardHeader } from "@heroui/react";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Trang Chính Sách Bảo Mật
 * Public route - không cần đăng nhập
 */
const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Chính Sách Bảo Mật
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        <Card className="bg-white dark:bg-gray-900">
          <CardBody className="prose dark:prose-invert max-w-none p-6">
            <h2>1. Giới Thiệu</h2>
            <p>
              Chào mừng bạn đến với <strong>Sổ Thu Chi AI</strong>. Chúng tôi
              cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích
              cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của
              bạn.
            </p>

            <h2>2. Thông Tin Thu Thập</h2>
            <p>Chúng tôi thu thập các thông tin sau:</p>
            <ul>
              <li>
                <strong>Thông tin tài khoản Google:</strong> Email, tên hiển
                thị, ảnh đại diện (khi bạn đăng nhập bằng Google)
              </li>
              <li>
                <strong>Dữ liệu giao dịch:</strong> Các giao dịch thu chi bạn
                nhập vào ứng dụng
              </li>
              <li>
                <strong>Dữ liệu ngân sách:</strong> Thông tin ngân sách và kế
                hoạch chi tiêu
              </li>
              <li>
                <strong>API Key Gemini:</strong> Khóa API do bạn tự nhập (lưu
                trữ cục bộ trên thiết bị)
              </li>
            </ul>

            <h2>3. Cách Sử Dụng Thông Tin</h2>
            <p>Thông tin của bạn được sử dụng để:</p>
            <ul>
              <li>Xác thực và quản lý tài khoản của bạn</li>
              <li>Lưu trữ và hiển thị dữ liệu giao dịch</li>
              <li>Tạo báo cáo và thống kê tài chính cá nhân</li>
              <li>Cung cấp tính năng trợ lý AI (nếu bạn cung cấp API key)</li>
            </ul>

            <h2>4. Lưu Trữ Dữ Liệu</h2>
            <ul>
              <li>
                <strong>Cloud Firestore:</strong> Dữ liệu giao dịch được lưu
                trên Firebase (Google Cloud)
              </li>
              <li>
                <strong>LocalStorage:</strong> API Key Gemini chỉ lưu trên trình
                duyệt của bạn, không gửi lên server
              </li>
            </ul>

            <h2>5. Chia Sẻ Thông Tin</h2>
            <p>
              Chúng tôi <strong>KHÔNG</strong> bán, cho thuê hoặc chia sẻ thông
              tin cá nhân của bạn với bên thứ ba, ngoại trừ:
            </p>
            <ul>
              <li>Google (cung cấp dịch vụ xác thực và lưu trữ)</li>
              <li>Khi có yêu cầu pháp lý từ cơ quan có thẩm quyền</li>
            </ul>

            <h2>6. Bảo Mật</h2>
            <p>
              Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn ngành bao gồm:
            </p>
            <ul>
              <li>Kết nối HTTPS được mã hóa</li>
              <li>Firebase Security Rules để kiểm soát truy cập dữ liệu</li>
              <li>Xác thực OAuth 2.0 qua Google</li>
            </ul>

            <h2>7. Quyền Của Bạn</h2>
            <p>Bạn có quyền:</p>
            <ul>
              <li>Truy cập và xem dữ liệu của mình</li>
              <li>Chỉnh sửa hoặc xóa dữ liệu giao dịch</li>
              <li>Xuất dữ liệu (CSV, Excel, PDF)</li>
              <li>Xóa tài khoản và toàn bộ dữ liệu</li>
            </ul>

            <h2>8. Liên Hệ</h2>
            <p>
              Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua email:
              <a
                href="mailto:phuc220204@gmail.com"
                className="text-primary-500"
              >
                phuc220204@gmail.com
              </a>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
