import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Khởi tạo theme từ localStorage hoặc mặc định là 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Effect để áp dụng theme vào DOM và lưu vào localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook để sử dụng ThemeContext
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
