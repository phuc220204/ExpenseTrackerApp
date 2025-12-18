import { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  where,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";

/**
 * Custom hook để quản lý transactions từ Firestore
 * Sử dụng onSnapshot để lắng nghe dữ liệu real-time
 * Path: users/{userId}/transactions
 */
const useTransactions = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ledger State
  const [ledgers, setLedgers] = useState([{ id: "main", name: "Sổ Chính" }]);
  const [currentLedger, setCurrentLedger] = useState(() => {
    const saved = localStorage.getItem("currentLedgerId");
    return saved ? { id: saved } : { id: "main", name: "Sổ Chính" };
  });

  // Load ledgers settings
  useEffect(() => {
    // Chờ auth loading hoàn tất trước
    if (authLoading) return;
    if (!currentUser) return;

    const fetchLedgers = async () => {
      try {
        const settingsRef = doc(
          db,
          "users",
          currentUser.uid,
          "settings",
          "appSettings"
        );
        const docSnap = await getDoc(settingsRef); // Need to import getDoc

        if (docSnap.exists() && docSnap.data().ledgers) {
          setLedgers(docSnap.data().ledgers);

          // Verify current ledger exists
          const savedId = localStorage.getItem("currentLedgerId");
          const exists = docSnap.data().ledgers.find((l) => l.id === savedId);
          if (exists) {
            setCurrentLedger(exists);
          } else {
            setCurrentLedger(docSnap.data().ledgers[0]);
            localStorage.setItem(
              "currentLedgerId",
              docSnap.data().ledgers[0].id
            );
          }
        } else {
          // Initialize if not exists
          const defaultLedgers = [{ id: "main", name: "Sổ Chính" }];
          await setDoc(
            settingsRef,
            { ledgers: defaultLedgers },
            { merge: true }
          ); // Need import setDoc
          setLedgers(defaultLedgers);
        }
      } catch (err) {
        console.error("Error loading ledgers:", err);
      }
    };

    fetchLedgers();
  }, [currentUser, authLoading]);

  /**
   * Effect để lắng nghe dữ liệu transactions từ Firestore real-time
   * Sử dụng onSnapshot để tự động cập nhật khi có thay đổi
   * Filter theo ledgerId
   */
  useEffect(() => {
    // Nếu chưa có user, reset state và không lắng nghe dữ liệu
    if (!currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    // Tạo reference đến collection transactions của user hiện tại
    const transactionsRef = collection(
      db,
      "users",
      currentUser.uid,
      "transactions"
    );

    // Tạo query với sắp xếp theo createdAt giảm dần VÀ filter theo ledgerId
    // Note: Cần Composite Index cho ledgerId + createdAt nếu data lớn.
    // Tạm thời filter client side nếu index chưa có, hoặc chỉ filter ledgerId
    // Để đơn giản và tránh lỗi index ngay lập tức, ta filter trong query
    const q = query(
      transactionsRef,
      where("ledgerId", "==", currentLedger.id || "main"),
      orderBy("createdAt", "desc")
    );

    // Lắng nghe thay đổi real-time
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Convert Firestore documents sang array
        const transactionsData = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));

        setTransactions(transactionsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Lỗi khi lắng nghe transactions:", error);
        // Fallback: nếu lỗi index, thử query không sort
        if (error.code === "failed-precondition") {
          const fallbackQ = query(
            transactionsRef,
            where("ledgerId", "==", currentLedger.id || "main")
          );
          onSnapshot(fallbackQ, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            // Sort client side
            data.sort(
              (a, b) =>
                (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
            );
            setTransactions(data);
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      }
    );

    // Cleanup: Hủy đăng ký listener khi component unmount hoặc user thay đổi
    return () => unsubscribe();
  }, [currentUser, currentLedger.id]);

  /**
   * Thêm giao dịch mới vào Firestore
   */
  const addTransaction = async (newTx) => {
    if (!currentUser) {
      console.error("Không thể thêm giao dịch: Chưa đăng nhập");
      return;
    }

    try {
      const transactionsRef = collection(
        db,
        "users",
        currentUser.uid,
        "transactions"
      );

      const transactionData = {
        userId: currentUser.uid,
        ledgerId: currentLedger.id || "main", // Attach current ledger ID
        date: newTx.date,
        type: newTx.type,
        category: newTx.category,
        amount: Number(newTx.amount),
        note: newTx.note || "",
        paymentMethod: newTx.paymentMethod,
        ...(newTx.paymentMethod === "transfer" && newTx.bankName
          ? { bankName: newTx.bankName }
          : {}),
        createdAt: serverTimestamp(),
      };

      await addDoc(transactionsRef, transactionData);
    } catch (error) {
      console.error("Lỗi khi thêm giao dịch:", error);
      throw error;
    }
  };

  // Ledger Management Actions
  const switchLedger = (ledger) => {
    setCurrentLedger(ledger);
    localStorage.setItem("currentLedgerId", ledger.id);
  };

  const addLedger = async (name) => {
    const newId = `ledger_${Date.now()}`;
    const newLedger = { id: newId, name };
    const newLedgers = [...ledgers, newLedger];

    try {
      const settingsRef = doc(
        db,
        "users",
        currentUser.uid,
        "settings",
        "appSettings"
      );
      await setDoc(settingsRef, { ledgers: newLedgers }, { merge: true });
      setLedgers(newLedgers);
      return newLedger;
    } catch (e) {
      console.error("Error adding ledger", e);
      throw e;
    }
  };

  /**
   * Cập nhật tên ledger (sổ thu chi)
   * Cho phép đổi tên tất cả các sổ (bao gồm cả Sổ Chính)
   * @param {string} ledgerId - ID của ledger cần cập nhật
   * @param {string} newName - Tên mới của ledger
   */
  const updateLedger = async (ledgerId, newName) => {
    if (!currentUser || !newName.trim()) return;

    const updatedLedgers = ledgers.map((l) =>
      l.id === ledgerId ? { ...l, name: newName.trim() } : l
    );

    try {
      const settingsRef = doc(
        db,
        "users",
        currentUser.uid,
        "settings",
        "appSettings"
      );
      await setDoc(settingsRef, { ledgers: updatedLedgers }, { merge: true });
      setLedgers(updatedLedgers);

      // Cập nhật currentLedger nếu đang chọn ledger này
      if (currentLedger.id === ledgerId) {
        setCurrentLedger({ ...currentLedger, name: newName.trim() });
      }
    } catch (e) {
      console.error("Error updating ledger", e);
      throw e;
    }
  };

  /**
   * Xóa ledger (sổ thu chi)
   * Cho phép xóa bất kỳ sổ nào miễn là còn ít nhất 1 sổ
   * @param {string} ledgerId - ID của ledger cần xóa
   */
  const deleteLedger = async (ledgerId) => {
    if (!currentUser) return;

    // Phải giữ ít nhất 1 ledger
    if (ledgers.length <= 1) {
      throw new Error(
        "Phải có ít nhất một sổ thu chi. Không thể xóa sổ duy nhất."
      );
    }

    const updatedLedgers = ledgers.filter((l) => l.id !== ledgerId);

    try {
      const settingsRef = doc(
        db,
        "users",
        currentUser.uid,
        "settings",
        "appSettings"
      );
      await setDoc(settingsRef, { ledgers: updatedLedgers }, { merge: true });
      setLedgers(updatedLedgers);

      // Nếu đang chọn ledger bị xóa, chuyển về sổ chính
      if (currentLedger.id === ledgerId) {
        const mainLedger =
          updatedLedgers.find((l) => l.id === "main") || updatedLedgers[0];
        setCurrentLedger(mainLedger);
        localStorage.setItem("currentLedgerId", mainLedger.id);
      }
    } catch (e) {
      console.error("Error deleting ledger", e);
      throw e;
    }
  };

  // ... (Keep update and delete transaction as is, but ensure they don't break)
  // Reuse existing update/delete logic since they rely on doc ID which is unique regardless of ledger

  // Need to update return object

  /**
   * Cập nhật giao dịch trong Firestore
   */
  const updateTransaction = async (transactionId, updatedData) => {
    if (!currentUser) return;

    try {
      const transactionRef = doc(
        db,
        "users",
        currentUser.uid,
        "transactions",
        transactionId
      );

      const updateData = { ...updatedData };
      if (updateData.amount !== undefined)
        updateData.amount = Number(updateData.amount);

      // Handle bankName logic ... (same as before)
      if (updateData.paymentMethod === "transfer") {
        if (!updateData.bankName) delete updateData.bankName;
      } else {
        delete updateData.bankName;
      }

      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) delete updateData[key];
      });

      await updateDoc(transactionRef, updateData);
    } catch (error) {
      console.error("Lỗi khi cập nhật giao dịch:", error);
      throw error;
    }
  };

  const deleteTransaction = async (transactionId) => {
    if (!currentUser) return;
    try {
      const transactionRef = doc(
        db,
        "users",
        currentUser.uid,
        "transactions",
        transactionId
      );
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error("Lỗi khi xóa giao dịch:", error);
      throw error;
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
  };

  const totalIncome = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  }, [transactions]);

  const balance = useMemo(() => {
    return totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshData,
    totalIncome,
    totalExpense,
    balance,
    // Ledger Exports
    ledgers,
    currentLedger,
    switchLedger,
    addLedger,
    updateLedger,
    deleteLedger,
  };
};

