import { Card, CardBody, Chip, Progress, Button, Tooltip } from "@heroui/react";
import { Calendar, User, Edit2, Trash2, DollarSign } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Component hiển thị thông tin một khoản nợ
 * @param {Object} debt - Dữ liệu khoản nợ
 * @param {Function} onEdit - Callback khi bấm sửa
 * @param {Function} onDelete - Callback khi bấm xóa
 * @param {Function} onPayment - Callback khi bấm thanh toán
 */
const DebtCard = ({ debt, onEdit, onDelete, onPayment }) => {
  const { type, personName, amount, remainingAmount, reason, dueDate, status } =
    debt;

  // Tính phần trăm đã trả
  const paidPercent = ((amount - remainingAmount) / amount) * 100;

  // Format số tiền
  const formatMoney = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  // Tính số ngày còn lại
  const getDaysRemaining = () => {
    if (!dueDate) return null;
    const days = differenceInDays(parseISO(dueDate), new Date());
    return days;
  };

  const daysRemaining = getDaysRemaining();

  // Xác định màu status
  const getStatusConfig = () => {
    switch (status) {
      case "paid":
        return { color: "success", text: "Đã trả" };
      case "overdue":
        return { color: "danger", text: "Quá hạn" };
      default:
        return { color: "primary", text: "Đang nợ" };
    }
  };

  const statusConfig = getStatusConfig();

  // Màu theo loại nợ
  const typeConfig = {
    lend: {
      color: "success",
      text: "Cho vay",
      bgClass: "bg-green-50 dark:bg-green-900/20",
    },
    borrow: {
      color: "warning",
      text: "Đi vay",
      bgClass: "bg-amber-50 dark:bg-amber-900/20",
    },
  };

  const currentTypeConfig = typeConfig[type] || typeConfig.borrow;

  return (
    <Card
      className={`${currentTypeConfig.bgClass} border border-default-200 dark:border-default-100`}
    >
      <CardBody className="p-4 space-y-3">
        {/* Header: Tên người + Status */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-default-100 rounded-full">
              <User size={18} className="text-default-600" />
            </div>
            <div>
              <h3 className="font-semibold text-default-900">{personName}</h3>
              <Chip size="sm" color={currentTypeConfig.color} variant="flat">
                {currentTypeConfig.text}
              </Chip>
            </div>
          </div>
          <Chip size="sm" color={statusConfig.color} variant="solid">
            {statusConfig.text}
          </Chip>
        </div>

        {/* Số tiền */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-default-500">Tổng nợ</span>
            <span className="font-bold text-lg text-default-900">
              {formatMoney(amount)}
            </span>
          </div>
          {status !== "paid" && (
            <div className="flex justify-between text-sm">
              <span className="text-default-500">Còn lại</span>
              <span className="font-semibold text-danger">
                {formatMoney(remainingAmount)}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {status !== "paid" && (
          <Progress
            size="sm"
            value={paidPercent}
            color={paidPercent >= 100 ? "success" : "primary"}
            className="max-w-full"
            label={`Đã trả ${paidPercent.toFixed(0)}%`}
            showValueLabel={false}
          />
        )}

        {/* Lý do */}
        {reason && (
          <p className="text-sm text-default-600 italic">"{reason}"</p>
        )}

        {/* Hạn trả */}
        {dueDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-default-400" />
            <span className="text-default-600">
              Hạn: {format(parseISO(dueDate), "dd/MM/yyyy", { locale: vi })}
            </span>
            {daysRemaining !== null && status === "active" && (
              <Chip
                size="sm"
                color={
                  daysRemaining < 0
                    ? "danger"
                    : daysRemaining <= 7
                    ? "warning"
                    : "default"
                }
                variant="flat"
              >
                {daysRemaining < 0
                  ? `Quá ${Math.abs(daysRemaining)} ngày`
                  : daysRemaining === 0
                  ? "Hôm nay"
                  : `Còn ${daysRemaining} ngày`}
              </Chip>
            )}
          </div>
        )}

        {/* Actions */}
        {status !== "paid" && (
          <div className="flex gap-2 pt-2 border-t border-default-200">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<DollarSign size={14} />}
              onPress={() => onPayment?.(debt)}
              className="flex-1"
            >
              Ghi trả
            </Button>
            <Tooltip content="Sửa">
              <Button
                size="sm"
                isIconOnly
                variant="light"
                onPress={() => onEdit?.(debt)}
              >
                <Edit2 size={14} />
              </Button>
            </Tooltip>
            <Tooltip content="Xóa">
              <Button
                size="sm"
                isIconOnly
                variant="light"
                color="danger"
                onPress={() => onDelete?.(debt)}
              >
                <Trash2 size={14} />
              </Button>
            </Tooltip>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default DebtCard;
