# Nguyên Tắc Thiết Kế UX/UI - Expense Tracker

## 1. Cấu Trúc Danh Mục 2 Cấp

### Mục Tiêu
- Giảm số lần chạm khi nhập liệu
- Phân loại chi tiết hơn để theo dõi tốt hơn
- Trực quan và dễ sử dụng

### Nguyên Tắc Thiết Kế

#### 1.1. Hiển Thị Icon
- **Category chính**: Icon lớn, dễ nhận biết
- **Subcategory**: Icon nhỏ hơn, hỗ trợ visual hierarchy
- **Consistency**: Icon nhất quán trong toàn bộ app

#### 1.2. Gần Đây/Thường Dùng
- Hiển thị 5 categories được dùng gần đây nhất
- Sắp xếp theo:
  1. Ngày sử dụng (mới nhất trước)
  2. Tần suất sử dụng
- Click để chọn nhanh, không cần mở dropdown

#### 1.3. Progressive Disclosure
- Chỉ hiển thị subcategory khi category đã được chọn
- Giảm cognitive load
- Flow: Chọn Category → Chọn Subcategory (nếu có) → Nhập tùy chỉnh (nếu cần)

#### 1.4. Tương Thích Ngược
- Hỗ trợ dữ liệu cũ (chỉ có category, không có subcategory)
- Tự động parse và hiển thị đúng
- Không làm mất dữ liệu hiện có

## 2. Danh Sách Tài Khoản/Ngân Hàng

### Mục Tiêu
- Phân biệt rõ ràng các loại tài khoản
- Dễ dàng nhận biết và chọn lựa
- Hỗ trợ cả ngân hàng truyền thống và ví điện tử

### Nguyên Tắc Thiết Kế

#### 2.1. Visual Hierarchy
- **Nhóm theo loại**: Truyền thống, Số, Ví điện tử
- **Màu sắc**: Mỗi ngân hàng/ví có màu brand riêng
- **Icon**: Phân biệt theo loại (Building, CreditCard, Wallet)

#### 2.2. Logo và Branding
- Sử dụng màu chủ đề chính thức của từng ngân hàng/ví
- Icon nhất quán, dễ nhận biết
- Có thể thay thế bằng logo thật sau

#### 2.3. Tên Gợi Nhớ (Tính năng tương lai)
- Cho phép người dùng đặt tên tùy chỉnh
- Ví dụ: "Thẻ lương VCB", "Ví MoMo cá nhân"
- Lưu trữ: localStorage hoặc Firestore

#### 2.4. Theme Color (Tính năng tương lai)
- Mỗi tài khoản có thể gán màu riêng
- Hiển thị trong danh sách giao dịch
- Giúp phân biệt nhanh các tài khoản

## 3. Nguyên Tắc Chung

### 3.1. Mobile First
- Ưu tiên thiết kế cho mobile
- Touch-friendly: Kích thước button đủ lớn
- Minimal clicks: Giảm số lần chạm

### 3.2. Accessibility
- ARIA labels cho screen readers
- Contrast đủ cao
- Keyboard navigation

### 3.3. Performance
- Lazy loading cho danh sách dài
- Memoization cho calculations
- Optimized re-renders

### 3.4. Consistency
- Icon style nhất quán
- Color scheme nhất quán
- Spacing và typography nhất quán

## 4. Best Practices

### 4.1. Category Selection
1. Hiển thị recent categories trước
2. Chọn category chính
3. Chọn subcategory (nếu có)
4. Nhập tùy chỉnh (nếu cần)

### 4.2. Bank Selection
1. Nhóm theo loại
2. Hiển thị màu và icon
3. Chọn từ dropdown
4. Nhập tùy chỉnh (nếu cần)

### 4.3. Error Handling
- Validation rõ ràng
- Error messages dễ hiểu
- Inline validation

### 4.4. Loading States
- Skeleton screens
- Progress indicators
- Optimistic updates

