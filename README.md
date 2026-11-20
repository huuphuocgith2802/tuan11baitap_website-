# TUẦN 11: XỬ LÝ FORM & KIỂM SOÁT DỮ LIỆU (FORM HANDLING & VALIDATION)
### HỌC PHẦN 111101 · THIẾT KẾ WEB — ĐẠI HỌC LẠC HỒNG (LHU)
> **Giáo trình giảng dạy:** Trang 70 – Trang 71  
> **Sinh viên thực hiện:** Huỳnh Hữu Phước  
> **Mã số sinh viên (MSSV):** 125000155  
> **Email sinh viên:** [125000155@lachong.edu.vn](mailto:125000155@lachong.edu.vn)  
> **GitHub Username:** [huuphuocgith2802](https://github.com/huuphuocgith2802)  
> **Tên Repository:** [`tuan11baitap_website-`](https://github.com/huuphuocgith2802/tuan11baitap_website-)

---

## 📌 GIỚI THIỆU DỰ ÁN

Dự án này là sản phẩm hoàn chỉnh của **Tuần 11: Xử lý Form & Kiểm soát dữ liệu** trong học phần Thiết kế Web tại Trường Đại học Lạc Hồng. Toàn bộ nội dung lý thuyết, hoạt động thực hành trên lớp, 6 bài tập tự rèn luyện tại nhà và Thách thức Tuần 11 ("The Secure Form") đã được xây dựng theo tiêu chuẩn lập trình hiện đại, giao diện trực quan và tối ưu hóa trải nghiệm người dùng (UX).

---

## 🎯 CÁC CHUẨN ĐẦU RA BÀI HỌC ĐÃ ĐẠT ĐƯỢC (LLO)

- ✅ **LLO 3.4.1:** Sử dụng `event.preventDefault()` để kiểm soát toàn diện quy trình submit Form, ngăn chặn trình duyệt reload trang.
- ✅ **LLO 3.4.2:** Truy xuất dữ liệu chính xác từ tất cả các loại input (text, email, password, tel, color, checkbox mảng nhiều mục, radio button, select).
- ✅ **LLO 3.4.3:** Xây dựng logic kiểm tra dữ liệu: trường bắt buộc không để trống, kiểm tra định dạng email, độ dài và độ mạnh mật khẩu, so sánh mật khẩu khớp nhau.
- ✅ **LLO 3.4.4:** Sử dụng Prompt AI để tạo và phân tích các Biểu thức chính quy (Regex) tiêu chuẩn kiểm tra số điện thoại Việt Nam và email RFC.

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN

```
tuan11_website/
├── index.html                  # Hub Trung tâm: Dashboard điều hướng toàn bộ bài tập & xem nhanh
├── form_logic.md               # Tài liệu kỹ thuật chi tiết mô tả quy trình kiểm tra dữ liệu
├── README.md                   # Tài liệu giới thiệu dự án & hướng dẫn chạy
│
├── assets/
│   ├── css/
│   │   └── style.css           # Toàn bộ CSS phong cách Modern UI, Toast, animations, meter
│   └── js/
│       └── main.js             # Logic chuyển Tab và điều khiển dashboard trung tâm
│
├── in-class/                   # 3 Hoạt động thực hành trên lớp (In-Class Activities)
│   ├── hoatdong1.html          # Hoạt động 1: "Stop the Page!" - event.preventDefault()
│   ├── hoatdong2.html          # Hoạt động 2: "Smart Validator" - Báo lỗi span.error-msg viền đỏ
│   └── hoatdong3.html          # Hoạt động 3: "Data Collector" - Thu thập Checkbox/Radio thành Object
│
├── homework/                   # 6 Bài tập tự rèn luyện tại nhà (Homework)
│   ├── bai1.html               # Bài 1: Form liên hệ cơ bản (Bắt buộc điền hết)
│   ├── bai2.html               # Bài 2: Kiểm tra mật khẩu khớp nhau (Real-time matching)
│   ├── bai3.html               # Bài 3: Bộ chọn màu nền (Color Picker live background)
│   ├── bai4.html               # Bài 4: Tính tổng đơn hàng tự động từ Checkbox (VNĐ)
│   ├── bai5.html               # Bài 5: Regex Email Checker (Phân tích cấu trúc Regex)
│   └── bai6.html               # Bài 6: Khóa nút Submit cho đến khi tick đồng ý điều khoản
│
└── challenge/                  # 🎯 THÁCH THỨC TUẦN 11: "THE SECURE FORM" (NHÓM)
    ├── the_secure_form.html    # Giao diện Form đăng ký bảo mật cao cấp
    └── secure_form.js          # Logic Real-time Validation & Toast setTimeout 3 giây
```

---

## 🚀 TỔNG HỢP NỘI DUNG VÀ TÍNH NĂNG CHI TIẾT

### 1. Hoạt động trên lớp (In-Class Activities)
- **Hoạt động 1: "Stop the Page!" (`in-class/hoatdong1.html`)**
  - Chặn reload trang khi submit bằng `event.preventDefault()`.
  - Tích hợp khung mô phỏng Console Log Viewer ngay trên giao diện web.
  - Phân tích câu hỏi Vibe Coding: *"Tại sao cần dùng `preventDefault()` khi xử lý Form bằng JS?"*.
- **Hoạt động 2: "Smart Validator" (`in-class/hoatdong2.html`)**
  - Kiểm tra Username < 5 ký tự: Báo lỗi *"Tên quá ngắn"* vào thẻ `<span class="error-msg">` và đổi border sang màu đỏ.
  - Kiểm tra Email có chứa ký tự `@`.
  - Kiểm tra Password không được để trống.
- **Hoạt động 3: "Data Collector" (`in-class/hoatdong3.html`)**
  - Thu thập Radio (Giới tính: Nam/Nữ/Khác) qua `input[name="gender"]:checked`.
  - Thu thập Checkbox (Sở thích) đóng gói vào mảng `hobbies: [...]`.
  - Xuất ra JSON format hiển thị trực quan.

### 2. Sáu bài tập tự rèn luyện tại nhà (Homework)
- **Bài 1 (`homework/bai1.html`):** Form liên hệ đầy đủ Tên, Email, Nội dung; chỉ gửi khi không có trường nào trống.
- **Bài 2 (`homework/bai2.html`):** So sánh 2 ô Mật khẩu và Nhập lại mật khẩu, hiển thị tích xanh khi trùng và cảnh báo đỏ khi lệch. Có nút xem/ẩn mật khẩu.
- **Bài 3 (`homework/bai3.html`):** Bộ chọn màu `type="color"` thay đổi trực tiếp màu nền kèm chuyển đổi mã màu HEX sang RGB và bảng màu preset.
- **Bài 4 (`homework/bai4.html`):** Tính tổng tiền các khóa học lập trình tự động với `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`, có nút "Chọn tất cả" và "Bỏ chọn".
- **Bài 5 (`homework/bai5.html`):** Áp dụng Regex chuẩn quốc tế `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`, phân tích ý nghĩa từng cụm ký tự và cung cấp các nút kiểm thử mẫu nhanh.
- **Bài 6 (`homework/bai6.html`):** Lắng nghe sự kiện `change` trên checkbox Điều khoản để bật/tắt thuộc tính `disabled` và class mờ của nút Gửi.

### 3. Thách thức Tuần 11: "THE SECURE FORM" (`challenge/the_secure_form.html`)
- **Real-time Validation:** Kiểm tra trực tiếp khi đang gõ phím (`input` event) cho tất cả các trường: Họ và tên tiếng Việt, Email chuẩn RFC, Số điện thoại di động Việt Nam.
- **Password Strength Meter:** Thước đo độ mạnh mật khẩu 5 cấp độ (chiều dài, chữ thường, chữ hoa, số, ký tự đặc biệt) kèm checklist trực quan và thanh tiến trình đổi màu (Đỏ -> Vàng -> Xanh).
- **Smooth Success Toast với `setTimeout` 3s:** Khi gửi thành công, Toast thông báo trượt mượt mà vào màn hình, thanh countdown đếm ngược co dần và tự động biến mất sau đúng 3.000 ms.
- **Tài liệu nộp đính kèm:** File [form_logic.md](form_logic.md) trình bày đầy đủ kiến trúc, bảng test case và luồng xử lý.

---

## 🛠 HƯỚNG DẪN CHẠY VÀ KIỂM THỬ TRÊN MÁY TÍNH CÁ NHÂN

1. **Cách 1: Chạy trực tiếp từ trình duyệt**
   - Click đúp vào file `index.html` trong thư mục `tuan11_website` để mở trên bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Cốc Cốc, Safari).
   - Sử dụng menu chuyển tab để kiểm thử toàn bộ các bài tập.

2. **Cách 2: Sử dụng Live Server trên VS Code**
   - Mở thư mục `tuan11_website` trong Visual Studio Code.
   - Nhấn chuột phải vào `index.html` chọn **Open with Live Server** (hoặc phím tắt `Alt + L, Alt + O`).
   - Mở Console (F12) để theo dõi các thông điệp ghi log chi tiết.

---

## 👨‍💻 THÔNG TIN TÁC GIẢ
- **Sinh viên:** Huỳnh Hữu Phước
- **MSSV:** 125000155
- **Trường:** Đại học Lạc Hồng (LHU) — Khoa Công nghệ Thông tin
- **Học phần:** 111101 · Thiết kế Web
