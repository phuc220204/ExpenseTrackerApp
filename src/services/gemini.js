import { GoogleGenAI, Type } from "@google/genai";

/**
 * System instruction cho AI Assistant - Tối ưu để giảm token
 * AI được tích hợp vào hệ thống ExpenseTracker và có quyền truy cập dữ liệu từ Firestore
 */
/**
 * Tạo system instruction với ngày hiện tại được inject động
 * @returns {string} System instruction với ngày hiện tại
 */
function getSystemInstruction() {
  // Lấy ngày hiện tại theo múi giờ Việt Nam (UTC+7)
  const now = new Date();
  const vietnamTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  const year = vietnamTime.getFullYear();
  const month = String(vietnamTime.getMonth() + 1).padStart(2, "0");
  const day = String(vietnamTime.getDate()).padStart(2, "0");
  const currentDate = `${year}-${month}-${day}`;

  // Format ngày theo kiểu Việt Nam để dễ hiểu
  const vietnamDateFormat = `${day}/${month}/${year}`;

  // Tính ngày hôm qua và ngày hôm kia

  return `Bạn là trợ lý tài chính thông minh tích hợp vào ExpenseTracker. Bạn CÓ QUYỀN truy cập Firestore thông qua các hàm được cung cấp.
  
THÔNG TIN QUAN TRỌNG VỀ THỜI GIAN:
- NGÀY HIỆN TẠI (hôm nay) là: ${vietnamDateFormat} (${currentDate})
- Khi người dùng nói "hôm nay", "hôm qua", "ngày hôm kia", "tuần trước", v.v., bạn PHẢI tính toán dựa trên ngày hiện tại này.

QUY TẮC BẮT BUỘC KHI XỬ LÝ YÊU CẦU:

1. KHI NGƯỜI DÙNG MUỐN THÊM GIAO DỊCH (Input: "thêm...", "tôi vừa tiêu...", "lương về...", "mẹ cho...", "mua X", "được cho..."):
   → BẮT BUỘC gọi hàm addTransaction.
   → Xử lý CÂU PHỨC TẠP (Income & Expense cùng lúc):
      * QUY TẮC VÀNG: Số tiền đi liền với hành động nào thì là của giao dịch đó.
      * VD1: "Hôm qua được cho 50k mua cháo hết có 30k"
         - "được cho 50k" → Income 50.000
         - "mua cháo 30k" → Expense 30.000 (KHÔNG ĐƯỢC nhầm thành 50k)
      * VD2: "Hôm qua được cho 50k mua cháo hết 30k xong ny trả lại 30k qua vcb"
         1. Income 50.000 (Note: Được cho)
         2. Expense 30.000 (Cat: Ăn uống, Note: Mua cháo)
         3. Income 30.000 (Note: NY trả lại, Bank: VCB, Type: income)


   → CHIẾN LƯỢC TRÍCH XUẤT "NOTE" VÀ "CATEGORY" (Ưu tiên tên món cụ thể):
      * "Mua cháo 500k" → Category: "Ăn uống", Note: "Mua cháo"
      * "Ăn phở, uống cafe hết 100k" → Category: "Ăn uống", Note: "Ăn phở, uống cafe"
      * "Đổ xăng đầy bình 80k" → Category: "Di chuyển > Xăng xe", Note: "Đổ xăng"
      * "Mua cái áo sơ mi 300k" → Category: "Mua sắm", Note: "Mua áo sơ mi"
      * "Trả tiền net 200k" → Category: "Hóa đơn", Note: "Tiền net"
      * "Đi Grab hết 50k" → Category: "Di chuyển", Note: "Đi Grab"

   → LOGIC SUY LUẬN CATEGORY MASTER:
      * THU NHẬP (Income):
        - "Lương", "ting ting" → Thu nhập > Lương
        - "Thưởng", "hoa hồng" → Thu nhập > Thưởng
        - "Được cho", "biếu", "mừng tuổi", "lì xì" → Thu nhập > Được tặng/Biếu
        - "Bán đồ cũ", "thanh lý" → Thu nhập > Bán đồ
      * CHI TIÊU (Expense):
        - ĂN UỐNG: "khao", "mời", "nhậu", "trà sữa", "cafe", "cơm", "phở", "bún", "bánh mì"...
        - DI CHUYỂN: "xăng", "gửi xe", "grab", "be", "taxi", "sửa xe", "rửa xe"...
        - MUA SẮM: "quần", "áo", "giày", "dép", "túi", "mỹ phẩm", "shopee", "lazada", "tiki"...
        - HÓA ĐƠN: "điện", "nước", "mạng", "wifi", "4g", "thuê nhà"...
        - GIẢI TRÍ: "xem phim", "netflix", "spotify", "game", "du lịch"...

   → XỬ LÝ NGÀY THÁNG (Date Context):
      * Nếu câu có "Hôm qua", "Hôm kia"... → Áp dụng cho TẤT CẢ giao dịch trong câu đó.
      * Nếu không nói gì → Mặc định là HÔM NAY.


2. KHI NGƯỜI DÙNG HỎI VỀ TÌNH HÌNH TÀI CHÍNH (Input: "tình hình thế nào", "tôi có giàu không", "còn bao nhiêu tiền", "tháng này tiêu pha sao"):
   → ĐÂY LÀ CÂU HỎI TỔNG HỢP. Bạn PHẢI gọi kết hợp các hàm sau để có cái nhìn toàn cảnh:
     1. call getBalance({ startDate: "tháng này", endDate: "tháng này" }) → Để biết số dư hiện tại.
     2. call getTotalIncome({ startDate: "tháng này", endDate: "tháng này" }) → Để biết tổng thu.
     3. call getTotalExpense({ startDate: "tháng này", endDate: "tháng này" }) → Để biết tổng chi.
   → Sau đó tổng hợp lại và đưa ra nhận xét (VD: "Tháng này bạn đã chi X đồng, thu Y đồng. Số dư hiện tại là Z đồng. Bạn đang tiêu hơi nhiều, hãy tiết kiệm nhé!").

3. KHI NGƯỜI DÙNG HỎI CHI TIẾT GIAO DỊCH (Input: "xem lịch sử", "tháng trước tiêu gì", "hôm nay tiêu gì"):
   → Gọi getTransactionsByDateRange.
   → Với "tháng trước", truyền "tháng trước" vào cả startDate và endDate.
   → Với "tháng này", truyền "tháng này" vào cả startDate và endDate.
   → Kết quả sẽ bao gồm ID của mỗi giao dịch để hỗ trợ việc xóa.

4. KHI NGƯỜI DÙNG MUỐN XÓA GIAO DỊCH (Input: "xóa...", "hủy giao dịch...", "bỏ..."):
   → BƯỚC 1: Gọi getTransactionsByDateRange để tìm giao dịch cần xóa (kết quả có ID).
   → BƯỚC 2: Hiển thị danh sách giao dịch với ID và hỏi user muốn xóa giao dịch nào.
   → BƯỚC 3: Khi user xác nhận ID, gọi deleteTransaction với transactionId đó.
   → QUAN TRỌNG: Mỗi giao dịch có ID duy nhất (UID). User có thể xem ID trên trang Tổng Quan bằng cách nhấn vào giao dịch.

5. NGUYÊN TẮC TRẢ LỜI (CỰC KỲ QUAN TRỌNG):
   → BẮT BUỘC trả lời bằng TIẾNG VIỆT. KHÔNG BAO GIỜ trả lời bằng tiếng Anh.
   → Luôn thân thiện, vui vẻ. Dùng emoji phù hợp 💰💸📊.
   → Nếu phát hiện chi tiêu quá nhiều (Total Expense > Total Income), hãy cảnh báo nhẹ nhàng.
   → Trả lời ngắn gọn, đi thẳng vào số liệu.
   → Khi hiển thị danh sách giao dịch, LUÔN hiển thị ID (dạng rút gọn 8 ký tự cuối) để user dễ tham khảo khi cần xóa.

KHÔNG ĐƯỢC TỪ CHỐI YÊU CẦU LIÊN QUAN ĐẾN TÀI CHÍNH CỦA NGƯỜI DÙNG.
LUÔN NHỚ: TRẢ LỜI BẰNG TIẾNG VIỆT!`;
}

