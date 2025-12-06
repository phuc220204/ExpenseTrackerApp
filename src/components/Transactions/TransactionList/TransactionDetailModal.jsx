import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  Chip,
  Divider,
} from "@heroui/react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Modal hiển thị chi tiết giao dịch
 * Hiển thị đầy đủ thông tin: Loại, Số tiền, Danh mục, Ngày, Phương thức, Ngân hàng/Ví, Ghi chú
 */
const TransactionDetailModal = ({ isOpen, onOpenChange, transaction }) => {
  if (!transaction) return null;

  const isIncome = transaction.type === "income";
  const formattedDate = transaction.date
    ? format(new Date(transaction.date + "T00:00:00"), "dd/MM/yyyy", {
        locale: vi,
      })
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200 dark:border-gray-800",
        body: "py-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Chi tiết giao dịch
              </h3>
            </ModalHeader>
            <ModalBody>
              <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                <CardBody className="p-6 space-y-4">
                  {/* Loại */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Loại:
                    </span>
                    <Chip
                      size="sm"
                      color={isIncome ? "success" : "danger"}
                      variant="flat"
                    >
                      {isIncome ? "Thu nhập" : "Chi tiêu"}
                    </Chip>
                  </div>

                  <Divider />

                  {/* Số tiền */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Số tiền:
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        isIncome
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </div>

                  <Divider />

                  {/* Danh mục */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Danh mục:
                    </span>
                    <div className="text-right">
                      {transaction.category?.includes(" > ") ? (
                        <>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                            {transaction.category.split(" > ")[1]}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.category.split(" > ")[0]}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {transaction.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <Divider />

                  {/* Ngày */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Ngày:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formattedDate}
                    </span>
                  </div>

                  <Divider />

                  {/* Phương thức thanh toán */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Phương thức:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {transaction.paymentMethod === "transfer"
                        ? "Chuyển khoản"
                        : "Tiền mặt"}
                    </span>
                  </div>

                  {/* Ngân hàng/Ví (chỉ hiển thị nếu là chuyển khoản và có bankName) */}
                  {transaction.paymentMethod === "transfer" &&
                    transaction.bankName && (
                      <>
                        <Divider />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Ngân hàng/Ví:
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {transaction.bankName}
                          </span>
                        </div>
                      </>
                    )}

                  {/* Ghi chú (chỉ hiển thị nếu có) */}
                  {transaction.note && (
                    <>
                      <Divider />
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Ghi chú:
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                          {transaction.note}
                        </p>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TransactionDetailModal;

