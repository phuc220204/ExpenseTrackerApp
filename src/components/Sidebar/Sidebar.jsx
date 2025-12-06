import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useAuth } from "../../contexts/AuthContext";
import { MENU_ITEMS, APP_NAME } from "./constants";
import ProfileAvatar from "../ProfileAvatar";

/**
 * Component Sidebar - Navigation menu cho ứng dụng
 * Hiển thị Desktop Sidebar và Mobile Bottom Navigation
 * Chỉ chứa UI, logic được xử lý bởi useSidebar hook
 */
const Sidebar = () => {
  const { logout } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /**
   * Xử lý đăng xuất khi người dùng xác nhận trong Modal
   */
  const handleConfirmLogout = () => {
    logout()
      .then(() => {
        onOpenChange(false); // Đóng Modal sau khi đăng xuất thành công
      })
      .catch((error) => {
        console.error("Lỗi khi đăng xuất:", error);
        // Vẫn đóng Modal ngay cả khi có lỗi để không làm người dùng bối rối
        onOpenChange(false);
      });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {APP_NAME}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          {/* Profile Avatar với dropdown đăng xuất */}
          <ProfileAvatar onLogoutClick={onOpen} />
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 pb-safe">
        <div className="grid grid-cols-4 h-16 pb-safe">
          {/* Menu Items - Tổng Quan, Thống Kê, Công cụ Dữ liệu */}
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center h-full transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400 active:bg-gray-50 dark:active:bg-gray-800"
                  }`
                }
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-xs font-medium leading-tight">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
          
          {/* Profile Avatar cho Mobile */}
          <div className="flex flex-col items-center justify-center h-full">
            <ProfileAvatar onLogoutClick={onOpen} isMobile />
          </div>
        </div>
      </nav>

      {/* Modal xác nhận đăng xuất */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Đăng xuất
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-700 dark:text-gray-300">
                  Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  className="text-gray-700 dark:text-gray-300"
                >
                  Hủy
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmLogout}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Đăng xuất
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Sidebar;

