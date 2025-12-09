import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Danh mục mặc định
const DEFAULT_CATEGORIES = {
  expense: [
    { id: "cat_1", name: "Ăn uống", icon: "🍜", color: "#EF4444" },
    { id: "cat_2", name: "Di chuyển", icon: "🚗", color: "#F59E0B" },
    { id: "cat_3", name: "Mua sắm", icon: "🛒", color: "#EC4899" },
    { id: "cat_4", name: "Giải trí", icon: "🎬", color: "#8B5CF6" },
    { id: "cat_5", name: "Sức khỏe", icon: "💊", color: "#10B981" },
    { id: "cat_6", name: "Giáo dục", icon: "📚", color: "#3B82F6" },
    { id: "cat_7", name: "Hóa đơn", icon: "📄", color: "#6366F1" },
    { id: "cat_8", name: "Khác", icon: "📦", color: "#64748B" },
  ],
  income: [
    { id: "cat_10", name: "Lương", icon: "💰", color: "#22C55E" },
    { id: "cat_11", name: "Thưởng", icon: "🎁", color: "#14B8A6" },
    { id: "cat_12", name: "Đầu tư", icon: "📈", color: "#0EA5E9" },
    { id: "cat_13", name: "Bán hàng", icon: "🏪", color: "#F97316" },
    { id: "cat_14", name: "Khác", icon: "💵", color: "#84CC16" },
  ],
};

/**
 * Lấy danh sách categories của user
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const getCategories = async (userId) => {
  try {
    const docRef = doc(db, "users", userId, "settings", "categories");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Nếu chưa có, tạo mới với default
      await setDoc(docRef, DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
  } catch (error) {
    console.error("Lỗi lấy categories:", error);
    return DEFAULT_CATEGORIES;
  }
};

/**
 * Lưu categories của user
 * @param {string} userId
 * @param {Object} categories
 */
export const saveCategories = async (userId, categories) => {
  try {
    const docRef = doc(db, "users", userId, "settings", "categories");
    await setDoc(docRef, categories);
  } catch (error) {
    console.error("Lỗi lưu categories:", error);
    throw error;
  }
};

/**
 * Thêm category mới
 * @param {string} userId
 * @param {string} type - 'expense' hoặc 'income'
 * @param {Object} category - { name, icon, color }
 */
export const addCategory = async (userId, type, category) => {
  const categories = await getCategories(userId);
  const newCategory = {
    id: `cat_${Date.now()}`,
    ...category,
  };
  categories[type] = [...(categories[type] || []), newCategory];
  await saveCategories(userId, categories);
  return newCategory;
};

/**
 * Cập nhật category
 * @param {string} userId
 * @param {string} type
 * @param {string} categoryId
 * @param {Object} updates
 */
export const updateCategory = async (userId, type, categoryId, updates) => {
  const categories = await getCategories(userId);
  categories[type] = categories[type].map((cat) =>
    cat.id === categoryId ? { ...cat, ...updates } : cat
  );
  await saveCategories(userId, categories);
};

/**
 * Xóa category
 * @param {string} userId
 * @param {string} type
 * @param {string} categoryId
 */
export const deleteCategory = async (userId, type, categoryId) => {
  const categories = await getCategories(userId);
  categories[type] = categories[type].filter((cat) => cat.id !== categoryId);
  await saveCategories(userId, categories);
};

export { DEFAULT_CATEGORIES };
