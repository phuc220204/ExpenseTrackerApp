import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  DEFAULT_CATEGORIES,
} from "../services/categoryService";

/**
 * Hook quản lý danh mục thu/chi của user
 * @returns {Object} State và actions cho categories
 */
export const useCategories = () => {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories khi user đăng nhập
  useEffect(() => {
    if (!currentUser) {
      setCategories(DEFAULT_CATEGORIES);
      setIsLoading(false);
      return;
    }

    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await getCategories(currentUser.uid);
        setCategories(data);
      } catch (error) {
        console.error("Lỗi fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [currentUser]);

  // Actions
  const handleAddCategory = useCallback(
    async (type, category) => {
      if (!currentUser) return;
      try {
        const newCat = await addCategory(currentUser.uid, type, category);
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

  const handleUpdateCategory = useCallback(
    async (type, categoryId, updates) => {
      if (!currentUser) return;
      try {
        await updateCategory(currentUser.uid, type, categoryId, updates);
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

  const handleDeleteCategory = useCallback(
    async (type, categoryId) => {
      if (!currentUser) return;
      try {
        await deleteCategory(currentUser.uid, type, categoryId);
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

  // Lấy danh sách tên categories (cho dropdown/select)
  const getCategoryNames = useCallback(
    (type) => {
      return categories[type]?.map((cat) => cat.name) || [];
    },
    [categories]
  );

  // Tìm category theo tên
  const findCategoryByName = useCallback(
    (type, name) => {
      return categories[type]?.find((cat) => cat.name === name);
    },
    [categories]
  );

  return {
    categories,
    expenseCategories: categories.expense || [],
    incomeCategories: categories.income || [],
    isLoading,
    addCategory: handleAddCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
    getCategoryNames,
    findCategoryByName,
  };
};
