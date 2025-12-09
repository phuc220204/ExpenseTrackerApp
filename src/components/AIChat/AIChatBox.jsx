import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
} from "@heroui/react";
import { Bot, Send, X, Trash2, CheckCircle2, XCircle, Key } from "lucide-react";
import { useAIChat } from "./useAIChat";
import ApiKeyModal from "./ApiKeyModal";
import { useGeminiKey } from "../../hooks/useGeminiKey";
import { useDisclosure } from "@heroui/react";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * Component Chat Box cho AI Assistant
 * Giao diện chat hiện đại với bong bóng tin nhắn
 */
const AIChatBox = ({ isOpen, onOpenChange }) => {
  const {
    messages,
    isLoading,
    previewTransaction,
    previewTransactions,
    hasKey,
    messagesEndRef,
    handleSendMessage,
    handleConfirmAdd,
    handleCancelPreview,
    handleClearChat,
  } = useAIChat();

  const { apiKey, setApiKey } = useGeminiKey();
  // const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Moved to Layout
  const {
    isOpen: isApiKeyModalOpen,
    onOpen: onOpenApiKeyModal,
    onOpenChange: onApiKeyModalChange,
  } = useDisclosure();
  const [inputMessage, setInputMessage] = useState("");

  /**
   * Lắng nghe event để mở ApiKeyModal
   */
  useEffect(() => {
    const handleOpenApiKeyModal = () => {
      onOpenApiKeyModal();
    };
    window.addEventListener("openApiKeyModal", handleOpenApiKeyModal);
    return () => {
      window.removeEventListener("openApiKeyModal", handleOpenApiKeyModal);
    };
  }, [onOpenApiKeyModal]);

  /**
   * Xử lý khi người dùng gửi tin nhắn
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      handleSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <>
      {/* Floating Action Button removed - Controlled by external SpeedDial */}

      {/* Modal Chat Box */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        placement="center"
        scrollBehavior="inside"
        hideCloseButton
        classNames={{
          base: "max-h-[95vh] sm:max-h-[90vh] mx-2 sm:mx-4",
          body: "p-0",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span>Trợ lý Tài chính AI</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasKey && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={onOpenApiKeyModal}
                      aria-label="Quản lý API Key"
                      title="Quản lý API Key"
                    >
                      <Key className="w-4 h-4" />
                    </Button>
                  )}
                  {messages.length > 0 && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={handleClearChat}
                      aria-label="Xóa lịch sử chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={onClose}
                    aria-label="Đóng"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody className="p-0">
                {/* Chat Messages */}
                <div className="flex flex-col h-[550px] sm:h-[650px] lg:h-[700px] bg-gray-50 dark:bg-gray-900">
                  {!hasKey ? (
                    <div className="flex-1 flex items-center justify-center p-6">
                      <div className="text-center">
                        <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Vui lòng cấu hình API Key để sử dụng Trợ lý AI
                        </p>
                        <Button color="primary" onPress={onOpenApiKeyModal}>
                          Cấu hình API Key
                        </Button>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-6">
                      <div className="text-center">
                        <Bot className="w-16 h-16 mx-auto mb-4 text-primary-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Chào bạn! 👋
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Tôi là Trợ lý Tài chính AI của bạn. Hãy hỏi tôi bất cứ
                          điều gì về tài chính của bạn!
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                          <p>💡 Ví dụ: "Thêm chi tiêu 50000 cho ăn uống"</p>
                          <p>💡 Ví dụ: "Tôi đã chi bao nhiêu tháng này?"</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              message.role === "user"
                                ? "bg-primary-600 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-2 border border-gray-200 dark:border-gray-700">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                              <span
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></span>
                              <span
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              ></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  {/* Preview Transaction Card(s) */}
                  {(previewTransaction ||
                    (previewTransactions &&
                      previewTransactions.length > 0)) && (
                    <div className="border-t border-gray-200 dark:border-gray-800 p-3 sm:p-4 bg-white dark:bg-gray-800">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        {previewTransactions.length > 0
                          ? `Xem trước ${previewTransactions.length} giao dịch`
                          : "Xem trước giao dịch"}
                      </h4>

                      <div
                        className={`space-y-3 ${
                          previewTransactions.length > 1
                            ? "max-h-[300px] sm:max-h-[400px] lg:max-h-[450px] overflow-y-auto pr-2"
                            : ""
                        }`}
                      >
                        {/* Hiển thị nhiều transactions */}
                        {previewTransactions.length > 0 ? (
                          previewTransactions.map((transaction, index) => (
                            <Card
                              key={index}
                              className="border border-primary-200 dark:border-primary-800"
                            >
                              <CardBody className="p-3 sm:p-4">
                                <div className="space-y-1.5 text-xs sm:text-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                                      Giao dịch {index + 1}:
                                    </span>
                                    <Chip
                                      size="sm"
                                      color={
                                        transaction.type === "income"
                                          ? "success"
                                          : "danger"
                                      }
                                      variant="flat"
                                    >
                                      {transaction.type === "income"
                                        ? "Thu"
                                        : "Chi"}
                                    </Chip>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Số tiền:
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {formatCurrency(transaction.amount)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Danh mục:
                                    </span>
                                    <span className="text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
                                      {transaction.category}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Ngày:
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                      {transaction.date}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Phương thức:
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                      {transaction.paymentMethod === "transfer"
                                        ? "Chuyển khoản"
                                        : "Tiền mặt"}
                                    </span>
                                  </div>
                                  {transaction.paymentMethod === "transfer" &&
                                    transaction.bankName && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                          Ngân hàng/Ví:
                                        </span>
                                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[120px] sm:max-w-none">
                                          {transaction.bankName}
                                        </span>
                                      </div>
                                    )}
                                  {transaction.note && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">
                                        Ghi chú:
                                      </span>
                                      <span className="text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
                                        {transaction.note}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </CardBody>
                            </Card>
                          ))
                        ) : previewTransaction ? (
                          // Hiển thị 1 transaction như cũ
                          <Card className="border border-primary-200 dark:border-primary-800">
                            <CardBody className="p-3 sm:p-4">
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Loại:
                                  </span>
                                  <Chip
                                    size="sm"
                                    color={
                                      previewTransaction.type === "income"
                                        ? "success"
                                        : "danger"
                                    }
                                    variant="flat"
                                  >
                                    {previewTransaction.type === "income"
                                      ? "Thu"
                                      : "Chi"}
                                  </Chip>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Số tiền:
                                  </span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(previewTransaction.amount)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Danh mục:
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    {previewTransaction.category}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Ngày:
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    {previewTransaction.date}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Phương thức:
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    {previewTransaction.paymentMethod ===
                                    "transfer"
                                      ? "Chuyển khoản"
                                      : "Tiền mặt"}
                                  </span>
                                </div>
                                {previewTransaction.paymentMethod ===
                                  "transfer" &&
                                  previewTransaction.bankName && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">
                                        Ngân hàng/Ví:
                                      </span>
                                      <span className="text-gray-900 dark:text-white font-medium">
                                        {previewTransaction.bankName}
                                      </span>
                                    </div>
                                  )}
                                {previewTransaction.note && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Ghi chú:
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                      {previewTransaction.note}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        ) : null}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          color="success"
                          size="sm"
                          startContent={<CheckCircle2 className="w-4 h-4" />}
                          onPress={handleConfirmAdd}
                          isLoading={isLoading}
                          className="flex-1"
                        >
                          {previewTransactions.length > 0
                            ? `Lưu tất cả (${previewTransactions.length})`
                            : "Lưu"}
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          startContent={<XCircle className="w-4 h-4" />}
                          onPress={handleCancelPreview}
                          className="flex-1"
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  {hasKey && (
                    <div className="border-t border-gray-200 dark:border-gray-800 p-3 sm:p-4 bg-white dark:bg-gray-800">
                      <form
                        onSubmit={handleSubmit}
                        className="flex gap-2 items-end"
                      >
                        <Textarea
                          value={inputMessage}
                          onValueChange={setInputMessage}
                          placeholder="Nhập câu hỏi hoặc yêu cầu của bạn... (Có thể nhập nhiều dòng)"
                          variant="bordered"
                          isDisabled={isLoading}
                          minRows={1}
                          maxRows={4}
                          classNames={{
                            input: "text-sm",
                            base: "flex-1",
                          }}
                          onKeyDown={(e) => {
                            // Enter để gửi, Shift+Enter để xuống dòng
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmit(e);
                            }
                          }}
                        />
                        <Button
                          type="submit"
                          color="primary"
                          isIconOnly
                          isDisabled={!inputMessage.trim() || isLoading}
                          isLoading={isLoading}
                          aria-label="Gửi tin nhắn"
                          className="flex-shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ApiKeyModal */}
      {isApiKeyModalOpen && (
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onOpenChange={onApiKeyModalChange}
          onSaveKey={setApiKey}
          currentApiKey={apiKey}
          onDeleteKey={() => setApiKey("")}
        />
      )}
    </>
  );
};

export default AIChatBox;
