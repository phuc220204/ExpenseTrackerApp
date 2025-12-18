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
import { useNavigate } from "react-router-dom";

/**
 * Component ProfileAvatar - Hiển thị avatar người dùng với dropdown menu
 * Chứa thông tin account, links chính sách, và nút đăng xuất
 */
const ProfileAvatar = ({ onLogoutClick, isMobile = false }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
          className={`flex items-center gap-3 rounded-lg transition-colors ${
            isMobile
              ? "flex-col justify-center h-full group"
              : "px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          aria-label="Tài khoản"
        >
          <div
            className={
              isMobile
                ? "p-1.5 rounded-xl group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-all"
                : ""
            }
          >
            {photoURL ? (
              <Avatar
                src={photoURL}
                alt={displayName}
                size="sm"
                className={isMobile ? "w-5 h-5" : "w-8 h-8"}
              />
            ) : (
              <div
                className={`rounded-full bg-primary-500 flex items-center justify-center text-white font-medium ${
                  isMobile ? "w-5 h-5 text-[10px]" : "w-8 h-8 text-sm"
                }`}
              >
                {initials}
              </div>
            )}
          </div>
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
            <span className="text-[10px] font-medium opacity-70">
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
          } else if (key === "profile") {
            navigate("/profile");
            setIsOpen(false);
          } else if (key === "privacy") {
            navigate("/privacy-policy");
            setIsOpen(false);
          } else if (key === "terms") {
            navigate("/terms-of-service");
            setIsOpen(false);
          }
        }}
      >
        <DropdownSection title="Tài khoản" showDivider>
          <DropdownItem
            key="profile"
            startContent={<User className="w-4 h-4" />}
            textValue="Thông tin & Cài đặt"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{displayName}</span>
              <span className="text-xs text-gray-500">Thông tin & Cài đặt</span>
            </div>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="Pháp lý" showDivider>
          <DropdownItem
            key="privacy"
            startContent={<Shield className="w-4 h-4" />}
            textValue="Chính sách bảo mật"
          >
            Chính sách bảo mật
          </DropdownItem>
          <DropdownItem
            key="terms"
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
