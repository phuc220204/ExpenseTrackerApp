/**
 * Các hằng số và cấu hình cho BulkImport
 */

/**
 * Placeholder text cho Textarea
 */
export const TEXTAREA_PLACEHOLDER =
  "Copy dữ liệu từ Excel và dán vào đây.\nĐịnh dạng cột: [Ngày] [Số tiền] [Danh mục] [Ghi chú]\nVí dụ:\n01/01/2024\t50000\tĂn uống\tBữa trưa\n02/01/2024\t100000\tMua sắm\tQuần áo";

/**
 * Số cột mong đợi trong dữ liệu
 */
export const EXPECTED_COLUMNS = 4;

/**
 * Các định dạng ngày tháng phổ biến
 */
export const DATE_FORMATS = [
  "dd/MM/yyyy",
  "dd-MM-yyyy",
  "yyyy-MM-dd",
  "dd/MM/yy",
  "dd-MM-yy",
];

/**
 * Regex để loại bỏ các ký tự không phải số từ số tiền
 */
export const AMOUNT_CLEANUP_REGEX = /[^\d]/g;

/**
 * Category mặc định nếu trống
 */
export const DEFAULT_CATEGORY = "Khác";

/**
 * Type mặc định (có thể phát hiện từ số âm/dương hoặc để user chọn)
 */
export const DEFAULT_TYPE = "expense";

