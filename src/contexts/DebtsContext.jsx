import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getDebts,
  createDebt,
  updateDebt,
  deleteDebt,
  recordPayment,
  checkOverdueDebts,
} from "../services/debtsService";

/**
 * Context quản lý Món Nợ (Debts)
 * Cung cấp state và actions cho việc quản lý nợ vay/cho vay
 */

const DebtsContext = createContext(null);

export const DebtsProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch debts từ Firestore
   */
  const fetchDebts = useCallback(async () => {
    // Chờ auth loading hoàn tất trước
    if (authLoading) {
      return;
    }

    if (!currentUser) {
      setDebts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getDebts(currentUser.uid);
      // Kiểm tra và cập nhật trạng thái quá hạn
      const updatedDebts = checkOverdueDebts(data);
      setDebts(updatedDebts);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải danh sách nợ:", err);
      setError("Không thể tải danh sách nợ");
    } finally {
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  // Fetch debts khi user thay đổi
  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  /**
   * Thêm khoản nợ mới
   * @param {Object} debtData - Dữ liệu khoản nợ
   */
  const addDebt = async (debtData) => {
    if (!currentUser) return;

    try {
      const debtId = await createDebt(currentUser.uid, debtData);

      // Optimistic update
      const newDebt = {
        id: debtId,
        ...debtData,
        remainingAmount: debtData.amount,
        status: "active",
        createdAt: new Date(),
      };

      setDebts((prev) => [newDebt, ...prev]);
      return debtId;
    } catch (err) {
      console.error("Lỗi khi thêm khoản nợ:", err);
      throw err;
    }
  };

  /**
   * Cập nhật khoản nợ
   * @param {string} debtId - ID khoản nợ
   * @param {Object} updates - Các field cần update
   */
  const editDebt = async (debtId, updates) => {
    if (!currentUser) return;

    try {
      await updateDebt(currentUser.uid, debtId, updates);

      // Optimistic update
      setDebts((prev) =>
        prev.map((debt) =>
          debt.id === debtId ? { ...debt, ...updates } : debt
        )
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật khoản nợ:", err);
      throw err;
    }
  };

  /**
   * Ghi nhận thanh toán
   * @param {string} debtId - ID khoản nợ
   * @param {number} amount - Số tiền thanh toán
   */
  const makePayment = async (debtId, amount) => {
    if (!currentUser) return;

    const debt = debts.find((d) => d.id === debtId);
    if (!debt) return;

    try {
      await recordPayment(
        currentUser.uid,
        debtId,
        amount,
        debt.remainingAmount
      );

      const newRemaining = debt.remainingAmount - amount;

      // Optimistic update
      setDebts((prev) =>
        prev.map((d) =>
          d.id === debtId
            ? {
                ...d,
                remainingAmount: newRemaining,
                status: newRemaining <= 0 ? "paid" : "active",
              }
            : d
        )
      );
    } catch (err) {
      console.error("Lỗi khi ghi nhận thanh toán:", err);
      throw err;
    }
  };

  /**
   * Xóa khoản nợ
   * @param {string} debtId - ID khoản nợ
   */
  const removeDebt = async (debtId) => {
    if (!currentUser) return;

    try {
      await deleteDebt(currentUser.uid, debtId);

      // Optimistic update
      setDebts((prev) => prev.filter((debt) => debt.id !== debtId));
    } catch (err) {
      console.error("Lỗi khi xóa khoản nợ:", err);
      throw err;
    }
  };

  // Tính toán thống kê
  const stats = {
    totalLend: debts
      .filter((d) => d.type === "lend" && d.status !== "paid")
      .reduce((sum, d) => sum + d.remainingAmount, 0),
    totalBorrow: debts
      .filter((d) => d.type === "borrow" && d.status !== "paid")
      .reduce((sum, d) => sum + d.remainingAmount, 0),
    overdueCount: debts.filter((d) => d.status === "overdue").length,
    activeCount: debts.filter(
      (d) => d.status === "active" || d.status === "overdue"
    ).length,
  };

  const value = {
    debts,
    loading,
    error,
    stats,
    addDebt,
    editDebt,
    makePayment,
    removeDebt,
    refreshDebts: fetchDebts,
  };

  return (
    <DebtsContext.Provider value={value}>{children}</DebtsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDebts = () => {
  const context = useContext(DebtsContext);
  if (!context) {
    throw new Error("useDebts must be used within DebtsProvider");
  }
  return context;
};
