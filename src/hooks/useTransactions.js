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
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";

/**
 * Custom hook để quản lý transactions từ Firestore
 * Sử dụng onSnapshot để lắng nghe dữ liệu real-time
 * Path: users/{userId}/transactions
 */
const useTransactions = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect để reset state khi user thay đổi (logout)
   * Tách riêng để tránh gọi setState trực tiếp trong useEffect chính
   */
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setIsLoading(false);
    }
  }, [currentUser]);

  /**
   * Effect để lắng nghe dữ liệu transactions từ Firestore real-time
   * Sử dụng onSnapshot để tự động cập nhật khi có thay đổi
   */
  useEffect(() => {
    // Nếu chưa có user, không lắng nghe dữ liệu
    if (!currentUser) {
      return;
    }

    // Tạo reference đến collection transactions của user hiện tại
    const transactionsRef = collection(
      db,
      "users",
      currentUser.uid,
      "transactions"
    );

    // Tạo query với sắp xếp theo createdAt giảm dần (mới nhất lên đầu)
    const q = query(transactionsRef, orderBy("createdAt", "desc"));

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
        setIsLoading(false);
      }
    );

    // Cleanup: Hủy đăng ký listener khi component unmount hoặc user thay đổi
    return () => unsubscribe();
  }, [currentUser]);

  /**
   * Thêm giao dịch mới vào Firestore
   * Đảm bảo bảo mật: Kiểm tra user trước khi thực hiện
   *
   * @param {Object} newTx - Đối tượng giao dịch cần thêm
   * @returns {Promise<void>}
   */
  const addTransaction = async (newTx) => {
    // Bảo mật: Kiểm tra user trước khi thực hiện
    if (!currentUser) {
      console.error("Không thể thêm giao dịch: Chưa đăng nhập");
      return;
    }

    try {
      // Tạo reference đến collection transactions của user
      const transactionsRef = collection(
        db,
        "users",
        currentUser.uid,
        "transactions"
      );

      // Chuẩn bị dữ liệu để thêm vào Firestore
      // Sử dụng spread operator để chỉ thêm bankName khi paymentMethod là 'transfer' và có giá trị
      const transactionData = {
        userId: currentUser.uid,
        date: newTx.date,
        type: newTx.type,
        category: newTx.category,
        amount: Number(newTx.amount), // Đảm bảo amount là Number
        note: newTx.note || "",
        paymentMethod: newTx.paymentMethod,
        // Chỉ thêm bankName nếu paymentMethod là 'transfer' và có giá trị (không phải null/undefined)
        ...(newTx.paymentMethod === "transfer" && newTx.bankName
          ? { bankName: newTx.bankName }
          : {}),
        createdAt: serverTimestamp(), // Sử dụng serverTimestamp để đảm bảo thời gian chính xác
      };

      // Thêm document vào Firestore
      // Firestore sẽ tự động tạo ID cho document mới
      await addDoc(transactionsRef, transactionData);
    } catch (error) {
      console.error("Lỗi khi thêm giao dịch:", error);
      throw error;
    }
  };

  /**
   * Cập nhật giao dịch trong Firestore
   * Đảm bảo bảo mật: Kiểm tra user và chỉ cho phép cập nhật giao dịch của chính user đó
   *
   * @param {string} transactionId - ID của giao dịch cần cập nhật
   * @param {Object} updatedData - Dữ liệu mới để cập nhật
   * @returns {Promise<void>}
   */
  const updateTransaction = async (transactionId, updatedData) => {
    // Bảo mật: Kiểm tra user trước khi thực hiện
    if (!currentUser) {
      console.error("Không thể cập nhật giao dịch: Chưa đăng nhập");
      return;
    }

    try {
      // Tạo reference đến document cần cập nhật
      const transactionRef = doc(
        db,
        "users",
        currentUser.uid,
        "transactions",
        transactionId
      );

      // Chuẩn bị dữ liệu cập nhật
      // Đảm bảo amount là Number nếu có trong updatedData
      // Loại bỏ các trường undefined để tránh lỗi Firestore
      const updateData = { ...updatedData };

      if (updateData.amount !== undefined) {
        updateData.amount = Number(updateData.amount);
      }

      // Xử lý bankName: Chỉ thêm nếu paymentMethod là 'transfer' và có giá trị
      // Nếu paymentMethod không phải 'transfer', xóa bankName khỏi updateData
      if (updateData.paymentMethod === "transfer") {
        // Nếu có bankName trong updatedData, giữ lại
        if (!updateData.bankName) {
          // Nếu không có bankName, xóa trường này khỏi updateData
          delete updateData.bankName;
        }
      } else {
        // Nếu paymentMethod không phải 'transfer', xóa bankName
        delete updateData.bankName;
      }

      // Loại bỏ tất cả các trường undefined để tránh lỗi Firestore
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      // Cập nhật document trong Firestore
      await updateDoc(transactionRef, updateData);
    } catch (error) {
      console.error("Lỗi khi cập nhật giao dịch:", error);
      throw error;
    }
  };

  /**
   * Xóa giao dịch khỏi Firestore
   * Đảm bảo bảo mật: Kiểm tra user và chỉ cho phép xóa giao dịch của chính user đó
   *
   * @param {string} transactionId - ID của giao dịch cần xóa
   * @returns {Promise<void>}
   */
  const deleteTransaction = async (transactionId) => {
    // Bảo mật: Kiểm tra user trước khi thực hiện
    if (!currentUser) {
      console.error("Không thể xóa giao dịch: Chưa đăng nhập");
      return;
    }

    try {
      // Tạo reference đến document cần xóa
      const transactionRef = doc(
        db,
        "users",
        currentUser.uid,
        "transactions",
        transactionId
      );

      // Xóa document khỏi Firestore
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error("Lỗi khi xóa giao dịch:", error);
      throw error;
    }
  };

  /**
   * Làm mới dữ liệu từ Firestore
   * Với onSnapshot, dữ liệu đã được cập nhật real-time nên hàm này chỉ cần set loading
   *
   * @returns {Promise<void>}
   */
  const refreshData = async () => {
    // Với onSnapshot, dữ liệu đã được cập nhật real-time
    // Hàm này chỉ để tạo hiệu ứng loading cho UX
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
  };

  // Tính tổng sử dụng useMemo để tối ưu hiệu suất
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
  };
};

