import { Card, CardBody } from "@heroui/react";
import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Trang Điều Khoản Dịch Vụ
 * Public route - không cần đăng nhập
 */
const TermsOfService = () => {
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
            <FileText className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Điều Khoản Dịch Vụ
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        <Card className="bg-white dark:bg-gray-900">
          <CardBody className="prose dark:prose-invert max-w-none p-6">
            <h2>1. Chấp Nhận Điều Khoản</h2>
            <p>
              Bằng việc sử dụng ứng dụng <strong>Sổ Thu Chi AI</strong>, bạn
              đồng ý tuân thủ các điều khoản dịch vụ này. Nếu không đồng ý, vui
              lòng không sử dụng ứng dụng.
            </p>

            <h2>2. Mô Tả Dịch Vụ</h2>
            <p>
              Sổ Thu Chi AI là ứng dụng quản lý tài chính cá nhân, cung cấp các
              tính năng:
            </p>
            <ul>
              <li>Ghi chép và theo dõi thu chi</li>
              <li>Thống kê và biểu đồ tài chính</li>
              <li>Quản lý ngân sách</li>
              <li>
                Trợ lý AI hỗ trợ nhập liệu (yêu cầu API key của người dùng)
              </li>
              <li>Xuất báo cáo</li>
            </ul>

            <h2>3. Tài Khoản Người Dùng</h2>
            <ul>
              <li>
                Bạn cần đăng nhập bằng tài khoản Google để sử dụng ứng dụng
              </li>
              <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình</li>
              <li>Mỗi người dùng chỉ được sử dụng một tài khoản</li>
            </ul>

            <h2>4. Quyền Sở Hữu Dữ Liệu</h2>
            <ul>
              <li>Bạn sở hữu toàn bộ dữ liệu giao dịch của mình</li>
              <li>
                Bạn có thể xuất, chỉnh sửa hoặc xóa dữ liệu bất cứ lúc nào
              </li>
              <li>
                Chúng tôi không sử dụng dữ liệu cá nhân của bạn cho mục đích
                thương mại
              </li>
            </ul>

            <h2>5. Sử Dụng Hợp Lý</h2>
            <p>Bạn cam kết không:</p>
            <ul>
              <li>Sử dụng ứng dụng cho mục đích bất hợp pháp</li>
              <li>Cố gắng truy cập trái phép vào hệ thống</li>
              <li>Phá hoại hoặc gây ảnh hưởng đến hoạt động của ứng dụng</li>
              <li>Chia sẻ tài khoản cho người khác sử dụng</li>
            </ul>

            <h2>6. API Key Bên Thứ Ba</h2>
            <ul>
              <li>
                Tính năng AI yêu cầu bạn cung cấp API Key Google Gemini của
                riêng bạn
              </li>
              <li>
                Bạn chịu trách nhiệm tuân thủ điều khoản sử dụng của Google
                Gemini
              </li>
              <li>API Key được lưu trữ cục bộ trên thiết bị của bạn</li>
            </ul>

            <h2>7. Miễn Trừ Trách Nhiệm</h2>
            <ul>
              <li>Ứng dụng được cung cấp "nguyên trạng" (as-is)</li>
              <li>
                Chúng tôi không chịu trách nhiệm về mất mát dữ liệu do lỗi kỹ
                thuật
              </li>
              <li>Ứng dụng không thay thế tư vấn tài chính chuyên nghiệp</li>
            </ul>

            <h2>8. Thay Đổi Điều Khoản</h2>
            <p>
              Chúng tôi có thể cập nhật điều khoản dịch vụ bất cứ lúc nào. Việc
              tiếp tục sử dụng ứng dụng sau khi thay đổi đồng nghĩa với việc bạn
              chấp nhận điều khoản mới.
            </p>

            <h2>9. Chấm Dứt</h2>
            <p>
              Chúng tôi có quyền chấm dứt hoặc tạm ngưng tài khoản của bạn nếu
              vi phạm điều khoản dịch vụ, mà không cần thông báo trước.
            </p>

            <h2>10. Liên Hệ</h2>
            <p>
              Mọi thắc mắc về điều khoản dịch vụ, vui lòng liên hệ:
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

export default TermsOfService;
