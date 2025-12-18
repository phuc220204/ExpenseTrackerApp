import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from "../services/challengesService";

/**
 * Context quản lý Thử thách Tiết kiệm (Challenges)
 * Cung cấp state và actions cho việc quản lý challenges
 */

const ChallengesContext = createContext(null);

export const ChallengesProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch challenges từ Firestore
   */
  const fetchChallenges = useCallback(async () => {
    // Chờ auth loading hoàn tất trước
    if (authLoading) {
      return;
    }

    if (!currentUser) {
      setChallenges([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getChallenges(currentUser.uid);
      setChallenges(data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải thử thách:", err);
      setError("Không thể tải danh sách thử thách");
    } finally {
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  // Fetch challenges khi user thay đổi
  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  /**
   * Thêm thử thách mới
   */
  const addChallenge = async (challengeData) => {
    if (!currentUser) return;

    try {
      const challengeId = await createChallenge(currentUser.uid, challengeData);

      const newChallenge = {
        id: challengeId,
        ...challengeData,
        currentAmount: 0,
        streakDays: 0,
        status: "active",
        createdAt: new Date(),
      };

      setChallenges((prev) => [newChallenge, ...prev]);
      return challengeId;
    } catch (err) {
      console.error("Lỗi khi thêm thử thách:", err);
      throw err;
    }
  };

  /**
   * Cập nhật thử thách
   */
  const editChallenge = async (challengeId, updates) => {
    if (!currentUser) return;

    try {
      await updateChallenge(currentUser.uid, challengeId, updates);

      setChallenges((prev) =>
        prev.map((c) => (c.id === challengeId ? { ...c, ...updates } : c))
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật thử thách:", err);
      throw err;
    }
  };

  /**
   * Ghi nhận tiến độ
   */
  const recordProgress = async (challengeId, amount) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    const newAmount = challenge.currentAmount + amount;
    const isCompleted = newAmount >= challenge.targetAmount;

    await editChallenge(challengeId, {
      currentAmount: newAmount,
      streakDays: challenge.streakDays + 1,
      status: isCompleted ? "completed" : "active",
    });
  };

  /**
   * Xóa thử thách
   */
  const removeChallenge = async (challengeId) => {
    if (!currentUser) return;

    try {
      await deleteChallenge(currentUser.uid, challengeId);
      setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    } catch (err) {
      console.error("Lỗi khi xóa thử thách:", err);
      throw err;
    }
  };

  // Tính toán thống kê
  const stats = {
    activeCount: challenges.filter((c) => c.status === "active").length,
    completedCount: challenges.filter((c) => c.status === "completed").length,
    totalSaved: challenges
      .filter((c) => c.status === "completed")
      .reduce((sum, c) => sum + c.currentAmount, 0),
  };

  const value = {
    challenges,
    loading,
    error,
    stats,
    addChallenge,
    editChallenge,
    recordProgress,
    removeChallenge,
    refreshChallenges: fetchChallenges,
  };

  return (
    <ChallengesContext.Provider value={value}>
      {children}
    </ChallengesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error("useChallenges must be used within ChallengesProvider");
  }
  return context;
};
