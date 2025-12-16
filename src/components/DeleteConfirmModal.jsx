import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AlertTriangle } from "lucide-react";

/**
 * Modal xác nhận xóa giao dịch hoặc item khác
 * Hỗ trợ cả onClose (callback style) và onOpenChange (HeroUI style)
 */
const DeleteConfirmModal = ({
  isOpen,
  onOpenChange,
  onClose,
  onConfirm,
  transaction,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa giao dịch này không?",
}) => {
  // Sử dụng onClose nếu có, nếu không thì dùng onOpenChange
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange || handleClose}
      size="md"
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200 dark:border-gray-800",
        footer: "border-t border-gray-200 dark:border-gray-800",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-700 dark:text-gray-300">{message}</p>
              {transaction && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.category}
                  </p>
                  {transaction.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {transaction.note}
                    </p>
                  )}
                </div>
              )}
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Hành động này không thể hoàn tác.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={handleClose}>
                Hủy
              </Button>
              <Button color="danger" onPress={handleConfirm}>
                Xóa
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmModal;
