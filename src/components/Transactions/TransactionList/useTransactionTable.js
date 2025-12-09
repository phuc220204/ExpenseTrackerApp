import { useMemo, useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

/**
 * Hook xử lý logic cho TransactionTable component
 * Quản lý phân trang và sắp xếp dữ liệu
 *
 * @param {Array} transactions - Mảng tất cả các giao dịch
 * @returns {Object} Object chứa dữ liệu đã xử lý và state phân trang
 * @returns {Array} returns.sortedTransactions - Mảng transactions đã được sắp xếp
 * @returns {number} returns.page - Trang hiện tại
 * @returns {Function} returns.setPage - Hàm set state cho page
 * @returns {number} returns.totalPages - Tổng số trang
 * @returns {Array} returns.paginatedTransactions - Mảng transactions của trang hiện tại
 * @returns {string} returns.sortDescriptor - Sort descriptor hiện tại
 * @returns {Function} returns.setSortDescriptor - Hàm set sort descriptor
 */
export const useTransactionTable = (transactions) => {
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "date",
    direction: "descending", // Mặc định: mới nhất trước
  });
  const rowsPerPage = 10;

  /**
   * Sắp xếp transactions dựa trên sortDescriptor
   * Hero UI Table trả về sortDescriptor dạng { column: "date", direction: "ascending" | "descending" }
   */
  const sortedTransactions = useMemo(() => {
    if (!sortDescriptor || !sortDescriptor.column) {
      // Nếu không có sort, mặc định sort theo ngày giảm dần
      return [...transactions].sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        return dateB - dateA;
      });
    }

    const sorted = [...transactions];

    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortDescriptor.column === "date") {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        comparison = dateA.getTime() - dateB.getTime();
      } else if (sortDescriptor.column === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortDescriptor.column === "type") {
        // Sort theo type: income trước, expense sau (hoặc ngược lại)
        // "income" < "expense" trong string comparison
        comparison = a.type.localeCompare(b.type);
      }

      // Đảo ngược nếu direction là descending
      if (sortDescriptor.direction === "descending") {
        comparison = -comparison;
      }

      return comparison;
    });

    return sorted;
  }, [transactions, sortDescriptor]);

  /**
   * Tính tổng số trang
   */
  const totalPages = useMemo(() => {
    return Math.ceil(sortedTransactions.length / rowsPerPage);
  }, [sortedTransactions.length, rowsPerPage]);

  /**
   * Lấy transactions của trang hiện tại
   */
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedTransactions.slice(start, end);
  }, [sortedTransactions, page, rowsPerPage]);

  /**
   * Reset về trang 1 khi transactions thay đổi hoặc trang hiện tại vượt quá tổng số trang
   * Sử dụng useEffect thay vì useMemo để tránh lỗi gọi setState trong useMemo
   */
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      queueMicrotask(() => setPage(1));
    }
  }, [totalPages, page]);

  return {
    sortedTransactions,
    page,
    setPage,
    totalPages,
    paginatedTransactions,
    sortDescriptor,
    setSortDescriptor,
  };
};

/**
 * Format ngày để hiển thị trong bảng
 * @param {string} dateString - Chuỗi ngày theo định dạng YYYY-MM-DD
 * @returns {string} Chuỗi ngày đã được format (dd/MM/yyyy)
 */
export const formatTableDate = (dateString) => {
  return format(parseISO(dateString), "dd/MM/yyyy");
};
