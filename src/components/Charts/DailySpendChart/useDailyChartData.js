import { useMemo, useState, useEffect } from "react";
import {
  format,
  parseISO,
  eachDayOfInterval,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from "date-fns";
import {
  DAYS_TO_WEEK_THRESHOLD,
  DAYS_TO_MONTH_THRESHOLD,
  BAR_COLOR_LIGHT,
  BAR_COLOR_DARK,
  GRID_COLOR_LIGHT,
  GRID_COLOR_DARK,
  TICK_COLOR_LIGHT,
  TICK_COLOR_DARK,
  STROKE_COLOR_LIGHT,
  STROKE_COLOR_DARK,
} from "./constants";

/**
 * Hook xử lý logic tính toán dữ liệu cho biểu đồ cột chi tiêu theo ngày/tuần/tháng
 * Tự động quyết định cách gom nhóm dựa trên khoảng thời gian
 * 
 * @param {Array} transactions - Mảng các giao dịch cần xử lý
 * @param {Object} dateRange - Khoảng thời gian { from: Date, to: Date }
 * @returns {Object} Object chứa dữ liệu đã xử lý và các style cho biểu đồ
 * @returns {Array} returns.chartData - Dữ liệu đã được xử lý để vẽ biểu đồ
 * @returns {string} returns.chartTitle - Tiêu đề biểu đồ dựa trên period
 * @returns {boolean} returns.isDark - Trạng thái dark mode
 * @returns {Object} returns.chartStyles - Object chứa các màu sắc cho biểu đồ
 */
export const useDailyChartData = (transactions, dateRange) => {
  const [isDark, setIsDark] = useState(false);

  /**
   * Theo dõi dark mode để điều chỉnh màu sắc
   */
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Theo dõi thay đổi dark mode
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /**
   * Tính toán dữ liệu chi tiêu với tự động gom nhóm
   * Logic: Xác định khoảng thời gian -> Quyết định cách gom nhóm -> Nhóm dữ liệu
   */
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Xác định khoảng thời gian và chuẩn hóa
    let from, to;
    if (dateRange && dateRange.from && dateRange.to) {
      // Chuẩn hóa thời gian để đảm bảo bao gồm cả ngày bắt đầu và kết thúc
      from = startOfDay(dateRange.from);
      to = endOfDay(dateRange.to);
    } else {
      // Nếu không có dateRange, lấy từ transactions (chỉ expense)
      const expenseDates = transactions
        .filter((tx) => tx.type === "expense")
        .map((tx) => parseISO(tx.date));

      if (expenseDates.length === 0) {
        return [];
      }

      from = startOfDay(new Date(Math.min(...expenseDates)));
      to = endOfDay(new Date(Math.max(...expenseDates)));
    }

    // Đảm bảo from <= to
    if (from > to) {
      [from, to] = [to, from];
    }

    // Tính số ngày trong khoảng thời gian
    const daysDiff = Math.abs(differenceInDays(to, from));

    // Quyết định cách gom nhóm dựa trên khoảng thời gian
    let groupType = "day"; // day, week, month
    if (daysDiff > DAYS_TO_MONTH_THRESHOLD) {
      // > 6 tháng: gom theo tháng
      groupType = "month";
    } else if (daysDiff > DAYS_TO_WEEK_THRESHOLD) {
      // > 2 tháng: gom theo tuần
      groupType = "week";
    }

    // Lọc transactions trong khoảng thời gian
    const filteredTransactions = transactions.filter((tx) => {
      if (tx.type !== "expense") return false;
      const txDate = parseISO(tx.date);
      return txDate >= from && txDate <= to;
    });

    if (filteredTransactions.length === 0) {
      return [];
    }

    // Gom nhóm theo loại đã chọn
    if (groupType === "month") {
      // Gom theo tháng
      const months = eachMonthOfInterval({ start: from, end: to });
      const monthlyData = months.map((month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const monthStr = format(month, "MM/yyyy");

        const monthTransactions = filteredTransactions.filter((tx) => {
          const txDate = parseISO(tx.date);
          return txDate >= monthStart && txDate <= monthEnd;
        });

        const total = monthTransactions.reduce(
          (sum, tx) => sum + (tx.amount || 0),
          0
        );

        return {
          date: monthStr,
          fullDate: `Tháng ${format(month, "MM/yyyy")}`,
          value: total,
          period: "month",
        };
      });

      return monthlyData;
    } else if (groupType === "week") {
      // Gom theo tuần
      const weeks = eachWeekOfInterval(
        { start: from, end: to },
        { weekStartsOn: 1 } // Tuần bắt đầu từ thứ 2
      );
      const weeklyData = weeks.map((week) => {
        const weekStart = startOfWeek(week, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(week, { weekStartsOn: 1 });

        // Đảm bảo không vượt quá khoảng thời gian đã chọn
        const actualStart = weekStart < from ? from : weekStart;
        const actualEnd = weekEnd > to ? to : weekEnd;

        const weekTransactions = filteredTransactions.filter((tx) => {
          const txDate = parseISO(tx.date);
          return txDate >= actualStart && txDate <= actualEnd;
        });

        const total = weekTransactions.reduce(
          (sum, tx) => sum + (tx.amount || 0),
          0
        );

        return {
          date: `${format(actualStart, "dd/MM")} - ${format(actualEnd, "dd/MM")}`,
          fullDate: `Tuần ${format(actualStart, "dd/MM")} - ${format(actualEnd, "dd/MM/yyyy")}`,
          value: total,
          period: "week",
        };
      });

      return weeklyData;
    } else {
      // Gom theo ngày (mặc định)
      const days = eachDayOfInterval({ start: from, end: to });
      const dailyData = days.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayTransactions = filteredTransactions.filter(
          (tx) => tx.date === dayStr
        );

        const total = dayTransactions.reduce(
          (sum, tx) => sum + (tx.amount || 0),
          0
        );

        return {
          date: format(day, "dd/MM"),
          fullDate: format(day, "dd/MM/yyyy"),
          value: total,
          period: "day",
        };
      });

      return dailyData;
    }
  }, [transactions, dateRange]);

  /**
   * Xác định tiêu đề biểu đồ dựa trên period
   */
  const chartTitle = useMemo(() => {
    if (chartData.length === 0) return "Chi Tiêu Theo Ngày";
    const period = chartData[0]?.period;
    if (period === "month") return "Chi Tiêu Theo Tháng";
    if (period === "week") return "Chi Tiêu Theo Tuần";
    return "Chi Tiêu Theo Ngày";
  }, [chartData]);

  /**
   * Object chứa các màu sắc cho biểu đồ dựa trên dark mode
   */
  const chartStyles = useMemo(
    () => ({
      barColor: isDark ? BAR_COLOR_DARK : BAR_COLOR_LIGHT,
      gridColor: isDark ? GRID_COLOR_DARK : GRID_COLOR_LIGHT,
      tickColor: isDark ? TICK_COLOR_DARK : TICK_COLOR_LIGHT,
      strokeColor: isDark ? STROKE_COLOR_DARK : STROKE_COLOR_LIGHT,
    }),
    [isDark]
  );

  return {
    chartData,
    chartTitle,
    isDark,
    chartStyles,
  };
};

