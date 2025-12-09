/**
 * Component hiển thị một hàng trong bảng nhập dữ liệu
 * Cải thiện UX: tooltip lỗi không đè, responsive tốt hơn
 */

import { Input, Select, SelectItem, Button, Chip } from "@heroui/react";
import { Trash2 } from "lucide-react";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "../../../components/AddTransactionModal/constants";

/**
 * Format số tiền khi nhập (thêm dấu chấm phân cách)
 * @param {string} value - Giá trị nhập
 * @returns {string} - Giá trị đã format
 */
const formatInputAmount = (value) => {
  // Loại bỏ tất cả ký tự không phải số
  const numericValue = value.replace(/[^\d]/g, "");
  if (!numericValue) return "";
  // Format với dấu chấm phân cách hàng nghìn
  return Number(numericValue).toLocaleString("vi-VN");
};

/**
 * Parse số tiền từ input đã format
 * @param {string} value - Giá trị đã format
 * @returns {number} - Số nguyên
 */
const parseInputAmount = (value) => {
  const numericValue = value.replace(/[^\d]/g, "");
  return numericValue ? parseInt(numericValue, 10) : 0;
};

/**
 * DataInputRow - Một hàng trong bảng nhập dữ liệu
 * @param {Object} item - Dữ liệu hàng
 * @param {Function} onUpdate - Callback cập nhật
 * @param {Function} onRemove - Callback xóa
 */
const DataInputRow = ({ item, onUpdate, onRemove }) => {
  // Lấy danh sách categories theo type (là mảng string)
  const categories =
    item.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Kiểm tra từng field có lỗi không
  const hasDateError =
    !item.isValid && item.errors?.includes("Ngày không hợp lệ");
  const hasAmountError =
    !item.isValid && item.errors?.includes("Số tiền không hợp lệ");

  return (
    <div
      className={`grid grid-cols-12 gap-2 sm:gap-3 p-3 transition-all ${
        !item.isValid ? "bg-red-50/50 dark:bg-red-900/10" : ""
      }`}
    >
      {/* STT */}
      <div className="col-span-1 flex items-center justify-center">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {item.rowNumber}
        </span>
      </div>

      {/* Ngày */}
      <div className="col-span-2">
        <Input
          type="date"
          size="sm"
          variant="bordered"
          value={item.date || ""}
          onChange={(e) => onUpdate(item.id, { date: e.target.value })}
          isInvalid={hasDateError}
          errorMessage={hasDateError ? "Ngày không hợp lệ" : undefined}
          classNames={{
            input: "text-xs",
            errorMessage: "text-[10px]",
          }}
        />
      </div>

      {/* Số tiền - với VND suffix */}
      <div className="col-span-2">
        <Input
          type="text"
          size="sm"
          variant="bordered"
          placeholder="0"
          value={item.amount ? formatInputAmount(item.amount.toString()) : ""}
          onChange={(e) => {
            const parsed = parseInputAmount(e.target.value);
            onUpdate(item.id, { amount: parsed });
          }}
          endContent={
            <span className="text-xs text-gray-400 font-medium">VND</span>
          }
          isInvalid={hasAmountError}
          errorMessage={hasAmountError ? "Số tiền không hợp lệ" : undefined}
          classNames={{
            input: "text-xs text-right",
            errorMessage: "text-[10px]",
          }}
        />
      </div>

      {/* Danh mục - categories là mảng string */}
      <div className="col-span-2">
        <Select
          size="sm"
          variant="bordered"
          placeholder="Chọn"
          selectedKeys={(() => {
            if (!item.category) return [];
            if (categories.includes(item.category)) return [item.category];
            if (item.category.includes(" > ")) {
              const parentCat = item.category.split(" > ")[0];
              if (categories.includes(parentCat)) return [parentCat];
            }
            return [];
          })()}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            onUpdate(item.id, { category: selected || "" });
          }}
          classNames={{
            trigger: "h-8 min-h-8",
            value: "text-xs",
          }}
        >
          {categories.map((cat) => (
            <SelectItem key={cat} textValue={cat}>
              {cat}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Ghi chú */}
      <div className="col-span-1">
        <Input
          type="text"
          size="sm"
          variant="bordered"
          placeholder="Ghi chú"
          value={item.note || ""}
          onChange={(e) => onUpdate(item.id, { note: e.target.value })}
          classNames={{
            input: "text-xs",
          }}
        />
      </div>

      {/* Loại */}
      <div className="col-span-1">
        <Select
          size="sm"
          variant="bordered"
          aria-label="Loại giao dịch"
          selectedKeys={[item.type || "expense"]}
          onSelectionChange={(keys) => {
            const newType = Array.from(keys)[0];
            onUpdate(item.id, {
              type: newType || "expense",
              category: "", // Reset category khi đổi type
            });
          }}
          classNames={{
            trigger: "h-8 min-h-8",
            value: "text-xs",
          }}
        >
          <SelectItem key="expense" textValue="Chi">
            Chi
          </SelectItem>
          <SelectItem key="income" textValue="Thu">
            Thu
          </SelectItem>
        </Select>
      </div>

      {/* Phương thức thanh toán */}
      <div className="col-span-1">
        <Select
          size="sm"
          variant="bordered"
          aria-label="Phương thức thanh toán"
          selectedKeys={[item.paymentMethod || "cash"]}
          onSelectionChange={(keys) => {
            const method = Array.from(keys)[0];
            onUpdate(item.id, { paymentMethod: method || "cash" });
          }}
          classNames={{
            trigger: "h-8 min-h-8",
            value: "text-xs",
          }}
        >
          <SelectItem key="cash" textValue="TM">
            TM
          </SelectItem>
          <SelectItem key="transfer" textValue="CK">
            CK
          </SelectItem>
        </Select>
      </div>

      {/* Trạng thái & Actions */}
      <div className="col-span-2 flex items-center gap-1 justify-end">
        <Chip
          size="sm"
          color={item.isValid ? "success" : "danger"}
          variant="flat"
          className="text-[10px]"
        >
          {item.isValid ? "OK" : "Lỗi"}
        </Chip>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          onPress={() => onRemove(item.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DataInputRow;