/**
 * Hàm helper để lấy transactions theo khoảng thời gian
 * Sử dụng getDocs (không phải realtime) để phục vụ cho AI phân tích
 * 
 * @param {string} userId - User ID
 * @param {string} startDate - Ngày bắt đầu (YYYY-MM-DD)
 * @param {string} endDate - Ngày kết thúc (YYYY-MM-DD)
 * @returns {Promise<Array>} Mảng các transactions trong khoảng thời gian
 */
export const getTransactionsByDateRange = async (userId, startDate, endDate) => {
  if (!userId) {
    console.error("User ID is required to fetch transactions.");
    return [];
  }

  try {
    const transactionsRef = collection(
      db,
      "users",
      userId,
      "transactions"
    );

    console.log("Querying Firestore with:", { userId, startDate, endDate });

    // Tạo query với filter theo date range
    // Lưu ý: Firestore so sánh string date theo thứ tự từ điển (YYYY-MM-DD)
    const q = query(
      transactionsRef,
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

    console.log(`Tìm thấy ${transactionsData.length} giao dịch trong khoảng ${startDate} đến ${endDate}`);

    return transactionsData;
  } catch (error) {
    console.error("Lỗi khi lấy transactions theo date range:", error);
    // Nếu lỗi do composite index, thử query đơn giản hơn
    if (error.code === "failed-precondition") {
      console.warn("Composite index chưa được tạo. Thử query đơn giản hơn...");
      try {
        const transactionsRef = collection(
          db,
          "users",
          userId,
          "transactions"
        );
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
        
        console.log(`Tìm thấy ${filtered.length} giao dịch (filtered client-side)`);
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
