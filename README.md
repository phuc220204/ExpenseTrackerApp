# 💰 Sổ Thu Chi AI - Personal Expense Tracker

Ứng dụng quản lý thu chi cá nhân thông minh với trợ lý AI tích hợp.

## 🌐 Demo

👉 **[Dùng thử ngay](https://expensetracker-purchase.vercel.app/)**

> Đăng nhập bằng tài khoản Google để trải nghiệm đầy đủ tính năng.

---

## ✨ Tính năng

| Tính năng              | Mô tả                                               |
| ---------------------- | --------------------------------------------------- |
| 📊 **Quản lý Thu Chi** | Phân loại danh mục 2 cấp, tuỳ chỉnh emoji & màu sắc |
| 🤖 **Trợ lý AI**       | Thêm giao dịch bằng ngôn ngữ tự nhiên (Gemini)      |
| 📅 **Lịch Chi Tiêu**   | Xem giao dịch theo dạng calendar                    |
| 📈 **Thống kê**        | Biểu đồ Pie, Bar, Biến động Thu/Chi                 |
| 💰 **Ngân sách**       | Đặt ngân sách theo danh mục                         |
| � **Sổ Mua Sắm**       | Lên kế hoạch chi tiêu cho sự kiện                   |
| 📥 **Xuất/Nhập**       | CSV, Excel, PDF, Google Sheets                      |
| 📱 **Mobile-First**    | Giao diện tối ưu cho điện thoại                     |
| 🌙 **Dark Mode**       | Giao diện sáng/tối                                  |
| 🔐 **Bảo mật**         | Xác thực Google OAuth 2.0                           |

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite), JavaScript/ES6+
- **Styling**: Tailwind CSS 3.4
- **UI Library**: Hero UI (formerly NextUI)
- **Charts**: Recharts
- **Backend**: Firebase (Authentication, Firestore)
- **AI**: Google Generative AI SDK (@google/genai)
- **Icons**: lucide-react
- **Date**: date-fns

---

## 🚀 Cài đặt & Chạy

```bash
# Clone repo
git clone https://github.com/phuc220204/ExpenseTrackerApp.git
cd ExpenseTrackerApp

# Cài đặt dependencies
npm install --legacy-peer-deps

# Chạy development server
npm run dev

# Build production
npm run build
```

---

## ⚙️ Cấu hình

1. Tạo project trên [Firebase Console](https://console.firebase.google.com/)
2. Bật Authentication với Google provider
3. Tạo Firestore database
4. Copy config vào file `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. (Optional) Lấy API Key Gemini từ [Google AI Studio](https://aistudio.google.com/) để dùng tính năng AI

---

## 📄 Legal

- [Chính sách bảo mật](https://expensetracker-purchase.vercel.app/privacy-policy)
- [Điều khoản dịch vụ](https://expensetracker-purchase.vercel.app/terms-of-service)

---

## 📝 License

MIT © 2024 [phuc220204](https://github.com/phuc220204)
