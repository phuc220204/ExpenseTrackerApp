---
description: Quy trình test toàn diện trước khi deploy lên Vercel/GitHub
---

# Pre-Deploy Test Workflow

Chạy các bước sau để đảm bảo mọi thứ hoạt động ổn định trước khi push code.

## 1. Build Check

// turbo

```bash
npm run build
```

> Đảm bảo không có lỗi build. Nếu có lỗi, fix trước khi tiếp tục.

## 2. Lint Check

// turbo

```bash
npm run lint
```

> Kiểm tra lỗi code style và unused imports.

## 3. Start Dev Server

// turbo

```bash
npm run dev
```

## 4. Feature Test Checklist

Mở browser tại http://localhost:5173 và test từng mục:

### Authentication

- [ ] Đăng nhập bằng Google
- [ ] Đăng xuất
- [ ] Profile Avatar hiển thị đúng

### Giao dịch (Transactions)

- [ ] Thêm giao dịch mới (Chi tiêu)
- [ ] Thêm giao dịch mới (Thu nhập)
- [ ] Sửa giao dịch
- [ ] Xóa giao dịch
- [ ] Emoji icon hiển thị đúng trong list/table

### Dashboard

- [ ] Card thống kê hiển thị đúng
- [ ] Danh sách giao dịch (List view)
- [ ] Bảng giao dịch (Table view)
- [ ] Calendar View (tab Lịch)

### Statistics

- [ ] Biểu đồ Pie Chart
- [ ] Biểu đồ Bar Chart
- [ ] Biến động Thu Chi (toggle theo ngày/tháng)
- [ ] Date Filter hoạt động

### Planning

- [ ] Tab Ngân Sách Tháng
- [ ] Tab Sổ Tay Mua Sắm
- [ ] Tạo kế hoạch mua sắm mới

### Data Tools

- [ ] Tab Nhập/Xuất dữ liệu
- [ ] Tab Danh mục (Category Manager)
- [ ] Thêm/Sửa/Xóa danh mục
- [ ] Export CSV/Excel/PDF

### AI Chat (nếu có API key)

- [ ] Mở AI Chat
- [ ] Gửi tin nhắn
- [ ] AI phản hồi đúng

### Legal Pages

- [ ] Truy cập /privacy-policy
- [ ] Truy cập /terms-of-service
- [ ] Links từ Profile Avatar hoạt động

### Responsive

- [ ] Mobile view (< 768px)
- [ ] Desktop view (> 1024px)

## 5. Deploy Commands

### Deploy lên Vercel

```bash
vercel --prod
```

### Hoặc push lên GitHub (auto deploy)

```bash
git add .
git commit -m "feat: add privacy policy, terms of service, and category sync"
git push origin main
```

## 6. Post-Deploy Verification

Sau khi deploy xong, test lại trên production URL:

- [ ] Login hoạt động
- [ ] Thêm giao dịch hoạt động
- [ ] Privacy Policy accessible
- [ ] Terms of Service accessible
