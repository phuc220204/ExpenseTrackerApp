import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns'

/**
 * Lọc transactions theo khoảng thời gian
 * Đảm bảo chuẩn hóa thời gian để không bỏ sót giao dịch nào
 * @param {Array} transactions - Mảng transactions cần lọc
 * @param {Object} dateRange - Object chứa { from: Date, to: Date }
 * @returns {Array} - Mảng transactions đã được lọc
 */
export const filterTransactionsByDateRange = (transactions, dateRange) => {
  if (!dateRange || !dateRange.from || !dateRange.to) {
    return transactions
  }

  // Chuẩn hóa thời gian: đảm bảo from là đầu ngày và to là cuối ngày
  const normalizedStart = startOfDay(dateRange.from)
  const normalizedEnd = endOfDay(dateRange.to)

  return transactions.filter((transaction) => {
    // parseISO sẽ trả về thời gian 00:00:00 của ngày đó
    const transactionDate = parseISO(transaction.date)
    
    // Kiểm tra xem transactionDate có nằm trong khoảng [normalizedStart, normalizedEnd] không
    return isWithinInterval(transactionDate, {
      start: normalizedStart,
      end: normalizedEnd,
    })
  })
}

