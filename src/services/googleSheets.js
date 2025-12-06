/**
 * Service để tương tác với Google Sheets API v4
 * Sử dụng REST API với fetch để tạo và cập nhật Google Sheets
 */

const SHEETS_API_BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

/**
 * Tên cơ sở cho Google Sheet
 * Format: "Bảng thống kê thu chi - dd/MM/yyyy"
 */
const BASE_SHEET_TITLE = "Bảng thống kê thu chi";

/**
 * Tạo một Google Sheet mới với tên được chuẩn hóa
 * Tên file: "Bảng thống kê thu chi - dd/MM/yyyy"
 * Tên sheet đầu tiên: "Sheet1"
 *
 * @param {string} accessToken - Google OAuth access token
 * @returns {Promise<string>} Spreadsheet ID của sheet vừa tạo
 */
export const createSpreadsheet = async (accessToken) => {
  try {
    // Tạo tên file với ngày tháng hiện tại
    const currentDate = new Date().toLocaleDateString("vi-VN");
    const spreadsheetTitle = `${BASE_SHEET_TITLE} - ${currentDate}`;

    const response = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            title: spreadsheetTitle,
          },
          sheets: [
            {
              properties: {
                title: "Sheet1",
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Không thể tạo Google Sheet"
      );
    }

    const data = await response.json();
    // Trả về cả spreadsheetId và sheetId của sheet đầu tiên
    return {
      spreadsheetId: data.spreadsheetId,
      sheetId: data.sheets?.[0]?.properties?.sheetId || 0,
    };
  } catch (error) {
    console.error("Lỗi khi tạo Google Sheet:", error);
    throw error;
  }
};

/**
 * Xuất dữ liệu transactions vào Google Sheet
 * Format: Header row + Data rows
 *
 * @param {string} accessToken - Google OAuth access token
 * @param {string} spreadsheetId - ID của spreadsheet
 * @param {Array} transactions - Mảng các transaction objects
 * @param {number} sheetId - ID của sheet (mặc định là 0)
 * @returns {Promise<void>}
 */
export const exportDataToSheet = async (
  accessToken,
  spreadsheetId,
  transactions,
  sheetId = 0
) => {
  try {
    // Chuẩn bị header
    const headers = [
      ["Ngày", "Loại", "Danh mục", "Số tiền", "Ghi chú", "Phương thức", "Ngân hàng"],
    ];

    // Chuẩn bị dữ liệu
    const values = transactions.map((tx) => [
      tx.date || "",
      tx.type === "income" ? "Thu" : "Chi",
      tx.category || "",
      tx.amount || 0,
      tx.note || "",
      tx.paymentMethod === "transfer" ? "Chuyển khoản" : "Tiền mặt",
      tx.bankName || "",
    ]);

    // Kết hợp header và data
    const allValues = [...headers, ...values];

    // Gọi API để append data (sử dụng A1 để ghi đè từ đầu)
    const response = await fetch(
      `${SHEETS_API_BASE_URL}/${spreadsheetId}/values/Sheet1!A1?valueInputOption=RAW`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: allValues,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Không thể xuất dữ liệu vào Google Sheet"
      );
    }

    // Format header row (bold, background color)
    await formatHeaderRow(accessToken, spreadsheetId, sheetId);
  } catch (error) {
    console.error("Lỗi khi xuất dữ liệu vào Google Sheet:", error);
    throw error;
  }
};

/**
 * Format header row (bold, background color)
 *
 * @param {string} accessToken - Google OAuth access token
 * @param {string} spreadsheetId - ID của spreadsheet
 * @param {number} sheetId - ID của sheet cần format
 * @returns {Promise<void>}
 */
const formatHeaderRow = async (accessToken, spreadsheetId, sheetId = 0) => {
  try {
    const response = await fetch(
      `${SHEETS_API_BASE_URL}/${spreadsheetId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.2,
                      green: 0.6,
                      blue: 0.9,
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 1.0,
                        green: 1.0,
                        blue: 1.0,
                      },
                      bold: true,
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat)",
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      // Không throw error vì đây chỉ là formatting, không ảnh hưởng đến dữ liệu
      console.warn("Không thể format header row");
    }
  } catch (error) {
    // Không throw error vì đây chỉ là formatting
    console.warn("Lỗi khi format header row:", error);
  }
};

/**
 * Lấy Google OAuth access token từ credential
 * Cần gọi signInWithPopup để lấy credential mới với scope
 *
 * @param {Object} credential - OAuth credential từ signInWithPopup
 * @returns {string} Access token
 */
export const getAccessTokenFromCredential = (credential) => {
  if (!credential || !credential.accessToken) {
    throw new Error("Không thể lấy access token từ credential");
  }
  return credential.accessToken;
};

