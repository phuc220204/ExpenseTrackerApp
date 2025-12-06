import { useState, useMemo } from "react";
import { format } from "date-fns";
import { filterTransactionsByDateRange } from "../../utils/dateFilter";

/**
 * Hook xử lý logic lọc dữ liệu cho trang Statistics
 * Quản lý dateRange state và tính toán filteredTransactions
 * 
 * @param {Array} transactions - Mảng tất cả các giao dịch
 * @returns {Object} Object chứa state và dữ liệu đã được lọc
 * @returns {Object|null} returns.dateRange - Khoảng thời gian đã chọn { from: Date, to: Date }
 * @returns {Function} returns.setDateRange - Hàm set state cho dateRange
 * @returns {Array} returns.filteredTransactions - Mảng transactions đã được lọc theo dateRange
 * @returns {string} returns.dateRangeText - Text tóm tắt khoảng thời gian đang xem
 */
export const useStatisticsFilter = (transactions) => {
  const [dateRange, setDateRange] = useState(null);

  /**
   * Lọc transactions theo khoảng thời gian đã chọn
   * Nếu không có dateRange, trả về toàn bộ transactions
   */
  const filteredTransactions = useMemo(() => {
    if (!dateRange) {
      // Mặc định là tất cả transactions nếu chưa có dateRange
      return transactions;
    }
    return filterTransactionsByDateRange(transactions, dateRange);
  }, [transactions, dateRange]);

  /**
   * Format text tóm tắt khoảng thời gian
   * Hiển thị dạng "Dữ liệu từ dd/MM/yyyy đến dd/MM/yyyy"
   */
  const dateRangeText = useMemo(() => {
    if (!dateRange || !dateRange.from || !dateRange.to) {
      return "";
    }
    return `Dữ liệu từ ${format(dateRange.from, "dd/MM/yyyy")} đến ${format(
      dateRange.to,
      "dd/MM/yyyy"
    )}`;
  }, [dateRange]);

  return {
    dateRange,
    setDateRange,
    filteredTransactions,
    dateRangeText,
  };
};