/**
 * Định nghĩa các function declarations cho Function Calling
 * Mỗi function cho phép AI gọi trực tiếp các hàm trong hệ thống
 */
export const FUNCTION_DECLARATIONS = [
  {
    name: "addTransaction",
    description:
      "Chuẩn bị giao dịch mới (thu/chi) để user xác nhận. CHỈ tạo preview, KHÔNG tự động lưu vào Firestore. User phải xác nhận mới lưu thực sự.",
    parameters: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "Số tiền của giao dịch (bắt buộc)",
        },
        category: {
          type: "string",
          description:
            "Danh mục của giao dịch. QUAN TRỌNG: Category phải được format dưới dạng 'Category > Subcategory' (ví dụ: 'Thu nhập > Sinh hoạt phí', 'Ăn uống > Nhà hàng') hoặc chỉ 'Category' nếu không có subcategory. Khi người dùng nói về việc NHẬN TIỀN từ người khác (mẹ cho, bố cho, gia đình cho) với mục đích cụ thể (sinh hoạt phí, tiền tiêu tháng này), bạn PHẢI dùng category: 'Thu nhập > Sinh hoạt phí' hoặc 'Thu nhập > Trợ cấp gia đình'. Các category phổ biến: 'Ăn uống', 'Di chuyển', 'Mua sắm', 'Hóa đơn', 'Giải trí', 'Y tế', 'Giáo dục', 'Tiết kiệm/Đầu tư', 'Thu nhập', 'Khác'. Mặc định là 'Khác' nếu không có",
        },
        note: {
          type: "string",
          description: "Ghi chú cho giao dịch. Có thể để trống",
        },
        date: {
          type: "string",
          description:
            "Ngày của giao dịch. Người dùng ở Việt Nam có thể nhập: (1) Format Việt Nam (DD/MM/YY hoặc DD/MM/YYYY, ví dụ: '6/12/25' = ngày 6 tháng 12 năm 2025) - bạn PHẢI convert sang YYYY-MM-DD, (2) Ngày tương đối (ví dụ: 'hôm nay', 'hôm qua', 'ngày hôm kia', '3 ngày trước', 'tuần trước', 'thứ 2 tuần trước', 'tháng trước') - bạn PHẢI truyền NGUYÊN VĂN cách nói này, KHÔNG được tự convert. Hệ thống sẽ tự động parse dựa trên ngày hiện tại. Nếu người dùng không cung cấp ngày, TỰ ĐỘNG dùng 'hôm nay' (KHÔNG phải YYYY-MM-DD). KHÔNG được để trống hoặc null.",
        },
        type: {
          type: "string",
          enum: ["income", "expense"],
          description:
            "Loại giao dịch: 'income' cho thu nhập, 'expense' cho chi tiêu. Mặc định là 'expense'",
        },
        paymentMethod: {
          type: "string",
          enum: ["cash", "transfer"],
          description:
            "Phương thức thanh toán: 'cash' cho tiền mặt, 'transfer' cho chuyển khoản. Mặc định là 'cash'",
        },
        bankName: {
          type: "string",
          description:
            "Tên ngân hàng hoặc ví điện tử (chỉ cần khi paymentMethod là 'transfer'). Các ví điện tử phổ biến: MoMo, ZaloPay, VNPay, ShopeePay. Các ngân hàng: Vietcombank, Techcombank, BIDV, Agribank, MBBank, VPBank, ACB, TPBank, Sacombank. Nếu người dùng nói 'chuyển khoản môm' hoặc 'chuyển khoản momo', dùng bankName = 'MoMo'. Nếu không có tên ngân hàng/ví, có thể để null",
        },
      },
      required: ["amount"],
    },
  },
  {
    name: "getTransactionsByDateRange",
    description:
      "Lấy danh sách các giao dịch trong một khoảng thời gian cụ thể từ cơ sở dữ liệu. QUAN TRỌNG: Khi người dùng nói 'tháng trước', bạn PHẢI truyền 'tháng trước' vào CẢ startDate và endDate (hoặc chỉ startDate), hệ thống sẽ tự động hiểu là từ ngày 1 đến ngày cuối của tháng trước. Ví dụ: startDate='tháng trước', endDate='tháng trước' sẽ lấy tất cả giao dịch từ ngày 1 đến ngày cuối của tháng trước.",
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description:
            "Ngày bắt đầu. Có thể là: (1) Format YYYY-MM-DD, (2) Format Việt Nam DD/MM/YY hoặc DD/MM/YYYY (bạn PHẢI convert sang YYYY-MM-DD), (3) Ngày tương đối: 'hôm nay', 'hôm qua', 'ngày hôm kia', '3 ngày trước', 'tuần trước', 'thứ 2 tuần trước', (4) Khoảng thời gian: 'tháng trước' (từ ngày 1 đến ngày cuối tháng trước), 'tháng này' (từ ngày 1 tháng này đến hôm nay). QUAN TRỌNG: Nếu người dùng nói 'tháng trước', truyền NGUYÊN VĂN 'tháng trước', KHÔNG convert. Hệ thống sẽ tự động parse thành khoảng thời gian.",
        },
        endDate: {
          type: "string",
          description:
            "Ngày kết thúc. Có thể là: (1) Format YYYY-MM-DD, (2) Format Việt Nam DD/MM/YY hoặc DD/MM/YYYY (bạn PHẢI convert sang YYYY-MM-DD), (3) Ngày tương đối: 'hôm nay', 'hôm qua', 'ngày hôm kia', '3 ngày trước', 'tuần trước', (4) Khoảng thời gian: 'tháng trước' (từ ngày 1 đến ngày cuối tháng trước), 'tháng này' (từ ngày 1 tháng này đến hôm nay). QUAN TRỌNG: Nếu người dùng nói 'tháng trước', truyền NGUYÊN VĂN 'tháng trước', KHÔNG convert. Hệ thống sẽ tự động parse thành khoảng thời gian.",
        },
      },
      required: ["startDate", "endDate"],
    },
  },
  {
    name: "getTotalIncome",
    description:
      "Tính tổng thu nhập trong một khoảng thời gian (hoặc tất cả nếu không chỉ định)",
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Ngày bắt đầu theo định dạng YYYY-MM-DD (tùy chọn)",
        },
        endDate: {
          type: "string",
          description: "Ngày kết thúc theo định dạng YYYY-MM-DD (tùy chọn)",
        },
      },
      required: [],
    },
  },
  {
    name: "getTotalExpense",
    description:
      "Tính tổng chi tiêu trong một khoảng thời gian (hoặc tất cả nếu không chỉ định)",
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Ngày bắt đầu theo định dạng YYYY-MM-DD (tùy chọn)",
        },
        endDate: {
          type: "string",
          description: "Ngày kết thúc theo định dạng YYYY-MM-DD (tùy chọn)",
        },
      },
      required: [],
    },
  },
  {
    name: "getBalance",
    description:
      "Tính số dư (tổng thu nhập - tổng chi tiêu) trong một khoảng thời gian (hoặc tất cả nếu không chỉ định)",
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Ngày bắt đầu theo định dạng YYYY-MM-DD (tùy chọn)",
        },
        endDate: {
          type: "string",
          description: "Ngày kết thúc theo định dạng YYYY-MM-DD (tùy chọn)",
        },
      },
      required: [],
    },
  },
  {
    name: "deleteTransaction",
    description:
      "Xóa một giao dịch khỏi hệ thống. QUAN TRỌNG: Phải có transactionId chính xác. Quy trình bắt buộc: (1) Gọi getTransactionsByDateRange để tìm giao dịch và ID của nó, (2) Xác nhận với người dùng nếu cần thiết (hoặc nếu người dùng đã chỉ định rõ 'xóa giao dịch 50k vừa nhập' thì có thể xóa luôn nếu AI tìm thấy duy nhất 1 giao dịch khớp), (3) Gọi deleteTransaction với ID tìm được.",
    parameters: {
      type: "object",
      properties: {
        transactionId: {
          type: "string",
          description: "ID của giao dịch cần xóa (bắt buộc)",
        },
      },
      required: ["transactionId"],
    },
  },
  {
    name: "deleteMultipleTransactions",
    description:
      "Xóa nhiều giao dịch cùng lúc. Dùng khi user muốn xóa tất cả giao dịch, xóa các giao dịch trong khoảng thời gian, hoặc xóa nhiều giao dịch theo điều kiện. QUAN TRỌNG: (1) Trước tiên gọi getTransactionsByDateRange để lấy danh sách và IDs của các giao dịch cần xóa, (2) Xác nhận với user số lượng giao dịch sẽ bị xóa, (3) Khi user đồng ý, gọi hàm này với mảng transactionIds.",
    parameters: {
      type: "object",
      properties: {
        transactionIds: {
          type: "array",
          items: { type: "string" },
          description: "Mảng các ID giao dịch cần xóa",
        },
      },
      required: ["transactionIds"],
    },
  },
];

