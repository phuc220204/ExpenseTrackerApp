# Cấu Trúc Danh Mục Chi Tiêu - Expense Tracker

## Tổng Quan

Hệ thống danh mục được tổ chức theo cấu trúc 2 cấp độ:
- **Category (Cấp 1)**: Nhóm danh mục chính
- **Subcategory (Cấp 2)**: Danh mục chi tiết bên trong mỗi category

## Cấu Trúc Chi Tiết

### CHI TIÊU (Expense)

#### 1. Ăn uống
- **Icon**: Utensils
- **Subcategories**:
  - Đi chợ/Tạp hóa
  - Nhà hàng
  - Cafe
  - Đồ uống

#### 2. Di chuyển
- **Icon**: Car
- **Subcategories**:
  - Sửa xe/Bảo dưỡng
  - Xăng/Dầu
  - Taxi/Xe công nghệ
  - Gửi xe
  - Phí cầu đường

#### 3. Mua sắm
- **Icon**: ShoppingBag
- **Subcategories**:
  - Quần áo
  - Điện tử
  - Đồ gia dụng
  - Mỹ phẩm

#### 4. Hóa đơn
- **Icon**: FileText
- **Subcategories**:
  - Điện
  - Nước
  - Internet
  - Điện thoại
  - Bảo hiểm

#### 5. Giải trí
- **Icon**: Music
- **Subcategories**:
  - Xem phim
  - Chơi game
  - Du lịch
  - Thể thao

#### 6. Y tế
- **Icon**: Heart
- **Subcategories**:
  - Khám bệnh
  - Thuốc
  - Bảo hiểm y tế

#### 7. Giáo dục
- **Icon**: GraduationCap
- **Subcategories**:
  - Học phí
  - Sách vở
  - Khóa học

#### 8. Tiết kiệm/Đầu tư
- **Icon**: PiggyBank
- **Subcategories**:
  - Tiết kiệm
  - Đầu tư
  - Chứng khoán

#### 9. Khác
- **Icon**: MoreHorizontal
- **Subcategories**: Không có (cho phép nhập tùy chỉnh)

### THU NHẬP (Income)

#### 1. Thu nhập
- **Icon**: Wallet
- **Subcategories**:
  - Lương
  - Freelance
  - Thưởng
  - Đầu tư

#### 2. Khác
- **Icon**: MoreHorizontal
- **Subcategories**: Không có (cho phép nhập tùy chỉnh)

## Format Lưu Trữ

Khi người dùng chọn category có subcategory, giá trị được lưu theo format:
```
"Category > Subcategory"
```

Ví dụ:
- `"Di chuyển > Sửa xe/Bảo dưỡng"`
- `"Ăn uống > Nhà hàng"`

Khi chỉ chọn category (không có subcategory hoặc không chọn subcategory):
```
"Category"
```

Ví dụ:
- `"Khác"`
- `"Tiết kiệm/Đầu tư"` (nếu không chọn subcategory)

## Tính Năng UX

### 1. Gần đây (Recent Categories)
- Hiển thị 5 categories được sử dụng gần đây nhất
- Sắp xếp theo ngày sử dụng và tần suất
- Click để chọn nhanh, giảm số lần chạm

### 2. Icon Mapping
- Mỗi category chính có icon riêng
- Mỗi subcategory có icon riêng (nếu có)
- Icon mặc định: MoreHorizontal

### 3. Tương Thích Ngược
- Hỗ trợ dữ liệu cũ (chỉ có category, không có subcategory)
- Tự động parse và hiển thị đúng

