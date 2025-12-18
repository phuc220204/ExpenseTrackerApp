import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { DollarSign } from "lucide-react";

/**
 * Modal ghi nhận thanh toán một phần khoản nợ
 * @param {boolean} isOpen - Trạng thái mở modal
 * @param {Function} onClose - Callback đóng modal
 * @param {Function} onSubmit - Callback submit payment
 * @param {Object} debt - Khoản nợ đang thanh toán
 */
const DebtPaymentModal = ({ isOpen, onClose, onSubmit, debt }) => {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reset form khi mở
  const handleOpenChange = (open) => {
    if (open) {
      setAmount("");
      setError("");
    }
  };

  // Format số tiền
  const formatMoney = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  // Handle submit
  const handleSubmit = async () => {
    const paymentAmount = parseFloat(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (paymentAmount > debt?.remainingAmount) {
      setError("Số tiền vượt quá số nợ còn lại");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(debt.id, paymentAmount);
      onClose();
    } catch (err) {
      console.error("Lỗi khi ghi nhận thanh toán:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trả hết nợ
  const handlePayAll = () => {
    setAmount(debt?.remainingAmount?.toString() || "");
  };

  if (!debt) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={handleOpenChange}
      size="sm"
      placement="center"
    >
      <ModalContent>
        <ModalHeader>Ghi nhận thanh toán</ModalHeader>

        <ModalBody className="gap-4">
          <div className="bg-default-100 rounded-lg p-3 space-y-1">
            <p className="text-sm text-default-600">
              {debt.type === "lend" ? "Người vay" : "Chủ nợ"}:{" "}
              <span className="font-semibold text-default-900">
                {debt.personName}
              </span>
            </p>
            <p className="text-sm text-default-600">
              Còn lại:{" "}
              <span className="font-bold text-danger">
                {formatMoney(debt.remainingAmount)}
              </span>
            </p>
          </div>

          <Input
            label="Số tiền thanh toán"
            placeholder="Nhập số tiền"
            type="number"
            value={amount}
            onValueChange={setAmount}
            startContent={<DollarSign size={18} className="text-default-400" />}
            endContent={<span className="text-default-400 text-sm">VNĐ</span>}
            isInvalid={!!error}
            errorMessage={error}
            autoFocus
          />

          <Button
            size="sm"
            variant="flat"
            color="success"
            onPress={handlePayAll}
          >
            Trả hết ({formatMoney(debt.remainingAmount)})
          </Button>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Hủy
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isSubmitting}
          >
            Xác nhận
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DebtPaymentModal;
