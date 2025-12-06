import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";
import DeleteConfirmModal from "../../DeleteConfirmModal";
import TransactionDetailModal from "./TransactionDetailModal";
import { getIconForCategory } from "./constants";

/**
 * Component hiển thị một giao dịch đơn lẻ
 * Bao gồm: Icon, thông tin giao dịch, menu hành động (Sửa/Xóa)
 * Click vào item để xem chi tiết
 */
const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  // Hỗ trợ category 2 cấp: "Category > Subcategory" hoặc chỉ "Category"
  const categoryDisplay = transaction.category?.includes(" > ")
    ? transaction.category.split(" > ")[1] // Hiển thị subcategory
    : transaction.category;
  const categoryMain = transaction.category?.includes(" > ")
    ? transaction.category.split(" > ")[0] // Category chính để lấy icon
    : transaction.category;
  
  const Icon = getIconForCategory(categoryMain, transaction.type);
  const isIncome = transaction.type === "income";
  const amountColor = isIncome
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 cursor-pointer"
        onClick={() => setIsDetailModalOpen(true)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`p-2 rounded-lg ${
              isIncome
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {categoryDisplay}
            </p>
            {transaction.category?.includes(" > ") && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {categoryMain}
              </p>
            )}
            {transaction.note && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {transaction.note}
              </p>
            )}
          </div>
        </div>
        <div className="ml-4 flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className={`font-semibold ${amountColor}`}>
              {isIncome ? "+" : "-"}
              {formatCurrency(Math.abs(transaction.amount))}
            </p>
            {transaction.paymentMethod === "transfer" &&
              transaction.bankName && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                  {transaction.bankName}
                </p>
              )}
          </div>
          {/* Menu hành động */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-gray-500 dark:text-gray-400"
                aria-label="Menu hành động"
                onClick={(e) => e.stopPropagation()} // Ngăn click event bubble lên parent
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions">
              <DropdownItem
                key="edit"
                startContent={<Edit className="w-4 h-4" />}
                onPress={() => onEdit(transaction)}
              >
                Sửa
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<Trash2 className="w-4 h-4" />}
                onPress={() => setIsDeleteModalOpen(true)}
              >
                Xóa
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={() => onDelete(transaction.id)}
        transaction={transaction}
      />

      {/* Modal chi tiết giao dịch */}
      <TransactionDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        transaction={transaction}
      />
    </>
  );
};

export default TransactionItem;