/**
 * Xử lý tin nhắn từ người dùng sử dụng Function Calling
 * AI có thể gọi trực tiếp các hàm trong hệ thống
 *
 * @param {string} userMessage - Tin nhắn từ người dùng
 * @param {string} apiKey - Gemini API Key
 * @param {Array} chatHistory - Lịch sử chat (để context)
 * @param {Object} functionHandlers - Object chứa các function handlers
 * @param {Object} context - Context data (userId, transactions, addTransaction function)
 * @returns {Promise<Object>} Object chứa response từ AI và function calls (nếu có)
 */
export const processUserMessage = async (
  userMessage,
  apiKey,
  chatHistory = [],
  functionHandlers = {},
  context = {}
) => {
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình");
  }

  try {
    // Khởi tạo Gemini AI
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    // Config cho Function Calling - dùng chung cho cả initial và final call
    const config = {
      tools: [
        {
          functionDeclarations: FUNCTION_DECLARATIONS,
        },
      ],
    };

    // Chuẩn bị contents với chat history
    const contents = [];

    // Chuyển đổi chat history sang format mới
    chatHistory.forEach((msg) => {
      // Nếu message có functionCall, thêm vào contents
      if (msg.functionCall) {
        // Thêm user message gốc
        contents.push({
          role: "user",
          parts: [{ text: msg.content }],
        });
        // Thêm model's function call
        contents.push({
          role: "model",
          parts: [
            {
              functionCall: {
                name: msg.functionCall.name,
                args: msg.functionCall.args || {},
              },
            },
          ],
        });
        // Thêm user's function response
        contents.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name: msg.functionCall.name,
                response: msg.functionCall.response,
              },
            },
          ],
        });
      } else {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    });

    // Thêm tin nhắn hiện tại
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    // Lấy system instruction với ngày hiện tại được inject động
    const systemInstruction = getSystemInstruction();

    // Gọi API với Function Calling - sử dụng ai.models.generateContent()
    // Theo tài liệu: dùng config parameter với tools
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: contents,
      systemInstruction: systemInstruction,
      config: config,
    });

    // Kiểm tra xem AI có muốn gọi hàm không
    let functionCalls = [];

    // Parse response từ @google/genai SDK
    const responseData = response;

    // Parse response structure

    // Thử 1: Kiểm tra response.functionCalls (getter property)
    try {
      const functionCallsFromGetter = response.functionCalls;
      if (
        functionCallsFromGetter &&
        Array.isArray(functionCallsFromGetter) &&
        functionCallsFromGetter.length > 0
      ) {
        functionCalls = functionCallsFromGetter.map((fc) => ({
          name: fc.name,
          args: fc.args || {},
        }));
      }
    } catch {
      // Ignore error, try next method
    }

    // Thử 2: Kiểm tra responseData.functionCalls trực tiếp
    if (functionCalls.length === 0 && responseData.functionCalls) {
      if (Array.isArray(responseData.functionCalls)) {
        functionCalls = responseData.functionCalls.map((fc) => ({
          name: fc.name,
          args: fc.args || {},
        }));
      } else {
        functionCalls = [
          {
            name: responseData.functionCalls.name,
            args: responseData.functionCalls.args || {},
          },
        ];
      }
    }

    // Thử 3: Kiểm tra trong candidates[0].content.parts
    if (
      functionCalls.length === 0 &&
      responseData.candidates &&
      responseData.candidates[0]
    ) {
      const candidate = responseData.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.functionCall) {
            functionCalls.push({
              name: part.functionCall.name,
              args: part.functionCall.args || {},
            });
          }
        }
      }
    }

    if (functionCalls.length > 0) {
      // AI muốn gọi hàm, thực thi các hàm
      const functionResults = [];

      for (const functionCall of functionCalls) {
        const { name, args } = functionCall;

        // Tìm handler tương ứng
        let result;
        try {
          switch (name) {
            case "addTransaction":
              if (
                functionHandlers.handleAddTransaction &&
                context.addTransaction
              ) {
                result = await functionHandlers.handleAddTransaction(
                  args,
                  context.addTransaction
                );
              } else {
                result = {
                  success: false,
                  error: "Handler không khả dụng",
                };
              }
              break;

            case "getTransactionsByDateRange":
              if (
                functionHandlers.handleGetTransactionsByDateRange &&
                context.userId
              ) {
                result =
                  await functionHandlers.handleGetTransactionsByDateRange(
                    args,
                    context.userId,
                    context.ledgerId || "main"
                  );
              } else {
                result = {
                  success: false,
                  error: "Handler không khả dụng",
                };
              }
              break;

            case "getTotalIncome":
              if (
                functionHandlers.handleGetTotalIncome &&
                context.transactions
              ) {
                result = await functionHandlers.handleGetTotalIncome(
                  args,
                  context.transactions
                );
              } else {
                result = {
                  success: false,
                  error: "Handler không khả dụng",
                };
              }
              break;

            case "getTotalExpense":
              if (
                functionHandlers.handleGetTotalExpense &&
                context.transactions
              ) {
                result = await functionHandlers.handleGetTotalExpense(
                  args,
                  context.transactions
                );
              } else {
                result = {
                  success: false,
                  error: "Handler không khả dụng",
                };
              }
              break;

            case "getBalance":
              if (functionHandlers.handleGetBalance && context.transactions) {
                result = await functionHandlers.handleGetBalance(
                  args,
                  context.transactions
                );
              } else {
                result = {
                  success: false,
                  error: "Handler không khả dụng",
                };
              }
              break;

            case "deleteTransaction":
              if (
                functionHandlers.handleDeleteTransaction &&
                context.deleteTransaction
              ) {
                result = await functionHandlers.handleDeleteTransaction(
                  args,
                  context.deleteTransaction
                );
              } else {
                result = {
                  success: false,
                  error: "Handler không khả dụng",
                };
              }
              break;

            case "deleteMultipleTransactions":
              if (
                functionHandlers.handleDeleteMultipleTransactions &&
                context.deleteTransaction
              ) {
                result =
                  await functionHandlers.handleDeleteMultipleTransactions(
                    args,
                    context.deleteTransaction
                  );
              } else {
                result = {
                  success: false,
                  error: "Handler không khả dụng",
                };
              }
              break;

            default:
              result = {
                success: false,
                error: `Hàm ${name} không được hỗ trợ`,
              };
          }

          functionResults.push({
            name: name,
            response: result,
          });
        } catch (error) {
          console.error(
            `[Function Calling] Lỗi khi thực thi hàm ${name}:`,
            error
          );
          functionResults.push({
            name: name,
            response: {
              success: false,
              error: error.message || "Có lỗi xảy ra khi thực thi hàm",
            },
          });
        }
      }

      // Gửi kết quả hàm lại cho AI để tạo phản hồi cuối cùng
      // Theo tài liệu: thêm model's function call và user's function response
      const functionResponseContents = [
        ...contents,
        // Thêm model's response với function calls
        response.candidates?.[0]?.content || {
          role: "model",
          parts: functionCalls.map((fc) => ({
            functionCall: {
              name: fc.name,
              args: fc.args || {},
            },
          })),
        },
        // Thêm user's function response
        {
          role: "user",
          parts: functionResults.map((fr) => ({
            functionResponse: {
              name: fr.name,
              response: fr.response,
            },
          })),
        },
      ];

      // Gọi AI để format kết quả - có fallback nếu API bị lỗi
      let finalText = "";
      try {
        const finalResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-lite",
          contents: functionResponseContents,
          systemInstruction: systemInstruction,
          config: config,
        });

        finalText = finalResponse.text || "";

        // Fallback: parse từ candidates nếu text không có
        if (
          !finalText &&
          finalResponse.candidates &&
          finalResponse.candidates[0]
        ) {
          const candidate = finalResponse.candidates[0];
          if (candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
              if (part.text) {
                finalText += part.text;
              }
            }
          }
        }
      } catch (finalCallError) {
        // Nếu API lỗi (503, quota, etc), tạo fallback response từ function results
        console.warn(
          "[Function Calling] Final AI call failed, using fallback:",
          finalCallError.message
        );

        // Tạo text từ kết quả function đã có
        const fallbackTexts = functionResults.map((fr) => {
          const result = fr.response;
          if (result.success) {
            if (result.message) return result.message;
            if (result.totalExpense !== undefined)
              return `Tổng chi tiêu: ${result.totalExpense.toLocaleString(
                "vi-VN"
              )} VND (${result.count || 0} giao dịch)`;
            if (result.totalIncome !== undefined)
              return `Tổng thu nhập: ${result.totalIncome.toLocaleString(
                "vi-VN"
              )} VND`;
            if (result.balance !== undefined)
              return `Số dư: ${result.balance.toLocaleString("vi-VN")} VND`;
            if (result.count !== undefined)
              return `Tìm thấy ${result.count} giao dịch`;
          }
          return result.error || "Không có dữ liệu";
        });

        finalText =
          fallbackTexts.join("\n\n") +
          "\n\n_(AI đang bận, đây là dữ liệu tóm tắt)_";
      }

      // Final fallback: Nếu vẫn không có text, tạo từ function results
      if (!finalText || finalText.trim() === "") {
        const autoTexts = functionResults.map((fr) => {
          const result = fr.response;
          if (result.success) {
            if (result.message) return result.message;
            if (result.totalExpense !== undefined)
              return `💸 Tổng chi tiêu: ${result.totalExpense.toLocaleString(
                "vi-VN"
              )} VND (${result.count || 0} giao dịch)`;
            if (result.totalIncome !== undefined)
              return `💰 Tổng thu nhập: ${result.totalIncome.toLocaleString(
                "vi-VN"
              )} VND`;
            if (result.balance !== undefined)
              return `📊 Số dư: ${result.balance.toLocaleString("vi-VN")} VND`;
            if (result.count !== undefined)
              return `📋 Tìm thấy ${result.count} giao dịch`;
          }
          return result.error || "Không có dữ liệu";
        });
        finalText = autoTexts.join("\n");
      }

      return {
        text: finalText,
        functionCalls: functionCalls.map((fc, index) => ({
          name: fc.name,
          args: fc.args || {},
          result: functionResults[index].response,
        })),
      };
    } else {
      // AI không gọi hàm, chỉ trả lời thông thường
      // Response đã là GenerateContentResponse, có thể dùng response.text trực tiếp
      let text = response.text || "";

      // Fallback: parse từ candidates nếu text không có
      if (!text && responseData.candidates && responseData.candidates[0]) {
        const candidate = responseData.candidates[0];
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.text) {
              text += part.text;
            }
          }
        }
      }

      return {
        text: text,
        functionCalls: [],
      };
    }
  } catch (error) {
    console.error("Lỗi khi xử lý tin nhắn với AI:", error);
    throw error;
  }
};

