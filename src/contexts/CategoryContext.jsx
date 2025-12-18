import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getCategories as fetchCategoriesFromFirestore,
  addCategory as addCategoryToFirestore,
  updateCategory as updateCategoryInFirestore,
  deleteCategory as deleteCategoryFromFirestore,
  DEFAULT_CATEGORIES,
} from "../services/categoryService";

/**
 * Context để chia sẻ categories giữa các component
 * Cho phép đồng bộ giữa CategoryManager và AddTransactionModal
 */

const CategoryContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used within CategoryProvider");
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories khi user đăng nhập
  useEffect(() => {
    // Chờ auth loading hoàn tất trước
    if (authLoading) {
      return;
    }

    if (!currentUser) {
      setCategories(DEFAULT_CATEGORIES);
      setIsLoading(false);
      return;
    }

    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCategoriesFromFirestore(currentUser.uid);
        setCategories(data);
      } catch (error) {
        console.error("Lỗi fetch categories:", error);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [currentUser, authLoading]);

  // Actions
  const addCategory = useCallback(
    async (type, category) => {
      if (!currentUser) return;
      try {
        const newCat = await addCategoryToFirestore(
          currentUser.uid,
          type,
          category
        );
        setCategories((prev) => ({
          ...prev,
          [type]: [...prev[type], newCat],
        }));
        return newCat;
      } catch (error) {
        console.error("Lỗi thêm category:", error);
        throw error;
      }
    },
    [currentUser]
  );

  const updateCategory = useCallback(
    async (type, categoryId, updates) => {
      if (!currentUser) return;
      try {
        await updateCategoryInFirestore(
          currentUser.uid,
          type,
          categoryId,
          updates
        );
        setCategories((prev) => ({
          ...prev,
          [type]: prev[type].map((cat) =>
            cat.id === categoryId ? { ...cat, ...updates } : cat
          ),
        }));
      } catch (error) {
        console.error("Lỗi cập nhật category:", error);
        throw error;
      }
    },
    [currentUser]
  );

  const deleteCategory = useCallback(
    async (type, categoryId) => {
      if (!currentUser) return;
      try {
        await deleteCategoryFromFirestore(currentUser.uid, type, categoryId);
        setCategories((prev) => ({
          ...prev,
          [type]: prev[type].filter((cat) => cat.id !== categoryId),
        }));
      } catch (error) {
        console.error("Lỗi xóa category:", error);
        throw error;
      }
    },
    [currentUser]
  );

  // Helper: Lấy danh sách tên categories theo type
  const getCategoryNames = useCallback(
    (type) => {
      return categories[type]?.map((cat) => cat.name) || [];
    },
    [categories]
  );

  // Helper: Tìm category object theo tên
  const findCategoryByName = useCallback(
    (type, name) => {
      return categories[type]?.find((cat) => cat.name === name);
    },
    [categories]
  );

  const value = {
    categories,
    expenseCategories: categories.expense || [],
    incomeCategories: categories.income || [],
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryNames,
    findCategoryByName,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
