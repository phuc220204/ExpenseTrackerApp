import { useState, useEffect } from "react";

/**
 * Hook quản lý view mode (list/table) với responsive logic
 * Mobile: Mặc định list, ẩn toggle
 * Desktop: Mặc định table, hiển thị toggle
 * 
 * @returns {Object} Object chứa view mode state và handlers
 * @returns {'list' | 'table'} returns.viewMode - Chế độ xem hiện tại
 * @returns {Function} returns.setViewMode - Hàm set state cho viewMode
 * @returns {boolean} returns.showToggle - Có hiển thị toggle button không (chỉ desktop)
 */
export const useViewMode = () => {
  const [viewMode, setViewMode] = useState("table");
  const [showToggle, setShowToggle] = useState(true);

  /**
   * Kiểm tra và cập nhật view mode dựa trên kích thước màn hình
   */
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      // Luôn hiển thị toggle để user có thể chọn
      setShowToggle(true);
      
      // Không force view mode, để user tự chọn
      // Chỉ load từ localStorage nếu có
      const savedViewMode = localStorage.getItem("transactionViewMode");
      if (savedViewMode && (savedViewMode === "list" || savedViewMode === "table")) {
        setViewMode(savedViewMode);
      } else {
        // Mặc định: mobile dùng list, desktop dùng table
        setViewMode(isMobile ? "list" : "table");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  /**
   * Handler để thay đổi view mode và lưu vào localStorage
   */
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("transactionViewMode", mode);
  };

  return {
    viewMode,
    setViewMode: handleViewModeChange,
    showToggle,
  };
};

