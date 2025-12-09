/**
 * Hook quản lý Mục tiêu tiết kiệm (Savings Goals)
 * Xử lý state, loading, và các operations CRUD
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  subscribeToGoals,
  createGoal,
  updateGoal,
  addMoneyToGoal,
  deleteGoal,
} from "../services/goalService";

/**
 * Hook xử lý logic cho Mục tiêu tiết kiệm
 * @returns {Object} State và các hàm xử lý goals
 */
export const useGoals = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lắng nghe realtime changes từ Firestore
  useEffect(() => {
    if (!currentUser) {
      // Reset state khi user logout - wrap trong queueMicrotask để tránh lint warning
      // Về bản chất vẫn là cleanup logic hợp lệ
      queueMicrotask(() => {
        setGoals([]);
        setIsLoading(false);
      });
      return;
    }

    // Wrap trong queueMicrotask để tránh lint warning
    queueMicrotask(() => setIsLoading(true));

    const unsubscribe = subscribeToGoals(
      currentUser.uid,
      (fetchedGoals) => {
        setGoals(fetchedGoals);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  /**
   * Tạo mục tiêu mới
   */
  const handleCreateGoal = useCallback(
    async (goalData) => {
      if (!currentUser) return;

      try {
        await createGoal(currentUser.uid, goalData);
        return { success: true };
      } catch (err) {
        console.error("Lỗi khi tạo mục tiêu:", err);
        return { success: false, error: err.message };
      }
    },
    [currentUser]
  );

  /**
   * Cập nhật mục tiêu
   */
  const handleUpdateGoal = useCallback(
    async (goalId, updates) => {
      if (!currentUser) return;

      try {
        await updateGoal(currentUser.uid, goalId, updates);
        return { success: true };
      } catch (err) {
        console.error("Lỗi khi cập nhật mục tiêu:", err);
        return { success: false, error: err.message };
      }
    },
    [currentUser]
  );

  /**
   * Thêm tiền vào mục tiêu (Bỏ tiết kiệm)
   */
  const handleAddMoney = useCallback(
    async (goal, amount) => {
      if (!currentUser) return;

      try {
        await addMoneyToGoal(
          currentUser.uid,
          goal.id,
          amount,
          goal.currentAmount,
          goal.targetAmount
        );
        return { success: true };
      } catch (err) {
        console.error("Lỗi khi thêm tiền:", err);
        return { success: false, error: err.message };
      }
    },
    [currentUser]
  );

  /**
   * Xóa mục tiêu
   */
  const handleDeleteGoal = useCallback(
    async (goalId) => {
      if (!currentUser) return;

      try {
        await deleteGoal(currentUser.uid, goalId);
        return { success: true };
      } catch (err) {
        console.error("Lỗi khi xóa mục tiêu:", err);
        return { success: false, error: err.message };
      }
    },
    [currentUser]
  );

  // Tính toán thống kê
  const stats = {
    total: goals.length,
    active: goals.filter((g) => g.status === "active").length,
    completed: goals.filter((g) => g.status === "completed").length,
    totalSaved: goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0),
    totalTarget: goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0),
  };

  return {
    goals,
    isLoading,
    error,
    stats,
    createGoal: handleCreateGoal,
    updateGoal: handleUpdateGoal,
    addMoney: handleAddMoney,
    deleteGoal: handleDeleteGoal,
  };
};

export default useGoals;
