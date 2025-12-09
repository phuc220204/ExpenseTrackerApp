import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Component nút chuyển đổi theme (Light/Dark)
 * Hiển thị icon Sun/Moon nhỏ gọn, tái sử dụng được
 */
const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      onClick={toggleTheme}
      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      aria-label="Chuyển đổi theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </Button>
  );
};

export default ThemeButton;
