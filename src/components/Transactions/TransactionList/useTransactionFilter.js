import { useState, useMemo, useCallback } from "react";

/**
 * Hook xử lý logic filter cho TransactionList
 * Hỗ trợ tìm kiếm theo text, lọc theo loại (income/expense), và lọc theo category
 *
 * @param {Array} transactions - Mảng các giao dịch gốc
 * @returns {Object} Object chứa filtered transactions và các controls
 */
export const useTransactionFilter = (transactions) => {
  // State cho các filter
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "income" | "expense"
  const [categoryFilter, setCategoryFilter] = useState("all"); // "all" | category name

  /**
   * Lấy danh sách categories duy nhất từ transactions
   */
  const availableCategories = useMemo(() => {
    const categories = new Set();
    transactions.forEach((tx) => {
      if (tx.category) {
        // Lấy category chính (phần trước dấu " > " nếu có)
        const mainCategory = tx.category.split(" > ")[0];
        categories.add(mainCategory);
      }
    });
    return Array.from(categories).sort();
  }, [transactions]);

  /**
   * Filter transactions dựa trên các tiêu chí
   */
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Filter theo search query (tìm trong note và category)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const noteMatch = tx.note?.toLowerCase().includes(query);
        const categoryMatch = tx.category?.toLowerCase().includes(query);
        if (!noteMatch && !categoryMatch) {
          return false;
        }
      }

      // Filter theo type
      if (typeFilter !== "all" && tx.type !== typeFilter) {
        return false;
      }

      // Filter theo category
      if (categoryFilter !== "all") {
        const txMainCategory = tx.category?.split(" > ")[0];
        if (txMainCategory !== categoryFilter) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, searchQuery, typeFilter, categoryFilter]);

  /**
   * Kiểm tra xem có filter nào đang active không
   */
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      typeFilter !== "all" ||
      categoryFilter !== "all"
    );
  }, [searchQuery, typeFilter, categoryFilter]);

  /**
   * Reset tất cả filters về mặc định
   */
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setTypeFilter("all");
    setCategoryFilter("all");
  }, []);

  /**
   * Đếm số lượng kết quả sau khi filter
   */
  const resultCount = filteredTransactions.length;
  const totalCount = transactions.length;

  return {
    // Filter states
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,

    // Data
    filteredTransactions,
    availableCategories,

    // Utilities
    hasActiveFilters,
    clearFilters,
    resultCount,
    totalCount,
  };
};

export default useTransactionFilter;
