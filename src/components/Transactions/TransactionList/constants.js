import {
  Utensils,
  Car,
  ShoppingBag,
  FileText,
  Music,
  Wallet,
  Briefcase,
  Gift,
  MoreHorizontal,
  Heart,
  GraduationCap,
  PiggyBank,
  ShoppingCart,
  Coffee,
  Home,
  Wrench,
  Fuel,
  Navigation,
  CreditCard,
  Gamepad2,
  Film,
  BookOpen,
  Stethoscope,
  Pill,
  Zap,
  Droplets,
  Phone,
  TrendingUp,
} from "lucide-react";
import {
  getCategoryIcon,
  getSubcategoryIcon,
  findCategoryFromSubcategory,
} from "../../AddTransactionModal/categoryStructure";

/**
 * Map icon tương ứng với từng category (cấp 1)
 * @type {Object<string, React.ComponentType>}
 */
export const CATEGORY_ICON_MAP = {
  "Ăn uống": Utensils,
  "Di chuyển": Car,
  "Mua sắm": ShoppingBag,
  "Hóa đơn": FileText,
  "Giải trí": Music,
  "Y tế": Heart,
  "Giáo dục": GraduationCap,
  "Tiết kiệm/Đầu tư": PiggyBank,
  "Thu nhập": Wallet,
  "Lương": Wallet,
  "Freelance": Briefcase,
  "Thưởng": Gift,
  "Khác": MoreHorizontal,
};

/**
 * Map icon cho subcategory (cấp 2)
 * @type {Object<string, React.ComponentType>}
 */
export const SUBCATEGORY_ICON_MAP = {
  // Ăn uống
  "Đi chợ/Tạp hóa": ShoppingCart,
  "Nhà hàng": Utensils,
  "Cafe": Coffee,
  "Đồ uống": Coffee,
  
  // Di chuyển
  "Sửa xe/Bảo dưỡng": Wrench,
  "Xăng/Dầu": Fuel,
  "Taxi/Xe công nghệ": Navigation,
  "Gửi xe": Car,
  "Phí cầu đường": Car,
  
  // Mua sắm
  "Quần áo": ShoppingBag,
  "Điện tử": ShoppingBag,
  "Đồ gia dụng": Home,
  "Mỹ phẩm": ShoppingBag,
  
  // Hóa đơn
  "Điện": Zap,
  "Nước": Droplets,
  "Internet": Phone,
  "Điện thoại": Phone,
  "Bảo hiểm": FileText,
  
  // Giải trí
  "Xem phim": Film,
  "Chơi game": Gamepad2,
  "Du lịch": Car,
  "Thể thao": Gamepad2,
  
  // Y tế
  "Khám bệnh": Stethoscope,
  "Thuốc": Pill,
  "Bảo hiểm y tế": Heart,
  
  // Giáo dục
  "Học phí": GraduationCap,
  "Sách vở": BookOpen,
  "Khóa học": BookOpen,
  
  // Tiết kiệm/Đầu tư
  "Tiết kiệm": PiggyBank,
  "Đầu tư": TrendingUp,
  "Chứng khoán": TrendingUp,
  
  // Thu nhập
  "Lương": Briefcase,
  "Freelance": Briefcase,
  "Thưởng": Gift,
};

/**
 * Lấy icon cho category hoặc subcategory
 * @param {string} category - Tên category hoặc subcategory
 * @param {string} type - Loại giao dịch ('income' hoặc 'expense')
 * @returns {React.ComponentType} Icon component
 */
export const getIconForCategory = (category, type = "expense") => {
  // Thử tìm trong subcategory map trước
  if (SUBCATEGORY_ICON_MAP[category]) {
    return SUBCATEGORY_ICON_MAP[category];
  }
  
  // Thử tìm trong category map
  if (CATEGORY_ICON_MAP[category]) {
    return CATEGORY_ICON_MAP[category];
  }
  
  // Thử tìm category chính từ subcategory
  const mainCategory = findCategoryFromSubcategory(type, category);
  if (mainCategory) {
    const icon = getCategoryIcon(type, mainCategory);
    if (icon) return icon;
  }
  
  // Trả về icon mặc định
  return DEFAULT_ICON;
};

/**
 * Icon mặc định khi không tìm thấy category trong map
 * @type {React.ComponentType}
 */
export const DEFAULT_ICON = MoreHorizontal;

