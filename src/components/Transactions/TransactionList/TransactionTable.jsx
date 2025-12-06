import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Pagination,
  Card,
  CardBody,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getIconForCategory } from "./constants";
import { useTransactionTable, formatTableDate } from "./useTransactionTable";
import DeleteConfirmModal from "../../DeleteConfirmModal";
import TransactionDetailModal from "./TransactionDetailModal";
import { useState } from "react";

/**
 * Component hiển thị danh sách giao dịch dạng bảng
 * Sử dụng Hero UI Table với phân trang
 */
const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  const {
    page,
    setPage,
    totalPages,
    paginatedTransactions,
    sortDescriptor,
    setSortDescriptor,
  } = useTransactionTable(transactions);

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    transactionId: null,
    transaction: null,
  });
  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    transaction: null,
  });

  if (transactions.length === 0) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardBody className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Chưa có giao dịch nào
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <Table
          aria-label="Bảng lịch sử giao dịch"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          classNames={{
            wrapper: "min-w-full",
          }}
          bottomContent={
            totalPages > 1 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                />
              </div>
            ) : null
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="date" allowsSorting className="min-w-[100px]">
              NGÀY
            </TableColumn>
            <TableColumn className="hidden sm:table-cell">DANH MỤC</TableColumn>
            <TableColumn className="hidden md:table-cell">GHI CHÚ</TableColumn>
            <TableColumn key="type" allowsSorting className="hidden sm:table-cell">LOẠI</TableColumn>
            <TableColumn className="hidden lg:table-cell">PHƯƠNG THỨC</TableColumn>
            <TableColumn key="amount" align="end" allowsSorting className="min-w-[120px]">
              SỐ TIỀN
            </TableColumn>
            <TableColumn align="center" className="min-w-[80px]">HÀNH ĐỘNG</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Không có giao dịch nào">
            {paginatedTransactions.map((transaction) => {
              // Hỗ trợ category 2 cấp
              const categoryMain = transaction.category?.includes(" > ")
                ? transaction.category.split(" > ")[0]
                : transaction.category;
              const categoryDisplay = transaction.category?.includes(" > ")
                ? transaction.category.split(" > ")[1]
                : transaction.category;
              
              const Icon = getIconForCategory(categoryMain, transaction.type);
              const isIncome = transaction.type === "income";

              return (
                <TableRow
                  key={transaction.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  onClick={(e) => {
                    // Chỉ mở modal nếu click vào row, không phải vào button
                    if (e.target.closest('button') || e.target.closest('[role="button"]')) {
                      return;
                    }
                    setDetailModalState({
                      isOpen: true,
                      transaction,
                    });
                  }}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatTableDate(transaction.date)}
                      </span>
                      {/* Hiển thị category trên mobile */}
                      <div className="flex items-center gap-1 sm:hidden mt-1">
                        <Icon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {categoryDisplay}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {categoryDisplay}
                        </span>
                        {transaction.category?.includes(" > ") && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {categoryMain}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                      {transaction.note || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Chip
                      size="sm"
                      variant="flat"
                      color={isIncome ? "success" : "danger"}
                    >
                      {isIncome ? "Thu" : "Chi"}
                    </Chip>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                      {transaction.paymentMethod === "transfer"
                        ? transaction.bankName || "Chuyển khoản"
                        : "Tiền mặt"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-semibold ${
                        isIncome
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div 
                      className="flex items-center justify-center gap-2"
                      onClick={(e) => e.stopPropagation()} // Ngăn click event bubble lên TableRow
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => {
                          onEdit(transaction);
                        }}
                        aria-label="Sửa"
                        className="text-gray-600 dark:text-gray-400"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => {
                          setDeleteModalState({
                            isOpen: true,
                            transactionId: transaction.id,
                            transaction,
                          });
                        }}
                        aria-label="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal xác nhận xóa */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteModalState({
            isOpen,
            transactionId: null,
            transaction: null,
          })
        }
        onConfirm={() => {
          if (deleteModalState.transactionId) {
            onDelete(deleteModalState.transactionId);
          }
          setDeleteModalState({
            isOpen: false,
            transactionId: null,
            transaction: null,
          });
        }}
        transaction={deleteModalState.transaction}
      />

      {/* Modal chi tiết giao dịch */}
      <TransactionDetailModal
        isOpen={detailModalState.isOpen}
        onOpenChange={(isOpen) =>
          setDetailModalState({
            isOpen,
            transaction: null,
          })
        }
        transaction={detailModalState.transaction}
      />
    </>
  );
};

export default TransactionTable;

