import { Input, Select, SelectItem, Button, Chip } from "@heroui/react";
import { Search, X, Filter } from "lucide-react";

/**
 * Component thanh filter cho danh sách giao dịch
 * Bao gồm: Search input, Type filter, Category filter
 */
const TransactionFilterBar = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  categoryFilter,
  onCategoryChange,
  availableCategories,
  hasActiveFilters,
  onClearFilters,
  resultCount,
  totalCount,
}) => {
  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Tìm kiếm ghi chú, danh mục..."
          value={searchQuery}
          onValueChange={onSearchChange}
          startContent={<Search className="w-4 h-4 text-gray-400" />}
          endContent={
            searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )
          }
          variant="bordered"
          size="sm"
          classNames={{
            base: "flex-1",
            inputWrapper: "bg-white dark:bg-gray-800",
          }}
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Type Filter */}
        <Select
          placeholder="Loại"
          selectedKeys={[typeFilter]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (selected) onTypeChange(selected);
          }}
          size="sm"
          variant="bordered"
          classNames={{
            base: "w-28 sm:w-32",
            trigger: "bg-white dark:bg-gray-800 h-9",
          }}
          aria-label="Lọc theo loại"
        >
          <SelectItem key="all" value="all">
            Tất cả
          </SelectItem>
          <SelectItem key="expense" value="expense">
            Chi tiêu
          </SelectItem>
          <SelectItem key="income" value="income">
            Thu nhập
          </SelectItem>
        </Select>

        {/* Category Filter */}
        <Select
          placeholder="Danh mục"
          selectedKeys={[categoryFilter]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (selected) onCategoryChange(selected);
          }}
          size="sm"
          variant="bordered"
          classNames={{
            base: "w-32 sm:w-40",
            trigger: "bg-white dark:bg-gray-800 h-9",
          }}
          aria-label="Lọc theo danh mục"
        >
          <SelectItem key="all" value="all">
            Tất cả
          </SelectItem>
          {availableCategories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="flat"
            color="danger"
            startContent={<X className="w-3 h-3" />}
            onPress={onClearFilters}
            className="h-9"
          >
            Xóa bộ lọc
          </Button>
        )}

        {/* Result Count */}
        {hasActiveFilters && (
          <Chip size="sm" variant="flat" color="primary" className="ml-auto">
            {resultCount}/{totalCount} kết quả
          </Chip>
        )}
      </div>
    </div>
  );
};

export default TransactionFilterBar;
