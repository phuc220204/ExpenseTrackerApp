# Danh Sách Tài Khoản/Ngân Hàng - Expense Tracker

## Tổng Quan

Danh sách bao gồm 3 loại:
1. **Ngân hàng truyền thống**: Các ngân hàng có chi nhánh vật lý
2. **Ngân hàng số**: Ngân hàng hoạt động chủ yếu qua ứng dụng
3. **Ví điện tử**: Các ứng dụng thanh toán điện tử

## Danh Sách Chi Tiết

### Ngân Hàng Truyền Thống

| Tên | Tên Ngắn | Màu Chủ Đề | Icon |
|-----|----------|------------|------|
| Vietcombank | VCB | #E41E2E (Đỏ) | Building2 |
| Techcombank | TCB | #0066CC (Xanh) | Building2 |
| BIDV | BIDV | #E41E2E (Đỏ) | Building2 |
| Agribank | Agribank | #00A651 (Xanh lá) | Building2 |
| MBBank | MB | #E41E2E (Đỏ) | Building2 |
| VPBank | VPBank | #0066CC (Xanh) | Building2 |
| ACB | ACB | #0066CC (Xanh) | Building2 |
| TPBank | TPBank | #E41E2E (Đỏ) | Building2 |
| Sacombank | Sacombank | #E41E2E (Đỏ) | Building2 |

### Ngân Hàng Số

| Tên | Tên Ngắn | Màu Chủ Đề | Icon |
|-----|----------|------------|------|
| Timo | Timo | #00A651 (Xanh lá) | CreditCard |
| Cake by VPBank | Cake | #FF6B6B (Đỏ hồng) | CreditCard |
| KBank | KBank | #0066CC (Xanh) | CreditCard |
| TNEX | TNEX | #FF6B6B (Đỏ hồng) | CreditCard |

### Ví Điện Tử

| Tên | Tên Ngắn | Màu Chủ Đề | Icon |
|-----|----------|------------|------|
| MoMo | MoMo | #A50064 (Tím) | Wallet |
| ZaloPay | ZaloPay | #0068FF (Xanh) | Wallet |
| VNPay | VNPay | #0066CC (Xanh) | Wallet |
| ShopeePay | ShopeePay | #EE4D2D (Cam) | Wallet |

## Tính Năng UX

### 1. Logo và Màu Sắc
- Mỗi ngân hàng/ví có màu chủ đề riêng
- Icon phân biệt theo loại (Building2, CreditCard, Wallet)
- Hiển thị màu trong Select và preview

### 2. Tên Gợi Nhớ (Tính năng tương lai)
- Cho phép người dùng đặt tên gợi nhớ cho tài khoản
- Ví dụ: "Thẻ lương VCB", "Ví MoMo cá nhân"
- Lưu trong localStorage hoặc Firestore

### 3. Theme Color (Tính năng tương lai)
- Mỗi tài khoản có thể gán màu riêng
- Hiển thị màu trong danh sách giao dịch
- Giúp phân biệt nhanh các tài khoản

### 4. Nhóm Hiển Thị
- Dropdown được nhóm theo loại (Truyền thống, Số, Ví điện tử)
- Dễ dàng tìm kiếm và chọn lựa

## Lưu Ý

- Logo chính thức: Hiện tại sử dụng icon từ lucide-react. Có thể thay thế bằng logo thật sau.
- Màu sắc: Dựa trên brand colors của từng ngân hàng/ví
- Tương thích: Hỗ trợ dữ liệu cũ (chỉ có tên ngân hàng, không có ID)

