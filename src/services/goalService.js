/**
 * Service xử lý CRUD cho Mục tiêu tiết kiệm (Savings Goals)
 * Collection: users/{userId}/goals/{goalId}
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Lấy reference đến collection goals của user
 * @param {string} userId - ID của user
 * @returns {CollectionReference} Reference đến collection
 */
const getGoalsCollection = (userId) => {
  return collection(db, "users", userId, "goals");
};

/**
 * Lắng nghe realtime thay đổi của goals
 * @param {string} userId - ID của user
 * @param {Function} onSuccess - Callback khi có data
 * @param {Function} onError - Callback khi có lỗi
 * @returns {Function} Unsubscribe function
 */
export const subscribeToGoals = (userId, onSuccess, onError) => {
  const goalsRef = getGoalsCollection(userId);
  const q = query(goalsRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const goals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onSuccess(goals);
    },
    (error) => {
      console.error("Lỗi khi lắng nghe goals:", error);
      onError(error);
    }
  );
};

/**
 * Tạo mục tiêu mới
 * @param {string} userId - ID của user
 * @param {Object} goalData - Dữ liệu mục tiêu
 * @returns {Promise<string>} ID của mục tiêu vừa tạo
 */
export const createGoal = async (userId, goalData) => {
  const goalsRef = getGoalsCollection(userId);

  const newGoal = {
    ...goalData,
    currentAmount: goalData.currentAmount || 0,
    status: "active", // active, completed, cancelled
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(goalsRef, newGoal);
  return docRef.id;
};

/**
 * Cập nhật mục tiêu
 * @param {string} userId - ID của user
 * @param {string} goalId - ID của mục tiêu
 * @param {Object} updates - Dữ liệu cần cập nhật
 */
export const updateGoal = async (userId, goalId, updates) => {
  const goalRef = doc(db, "users", userId, "goals", goalId);

  await updateDoc(goalRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Thêm tiền vào mục tiêu (Bỏ tiết kiệm)
 * @param {string} userId - ID của user
 * @param {string} goalId - ID của mục tiêu
 * @param {number} amount - Số tiền thêm vào
 * @param {number} currentTotal - Tổng tiền hiện tại
 * @param {number} targetAmount - Mục tiêu cần đạt
 */
export const addMoneyToGoal = async (
  userId,
  goalId,
  amount,
  currentTotal,
  targetAmount
) => {
  const newTotal = currentTotal + amount;
  const updates = {
    currentAmount: newTotal,
  };

  // Tự động đánh dấu hoàn thành nếu đạt mục tiêu
  if (newTotal >= targetAmount) {
    updates.status = "completed";
    updates.completedAt = serverTimestamp();
  }

  await updateGoal(userId, goalId, updates);
};

/**
 * Xóa mục tiêu
 * @param {string} userId - ID của user
 * @param {string} goalId - ID của mục tiêu
 */
export const deleteGoal = async (userId, goalId) => {
  const goalRef = doc(db, "users", userId, "goals", goalId);
  await deleteDoc(goalRef);
};

/**
 * Icon mặc định cho mục tiêu
 */
export const DEFAULT_GOAL_ICONS = [
  "🎯",
  "📱",
  "💻",
  "🏠",
  "🚗",
  "✈️",
  "🎓",
  "💍",
  "👶",
  "🏥",
  "🎸",
  "📸",
  "🎮",
  "👗",
  "⌚",
  "🎁",
];

/**
 * Màu mặc định cho mục tiêu
 */
export const DEFAULT_GOAL_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];
