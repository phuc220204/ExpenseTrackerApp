# ExpenseTrackerApp

Ứng dụng quản lý thu chi cá nhân với AI Assistant tích hợp.

## Tính năng

- 📊 Quản lý thu chi với phân loại danh mục 2 cấp
- 🤖 Trợ lý AI thông minh (Gemini) để thêm giao dịch bằng ngôn ngữ tự nhiên
- 📱 Responsive design, tối ưu cho mobile
- 🔐 Xác thực Google
- ☁️ Lưu trữ dữ liệu trên Firebase Firestore
- 📈 Thống kê và biểu đồ trực quan
- 📥 Xuất/nhập dữ liệu Excel/Google Sheets

## Tech Stack

- **Frontend**: React (Vite), JavaScript/ES6+
- **Styling**: Tailwind CSS
- **UI Library**: Hero UI (formerly NextUI)
- **Charts**: Recharts
- **Backend**: Firebase (Authentication, Firestore)
- **AI**: Google Generative AI SDK (@google/genai)
- **Icons**: lucide-react
- **Date Handling**: date-fns

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Cấu hình

1. Tạo project Firebase và lấy config
2. Thêm Firebase config vào `.env.local`
3. Cấu hình Gemini API Key trong ứng dụng (Settings)

## License

MIT
