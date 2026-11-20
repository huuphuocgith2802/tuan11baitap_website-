# TÀI LIỆU KỸ THUẬT: THIẾT KẾ LOGIC KIỂM SOÁT VÀ XÁC THỰC DỮ LIỆU FORM (FORM LOGIC & VALIDATION)

> **Học phần:** 111101 · Thiết kế Web  
> **Trường:** Đại học Lạc Hồng (LHU)  
> **Chủ đề:** Tuần 11 - Xử lý Form & Kiểm soát dữ liệu (Form Handling & Validation)  
> **Dự án Thách thức:** The Secure Form (Form Đăng Ký Bảo Mật Đa Tầng)  
> **Sinh viên thực hiện:** Huỳnh Hữu Phước  
> **Mã số sinh viên (MSSV):** 125000155  
> **GitHub Repository:** [tuan11baitap_website-](https://github.com/huuphuocgith2802/tuan11baitap_website-)

---

## 1. TỔNG QUAN VỀ KIẾM SOÁT DỮ LIỆU FORM (FORM VALIDATION)

### 1.1. Triết lý thiết kế bảo mật
> *"Đừng bao giờ tin tưởng dữ liệu người dùng nhập vào. Hãy luôn kiểm tra (Validate) thật kỹ trước khi làm bất cứ điều gì tiếp theo."*

Trong kiến trúc ứng dụng web hiện đại, Form là cầu nối tương tác chính giữa người dùng và hệ thống cơ sở dữ liệu. Quá trình kiểm soát dữ liệu gồm 2 lớp phòng vệ cốt lõi:
1. **Client-side Validation (Phía máy khách - Trình duyệt):**
   - Phản hồi tức thì, tối ưu hóa trải nghiệm người dùng (UX).
   - Ngăn chặn các dữ liệu sai định dạng trước khi gửi yêu cầu mạng (Network Request), tiết kiệm băng thông máy chủ.
   - Cung cấp hướng dẫn trực quan để người dùng sửa đổi kịp thời.
2. **Server-side Validation (Phía máy chủ):**
   - Lớp phòng thủ sống còn cuối cùng chống giả mạo request, Bypass Script, SQL Injection, XSS.

Dự án này tập trung triển khai **Client-side Validation toàn diện**, kết hợp giữa **Constraint Validation API của HTML5** và **JavaScript DOM Event-Driven Logic**.

---

## 2. QUY TRÌNH XỬ LÝ SỰ KIỆN FORM VÀ `event.preventDefault()`

### 2.1. Vấn đề của hành vi mặc định (Default Form Submission)
Khi người dùng nhấn nút `type="submit"` hoặc bấm `Enter` trong thẻ `<form action="..." method="...">`, trình duyệt sẽ:
1. Đóng gói dữ liệu Form vào Query String (GET) hoặc Request Body (POST).
2. Gửi HTTP Request lên URL chỉ định ở thuộc tính `action`.
3. **Tải lại (Reload) toàn bộ trang web** hoặc chuyển hướng sang trang mới.

### 2.2. Tại sao phải sử dụng `event.preventDefault()`?
Trong các ứng dụng Web hiện đại (Single Page Application - SPA, AJAX/Fetch, dynamic UI):
- Tải lại trang sẽ **xóa sạch toàn bộ trạng thái biến JavaScript (State), hủy bỏ các thông báo lỗi trực quan**, gây giật lag trải nghiệm.
- `event.preventDefault()` có nhiệm vụ:
  - **Chặn đứng hành vi tải lại trang mặc định** của trình duyệt.
  - Trao toàn quyền kiểm soát cho JavaScript để thực thi logic kiểm tra dữ liệu (Validate), xử lý animation, và gửi dữ liệu bất đồng bộ (Fetch/API).

```javascript
// Minh họa kỹ thuật chặn reload
const myForm = document.querySelector('#registerForm');
myForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Dừng tải lại trang ngay lập tức
    console.log("Form submit đã được JavaScript tiếp quản an toàn!");
});
```

---

## 3. CHI TIẾT CÁC BƯỚC THIẾT LẬP VALIDATION TRONG DỰ ÁN

Hệ thống xác thực dữ liệu trong dự án **"The Secure Form"** được thiết kế theo quy trình 6 bước chuẩn mực:

```
[Người dùng tương tác] 
         │
         ├── Sự kiện 'input' / 'blur' ───────► [Real-time Validation từng trường]
         │                                              │
         │                                              ├── Hợp lệ: Hiển thị viền xanh, xóa lỗi
         │                                              └── Lỗi: Hiển thị viền đỏ, xuất hiện span.error-msg
         │
         └── Sự kiện 'submit' ──────────────► [event.preventDefault()]
                                                        │
                                                        ▼
                                              [Tổng kiểm tra toàn bộ Form]
                                                        │
                         ┌──────────────────────────────┴──────────────────────────────┐
                         ▼                                                             ▼
                 [Có ít nhất 1 lỗi]                                            [Mọi trường hợp lệ]
                         │                                                             │
             Focus vào ô lỗi đầu tiên                                       Hiển thị Success Toast (3s)
             Cập nhật lại thông báo lỗi                                     Tạo Object dữ liệu sạch
                                                                            Reset form sau khi gửi
```

---

### Bước 1: Kiểm tra trường bắt buộc không để trống (Empty Field Check)
- **Mục tiêu:** Đảm bảo tất cả các trường dữ liệu quan trọng phải có giá trị thực chất, không chứa chuỗi ký tự trắng vô nghĩa.
- **Kỹ thuật:** Sử dụng phương thức `.trim()` để loại bỏ khoảng trắng ở 2 đầu chuỗi.
- **Hàm mẫu:**
```javascript
function checkRequired(value, fieldName) {
    if (!value || value.trim() === '') {
        return `${fieldName} không được để trống!`;
    }
    return '';
}
```

---

### Bước 2: Kiểm tra Họ và Tên (Full Name Validation)
- **Mục tiêu:** Tên phải có độ dài tối thiểu 3 ký tự và chỉ chứa chữ cái tiếng Việt/Anh cùng khoảng trắng, không chứa số hoặc ký tự đặc biệt vô lý.
- **Biểu thức chính quy (Regex):**
```javascript
const nameRegex = /^[a-zA-ZÀ-ỹ\s]{3,50}$/;
```
- **Xử lý:**
  - Nếu độ dài < 3 ký tự: Báo lỗi *"Họ và tên phải có ít nhất 3 ký tự"*.
  - Nếu chứa số hoặc ký tự lạ: Báo lỗi *"Họ và tên chỉ được chứa chữ cái và khoảng trắng"*.

---

### Bước 3: Kiểm tra định dạng Email chuẩn xác (RFC 5322 Regex)
- **Mục tiêu:** Đảm bảo địa chỉ email có tiền tố hợp lệ, chứa ký tự `@`, tên miền và phần mở rộng (tên miền cấp cao TLD từ 2 ký tự trở lên).
- **Biểu thức chính quy (Regex):**
```javascript
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```
- **Giải thích từng thành phần Regex:**
  - `^`: Bắt đầu chuỗi.
  - `[a-zA-Z0-9._%+-]+`: Tiền tố gồm chữ cái, chữ số, dấu chấm, gạch dưới, dấu cộng/trừ/phần trăm (ít nhất 1 ký tự).
  - `@`: Ký tự @ bắt buộc phân tách giữa username và domain.
  - `[a-zA-Z0-9.-]+`: Tên miền (ví dụ: `gmail`, `lachong`, `edu`).
  - `\.`: Dấu chấm phân tách tên miền và đuôi mở rộng.
  - `[a-zA-Z]{2,}`: TLD (Top-Level Domain) có ít nhất 2 ký tự (ví dụ: `vn`, `com`, `org`, `edu.vn`).
  - `$`: Kết thúc chuỗi.

---

### Bước 4: Kiểm tra Số điện thoại Việt Nam (Phone Number Regex)
- **Mục tiêu:** Số điện thoại di động hợp lệ tại Việt Nam gồm 10 chữ số, bắt đầu bằng các đầu số viễn thông hiện hành: 03, 05, 07, 08, 09.
- **Biểu thức chính quy (Regex):**
```javascript
const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
```
- **Giải thích:**
  - `^0[3|5|7|8|9]`: Bắt đầu bằng chữ số 0 kết hợp với 3, 5, 7, 8, hoặc 9.
  - `[0-9]{8}$`: Tiếp nối bởi đúng 8 chữ số ngẫu nhiên từ 0 đến 9.

---

### Bước 5: Kiểm tra độ mạnh Mật khẩu & Thước đo trực quan (Password Strength Meter)
- **Mục tiêu:** Mật khẩu phải an toàn, bảo vệ tài khoản người dùng trước các cuộc tấn công Brute-force hoặc Dictionary Attack.
- **Tiêu chuẩn đánh giá điểm:**
  1. Độ dài tối thiểu 8 ký tự (+1 điểm)
  2. Chứa ít nhất một chữ cái thường `[a-z]` (+1 điểm)
  3. Chứa ít nhất một chữ cái hoa `[A-Z]` (+1 điểm)
  4. Chứa ít nhất một chữ số `[0-9]` (+1 điểm)
  5. Chứa ít nhất một ký tự đặc biệt `[!@#$%^&*(),.?":{}|<>]` (+1 điểm)
- **Phân loại cấp độ:**
  - Điểm 1-2: **Yếu (Weak)** — Thanh tiến trình màu đỏ.
  - Điểm 3-4: **Trung bình (Medium)** — Thanh tiến trình màu vàng/cam.
  - Điểm 5: **Mạnh (Strong)** — Thanh tiến trình màu xanh lá.

---

### Bước 6: Kiểm tra Mật khẩu khớp nhau (Confirm Password Match)
- **Mục tiêu:** Chống gõ nhầm mật khẩu khi đăng ký.
- **Xử lý:**
```javascript
function checkPasswordMatch(password, confirmPassword) {
    if (confirmPassword !== password) {
        return "Mật khẩu xác nhận không khớp với mật khẩu đã nhập!";
    }
    return '';
}
```

---

### Bước 7: Kiểm soát Checkbox Điều khoản & Khóa nút Submit
- **Mục tiêu:** Tuân thủ pháp lý và xác nhận sự đồng thuận của người dùng.
- **Cơ chế:**
  - Nút Submit ban đầu có thuộc tính `disabled = true` và class làm mờ `opacity-50 cursor-not-allowed`.
  - Lắng nghe sự kiện `change` trên checkbox `#termsAgreement`.
  - Khi `checked === true`, gỡ bỏ `disabled`, kích hoạt hiệu ứng hover sáng rõ.

---

## 4. CHI TIẾT TRẢI NGHIỆM NGƯỜI DÙNG (UI / UX DESIGN)

### 4.1. Kiểm tra dữ liệu thời gian thực (Real-time Validation)
- Thay vì bắt người dùng phải nhấn nút Submit mới nhận được cả danh sách lỗi, hệ thống áp dụng:
  - Sự kiện `'input'`: Kiểm tra ngay khi người dùng đang gõ từng ký tự để hiển thị trạng thái tương tác động.
  - Sự kiện `'blur'`: Kiểm tra khi người dùng rời con trỏ chuột khỏi ô nhập liệu để đưa ra kết luận chuẩn xác.
- Khi có lỗi:
  - Input nhận class `.input-error` (`border: 2px solid #ef4444; background: #fef2f2;`).
  - Thẻ `<span class="error-msg">` hiển thị thông báo chi tiết màu đỏ.
- Khi dữ liệu hợp lệ:
  - Input nhận class `.input-success` (`border: 2px solid #10b981; background: #f0fdf4;`).
  - Thông báo lỗi bị ẩn đi (`display: none;`).

### 4.2. Thông báo thành công mượt mà với `setTimeout` 3 giây
Khi tất cả các trường dữ liệu đều hợp lệ:
1. Hệ thống tạo một **Toast Notification** đẹp mắt trượt mượt mà từ góc trên màn hình với icon checkmark màu xanh.
2. Một thanh tiến trình (Progress Bar) chạy co dần từ 100% về 0% trong đúng 3.000 milliseconds (3 giây).
3. Sử dụng `setTimeout(callback, 3000)` để kích hoạt hiệu ứng mờ dần (Fade Out) và xóa Toast khỏi DOM:

```javascript
function showSuccessToast(message) {
    const toast = document.getElementById('successToast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    
    // Hiển thị Toast
    toast.classList.add('show');
    
    // Tự động ẩn mượt mà sau 3 giây (3000ms)
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
```

---

## 5. BẢNG TỔNG HỢP CÁC BIỂU THỨC CHÍNH QUY (REGEX) VÀ QUY TẮC

| STT | Trường Dữ Liệu | Biểu Thức Chính Quy (Regex) | Ý Nghĩa / Mục Đích |
|:---:|:---|:---|:---|
| 1 | **Họ và Tên** | `/^[a-zA-ZÀ-ỹ\s]{3,50}$/` | Cho phép chữ cái tiếng Việt/Anh có dấu, tối thiểu 3 ký tự |
| 2 | **Email chuẩn** | `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` | Cú pháp email quốc tế chuẩn với username, @, domain, TLD |
| 3 | **Số điện thoại VN** | `/^(0[3\|5\|7\|8\|9])[0-9]{8}$/` | Đầu số viễn thông Việt Nam (10 chữ số) |
| 4 | **Độ mạnh mật khẩu** | Đa regex: `/[a-z]/`, `/[A-Z]/`, `/[0-9]/`, `/[^A-Za-z0-9]/` | Kiểm tra đủ 4 nhóm ký tự kết hợp độ dài `>= 8` |
| 5 | **Không khoảng trắng** | `/^\S+$/` | Kiểm tra chuỗi liên tục không chứa ký tự space (username) |

---

## 6. KỊCH BẢN KIỂM THỬ (TEST CASES & VERIFICATION MATRIX)

| Mã Test | Trường Dữ Liệu | Giá Trị Nhập Vào | Kết Quả Mong Đợi | Trạng Thái Đạt |
|:---:|:---|:---|:---|:---:|
| **TC01** | Họ và tên | `"  "` (Khoảng trắng) | Báo lỗi: "Họ và tên không được để trống" | ✅ Đạt |
| **TC02** | Họ và tên | `"An"` | Báo lỗi: "Họ và tên phải có ít nhất 3 ký tự" | ✅ Đạt |
| **TC03** | Họ và tên | `"Huỳnh Hữu Phước"` | Viền xanh, hợp lệ | ✅ Đạt |
| **TC04** | Email | `"huuphuoc.email.com"` (thiếu @) | Báo lỗi: "Email không đúng định dạng (thiếu @)" | ✅ Đạt |
| **TC05** | Email | `"huuphuoc@lhu"` (thiếu domain TLD) | Báo lỗi: "Email không đúng định dạng" | ✅ Đạt |
| **TC06** | Email | `"125000155@lachong.edu.vn"` | Viền xanh, hợp lệ | ✅ Đạt |
| **TC07** | Số điện thoại | `"0123456789"` (đầu số sai) | Báo lỗi: "Số điện thoại Việt Nam phải bắt đầu bằng 03, 05, 07, 08, 09" | ✅ Đạt |
| **TC08** | Số điện thoại | `"0912345678"` | Viền xanh, hợp lệ | ✅ Đạt |
| **TC09** | Mật khẩu | `"12345"` (ngắn, yếu) | Báo lỗi: "Mật khẩu tối thiểu 8 ký tự", mức Yếu | ✅ Đạt |
| **TC10** | Mật khẩu | `"Lhu@2026Password!"` | Viền xanh, thanh đo đạt mức Mạnh (5/5 sao) | ✅ Đạt |
| **TC11** | Nhập lại MK | Khác với ô Mật khẩu | Báo lỗi: "Mật khẩu xác nhận không khớp" | ✅ Đạt |
| **TC12** | Điều khoản | Chưa tick chọn checkbox | Nút Submit ở trạng thái disabled, không thể bấm | ✅ Đạt |
| **TC13** | Submit Form | Điền hợp lệ toàn bộ + tick | Xuất hiện Toast thành công, biến mất sau đúng 3s, reset form | ✅ Đạt |

---

## 7. KẾT LUẬN

Hệ thống xử lý Form và kiểm soát dữ liệu Tuần 11 đã đáp ứng xuất sắc toàn bộ chuẩn đầu ra bài học (LLO 3.4.1 - 3.4.4):
- Làm chủ phương thức `event.preventDefault()` để kiểm soát quy trình submit mà không làm tải lại trang web.
- Truy xuất linh hoạt các dữ liệu từ nhiều kiểu input: text, email, tel, password, color, checkbox, radio, select.
- Xây dựng hệ thống thông báo lỗi thông minh, trực quan, nâng cao bảo mật và trải nghiệm người dùng theo tiêu chuẩn thiết kế web chuyên nghiệp.
