import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";

/**
 * Custom hook quản lý ngân sách (Budgets) từ Firestore
 */
const useBudgets = () => {
  const { currentUser } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lắng nghe thay đổi từ Firestore
  useEffect(() => {
    if (!currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBudgets([]);
      setIsLoading(false);
      return;
    }

    const budgetsRef = collection(db, "users", currentUser.uid, "budgets");
    const q = query(budgetsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const budgetsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBudgets(budgetsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching budgets:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Thêm ngân sách mới
  const addBudget = async (budgetData) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, "users", currentUser.uid, "budgets"), {
        ...budgetData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding budget:", error);
      throw error;
    }
  };

  // Cập nhật ngân sách
  const updateBudget = async (id, updates) => {
    if (!currentUser) return;
    try {
      const budgetRef = doc(db, "users", currentUser.uid, "budgets", id);
      await updateDoc(budgetRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  };

  // Xóa ngân sách
  const deleteBudget = async (id) => {
    if (!currentUser) return;
    try {
      const budgetRef = doc(db, "users", currentUser.uid, "budgets", id);
      await deleteDoc(budgetRef);
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  };

  return {
    budgets,
    isLoading,
    addBudget,
    updateBudget,
    deleteBudget,
  };
};

export default useBudgets;
