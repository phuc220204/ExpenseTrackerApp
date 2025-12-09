import {
  Card,
  CardBody,
  Progress,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { MoreVertical, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { getIconForCategory } from "../Transactions/TransactionList/constants";

/**
 * Component hiển thị thông tin ngân sách của một danh mục
 */
const BudgetCard = ({ budget, spentAmount, onEdit, onDelete }) => {
  const { category, limit } = budget;
  const CategoryIcon = getIconForCategory(category, "expense");

  // Tính toán phần trăm đã chi
  const percentage = Math.min((spentAmount / limit) * 100, 100);
  const isOverLimit = spentAmount > limit;
  const remaining = limit - spentAmount;

  // Xác định màu sắc dựa trên phần trăm
  let color = "success";
  if (percentage >= 90) color = "danger";
  else if (percentage >= 75) color = "warning";

  return (
    <Card className="w-full">
      <CardBody className="p-4">
        {/* Header: Icon, Category Name, Menu Action */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isOverLimit
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              }`}
            >
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {category}
              </h3>
              <p className="text-xs text-gray-500">Tháng này</p>
            </div>
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm" radius="full">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Budget actions">
              <DropdownItem
                key="edit"
                startContent={<Edit2 className="w-4 h-4" />}
                onPress={() => onEdit(budget)}
              >
                Chỉnh sửa
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<Trash2 className="w-4 h-4" />}
                onPress={() => onDelete(budget)}
              >
                Xóa
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Amount Info */}
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Đã chi</span>
            <span
              className={`text-lg font-bold ${
                isOverLimit ? "text-red-600" : "text-gray-900 dark:text-white"
              }`}
            >
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(spentAmount)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mb-1">Hạn mức</span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(limit)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress
          value={percentage}
          color={color}
          className="h-2"
          aria-label="Chi tiêu ngân sách"
        />

        {/* Warning/Status Message */}
        <div className="mt-3 text-xs flex items-center gap-1">
          {isOverLimit ? (
            <span className="text-red-600 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Đã vượt quá{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Math.abs(remaining))}
            </span>
          ) : (
            <span className="text-gray-500">
              Còn lại{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(remaining)}
            </span>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default BudgetCard;
