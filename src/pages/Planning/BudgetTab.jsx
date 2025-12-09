import { useState, useMemo } from "react";
import { Button, useDisclosure, Progress, Card, CardBody } from "@heroui/react";
import { Plus, Wallet } from "lucide-react";
import { useTransactionsContext } from "../../contexts/TransactionsContext";
import { useBudgetContext } from "../../contexts/BudgetContext";
import BudgetCard from "../../components/Budget/BudgetCard";
import CreateBudgetModal from "../../components/Budget/CreateBudgetModal";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * Tab Quản lý ngân sách (Budget)
 * Được tách ra từ trang Budget cũ để nhúng vào trang Planning
 */
const BudgetTab = () => {
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
      // Logic match category: Giả định ngân sách áp dụng cho tên category chính
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
                {formatCurrency(
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
              <span>Đã chi: {formatCurrency(totalBudgetInfo.totalSpent)}</span>
              <span>
                Tổng hạn mức: {formatCurrency(totalBudgetInfo.totalLimit)}
              </span>
            </div>
            <Progress
              aria-label="Tiến độ chi tiêu tổng"
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
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
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

export default BudgetTab;
