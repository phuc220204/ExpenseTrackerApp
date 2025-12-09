import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";

/**
 * Context type cho Authentication
 * @typedef {Object} AuthContextType
 * @property {import('firebase/auth').User | null} currentUser - User hiện tại đang đăng nhập (null nếu chưa đăng nhập)
 * @property {boolean} loading - Trạng thái đang tải (true khi đang kiểm tra auth state)
 * @property {Function} logout - Hàm để đăng xuất user
 */

const AuthContext = createContext(null);

// Thời gian tối đa của một phiên đăng nhập (3 tiếng)
const SESSION_TIMEOUT_MS = 3 * 60 * 60 * 1000;

/**
 * Provider component để quản lý authentication state cho toàn bộ ứng dụng
 * Sử dụng onAuthStateChanged để lắng nghe thay đổi trạng thái đăng nhập
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Effect để lắng nghe thay đổi trạng thái đăng nhập
   * onAuthStateChanged sẽ tự động gọi callback mỗi khi user đăng nhập/đăng xuất
   */
  useEffect(() => {
    // Lắng nghe thay đổi trạng thái đăng nhập
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Kiểm tra thời gian hết hạn session (3 tiếng)
        const lastSignInTime = new Date(user.metadata.lastSignInTime).getTime();
        const currentTime = Date.now();

        if (currentTime - lastSignInTime > SESSION_TIMEOUT_MS) {
          console.warn(
            "Phiên đăng nhập hết hạn (quá 3 tiếng). Đang đăng xuất..."
          );

          await signOut(auth);
          setCurrentUser(null);
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false); // Đã hoàn tất kiểm tra auth state
    });

    // Cleanup: Hủy đăng ký listener khi component unmount
    return () => unsubscribe();
  }, []);

  /**
   * Hàm đăng xuất user
   * Gọi signOut từ Firebase Auth để đăng xuất
   * onAuthStateChanged sẽ tự động cập nhật currentUser về null
   *
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged sẽ tự động cập nhật currentUser về null
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook để sử dụng AuthContext trong các components
 * @returns {AuthContextType} Object chứa currentUser và loading state
 * @throws {Error} Nếu hook được gọi bên ngoài AuthProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