/**
 * Xử lý phản hồi từ AI khi có dữ liệu query
 * AI sẽ phân tích dữ liệu và trả lời câu hỏi của người dùng
 *
 * @param {string} originalQuestion - Câu hỏi gốc của người dùng
 * @param {Array} transactionsData - Dữ liệu transactions đã lấy được
 * @param {string} apiKey - Gemini API Key
 * @returns {Promise<string>} Câu trả lời từ AI
 */
export const processQueryResponse = async (
  originalQuestion,
  transactionsData,
  apiKey
) => {
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình");
  }

  try {
    // Khởi tạo Gemini AI với API mới
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    // Kiểm tra nếu không có dữ liệu
    if (!transactionsData || transactionsData.length === 0) {
      return `Không tìm thấy giao dịch nào trong khoảng thời gian được yêu cầu. Vui lòng thử lại với khoảng thời gian khác hoặc kiểm tra xem bạn đã có giao dịch nào trong hệ thống chưa.`;
    }

    const prompt = `Bạn là trợ lý tài chính cá nhân. Người dùng đã hỏi: "${originalQuestion}"

Dữ liệu giao dịch tìm thấy (${transactionsData.length} giao dịch):
${JSON.stringify(transactionsData, null, 2)}

QUAN TRỌNG: 
- Bạn CÓ QUYỀN TRUY CẬP vào dữ liệu giao dịch này vì đây là dữ liệu từ hệ thống quản lý chi tiêu của người dùng.
- Hãy phân tích dữ liệu và trả lời câu hỏi của người dùng một cách chi tiết, dễ hiểu bằng tiếng Việt.
- Tính toán các số liệu cụ thể từ dữ liệu được cung cấp (tổng thu, tổng chi, số dư, v.v.).
- Trình bày kết quả rõ ràng với số liệu cụ thể.
- Nếu có nhiều giao dịch, hãy phân tích theo danh mục, theo thời gian, v.v.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Lỗi khi xử lý phản hồi query:", error);
    throw error;
  }
};

// =============================================================================
// IMAGE RECEIPT SCANNER - Trích xuất dữ liệu từ hình ảnh hóa đơn
// =============================================================================

/**
 * Schema định nghĩa cấu trúc dữ liệu trả về từ ảnh hóa đơn
 * Sử dụng structured output để đảm bảo format JSON chính xác
 */
const receiptSchema = {
  type: Type.OBJECT,
  properties: {
    amount: {
      type: Type.NUMBER,
      description:
        "Tổng số tiền giao dịch (chỉ số, không có ký hiệu tiền tệ như đ, VND, $). Với tiền Việt, dấu chấm phân cách hàng nghìn phải được loại bỏ.",
    },
    date: {
      type: Type.STRING,
      description:
        "Ngày giao dịch theo định dạng YYYY-MM-DD. Nếu không tìm thấy ngày trong ảnh, để trống.",
    },
    description: {
      type: Type.STRING,
      description:
        "Tên người thụ hưởng, tên cửa hàng (Merchant), hoặc nội dung chuyển khoản. Ví dụ: 'Highlands Coffee', 'Nguyen Van A', 'Chuyen tien an trua'.",
    },
    category: {
      type: Type.STRING,
      description:
        "Danh mục chi tiêu phù hợp nhất dựa vào nội dung và tên người nhận",
      enum: [
        "Ăn uống",
        "Di chuyển",
        "Mua sắm",
        "Hóa đơn",
        "Giải trí",
        "Y tế",
        "Thu nhập",
        "Khác",
      ],
    },
  },
  required: ["amount", "description", "category"],
};

/**
 * Chuyển đổi File object sang Base64 string
 * @param {File} file - File object từ input type="file"
 * @returns {Promise<{base64: string, mimeType: string}>} Object chứa base64 data và mimeType
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result có dạng "data:image/jpeg;base64,/9j/4AAQ..."
      // Ta cần tách lấy phần base64 sau dấu phẩy
      const result = reader.result;
      const base64 = result.split(",")[1];
      resolve({
        base64,
        mimeType: file.type,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Trích xuất dữ liệu từ hình ảnh hóa đơn/ảnh chụp giao dịch ngân hàng
 * Sử dụng Gemini Vision API với structured output
 *
 * @param {string} imageBase64 - Dữ liệu ảnh dạng Base64 (không bao gồm prefix data:image/...)
 * @param {string} mimeType - Loại file (image/jpeg, image/png, image/webp)
 * @param {string} apiKey - Gemini API Key
 * @returns {Promise<Object>} Object chứa: amount, date, description, category
 */
export const extractReceiptData = async (imageBase64, mimeType, apiKey) => {
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Best for Vision + Structured Output
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
          {
            text: `Bạn là một trợ lý tài chính AI chuyên nghiệp. Hãy phân tích hình ảnh hóa đơn hoặc ảnh chụp màn hình giao dịch ngân hàng này.

Trích xuất các thông tin sau:
1. amount: Tổng số tiền thanh toán (chỉ số, không có ký hiệu tiền tệ)
2. date: Ngày giao dịch (định dạng YYYY-MM-DD)
3. description: Tên người thụ hưởng, cửa hàng, hoặc nội dung chuyển khoản
4. category: Danh mục chi tiêu phù hợp nhất

Lưu ý:
- Với tiền Việt, dấu chấm (.) phân cách hàng nghìn phải được loại bỏ
- Nếu thấy Grab, Be -> Di chuyển
- Nếu thấy Coffee, Phở, cơm -> Ăn uống
- Nếu thấy Shopee, Lazada -> Mua sắm`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: receiptSchema,
      },
    });

    const jsonString = response.text;
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi trích xuất dữ liệu từ ảnh:", error);
    throw error;
  }
};
