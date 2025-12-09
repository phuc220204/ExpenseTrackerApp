import { Tabs, Tab } from "@heroui/react";
import { List, Table as TableIcon } from "lucide-react";
import TransactionListView from "./TransactionListView";
import TransactionTable from "./TransactionTable";
import TransactionFilterBar from "./TransactionFilterBar";
import { useViewMode } from "./useViewMode";
import { useTransactionFilter } from "./useTransactionFilter";

/**
 * Component container chính hiển thị danh sách giao dịch
 * Hỗ trợ 2 chế độ xem: List (gom nhóm theo ngày) và Table (dạng bảng)
 * Responsive: Mobile mặc định List, Desktop mặc định Table
 * Có tính năng Search & Filter
 */
const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const { viewMode, setViewMode, showToggle } = useViewMode();

  // Hook xử lý filter
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    filteredTransactions,
    availableCategories,
    hasActiveFilters,
    clearFilters,
    resultCount,
    totalCount,
  } = useTransactionFilter(transactions);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Toolbar với tiêu đề và toggle view */}
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Lịch Sử Giao Dịch
        </h2>
        {showToggle && (
          <Tabs
            selectedKey={viewMode}
            onSelectionChange={(key) => setViewMode(key)}
            size="sm"
            variant="bordered"
            classNames={{
              tabList: "gap-2",
            }}
          >
            <Tab
              key="list"
              title={
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span>Danh sách</span>
                </div>
              }
            />
            <Tab
              key="table"
              title={
                <div className="flex items-center gap-2">
                  <TableIcon className="w-4 h-4" />
                  <span>Bảng</span>
                </div>
              }
            />
          </Tabs>
        )}
      </div>

      {/* Filter Bar */}
      <TransactionFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        availableCategories={availableCategories}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        resultCount={resultCount}
        totalCount={totalCount}
      />

      {/* Hiển thị theo view mode đã chọn */}
      {viewMode === "list" ? (
        <TransactionListView
          transactions={filteredTransactions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default TransactionList;