/**
 * Hàm helper để lấy transactions theo khoảng thời gian
 * Sử dụng getDocs (không phải realtime) để phục vụ cho AI phân tích
 *
 * @param {string} userId - User ID
 * @param {string} startDate - Ngày bắt đầu (YYYY-MM-DD)
 * @param {string} endDate - Ngày kết thúc (YYYY-MM-DD)
 * @param {string} ledgerId - ID của sổ ledger (mặc định 'main')
 * @returns {Promise<Array>} Mảng các transactions trong khoảng thời gian
 */
export const getTransactionsByDateRange = async (
  userId,
  startDate,
  endDate,
  ledgerId = "main"
) => {
  if (!userId) {
    console.error("User ID is required to fetch transactions.");
    return [];
  }

  try {
    const transactionsRef = collection(db, "users", userId, "transactions");

    // Tạo query với filter theo date range VÀ ledgerId
    // Lưu ý: Firestore so sánh string date theo thứ tự từ điển (YYYY-MM-DD)
    const q = query(
      transactionsRef,
      where("ledgerId", "==", ledgerId),
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date", "desc")
    );

    const snapshot = await getDocs(q);
    const transactionsData = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        ...data,
        // Đảm bảo date là string format YYYY-MM-DD
        date: data.date || "",
      };
    });

    return transactionsData;
  } catch (error) {
    console.error("Lỗi khi lấy transactions theo date range:", error);
    // Nếu lỗi do composite index, thử query đơn giản hơn
    if (error.code === "failed-precondition") {
      console.warn("Composite index chưa được tạo. Thử query đơn giản hơn...");
      try {
        const transactionsRef = collection(db, "users", userId, "transactions");
        const q = query(transactionsRef, orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const allTransactions = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));

        // Filter client-side
        const filtered = allTransactions.filter((tx) => {
          const txDate = tx.date || "";
          return txDate >= startDate && txDate <= endDate;
        });

        return filtered;
      } catch (fallbackError) {
        console.error("Lỗi khi query fallback:", fallbackError);
        throw fallbackError;
      }
    }
    throw error;
  }
};

export default useTransactions;
