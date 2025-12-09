/**
 * Định dạng số thành định dạng tiền tệ Việt Nam với VND ở sau
 * Ví dụ: 1.000.000 VND
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0 VND";
  }

  return (
    new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " VND"
  );
};

/**
 * Format số tiền rút gọn (không có suffix) - dùng cho input display
 * Ví dụ: 1.000.000
 */
export const formatAmountOnly = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0";
  }

  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format số tiền khi nhập (thêm dấu chấm phân cách hàng nghìn theo định dạng VN)
 * Ví dụ: 1000000 -> "1.000.000"
 */
export const formatAmountInput = (value) => {
  if (!value) return "";

  // Loại bỏ tất cả ký tự không phải số
  const numericValue = value.toString().replace(/\D/g, "");

  if (!numericValue) return "";

  // Thêm dấu chấm phân cách hàng nghìn theo định dạng VN
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseInt(numericValue, 10));
};

/**
 * Parse số tiền từ string đã format (loại bỏ dấu phẩy)
 * Ví dụ: "1,000,000" -> 1000000
 */
export const parseAmountInput = (formattedValue) => {
  if (!formattedValue) return "";
  return formattedValue.toString().replace(/\D/g, "");
};
