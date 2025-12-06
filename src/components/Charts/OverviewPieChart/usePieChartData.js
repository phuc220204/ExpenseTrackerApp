import { useMemo, useState, useEffect } from "react";
import {
  TOP_CATEGORIES_COUNT,
  EXPENSE_COLORS,
  INCOME_COLORS,
  EXPENSE_DARK_COLORS,
  INCOME_DARK_COLORS,
  OTHER_COLOR,
  OTHER_COLOR_DARK,
} from "./constants";

/**
 * Hook xử lý logic tính toán dữ liệu cho biểu đồ tròn
 * Bao gồm: lọc theo loại, nhóm theo danh mục, tính phần trăm, gom nhóm Top 5 + "Khác"
 * 
 * @param {Array} transactions - Mảng các giao dịch cần xử lý
 * @returns {Object} Object chứa dữ liệu đã xử lý và các state liên quan
 * @returns {string} returns.selectedType - Loại giao dịch đang chọn ('expense' | 'income')
 * @returns {Function} returns.setSelectedType - Hàm set state cho selectedType
 * @returns {Array} returns.chartData - Dữ liệu đã được xử lý để vẽ biểu đồ
 * @returns {Array} returns.colors - Bảng màu tương ứng với loại giao dịch và dark mode
 * @returns {string} returns.otherColor - Màu cho nhóm "Khác"
 * @returns {string} returns.cardTitle - Tiêu đề Card dựa trên loại giao dịch
 */
export const usePieChartData = (transactions) => {
  const [selectedType, setSelectedType] = useState("expense");
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
   * Lọc transactions theo loại đã chọn
   */
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.type === selectedType);
  }, [transactions, selectedType]);

  /**
   * Tính toán dữ liệu cho biểu đồ tròn theo danh mục
   * Logic: Nhóm theo category -> Tính tổng và phần trăm -> Sắp xếp -> Gom Top 5 + "Khác"
   */
  const chartData = useMemo(() => {
    const categoryMap = {};

    // Nhóm transactions theo danh mục (chỉ từ filteredTransactions)
    filteredTransactions.forEach((tx) => {
      const category = tx.category || "Khác";
      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          value: 0,
          type: tx.type,
        };
      }
      categoryMap[category].value += tx.amount || 0;
    });

    // Chuyển thành mảng và tính tổng
    let data = Object.values(categoryMap);
    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
      return [];
    }

    // Thêm phần trăm và sắp xếp theo giá trị giảm dần
    data = data
      .map((item) => ({
        ...item,
        percentage: (item.value / total) * 100,
      }))
      .sort((a, b) => b.value - a.value);

    // Logic gom nhóm: Chỉ giữ Top 5, phần còn lại gom vào "Khác"
    const topCategories = data.slice(0, TOP_CATEGORIES_COUNT);
    const remainingCategories = data.slice(TOP_CATEGORIES_COUNT);

    // Tính tổng giá trị của các danh mục còn lại
    const otherValue = remainingCategories.reduce(
      (sum, item) => sum + item.value,
      0
    );

    // Kiểm tra xem trong Top 5 đã có "Khác" chưa
    const otherIndex = topCategories.findIndex(
      (item) => item.name === "Khác"
    );

    // Tạo mảng kết quả
    const result = [...topCategories];

    if (otherValue > 0) {
      if (otherIndex !== -1) {
        // Nếu đã có "Khác" trong Top 5, cộng dồn giá trị vào đó
        result[otherIndex].value += otherValue;
        result[otherIndex].percentage =
          (result[otherIndex].value / total) * 100;
        result[otherIndex].isGrouped = true; // Đánh dấu đã được gom thêm
      } else {
        // Nếu chưa có "Khác", tạo mới
        result.push({
          name: "Khác",
          value: otherValue,
          percentage: (otherValue / total) * 100,
          type: "other",
          isGrouped: true, // Flag để nhận biết đây là nhóm "Khác" được gom lại
        });
      }
    }

    return result;
  }, [filteredTransactions]);

  /**
   * Chọn bảng màu dựa trên loại giao dịch và dark mode
   */
  const colors = useMemo(() => {
    if (selectedType === "income") {
      return isDark ? INCOME_DARK_COLORS : INCOME_COLORS;
    }
    return isDark ? EXPENSE_DARK_COLORS : EXPENSE_COLORS;
  }, [selectedType, isDark]);

  const otherColor = isDark ? OTHER_COLOR_DARK : OTHER_COLOR;

  /**
   * Tiêu đề Card dựa trên loại giao dịch
   */
  const cardTitle =
    selectedType === "income" ? "Cơ Cấu Thu Nhập" : "Cơ Cấu Chi Tiêu";

  return {
    selectedType,
    setSelectedType,
    chartData,
    colors,
    otherColor,
    cardTitle,
  };
};

