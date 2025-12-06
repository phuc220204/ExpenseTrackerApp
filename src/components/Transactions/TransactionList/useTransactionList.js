import { useMemo } from "react";
import { format, isToday, isYesterday, parseISO } from "date-fns";

/**
 * Format ngày hiển thị trong header
 * Hiển thị "Hôm nay", "Hôm qua" hoặc định dạng ngày tháng
 * 
 * @param {string} dateString - Chuỗi ngày theo định dạng YYYY-MM-DD
 * @returns {string} Chuỗi ngày đã được format
 */
export const formatDateHeader = (dateString) => {
  const date = parseISO(dateString);
  if (isToday(date)) {
    return "Hôm nay";
  }
  if (isYesterday(date)) {
    return "Hôm qua";
  }
  return format(date, "dd/MM/yyyy");
};

/**
 * Hook xử lý logic cho TransactionList component
 * Gom nhóm và sắp xếp transactions theo ngày
 * 
 * @param {Array} transactions - Mảng các giao dịch cần xử lý
 * @returns {Object} Object chứa dữ liệu đã được xử lý
 * @returns {Object} returns.groupedTransactions - Object chứa transactions được nhóm theo ngày
 * @returns {Array} returns.sortedDates - Mảng các ngày đã được sắp xếp (mới nhất trước)
 */
export const useTransactionList = (transactions) => {
  /**
   * Gom nhóm giao dịch theo ngày
   * Key là date (YYYY-MM-DD), value là mảng transactions của ngày đó
   */
  const groupedTransactions = useMemo(() => {
    return transactions.reduce((groups, transaction) => {
      const date = transaction.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
  }, [transactions]);

  /**
   * Sắp xếp các ngày theo thứ tự giảm dần (mới nhất trước)
   */
  const sortedDates = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => {
      return new Date(b) - new Date(a);
    });
  }, [groupedTransactions]);

  return {
    groupedTransactions,
    sortedDates,
  };
};

