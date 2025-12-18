import { useRef, useState } from "react";
import { Spinner } from "@heroui/react";
import { Camera, AlertCircle } from "lucide-react";
import { extractReceiptData, fileToBase64 } from "../../services/gemini";
import { useGeminiKey } from "../../hooks/useGeminiKey";

/**
 * Component khu vực quét hóa đơn/ảnh chuyển khoản
 * Thiết kế: Dashed border box với icon camera và helper text
 * Sử dụng Gemini Vision API để trích xuất thông tin giao dịch từ ảnh
 *
 * @param {Function} onExtracted - Callback khi AI trích xuất xong, nhận data object
 * @param {boolean} disabled - Vô hiệu hóa nút
 */
const ImageScanButton = ({ onExtracted, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { apiKey, hasKey } = useGeminiKey();

  /**
   * Xử lý khi người dùng chọn file ảnh
   * Gọi Gemini Vision API để trích xuất thông tin
   */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setError("");
    setIsLoading(true);

    try {
      // Kiểm tra API Key trước khi gọi API
      if (!hasKey || !apiKey) {
        throw new Error("API_KEY_REQUIRED");
      }

      // Kiểm tra file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Vui lòng chọn file ảnh (jpg, png, webp)");
      }

      // Chuyển file sang Base64
      const { base64, mimeType } = await fileToBase64(file);

      // Gọi Gemini Vision API
      const data = await extractReceiptData(base64, mimeType, apiKey);

      if (data) {
        // Gọi callback với dữ liệu đã trích xuất
        onExtracted(data);
      } else {
        throw new Error("Không thể trích xuất thông tin từ ảnh");
      }
    } catch (err) {
      console.error("Lỗi khi quét ảnh:", err);

      // Xử lý các loại lỗi cụ thể
      if (
        err.message === "API_KEY_REQUIRED" ||
        err.message?.includes("API Key not found")
      ) {
        setError("API_KEY_REQUIRED");
      } else if (err.message?.includes("API_KEY_INVALID")) {
        setError(
          "API Key không hợp lệ. Vui lòng kiểm tra lại trong Trợ lý AI."
        );
      } else {
        setError(err.message || "Có lỗi xảy ra khi xử lý ảnh");
      }
    } finally {
      setIsLoading(false);
      // Reset input để có thể chọn lại cùng file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /**
   * Mở dialog chọn file khi click nút
   */
  const handleClick = () => {
    if (!hasKey || !apiKey) {
      setError("API_KEY_REQUIRED");
      return;
    }
    setError("");
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Divider với text */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
          Hoặc quét hóa đơn
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Input file ẩn */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Khu vực quét - dashed border box */}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`
          w-full py-4 px-4
          border-2 border-dashed rounded-xl
          flex items-center justify-center gap-2
          transition-all duration-200
          ${
            disabled || isLoading
              ? "border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50"
              : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 cursor-pointer"
          }
        `}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" color="primary" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Đang phân tích...
            </span>
          </>
        ) : (
          <>
            <Camera size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Quét hóa đơn (Tự động điền)
            </span>
          </>
        )}
      </button>

      {/* Helper text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Tải lên ảnh hóa đơn để AI tự động trích xuất thông tin giao dịch.
      </p>

      {/* Hiển thị lỗi */}
      {error && (
        <div className="flex flex-col items-center gap-2 text-xs text-danger bg-danger/10 py-3 px-3 rounded-lg">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={14} />
            {error === "API_KEY_REQUIRED" ? (
              <span>Chưa có API Key. Vui lòng cấu hình trong Trợ lý AI.</span>
            ) : (
              <span>{error}</span>
            )}
          </div>
          {error === "API_KEY_REQUIRED" && (
            <span className="text-gray-600 dark:text-gray-400 text-center">
              Nhấn nút{" "}
              <strong className="text-primary-500">✨ Trợ lý AI</strong> ở thanh
              điều hướng bên dưới để thêm API Key
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageScanButton;
