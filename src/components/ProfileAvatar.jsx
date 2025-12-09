import { useState } from "react";
import { LogOut, User, Shield, FileText } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { Link } from "react-router-dom";

/**
 * Component ProfileAvatar - Hiển thị avatar người dùng với dropdown menu
 * Chứa thông tin account, links chính sách, và nút đăng xuất
 */
const ProfileAvatar = ({ onLogoutClick, isMobile = false }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Lấy tên hiển thị từ user (email hoặc displayName)
  const displayName =
    currentUser?.displayName || currentUser?.email?.split("@")[0] || "User";
  const email = currentUser?.email || "";
  const photoURL = currentUser?.photoURL || null;

  // Lấy chữ cái đầu để hiển thị trong avatar
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement={isMobile ? "top" : "top-start"}
      classNames={{
        content: "min-w-[200px]",
      }}
    >
      <DropdownTrigger>
        <button
          className={`flex items-center gap-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
            isMobile
              ? "flex-col justify-center h-full px-2 py-1"
              : "px-3 py-2 w-full"
          }`}
          aria-label="Tài khoản"
        >
          {photoURL ? (
            <Avatar
              src={photoURL}
              alt={displayName}
              size="sm"
              className={isMobile ? "w-6 h-6" : "w-8 h-8"}
            />
          ) : (
            <div
              className={`rounded-full bg-primary-500 flex items-center justify-center text-white font-medium ${
                isMobile ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm"
              }`}
            >
              {initials}
            </div>
          )}
          {!isMobile && (
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {email}
              </p>
            </div>
          )}
          {isMobile && (
            <span className="text-xs font-medium leading-tight text-gray-600 dark:text-gray-400">
              Tài khoản
            </span>
          )}
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile menu"
        onAction={(key) => {
          if (key === "logout") {
            onLogoutClick();
            setIsOpen(false);
          }
        }}
      >
        <DropdownSection title="Tài khoản" showDivider>
          <DropdownItem
            key="profile"
            startContent={<User className="w-4 h-4" />}
            textValue="Thông tin tài khoản"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{displayName}</span>
              <span className="text-xs text-gray-500">{email}</span>
            </div>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="Pháp lý" showDivider>
          <DropdownItem
            key="privacy"
            as={Link}
            to="/privacy-policy"
            startContent={<Shield className="w-4 h-4" />}
            textValue="Chính sách bảo mật"
          >
            Chính sách bảo mật
          </DropdownItem>
          <DropdownItem
            key="terms"
            as={Link}
            to="/terms-of-service"
            startContent={<FileText className="w-4 h-4" />}
            textValue="Điều khoản dịch vụ"
          >
            Điều khoản dịch vụ
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            key="logout"
            startContent={<LogOut className="w-4 h-4" />}
            className="text-danger"
            color="danger"
            textValue="Đăng xuất"
          >
            Đăng xuất
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileAvatar;
