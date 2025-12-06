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
 * Modal xác nhận xóa giao dịch
 */
const DeleteConfirmModal = ({ isOpen, onOpenChange, onConfirm, transaction }) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200 dark:border-gray-800",
        footer: "border-t border-gray-200 dark:border-gray-800",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Xác nhận xóa
                </h2>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-700 dark:text-gray-300">
                Bạn có chắc chắn muốn xóa giao dịch này không?
              </p>
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
              <Button
                color="default"
                variant="light"
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                color="danger"
                onPress={handleConfirm}
              >
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

