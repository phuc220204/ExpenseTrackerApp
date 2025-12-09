import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Link,
  useDisclosure,
  Chip,
} from "@heroui/react";
import {
  ExternalLink,
  Key,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

/**
 * Component Modal hướng dẫn người dùng lấy Gemini API Key
 * Hiển thị khi chưa có API Key trong localStorage
 */
const ApiKeyModal = ({
  isOpen,
  onOpenChange,
  onSaveKey,
  currentApiKey,
  onDeleteKey,
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onOpenChange: onDeleteModalChange,
  } = useDisclosure();

  // Kiểm tra trạng thái kết nối
  const hasKey = Boolean(currentApiKey);

  // State đã được khởi tạo từ props khi component mount (do conditional rendering)
  // Không cần useEffect để sync state nữa

  const handleSave = () => {
    if (apiKey.trim()) {
      setIsLoading(true);
      onSaveKey(apiKey.trim());
      setIsLoading(false);
      setApiKey("");
      setShowSuccessToast(true);
      // Tự động ẩn toast sau 3 giây
      setTimeout(() => {
        setShowSuccessToast(false);
        onOpenChange(false);
      }, 3000);
    }
  };

  const handleDelete = () => {
    onOpenDeleteModal();
  };

  const confirmDelete = () => {
    onDeleteKey();
    setApiKey("");
    onOpenChange(false);
    onDeleteModalChange(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        backdrop="blur"
        placement="center"
        isDismissable={true}
        isKeyboardDismissDisabled={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span>Cấu hình API Key</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {/* Trạng thái Kết nối */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    {hasKey ? (
                      <>
                        <ShieldCheck className="w-5 h-5 text-success-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-success-700 dark:text-success-400">
                            Trạng thái: Đã kết nối & Bảo mật
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            API Key đã được lưu an toàn trên thiết bị này
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Trạng thái: Chưa cấu hình
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                            Vui lòng nhập API Key để sử dụng Trợ lý AI
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thông báo Bảo mật & Riêng tư */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium">
                          Bảo mật & Riêng tư
                        </p>
                        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                          Để đảm bảo an toàn tuyệt đối, App chỉ lưu chìa khóa
                          (API Key) ngay trên trình duyệt của máy bạn. Chúng tôi
                          không bao giờ gửi Key lên máy chủ.
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                          <strong>Lưu ý:</strong> Vì lý do bảo mật này, nếu bạn
                          đổi thiết bị hoặc xóa lịch sử web, Key sẽ bị xóa và
                          bạn cần nhập lại.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Khu vực Hướng dẫn */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      Cách lấy API Key miễn phí:
                    </h4>
                    <ol className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside mb-3">
                      <li>Truy cập Google AI Studio</li>
                      <li>Đăng nhập bằng tài khoản Google của bạn</li>
                      <li>Nhấp vào "Get API Key" hoặc "Create API Key"</li>
                      <li>Sao chép API Key và dán vào ô bên dưới</li>
                    </ol>
                    <div className="space-y-2">
                      <Button
                        as={Link}
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        variant="flat"
                        size="sm"
                        startContent={<ExternalLink className="w-4 h-4" />}
                        className="w-full sm:w-auto"
                      >
                        Mở Google AI Studio
                      </Button>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        💡 Miễn phí 100% với tài khoản Google cá nhân
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-500 italic">
                        Vì đây là 1 tính năng phụ nhằm tăng trải nghiệm người
                        dùng nên bạn có thể thêm API key hoặc không tuỳ nhu cầu
                        của bạn
                      </p>
                    </div>
                  </div>

                  {/* Khu vực Nhập liệu */}
                  <div>
                    <Input
                      label="API Key"
                      placeholder={
                        hasKey && !apiKey
                          ? "Đã có Key được lưu (nhập key mới để thay thế)"
                          : "Nhập Gemini API Key của bạn"
                      }
                      value={apiKey}
                      onValueChange={setApiKey}
                      type={isVisible ? "text" : "password"}
                      variant="bordered"
                      description="API Key sẽ được lưu cục bộ trên trình duyệt của bạn"
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() => setIsVisible(!isVisible)}
                          aria-label="Toggle password visibility"
                        >
                          {isVisible ? (
                            <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          )}
                        </button>
                      }
                      classNames={{
                        label: "text-gray-700 dark:text-gray-300",
                      }}
                    />
                    {hasKey && !apiKey && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        Đã có API Key được lưu. Nhập key mới để thay thế.
                      </div>
                    )}
                    <div className="mt-2">
                      <Link
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        Quên Key? Lấy lại tại đây{" "}
                        <ExternalLink className="w-3 h-3 inline ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Toast thông báo thành công */}
                  {showSuccessToast && (
                    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                      <div className="bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg p-3 shadow-lg flex items-center gap-2 min-w-[280px]">
                        <CheckCircle2 className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" />
                        <p className="text-sm text-success-800 dark:text-success-200 font-medium">
                          Đã lưu Key an toàn vào thiết bị này!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex items-center justify-between w-full">
                  <div>
                    {currentApiKey && (
                      <Button
                        color="danger"
                        variant="light"
                        size="sm"
                        onPress={handleDelete}
                      >
                        Xóa API Key
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="light"
                      onPress={onClose}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {currentApiKey ? "Đóng" : "Bỏ qua"}
                    </Button>
                    <Button
                      color="primary"
                      onPress={handleSave}
                      isLoading={isLoading}
                      disabled={!apiKey.trim()}
                    >
                      {hasKey && apiKey ? "Cập nhật" : "Lưu Key"}
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal xác nhận xóa API Key */}
      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalChange}
        size="md"
        backdrop="blur"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-danger" />
                  <span>Xóa API Key</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Bạn có chắc chắn muốn xóa API Key hiện tại không? Sau khi xóa,
                  bạn sẽ không thể sử dụng Trợ lý AI cho đến khi nhập API Key
                  mới.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  className="text-gray-700 dark:text-gray-300"
                >
                  Hủy
                </Button>
                <Button color="danger" onPress={confirmDelete}>
                  Xóa API Key
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ApiKeyModal;
