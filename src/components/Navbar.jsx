import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  // Lazy initialization: Chỉ đọc localStorage một lần khi khởi tạo state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  /**
   * Effect để áp dụng theme vào document.documentElement khi theme thay đổi
   * Chạy khi component mount và mỗi khi theme state thay đổi
   */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              ExpenseTracker
            </h1>
          </div>
          <Button
            isIconOnly
            variant="light"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-gray-700 dark:text-gray-300"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

