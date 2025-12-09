import { useState, useMemo } from "react";
import { Button, useDisclosure, Progress, Card, CardBody } from "@heroui/react";
import { Plus, Wallet } from "lucide-react";
import { useTransactionsContext } from "../contexts/TransactionsContext";
import { useBudgetContext } from "../contexts/BudgetContext";
import BudgetCard from "../components/Budget/BudgetCard";
import CreateBudgetModal from "../components/Budget/CreateBudgetModal";
import RefreshButton from "../components/RefreshButton";
import ThemeButton from "../components/ThemeButton";

/**
 * Trang quản lý ngân sách (Budget)
 * Hiển thị danh sách các ngân sách đã tạo và tiến độ chi tiêu
 */
const Budget = () => {
  const { transactions } = useTransactionsContext();
  const { budgets, isLoading, deleteBudget } = useBudgetContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingBudget, setEditingBudget] = useState(null);

  /**
   * Tính toán tổng chi tiêu theo category trong tháng hiện tại
   */
  const spendingByCategory = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filter transactions của tháng hiện tại
    const currentMonthTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear &&
        tx.type === "expense"
      );
    });

    // Group by category
    const spending = {};
    currentMonthTransactions.forEach((tx) => {
      // Lấy category chính (bỏ subcategory nếu có)
      // Note: Logic này có thể cần điều chỉnh tùy theo việc ngân sách áp dụng cho category cha hay con
      // Hiện tại giả định ngân sách áp dụng cho tên category được lưu trong budget
      // Nếu budget lưu "Ăn uống", mà transaction là "Ăn uống > Nhà hàng", thì cần match "Ăn uống"

      // Cách đơn giản: Nếu budget category match với start của transaction category
      budgets.forEach((budget) => {
        if (
          tx.category === budget.category ||
          tx.category.startsWith(budget.category + " > ")
        ) {
          spending[budget.category] =
            (spending[budget.category] || 0) + tx.amount;
        }
      });
    });

    return spending;
  }, [transactions, budgets]);

  /**
   * Tổng hợp thông tin ngân sách toàn bộ
   */
  const totalBudgetInfo = useMemo(() => {
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = Object.values(spendingByCategory).reduce(
      (sum, val) => sum + val,
      0
    );
    return { totalLimit, totalSpent };
  }, [budgets, spendingByCategory]);

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    onOpen();
  };

  const handleDelete = (budget) => {
    // Thêm confirm dialog nếu cần
    if (
      window.confirm(
        `Bạn có chắc muốn xóa ngân sách cho mục "${budget.category}"?`
      )
    ) {
      deleteBudget(budget.id);
    }
  };

  const handleOpenCreate = () => {
    setEditingBudget(null);
    onOpen();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ngân Sách
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý hạn mức chi tiêu hàng tháng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeButton />
          <RefreshButton />
        </div>
      </div>

      {/* Tổng quan ngân sách */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Tổng Ngân Sách Tháng</h2>
                <p className="text-blue-100 text-sm">
                  Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Còn lại</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  Math.max(
                    0,
                    totalBudgetInfo.totalLimit - totalBudgetInfo.totalSpent
                  )
                )}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Đã chi:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalBudgetInfo.totalSpent)}
              </span>
              <span>
                Tổng hạn mức:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalBudgetInfo.totalLimit)}
              </span>
            </div>
            <Progress
              value={
                (totalBudgetInfo.totalSpent / totalBudgetInfo.totalLimit) *
                  100 || 0
              }
              className="h-2 bg-white/30"
              classNames={{
                indicator: "bg-white",
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          color="primary"
          startContent={<Plus className="w-5 h-5" />}
          onPress={handleOpenCreate}
        >
          Tạo ngân sách mới
        </Button>
      </div>

      {/* Danh sách ngân sách */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            spentAmount={spendingByCategory[budget.category] || 0}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {budgets.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Bạn chưa thiết lập ngân sách nào cho tháng này.
            </p>
            <Button variant="light" color="primary" onPress={handleOpenCreate}>
              Thiết lập ngay
            </Button>
          </div>
        )}
      </div>

      {/* Modal tạo/sửa */}
      <CreateBudgetModal
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
        editingBudget={editingBudget}
      />
    </div>
  );
};

export default Budget;
