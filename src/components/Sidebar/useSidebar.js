import { useState, useEffect } from "react";

/**
 * Hook xử lý logic cho Sidebar component
 * Quản lý theme state và toggle theme functionality
 * 
 * @returns {Object} Object chứa theme state và handlers
 * @returns {string} returns.theme - Trạng thái theme hiện tại ('light' | 'dark')
 * @returns {Function} returns.toggleTheme - Hàm để chuyển đổi theme
 */
export const useSidebar = () => {
  // Lazy initialization: Chỉ đọc localStorage một lần khi khởi tạo state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  /**
   * Effect để áp dụng theme vào document.documentElement khi theme thay đổi
   * Chạy khi component mount và mỗi khi theme state thay đổi
   */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  /**
   * Chuyển đổi theme giữa light và dark
   * Lưu theme mới vào localStorage và cập nhật DOM
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return {
    theme,
    toggleTheme,
  };
};

