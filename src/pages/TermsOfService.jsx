import { Card, CardBody, Button, Chip } from "@heroui/react";
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  User,
  Layers,
  Key,
  AlertTriangle,
  RefreshCw,
  XCircle,
  Mail,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Trang Điều Khoản Dịch Vụ - Redesigned
 * Public route - không cần đăng nhập
 */
const TermsOfService = () => {
  const features = [
    { icon: "📝", text: "Ghi chép thu chi" },
    { icon: "📊", text: "Thống kê & biểu đồ" },
    { icon: "💰", text: "Quản lý ngân sách" },
    { icon: "🤖", text: "Trợ lý AI thông minh" },
    { icon: "📤", text: "Xuất báo cáo" },
  ];

  const sections = [
    {
      icon: User,
      title: "Tài Khoản Người Dùng",
      color: "from-blue-500 to-cyan-500",
      items: [
        "Đăng nhập bằng tài khoản Google",
        "Bảo mật thông tin đăng nhập của mình",
        "Mỗi người dùng sử dụng một tài khoản",
      ],
    },
    {
      icon: Layers,
      title: "Quyền Sở Hữu Dữ Liệu",
      color: "from-purple-500 to-pink-500",
      items: [
        "Bạn sở hữu toàn bộ dữ liệu giao dịch",
        "Xuất, chỉnh sửa hoặc xóa bất cứ lúc nào",
        "Không sử dụng dữ liệu cho mục đích thương mại",
      ],
    },
    {
      icon: Key,
      title: "API Key Bên Thứ Ba",
      color: "from-amber-500 to-orange-500",
      items: [
        "Tính năng AI yêu cầu API Key Google Gemini",
        "Tuân thủ điều khoản của Google Gemini",
        "API Key lưu trữ cục bộ trên thiết bị",
      ],
    },
  ];

  const restrictions = [
    "Sử dụng cho mục đích bất hợp pháp",
    "Truy cập trái phép vào hệ thống",
    "Phá hoại hoạt động của ứng dụng",
    "Chia sẻ tài khoản cho người khác",
  ];

  const disclaimers = [
    "Ứng dụng được cung cấp 'nguyên trạng' (as-is)",
    "Không chịu trách nhiệm về mất mát dữ liệu do lỗi kỹ thuật",
    "Không thay thế tư vấn tài chính chuyên nghiệp",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <FileText className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Điều Khoản Dịch Vụ
              </h1>
              <div className="flex items-center gap-3">
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-white/20 text-white"
                >
                  Ví Vi Vu
                </Chip>
                <span className="text-white/70 text-sm">
                  Cập nhật: {new Date().toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Acceptance Card */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-none shadow-xl">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Chấp Nhận Điều Khoản
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Bằng việc sử dụng ứng dụng{" "}
                  <strong>Ví Vi Vu - Sổ Thu Chi AI</strong>, bạn đồng ý tuân thủ
                  các điều khoản dịch vụ này. Nếu không đồng ý, vui lòng không
                  sử dụng ứng dụng.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Features */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6" />
              <h3 className="font-semibold text-lg">Mô Tả Dịch Vụ</h3>
            </div>
            <p className="text-white/90 mb-4">
              Ví Vi Vu là ứng dụng quản lý tài chính cá nhân, cung cấp:
            </p>
            <div className="flex flex-wrap gap-2">
              {features.map((f, i) => (
                <Chip key={i} variant="flat" className="bg-white/20 text-white">
                  {f.icon} {f.text}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sections.map((section, idx) => (
            <Card
              key={idx}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-none shadow-lg"
            >
              <CardBody className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${section.color} text-white`}
                  >
                    <section.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Restrictions */}
        <Card className="mb-8 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/50">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">
                Sử Dụng Hợp Lý - Bạn cam kết KHÔNG
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {restrictions.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Disclaimers */}
        <Card className="mb-8 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                Miễn Trừ Trách Nhiệm
              </h3>
            </div>
            <ul className="space-y-2">
              {disclaimers.map((d, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Changes & Termination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-none shadow-lg">
            <CardBody className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Thay Đổi Điều Khoản
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chúng tôi có thể cập nhật điều khoản bất cứ lúc nào. Việc tiếp
                tục sử dụng đồng nghĩa với việc bạn chấp nhận điều khoản mới.
              </p>
            </CardBody>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-none shadow-lg">
            <CardBody className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-rose-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Chấm Dứt
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chúng tôi có quyền chấm dứt hoặc tạm ngưng tài khoản nếu vi phạm
                điều khoản, mà không cần thông báo trước.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Contact */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-none shadow-lg">
          <CardBody className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Liên Hệ
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mọi thắc mắc về điều khoản dịch vụ
                  </p>
                </div>
              </div>
              <Button
                as="a"
                href="mailto:phuc220204@gmail.com"
                color="secondary"
                variant="flat"
                startContent={<Mail className="w-4 h-4" />}
              >
                phuc220204@gmail.com
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link
            to="/privacy-policy"
            className="text-primary-500 hover:text-primary-600 text-sm"
          >
            Xem Chính Sách Bảo Mật →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
