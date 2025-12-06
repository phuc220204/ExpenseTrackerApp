import { useState, useEffect, useMemo, useRef } from "react";
import {
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import { X } from "lucide-react";
import {
  getCategories,
  getSubcategories,
  getCategoryIcon,
  getSubcategoryIcon,
  hasSubcategories,
} from "./categoryStructure";

/**
 * Component chọn Category với hỗ trợ Subcategory
 * Refactored để tránh xung đột state và props
 */
const CategorySelector = ({
  type,
  value,
  onChange,
  error,
}) => {
  const categories = getCategories(type);
  
  // Parse value thành category và subcategory
  const parsedValue = useMemo(() => {
    if (!value) {
      return { category: "", subcategory: "", custom: "" };
    }
    
    if (value.includes(" > ")) {
      const [cat, sub] = value.split(" > ");
      
      // Kiểm tra xem category có hợp lệ không
      if (!categories.includes(cat)) {
        // Category không hợp lệ -> custom category
        return { category: "", subcategory: "", custom: value };
      }
      
      // Kiểm tra xem subcategory có phải là subcategory hợp lệ không
      const validSubs = getSubcategories(type, cat);
      if (validSubs.includes(sub)) {
        // Subcategory hợp lệ
        return { category: cat, subcategory: sub, custom: "" };
      } else {
        // Subcategory không hợp lệ -> custom subcategory (other)
        return { category: cat, subcategory: "other", custom: sub };
      }
    }
    
    // Kiểm tra xem value có phải là category chính không
    if (categories.includes(value)) {
      return { category: value, subcategory: "", custom: "" };
    }
    
    // Kiểm tra xem có phải là subcategory không
    for (const cat of categories) {
      const subs = getSubcategories(type, cat);
      if (subs.includes(value)) {
        return { category: cat, subcategory: value, custom: "" };
      }
    }
    
    // Không tìm thấy, coi như custom category
    return { category: "", subcategory: "", custom: value };
  }, [value, categories, type]);

  // Local state chỉ để quản lý UI (selectedCategory, selectedSubcategory, customCategory)
  const [selectedCategory, setSelectedCategory] = useState(parsedValue.category);
  const [selectedSubcategory, setSelectedSubcategory] = useState(parsedValue.subcategory);
  const [customCategory, setCustomCategory] = useState(parsedValue.custom);
  
  // Ref để track khi user đang tương tác (tránh sync khi đang chọn)
  const isUserInteracting = useRef(false);
  
  // Ref để lưu giá trị value trước đó (để so sánh xem có thay đổi thực sự không)
  const previousValueRef = useRef(value);

  // Sync local state với parsedValue khi value prop thay đổi từ bên ngoài
  useEffect(() => {
    // QUAN TRỌNG: Chỉ sync nếu value thực sự thay đổi (không phải do re-render)
    if (value === previousValueRef.current) {
      previousValueRef.current = value;
      return;
    }
    
    // Cập nhật previousValue
    previousValueRef.current = value;
    
    // QUAN TRỌNG: Không sync nếu user đang tương tác (đang chọn category/subcategory)
    if (isUserInteracting.current) {
      return;
    }
    
    // Quan trọng: Không sync nếu đang trong quá trình chọn (user đang tương tác)
    // Nếu value là empty nhưng có selectedCategory và category đó có subcategories,
    // có nghĩa là user đã chọn category và đang chờ chọn subcategory
    if (value === "" && selectedCategory && categories.includes(selectedCategory) && hasSubcategories(type, selectedCategory)) {
      // Chỉ sync customCategory nếu cần
      if (customCategory !== "" && parsedValue.custom === "") {
        setCustomCategory("");
      }
      return;
    }
    
    // Nếu value là empty và đang chọn "other" subcategory, giữ nguyên state
    if (value === "" && selectedSubcategory === "other" && selectedCategory) {
      if (customCategory !== "" && parsedValue.custom === "") {
        setCustomCategory("");
      }
      return;
    }
    
    // Sync bình thường khi value thực sự thay đổi từ bên ngoài
    if (parsedValue.category !== selectedCategory) {
      setSelectedCategory(parsedValue.category);
    }
    if (parsedValue.subcategory !== selectedSubcategory) {
      setSelectedSubcategory(parsedValue.subcategory);
    }
    if (parsedValue.custom !== customCategory) {
      setCustomCategory(parsedValue.custom);
    }
  }, [value, parsedValue.category, parsedValue.subcategory, parsedValue.custom, selectedCategory, selectedSubcategory, customCategory, categories, type]);

  // Tính subcategories dựa trên selectedCategory
  const subcategories = useMemo(() => {
    if (!selectedCategory || !categories.includes(selectedCategory)) {
      return [];
    }
    return getSubcategories(type, selectedCategory);
  }, [selectedCategory, categories, type]);

  // Xử lý khi chọn category chính
  const handleCategoryChange = (category) => {
    // Đánh dấu user đang tương tác
    isUserInteracting.current = true;

    if (!category) {
      // Deselect - reset tất cả
      setSelectedCategory("");
      setSelectedSubcategory("");
      setCustomCategory("");
      onChange("");
      // Reset flag sau một chút để useEffect có thể sync lại
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 100);
      return;
    }
    
    setSelectedCategory(category);
    setSelectedSubcategory("");
    setCustomCategory("");

    if (!hasSubcategories(type, category)) {
      // Category không có subcategory -> dùng category làm giá trị cuối cùng
      onChange(category);
      // Reset flag sau khi onChange được gọi
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 100);
    } else {
      // Category có subcategory -> chờ user chọn subcategory
      // Không gọi onChange ngay, chỉ set state
      // Giữ flag = true để useEffect không sync
    }
  };

  // Xử lý khi chọn subcategory
  const handleSubcategoryChange = (subcategory) => {
    // Đánh dấu user đang tương tác
    isUserInteracting.current = true;

    if (!subcategory) {
      // Deselect subcategory -> quay về chỉ có category
      setSelectedSubcategory("");
      setCustomCategory("");
      if (selectedCategory && !hasSubcategories(type, selectedCategory)) {
        onChange(selectedCategory);
      } else {
        onChange("");
      }
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 100);
      return;
    }

    setSelectedSubcategory(subcategory);
    setCustomCategory("");

    if (subcategory === "other") {
      // Chọn "Khác" -> chờ user nhập custom subcategory
      // KHÔNG clear category chính, chỉ clear subcategory value
      // Giữ nguyên selectedCategory, chỉ clear value để chờ user nhập custom
      onChange("");
      // Giữ flag = true để useEffect không sync
    } else {
      // Format: "Category > Subcategory"
      const fullValue = `${selectedCategory} > ${subcategory}`;
      onChange(fullValue);
      // Reset flag sau khi onChange được gọi
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 100);
    }
  };

  // Xử lý khi nhập category/subcategory tùy chỉnh
  const handleCustomCategoryChange = (customValue) => {
    // Đánh dấu user đang tương tác
    isUserInteracting.current = true;

    setCustomCategory(customValue);
    
    if (!customValue.trim()) {
      onChange("");
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 100);
      return;
    }

    if (selectedSubcategory === "other" && selectedCategory) {
      // Custom subcategory: "Category > Custom"
      const fullValue = `${selectedCategory} > ${customValue.trim()}`;
      onChange(fullValue);
      // Reset flag sau khi onChange được gọi
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 100);
    } else if (selectedCategory === "Khác" || !selectedCategory) {
      // Custom category (không có category chính)
      onChange(customValue.trim());
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 100);
    } else {
      // Vẫn reset flag
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 100);
    }
  };

  // Xác định khi nào hiển thị input custom
  const showCustomInput = useMemo(() => {
    return (
      selectedSubcategory === "other" ||
      (selectedCategory === "Khác" && !selectedSubcategory) ||
      (!selectedCategory && !value)
    );
  }, [selectedSubcategory, selectedCategory, value]);

  return (
    <div className="space-y-3">
      {/* Chọn Category chính */}
      <Select
        label="Danh mục"
        placeholder="Chọn danh mục"
        selectedKeys={selectedCategory && categories.includes(selectedCategory) ? [selectedCategory] : []}
        onSelectionChange={(keys) => {
          const keysArray = Array.from(keys);
          const selected = keysArray.length > 0 ? keysArray[0] : null;
          handleCategoryChange(selected);
        }}
        variant="bordered"
        isInvalid={!!error}
        errorMessage={error}
        disallowEmptySelection={false}
        classNames={{
          label: "text-gray-700 dark:text-gray-300",
        }}
        renderValue={(items) => {
          if (items.length === 0) return null;
          return items.map((item) => {
            const Icon = getCategoryIcon(type, item.key);
            return (
              <div key={item.key} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{item.key}</span>
              </div>
            );
          });
        }}
      >
        {categories.map((category) => {
          const Icon = getCategoryIcon(type, category);
          return (
            <SelectItem
              key={category}
              value={category}
              startContent={<Icon className="w-4 h-4" />}
            >
              {category}
            </SelectItem>
          );
        })}
      </Select>

      {/* Chọn Subcategory (nếu category có subcategories) */}
      {selectedCategory && 
       categories.includes(selectedCategory) &&
       hasSubcategories(type, selectedCategory) && (
        <Select
          label="Danh mục chi tiết"
          placeholder="Chọn danh mục chi tiết (tùy chọn)"
          selectedKeys={
            selectedSubcategory === "other"
              ? ["other"]
              : selectedSubcategory && subcategories.includes(selectedSubcategory)
              ? [selectedSubcategory]
              : []
          }
          onSelectionChange={(keys) => {
            const keysArray = Array.from(keys);
            const selected = keysArray.length > 0 ? keysArray[0] : null;
            handleSubcategoryChange(selected);
          }}
          variant="bordered"
          disallowEmptySelection={false}
          classNames={{
            label: "text-gray-700 dark:text-gray-300",
          }}
        >
          {subcategories.map((subcategory) => {
            const Icon = getSubcategoryIcon(subcategory);
            return (
              <SelectItem
                key={subcategory}
                value={subcategory}
                startContent={<Icon className="w-4 h-4" />}
              >
                {subcategory}
              </SelectItem>
            );
          })}
          <SelectItem key="other" value="other">
            Khác
          </SelectItem>
        </Select>
      )}

      {/* Input nhập category/subcategory tùy chỉnh */}
      {showCustomInput && (
        <Input
          label={
            selectedSubcategory === "other"
              ? "Tên danh mục chi tiết khác"
              : "Tên danh mục khác"
          }
          placeholder="Nhập tên danh mục..."
          value={customCategory}
          onChange={(e) => handleCustomCategoryChange(e.target.value)}
          variant="bordered"
          endContent={
            customCategory && (
              <button
                type="button"
                onClick={() => {
                  setCustomCategory("");
                  setSelectedCategory("");
                  setSelectedSubcategory("");
                  onChange("");
                }}
                className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Xóa"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            )
          }
          classNames={{
            label: "text-gray-700 dark:text-gray-300",
          }}
        />
      )}
    </div>
  );
};

export default CategorySelector;
