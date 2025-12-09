import {
  Utensils,
  Car,
  ShoppingBag,
  FileText,
  Music,
  Heart,
  GraduationCap,
  PiggyBank,
  Wallet,
  MoreHorizontal,
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
  Lightbulb,
  Zap,
  Droplets,
  Phone,
  Briefcase,
  Gift,
  TrendingUp,
  Users,
  HandCoins,
} from "lucide-react";

/**
 * Cấu trúc Category 2 cấp
 * Category chính (Cấp 1) và Subcategory (Cấp 2)
 */

/**
 * Icon map cho Category chính
 */
export const CATEGORY_ICONS = {
  "Ăn uống": Utensils,
  "Di chuyển": Car,
  "Mua sắm": ShoppingBag,
  "Hóa đơn": FileText,
  "Giải trí": Music,
  "Y tế": Heart,
  "Giáo dục": GraduationCap,
  "Tiết kiệm/Đầu tư": PiggyBank,
  "Thu nhập": Wallet,
  Khác: MoreHorizontal,
};

/**
 * Icon map cho Subcategory
 */
export const SUBCATEGORY_ICONS = {
  // Ăn uống
  "Đi chợ/Tạp hóa": ShoppingCart,
  "Nhà hàng": Utensils,
  Cafe: Coffee,
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
  Điện: Zap,
  Nước: Droplets,
  Internet: Phone,
  "Điện thoại": Phone,
  "Bảo hiểm": FileText,

  // Giải trí
  "Xem phim": Film,
  "Chơi game": Gamepad2,
  "Du lịch": Car,
  "Thể thao": Gamepad2,

  // Y tế
  "Khám bệnh": Stethoscope,
  Thuốc: Pill,
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
  Lương: Briefcase,
  Freelance: Briefcase,
  Thưởng: Gift,
  "Trợ cấp gia đình": HandCoins,
  "Sinh hoạt phí": HandCoins,
  "Tiền tiêu": HandCoins,
  "Tiền cho": HandCoins,
};

/**
 * Cấu trúc Category với Subcategory
 */
export const CATEGORY_STRUCTURE = {
  // CHI TIÊU
  expense: {
    "Ăn uống": {
      icon: Utensils,
      subcategories: ["Đi chợ/Tạp hóa", "Nhà hàng", "Cafe", "Đồ uống"],
    },
    "Di chuyển": {
      icon: Car,
      subcategories: [
        "Sửa xe/Bảo dưỡng",
        "Xăng/Dầu",
        "Taxi/Xe công nghệ",
        "Gửi xe",
        "Phí cầu đường",
      ],
    },
    "Mua sắm": {
      icon: ShoppingBag,
      subcategories: ["Quần áo", "Điện tử", "Đồ gia dụng", "Mỹ phẩm"],
    },
    "Hóa đơn": {
      icon: FileText,
      subcategories: ["Điện", "Nước", "Internet", "Điện thoại", "Bảo hiểm"],
    },
    "Giải trí": {
      icon: Music,
      subcategories: ["Xem phim", "Chơi game", "Du lịch", "Thể thao"],
    },
    "Y tế": {
      icon: Heart,
      subcategories: ["Khám bệnh", "Thuốc", "Bảo hiểm y tế"],
    },
    "Giáo dục": {
      icon: GraduationCap,
      subcategories: ["Học phí", "Sách vở", "Khóa học"],
    },
    "Tiết kiệm/Đầu tư": {
      icon: PiggyBank,
      subcategories: ["Tiết kiệm", "Đầu tư", "Chứng khoán"],
    },
    Khác: {
      icon: MoreHorizontal,
      subcategories: [],
    },
  },

  // THU NHẬP
  income: {
    "Thu nhập": {
      icon: Wallet,
      subcategories: [
        "Lương",
        "Freelance",
        "Thưởng",
        "Đầu tư",
        "Trợ cấp gia đình",
        "Sinh hoạt phí",
        "Tiền tiêu",
        "Tiền cho",
      ],
    },
    Khác: {
      icon: MoreHorizontal,
      subcategories: [],
    },
  },
};

/**
 * Lấy tất cả categories (cấp 1) theo type
 */
export const getCategories = (type) => {
  return Object.keys(CATEGORY_STRUCTURE[type] || {});
};

/**
 * Lấy subcategories của một category
 */
export const getSubcategories = (type, category) => {
  return CATEGORY_STRUCTURE[type]?.[category]?.subcategories || [];
};

/**
 * Lấy icon của category
 */
export const getCategoryIcon = (type, category) => {
  return CATEGORY_STRUCTURE[type]?.[category]?.icon || MoreHorizontal;
};

/**
 * Lấy icon của subcategory
 * @param {string} subcategory - Tên subcategory
 * @returns {React.ComponentType} Icon component
 */
export const getSubcategoryIcon = (subcategory) => {
  return SUBCATEGORY_ICONS[subcategory] || MoreHorizontal;
};

/**
 * Kiểm tra xem category có subcategories không
 */
export const hasSubcategories = (type, category) => {
  const subcategories = getSubcategories(type, category);
  return subcategories.length > 0;
};

/**
 * Tìm category chính từ subcategory
 */
export const findCategoryFromSubcategory = (type, subcategory) => {
  const categories = CATEGORY_STRUCTURE[type] || {};
  for (const [category, data] of Object.entries(categories)) {
    if (data.subcategories.includes(subcategory)) {
      return category;
    }
  }
  return null;
};
