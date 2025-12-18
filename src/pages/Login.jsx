import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Input,
  Tabs,
  Tab,
  Divider,
} from "@heroui/react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import ThemeButton from "../components/ThemeButton";

/**
 * Component trang đăng nhập
 * Hỗ trợ đăng nhập bằng Google và Email/Password
 */
const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form state cho Email/Password
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Kiểm tra độ mạnh của mật khẩu
   */
  const getPasswordStrength = (pwd) => {
    const checks = {
      length: pwd.length >= 6,
      hasNumber: /\d/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;

    let strength = "weak";
    let color = "danger";
    let label = "Yếu";

    if (passedChecks >= 4) {
      strength = "strong";
      color = "success";
      label = "Mạnh";
    } else if (passedChecks >= 3) {
      strength = "medium";
      color = "warning";
      label = "Trung bình";
    }

    return { checks, strength, color, label, passedChecks };
  };

  const passwordStrength = getPasswordStrength(password);

  /**
   * Xử lý đăng nhập bằng Google
   */
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Xử lý đăng nhập bằng Email/Password
   */
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Xử lý đăng ký tài khoản mới
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Gửi email xác thực
      await sendEmailVerification(userCredential.user);

      setSuccessMessage(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );

      // Reset form và chuyển sang tab đăng nhập
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setAuthMode("login");
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Xử lý quên mật khẩu - gửi email reset
   */
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Vui lòng nhập email để lấy lại mật khẩu");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        "Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư."
      );
    } catch (error) {
      console.error("Lỗi gửi email reset:", error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Xử lý các lỗi Authentication
   */
  const handleAuthError = (error) => {
    const errorMessages = {
      "auth/popup-closed-by-user":
        "Bạn đã đóng cửa sổ đăng nhập. Vui lòng thử lại.",
      "auth/popup-blocked":
        "Cửa sổ đăng nhập bị chặn. Vui lòng cho phép popup.",
      "auth/cancelled-popup-request": "Yêu cầu đăng nhập đã bị hủy.",
      "auth/user-not-found": "Không tìm thấy tài khoản với email này.",
      "auth/wrong-password": "Mật khẩu không chính xác.",
      "auth/invalid-credential": "Email hoặc mật khẩu không chính xác.",
      "auth/email-already-in-use": "Email này đã được sử dụng.",
      "auth/weak-password":
        "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.",
      "auth/invalid-email": "Email không hợp lệ.",
      "auth/too-many-requests":
        "Quá nhiều lần thử. Vui lòng thử lại sau ít phút.",
    };

    setError(
      errorMessages[error.code] ||
        error.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại."
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8 relative">
      {/* Nút chuyển theme ở góc trên phải */}
      <div className="absolute top-4 right-4">
        <ThemeButton />
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardBody className="p-6 sm:p-8 space-y-6">
          {/* Logo và Tiêu đề */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <img
                  src="/logoApp.png"
                  alt="Ví Vi Vu Logo"
                  className="w-12 h-12"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Ví Vi Vu
              </h1>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Sống vi vu, không lo túi
              </p>
            </div>
          </div>

          {/* Tabs: Đăng nhập / Đăng ký */}
          <Tabs
            selectedKey={authMode}
            onSelectionChange={setAuthMode}
            variant="bordered"
            fullWidth
            classNames={{
              tabList: "gap-2",
              tab: "h-10",
            }}
          >
            <Tab key="login" title="Đăng nhập" />
            <Tab key="register" title="Đăng ký" />
          </Tabs>

          {/* Form Email/Password */}
          <form
            onSubmit={authMode === "login" ? handleEmailSignIn : handleRegister}
            className="space-y-4"
          >
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onValueChange={setEmail}
              startContent={<Mail size={18} className="text-default-400" />}
              isRequired
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={password}
              onValueChange={setPassword}
              startContent={<Lock size={18} className="text-default-400" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-default-400" />
                  ) : (
                    <Eye size={18} className="text-default-400" />
                  )}
                </button>
              }
              isRequired
            />

            {authMode === "register" && (
              <Input
                type={showPassword ? "text" : "password"}
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                startContent={<Lock size={18} className="text-default-400" />}
                isRequired
                isInvalid={confirmPassword && confirmPassword !== password}
                errorMessage={
                  confirmPassword && confirmPassword !== password
                    ? "Mật khẩu không khớp"
                    : ""
                }
              />
            )}

            {/* Password strength indicator - chỉ hiển khi đăng ký */}
            {authMode === "register" && password && (
              <div className="space-y-2 p-3 bg-default-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-default-600">
                    Độ mạnh mật khẩu:
                  </span>
                  <span
                    className={`text-xs font-medium text-${passwordStrength.color}`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= passwordStrength.passedChecks
                          ? passwordStrength.color === "success"
                            ? "bg-success"
                            : passwordStrength.color === "warning"
                            ? "bg-warning"
                            : "bg-danger"
                          : "bg-default-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Checklist */}
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span
                    className={
                      passwordStrength.checks.length
                        ? "text-success"
                        : "text-default-400"
                    }
                  >
                    {passwordStrength.checks.length ? "✓" : "•"} Tối thiểu 6 ký
                    tự
                  </span>
                  <span
                    className={
                      passwordStrength.checks.hasNumber
                        ? "text-success"
                        : "text-default-400"
                    }
                  >
                    {passwordStrength.checks.hasNumber ? "✓" : "•"} Có số
                  </span>
                  <span
                    className={
                      passwordStrength.checks.hasLower
                        ? "text-success"
                        : "text-default-400"
                    }
                  >
                    {passwordStrength.checks.hasLower ? "✓" : "•"} Chữ thường
                  </span>
                  <span
                    className={
                      passwordStrength.checks.hasUpper
                        ? "text-success"
                        : "text-default-400"
                    }
                  >
                    {passwordStrength.checks.hasUpper ? "✓" : "•"} Chữ hoa
                  </span>
                  <span
                    className={
                      passwordStrength.checks.hasSpecial
                        ? "text-success"
                        : "text-default-400"
                    }
                  >
                    {passwordStrength.checks.hasSpecial ? "✓" : "•"} Ký tự đặc
                    biệt
                  </span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading
                ? "Đang xử lý..."
                : authMode === "login"
                ? "Đăng nhập"
                : "Đăng ký"}
            </Button>

            {/* Quên mật khẩu - chỉ hiện khi đăng nhập */}
            {authMode === "login" && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
                  disabled={isLoading}
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <Divider className="flex-1" />
            <span className="text-xs text-default-400">hoặc</span>
            <Divider className="flex-1" />
          </div>

          {/* Nút đăng nhập Google */}
          <Button
            size="lg"
            variant="bordered"
            className="w-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            onPress={handleGoogleSignIn}
            isLoading={isLoading}
            startContent={
              !isLoading && (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )
            }
          >
            Đăng nhập bằng Google
          </Button>

          {/* Hiển thị lỗi */}
          {error && (
            <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-sm text-danger-600 dark:text-danger-400">
                {error}
              </p>
            </div>
          )}

          {/* Hiển thị thông báo thành công */}
          {successMessage && (
            <div className="p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
              <p className="text-sm text-success-600 dark:text-success-400">
                {successMessage}
              </p>
            </div>
          )}

          {/* Điều khoản */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Bằng cách đăng nhập, bạn đồng ý với{" "}
            <Link
              to="/terms-of-service"
              className="text-primary-500 hover:underline"
            >
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link
              to="/privacy-policy"
              className="text-primary-500 hover:underline"
            >
              Chính sách bảo mật
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
