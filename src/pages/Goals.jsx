/**
 * Trang Mục tiêu tiết kiệm (Savings Goals)
 * Hiển thị danh sách mục tiêu và cho phép CRUD
 */

import { useState } from "react";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
import { Target, Plus, TrendingUp, CheckCircle2 } from "lucide-react";
import useGoals from "../hooks/useGoals";
import GoalCard from "../components/Goals/GoalCard";
import CreateGoalModal from "../components/Goals/CreateGoalModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { formatCurrency } from "../utils/formatCurrency";

const Goals = () => {
  const {
    goals,
    isLoading,
    stats,
    createGoal,
    updateGoal,
    addMoney,
    deleteGoal,
  } = useGoals();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);

  // Xử lý tạo/cập nhật mục tiêu
  const handleSaveGoal = async (goalData) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData);
    } else {
      await createGoal(goalData);
    }
    setEditingGoal(null);
  };

  // Xử lý xóa mục tiêu
  const handleDeleteGoal = async () => {
    if (deletingGoal) {
      await deleteGoal(deletingGoal.id);
      setDeletingGoal(null);
    }
  };

  // Phân loại goals
  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" label="Đang tải mục tiêu..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-7 h-7 text-primary-500" />
            Mục tiêu tiết kiệm
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Đặt mục tiêu và theo dõi tiến độ tiết kiệm của bạn
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={() => setIsCreateOpen(true)}
        >
          Thêm mục tiêu
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <CardBody className="p-4">
            <p className="text-sm opacity-80">Tổng đã tiết kiệm</p>
            <p className="text-xl font-bold">
              {formatCurrency(stats.totalSaved)}
            </p>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardBody className="p-4">
            <p className="text-sm opacity-80">Mục tiêu hoàn thành</p>
            <p className="text-xl font-bold flex items-center gap-1">
              <CheckCircle2 className="w-5 h-5" />
              {stats.completed}
            </p>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardBody className="p-4">
            <p className="text-sm opacity-80">Đang thực hiện</p>
            <p className="text-xl font-bold flex items-center gap-1">
              <TrendingUp className="w-5 h-5" />
              {stats.active}
            </p>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardBody className="p-4">
            <p className="text-sm opacity-80">Tổng mục tiêu</p>
            <p className="text-xl font-bold">
              {formatCurrency(stats.totalTarget)}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            Đang thực hiện ({activeGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddMoney={addMoney}
                onEdit={(g) => {
                  setEditingGoal(g);
                  setIsCreateOpen(true);
                }}
                onDelete={(g) => setDeletingGoal(g)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Đã hoàn thành ({completedGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddMoney={addMoney}
                onEdit={(g) => {
                  setEditingGoal(g);
                  setIsCreateOpen(true);
                }}
                onDelete={(g) => setDeletingGoal(g)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardBody className="py-12 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có mục tiêu nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Hãy tạo mục tiêu tiết kiệm đầu tiên của bạn!
            </p>
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={() => setIsCreateOpen(true)}
            >
              Tạo mục tiêu
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <CreateGoalModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        editingGoal={editingGoal}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingGoal}
        onClose={() => setDeletingGoal(null)}
        onConfirm={handleDeleteGoal}
        title="Xóa mục tiêu"
        message={`Bạn có chắc muốn xóa mục tiêu "${deletingGoal?.name}"? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
};

export default Goals;
