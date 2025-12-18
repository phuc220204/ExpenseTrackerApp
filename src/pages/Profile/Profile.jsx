import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Avatar,
  Divider,
  Switch,
  Chip,
} from "@heroui/react";
import {
  User,
  Key,
  Database,
  Save,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useGeminiKey } from "../../hooks/useGeminiKey";
import { useTheme } from "../../contexts/ThemeContext";
import { Link } from "react-router-dom";

/**
 * Trang Quản lý Tài khoản (Profile)
 * Cho phép user chỉnh sửa thông tin cá nhân, cấu hình API Key và cài đặt ứng dụng
 */
const Profile = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const { apiKey, saveKey, removeKey, hasKey } = useGeminiKey();
  const { theme, setTheme } = useTheme();

  // State cho form chỉnh sửa profile
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  // State cho API Key form
  const [keyInput, setKeyInput] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // Xử lý cập nhật thông tin cá nhân
  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      setMessage({
        type: "error",
        content: "Tên hiển thị không được để trống",
      });
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({ displayName: displayName });
      setMessage({ type: "success", content: "Cập nhật hồ sơ thành công!" });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", content: "Lỗi khi cập nhật hồ sơ" });
    } finally {
      setLoading(false);
      // Tự động ẩn thông báo sau 3s
      setTimeout(() => setMessage({ type: "", content: "" }), 3000);
    }
  };

  // Xử lý lưu API Key
  const handleSaveKey = () => {
    if (keyInput.trim()) {
      saveKey(keyInput.trim());
      setKeyInput("");
      setShowKeyInput(false);
      setMessage({ type: "success", content: "Đã lưu API Key thành công!" });
      setTimeout(() => setMessage({ type: "", content: "" }), 3000);
    }
  };

  // Xử lý xóa API Key
  const handleRemoveKey = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa API Key này không?")) {
      removeKey();
      setMessage({ type: "success", content: "Đã xóa API Key" });
      setTimeout(() => setMessage({ type: "", content: "" }), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Quản lý Tài khoản
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Cập nhật thông tin và cài đặt ứng dụng
          </p>
        </div>
      </div>

      {/* Thông báo Feedback */}
      {message.content && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {message.content}
        </div>
      )}

      {/* 1. Thông tin cá nhân */}
      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Thông tin cá nhân
            </h2>
          </div>
        </CardHeader>
        <CardBody className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <Avatar
                src={currentUser?.photoURL}
                name={displayName}
                className="w-24 h-24 text-2xl font-bold"
                isBordered
                color="primary"
              />
            </div>

            {/* Edit Info Form */}
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tên hiển thị"
                  placeholder="Nhập tên của bạn"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setIsEditing(true);
                  }}
                  variant="bordered"
                  labelPlacement="outside"
                  radius="sm"
                />
                <Input
                  label="Email"
                  value={email}
                  isReadOnly
                  variant="flat"
                  labelPlacement="outside"
                  radius="sm"
                  description="Email không thể thay đổi khi đăng nhập bằng Google"
                  className="opacity-70"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end pt-2">
                  <Button
                    color="primary"
                    startContent={<Save size={16} />}
                    isLoading={loading}
                    onPress={handleUpdateProfile}
                    size="sm"
                    className="font-medium"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 2. Cấu hình AI Assistant */}
      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Cấu hình AI Assistant
            </h2>
          </div>
          <Chip
            color={hasKey ? "success" : "warning"}
            variant="flat"
            size="sm"
            startContent={
              hasKey ? (
                <div className="w-2 h-2 rounded-full bg-green-500 ml-1" />
              ) : null
            }
          >
            {hasKey ? "Đã kết nối" : "Chưa cấu hình"}
          </Chip>
        </CardHeader>
        <CardBody className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Để sử dụng các tính năng thông minh (Chat, Quét hóa đơn), bạn cần
              cung cấp Google Gemini API Key. Key được lưu an toàn trên trình
              duyệt của bạn.
            </p>

            {hasKey && !showKeyInput ? (
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
                    <Key className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      Gemini API Key
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500 truncate font-mono">
                        {showKey ? apiKey : "**************************"}
                      </p>
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="text-slate-400 hover:text-purple-500 transition-colors"
                        title={showKey ? "Ẩn Key" : "Hiện Key"}
                      >
                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setShowKeyInput(true)}
                  >
                    Thay đổi
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={handleRemoveKey}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-end">
                <Input
                  label="Nhập API Key mới"
                  placeholder="Paste key của bạn vào đây (AIza...)"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  className="flex-1"
                  color="secondary"
                  endContent={
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-secondary-500 hover:underline whitespace-nowrap"
                    >
                      Lấy Key ở đâu?
                    </a>
                  }
                />
                <div className="flex gap-2">
                  <Button color="secondary" onPress={handleSaveKey}>
                    Lưu Key
                  </Button>
                  {hasKey && (
                    <Button
                      variant="light"
                      onPress={() => setShowKeyInput(false)}
                      color="danger"
                    >
                      Hủy
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* 3. Cài đặt Ứng dụng */}
      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-slate-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Cài đặt ứng dụng
            </h2>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-slate-700 text-yellow-400"
                      : "bg-orange-100 text-orange-500"
                  }`}
                >
                  {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    Giao diện (Theme)
                  </p>
                  <p className="text-sm text-slate-500">
                    Chuyển đổi giữa Sáng và Tối
                  </p>
                </div>
              </div>
              <Switch
                isSelected={theme === "dark"}
                onValueChange={(isSelected) =>
                  setTheme(isSelected ? "dark" : "light")
                }
                color="secondary"
                size="md"
              />
            </div>

            {/* Data Tools */}
            <div className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                  <Database size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    Dữ liệu & Công cụ
                  </p>
                  <p className="text-sm text-slate-500">
                    Sao lưu, phục hồi và nhập liệu nâng cao
                  </p>
                </div>
              </div>
              <Button
                as={Link}
                to="/data-tools"
                variant="light"
                color="primary"
                endContent={<ChevronRight size={16} />}
              >
                Truy cập
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Logout Button */}
      <div className="flex justify-center pt-4">
        <Button
          color="danger"
          variant="flat"
          startContent={<LogOut size={18} />}
          onPress={logout}
          className="w-full sm:w-auto min-w-[200px]"
        >
          Đăng xuất tài khoản
        </Button>
      </div>
    </div>
  );
};

export default Profile;
