/**
 * Các hằng số và cấu hình cho DataTools
 */

/**
 * Placeholder text cho Textarea nhập dữ liệu
 */
export const IMPORT_TEXTAREA_PLACEHOLDER =
  "Copy dữ liệu từ Excel (bỏ dòng tiêu đề) và dán vào đây.\nĐịnh dạng cột: [Ngày] [Số tiền] [Danh mục] [Ghi chú] [Loại]\nVí dụ:\n01/01/2024\t50000\tĂn uống\tBữa trưa\texpense\n02/01/2024\t100000\tLương\tTháng 1\tincome";

/**
 * Header cho file Excel mẫu
 */
export const SAMPLE_EXCEL_HEADERS = [
  "Date",
  "Amount",
  "Category",
  "Note",
  "Type",
];

/**
 * Tên file Excel mẫu
 */
export const SAMPLE_EXCEL_FILENAME = "Mau_Nhap_Du_Lieu.xlsx";

/**
 * Tên file Excel xuất
 */
export const EXPORT_EXCEL_FILENAME = "Lich_Su_Giao_Dich.xlsx";

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
 * Type mặc định
 */
export const DEFAULT_TYPE = "expense";

