import { useState, useRef, useEffect } from "react";
import { processUserMessage } from "../../services/gemini";
import { useGeminiKey } from "../../hooks/useGeminiKey";
import { useAuth } from "../../contexts/AuthContext";
import { useTransactionsContext } from "../../contexts/TransactionsContext";
import * as functionHandlers from "../../services/geminiFunctionHandlers";

/**
 * Hook xử lý logic cho AIChatBox
 * Quản lý chat history, xử lý tin nhắn, và tương tác với AI
 *
 * @returns {Object} Object chứa state và handlers
 */
export const useAIChat = () => {
  const { apiKey, hasKey } = useGeminiKey();
  const { currentUser } = useAuth();
  const { addTransaction, deleteTransaction, transactions } =
    useTransactionsContext();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewTransaction, setPreviewTransaction] = useState(null);
  const [previewTransactions, setPreviewTransactions] = useState([]); // Hỗ trợ nhiều transactions
  const messagesEndRef = useRef(null);

  /**
   * Scroll xuống cuối chat khi có tin nhắn mới
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Thêm tin nhắn vào chat history
   *
   * @param {string} role - 'user' hoặc 'assistant'
   * @param {string} content - Nội dung tin nhắn
   */
  const addMessage = (role, content) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  /**
   * Xử lý khi người dùng gửi tin nhắn
   * Sử dụng Function Calling để AI có thể gọi trực tiếp các hàm trong hệ thống
   *
   * @param {string} userMessage - Tin nhắn từ người dùng
   */
  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim() || !hasKey || !currentUser) return;

    // Thêm tin nhắn người dùng vào chat
    addMessage("user", userMessage);
    setIsLoading(true);

    try {
      // Chuẩn bị context cho function handlers
      const context = {
        userId: currentUser.uid,
        transactions: transactions || [],
        addTransaction: addTransaction,
        deleteTransaction: deleteTransaction,
      };

      // Giới hạn chat history để giảm token (chỉ giữ 8 messages gần nhất)
      const MAX_HISTORY = 8;
      const limitedHistory =
        messages.length > MAX_HISTORY ? messages.slice(-MAX_HISTORY) : messages;

      // Gọi processUserMessage với Function Calling
      const aiResponse = await processUserMessage(
        userMessage,
        apiKey,
        limitedHistory,
        functionHandlers,
        context
      );

      // Xử lý function calls nếu có
      if (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
        // Lấy tất cả các addTransaction calls
        const addTransactionCalls = aiResponse.functionCalls.filter(
          (fc) => fc.name === "addTransaction" && fc.result && fc.result.success
        );

        if (addTransactionCalls.length > 0) {
          // Xử lý nhiều transactions cùng lúc
          const transactions = addTransactionCalls
            .map((fc) => fc.result.transaction)
            .filter((tx) => tx); // Lọc bỏ null/undefined

          if (transactions.length === 1) {
            // Chỉ 1 transaction - dùng previewTransaction như cũ
            setPreviewTransaction(transactions[0]);
            setPreviewTransactions([]);
            const previewMessage =
              aiResponse.text ||
              `Đã chuẩn bị giao dịch ${
                transactions[0].type === "income" ? "thu nhập" : "chi tiêu"
              } ${transactions[0].amount?.toLocaleString(
                "vi-VN"
              )} VND.\n\nVui lòng xác nhận bên dưới để lưu vào hệ thống.`;
            addMessage("assistant", previewMessage);
          } else if (transactions.length > 1) {
            // Nhiều transactions - dùng previewTransactions
            setPreviewTransaction(null);
            setPreviewTransactions(transactions);
            const previewMessage =
              aiResponse.text ||
              `Đã chuẩn bị ${transactions.length} giao dịch.\n\nVui lòng xác nhận bên dưới để lưu tất cả vào hệ thống.`;
            addMessage("assistant", previewMessage);
          }
        } else {
          // Các hàm khác (query, getTotal, etc.) - chỉ hiển thị kết quả
          addMessage("assistant", aiResponse.text);
        }
      } else {
        // Không có function calls, chỉ hiển thị text response
        addMessage("assistant", aiResponse.text);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý tin nhắn:", error);

      // Xử lý các loại lỗi khác nhau
      let errorMessage =
        "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại.";

      if (
        error.message?.includes("429") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate-limit")
      ) {
        errorMessage =
          "⚠️ Bạn đã vượt quá hạn mức sử dụng API (quota) của Gemini.\n\n" +
          "Vui lòng:\n" +
          "1. Kiểm tra quota tại: https://ai.dev/usage?tab=rate-limit\n" +
          "2. Đợi một chút rồi thử lại\n" +
          "3. Hoặc nâng cấp gói API của bạn\n\n" +
          "Thông tin chi tiết: https://ai.google.dev/gemini-api/docs/rate-limits";
      } else if (error.message?.includes("API Key")) {
        errorMessage =
          "❌ API Key không hợp lệ hoặc chưa được cấu hình.\n\n" +
          "Vui lòng kiểm tra lại API Key trong cài đặt.";
      } else if (
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        errorMessage =
          "❌ Model AI không tìm thấy.\n\n" +
          "Có thể model đã thay đổi hoặc không khả dụng. Vui lòng thử lại sau.";
      }

      addMessage("assistant", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Xác nhận và lưu transaction từ preview
   */
  const handleConfirmAdd = async () => {
    // Xử lý nhiều transactions nếu có
    if (previewTransactions.length > 0) {
      try {
        setIsLoading(true);
        let successCount = 0;
        let errorCount = 0;

        for (const transaction of previewTransactions) {
          try {
            await addTransaction(transaction);
            successCount++;
          } catch (error) {
            console.error("Lỗi khi lưu giao dịch:", error);
            errorCount++;
          }
        }

        setPreviewTransactions([]);

        if (errorCount === 0) {
          addMessage(
            "assistant",
            `✅ Đã lưu thành công ${successCount} giao dịch vào hệ thống!`
          );
        } else {
          addMessage(
            "assistant",
            `⚠️ Đã lưu ${successCount} giao dịch, ${errorCount} giao dịch gặp lỗi.`
          );
        }
      } catch (error) {
        console.error("Lỗi khi lưu giao dịch:", error);
        addMessage(
          "assistant",
          "❌ Có lỗi xảy ra khi lưu giao dịch. Vui lòng thử lại."
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Xử lý 1 transaction như cũ
    if (!previewTransaction) return;

    try {
      setIsLoading(true);
      await addTransaction(previewTransaction);
      setPreviewTransaction(null);
      addMessage("assistant", "✅ Đã lưu giao dịch thành công vào hệ thống!");
    } catch (error) {
      console.error("Lỗi khi lưu giao dịch:", error);
      addMessage(
        "assistant",
        "❌ Có lỗi xảy ra khi lưu giao dịch. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Hủy preview transaction
   */
  const handleCancelPreview = () => {
    setPreviewTransaction(null);
    setPreviewTransactions([]);
  };

  /**
   * Xóa toàn bộ lịch sử chat
   */
  const handleClearChat = () => {
    setMessages([]);
    setPreviewTransaction(null);
    setPreviewTransactions([]);
  };

  return {
    messages,
    isLoading,
    previewTransaction,
    previewTransactions,
    hasKey,
    messagesEndRef,
    handleSendMessage,
    handleConfirmAdd,
    handleCancelPreview,
    handleClearChat,
  };
};
