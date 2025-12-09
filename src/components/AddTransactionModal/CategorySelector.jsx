import { useMemo } from "react";
import { Select, SelectItem, Input } from "@heroui/react";
import { X, MoreHorizontal } from "lucide-react";
import { useCategoryContext } from "../../contexts/CategoryContext";

/**
 * Component chọn Category với hỗ trợ dynamic categories từ Firestore
 * Categories được đồng bộ với Category Manager
 */
const CategorySelector = ({ type, value, onChange, error }) => {
  const { expenseCategories, incomeCategories } = useCategoryContext();

  // Lấy categories theo type
  const categories = useMemo(() => {
    const categoryList =
      type === "expense" ? expenseCategories : incomeCategories;
    return categoryList.map((cat) => ({
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
    }));
  }, [type, expenseCategories, incomeCategories]);

  const categoryNames = useMemo(
    () => categories.map((c) => c.name),
    [categories]
  );

  // Parse value để xác định category đã chọn
  const selectedCategory = useMemo(() => {
    if (!value) return "";
    // Lấy phần trước " > " nếu có
    const mainCat = value.includes(" > ") ? value.split(" > ")[0] : value;
    // Kiểm tra xem có trong danh sách không
    if (categoryNames.includes(mainCat)) {
      return mainCat;
    }
    // Nếu không có, trả về custom
    return "";
  }, [value, categoryNames]);

  const customValue = useMemo(() => {
    if (!value) return "";
    if (categoryNames.includes(value)) return "";
    // Nếu là "Category > Subcategory"
    if (value.includes(" > ")) {
      const [, sub] = value.split(" > ");
      return sub || "";
    }
    // Giá trị custom không có trong list
    if (!categoryNames.includes(value)) {
      return value;
    }
    return "";
  }, [value, categoryNames]);

  // Xử lý thay đổi category
  const handleCategoryChange = (categoryName) => {
    if (!categoryName) {
      onChange("");
      return;
    }
    onChange(categoryName);
  };

  // Xử lý nhập chi tiết subcategory
  const handleSubcategoryChange = (subValue) => {
    if (!subValue) {
      onChange(selectedCategory);
      return;
    }
    if (selectedCategory) {
      onChange(`${selectedCategory} > ${subValue}`);
    } else {
      onChange(subValue);
    }
  };

  // Tìm category object từ tên
  const findCategory = (name) => categories.find((c) => c.name === name);

  // Xác định có hiển thị input chi tiết không
  const showDetailInput = selectedCategory && selectedCategory !== "Khác";

  return (
    <div className="space-y-3">
      {/* Chọn Category chính */}
      <Select
        label="Danh mục"
        placeholder="Chọn danh mục"
        selectedKeys={selectedCategory ? [selectedCategory] : []}
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
            const cat = findCategory(item.key);
            return (
              <div key={item.key} className="flex items-center gap-2">
                {cat?.icon && <span className="text-base">{cat.icon}</span>}
                <span>{item.key}</span>
              </div>
            );
          });
        }}
      >
        {categories.map((category) => (
          <SelectItem
            key={category.name}
            value={category.name}
            startContent={
              category.icon ? (
                <span className="text-base">{category.icon}</span>
              ) : (
                <MoreHorizontal className="w-4 h-4" />
              )
            }
          >
            {category.name}
          </SelectItem>
        ))}
      </Select>

      {/* Input nhập chi tiết (subcategory) */}
      {showDetailInput && (
        <Input
          label="Danh mục chi tiết"
          placeholder="VD: Đi chợ, Cafe, Sửa xe... (tùy chọn)"
          value={customValue}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
          variant="bordered"
          endContent={
            customValue && (
              <button
                type="button"
                onClick={() => onChange(selectedCategory)}
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

      {/* Input cho category "Khác" hoặc không chọn category */}
      {(selectedCategory === "Khác" || (!selectedCategory && value)) && (
        <Input
          label="Tên danh mục khác"
          placeholder="Nhập tên danh mục..."
          value={customValue || value}
          onChange={(e) => onChange(e.target.value)}
          variant="bordered"
          endContent={
            (customValue || value) && (
              <button
                type="button"
                onClick={() => onChange("")}
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
