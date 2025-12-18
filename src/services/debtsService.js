import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Service layer cho Debts (Món Nợ)
 * Xử lý CRUD operations với Firestore
 */

const COLLECTION_NAME = "debts";

/**
 * Lấy collection reference cho debts của user
 * @param {string} userId - ID của user hiện tại
 * @returns {CollectionReference} Firestore collection reference
 */
const getDebtsCollection = (userId) => {
  return collection(db, "users", userId, COLLECTION_NAME);
};

/**
 * Lấy tất cả debts của user
 * @param {string} userId - ID của user
 * @returns {Promise<Array>} Danh sách debts
 */
export const getDebts = async (userId) => {
  const debtsRef = getDebtsCollection(userId);
  const q = query(debtsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Tạo debt mới
 * @param {string} userId - ID của user
 * @param {Object} debtData - Dữ liệu debt
 * @returns {Promise<string>} ID của debt mới
 */
export const createDebt = async (userId, debtData) => {
  const debtsRef = getDebtsCollection(userId);

  const newDebt = {
    ...debtData,
    remainingAmount: debtData.amount, // Ban đầu còn nợ = tổng nợ
    status: "active",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(debtsRef, newDebt);
  return docRef.id;
};

/**
 * Cập nhật debt
 * @param {string} userId - ID của user
 * @param {string} debtId - ID của debt
 * @param {Object} updates - Các field cần update
 */
export const updateDebt = async (userId, debtId, updates) => {
  const debtRef = doc(db, "users", userId, COLLECTION_NAME, debtId);
  await updateDoc(debtRef, updates);
};

/**
 * Ghi nhận thanh toán một phần
 * @param {string} userId - ID của user
 * @param {string} debtId - ID của debt
 * @param {number} paymentAmount - Số tiền trả
 * @param {number} currentRemaining - Số tiền còn lại hiện tại
 */
export const recordPayment = async (
  userId,
  debtId,
  paymentAmount,
  currentRemaining
) => {
  const newRemaining = currentRemaining - paymentAmount;

  const updates = {
    remainingAmount: newRemaining,
    status: newRemaining <= 0 ? "paid" : "active",
  };

  await updateDebt(userId, debtId, updates);
};

/**
 * Xóa debt
 * @param {string} userId - ID của user
 * @param {string} debtId - ID của debt
 */
export const deleteDebt = async (userId, debtId) => {
  const debtRef = doc(db, "users", userId, COLLECTION_NAME, debtId);
  await deleteDoc(debtRef);
};

/**
 * Kiểm tra và cập nhật trạng thái quá hạn
 * @param {Array} debts - Danh sách debts
 * @returns {Array} Danh sách debts đã cập nhật status
 */
export const checkOverdueDebts = (debts) => {
  const today = new Date().toISOString().split("T")[0];

  return debts.map((debt) => {
    if (debt.status === "active" && debt.dueDate && debt.dueDate < today) {
      return { ...debt, status: "overdue" };
    }
    return debt;
  });
};
