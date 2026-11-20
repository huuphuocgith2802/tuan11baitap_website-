/**
 * LOGIC XỬ LÝ FORM & KIỂM SOÁT DỮ LIỆU - THE SECURE FORM
 * Học phần: 111101 Thiết kế Web - Đại học Lạc Hồng (LHU)
 * Sinh viên thực hiện: Huỳnh Hữu Phước (125000155)
 */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('secureRegisterForm');
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('termsAgree');
  const submitBtn = document.getElementById('submitSecureBtn');

  // Error spans
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const passwordError = document.getElementById('passwordError');
  const confirmError = document.getElementById('confirmError');
  const termsError = document.getElementById('termsError');

  // Password Strength components
  const strengthBar = document.getElementById('strengthBar');
  const strengthLabel = document.getElementById('strengthLabel');
  const ruleLength = document.getElementById('ruleLength');
  const ruleLower = document.getElementById('ruleLower');
  const ruleUpper = document.getElementById('ruleUpper');
  const ruleNumber = document.getElementById('ruleNumber');
  const ruleSpecial = document.getElementById('ruleSpecial');

  // Toast components
  const toast = document.getElementById('secureToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  const payloadCard = document.getElementById('payloadCard');
  const payloadOutput = document.getElementById('payloadOutput');

  let toastTimer = null;

  // =========================================================================
  // HELPER FUNCTIONS: SET ERROR & SUCCESS
  // =========================================================================
  function setFieldError(input, errorElement, message) {
    input.classList.remove('input-success');
    input.classList.add('input-error');
    errorElement.textContent = message;
    errorElement.style.color = 'var(--danger)';
    return false;
  }

  function setFieldSuccess(input, errorElement) {
    input.classList.remove('input-error');
    input.classList.add('input-success');
    errorElement.textContent = '';
    return true;
  }

  // =========================================================================
  // 1. VALIDATION: FULL NAME (HỌ VÀ TÊN)
  // =========================================================================
  function validateName() {
    const value = nameInput.value.trim();
    if (value === '') {
      return setFieldError(nameInput, nameError, 'Họ và tên không được để trống!');
    }
    if (value.length < 3) {
      return setFieldError(nameInput, nameError, 'Họ và tên phải có tối thiểu 3 ký tự!');
    }
    // Hỗ trợ tiếng Việt và khoảng trắng
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{3,50}$/;
    if (!nameRegex.test(value)) {
      return setFieldError(nameInput, nameError, 'Họ và tên chỉ được chứa chữ cái và khoảng trắng!');
    }
    return setFieldSuccess(nameInput, nameError);
  }

  // =========================================================================
  // 2. VALIDATION: EMAIL (CHUẨN RFC)
  // =========================================================================
  function validateEmail() {
    const value = emailInput.value.trim();
    if (value === '') {
      return setFieldError(emailInput, emailError, 'Email không được để trống!');
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return setFieldError(emailInput, emailError, 'Email không hợp lệ (ví dụ: username@domain.com)!');
    }
    return setFieldSuccess(emailInput, emailError);
  }

  // =========================================================================
  // 3. VALIDATION: SỐ ĐIỆN THOẠI VIỆT NAM (10 SỐ, ĐẦU 03, 05, 07, 08, 09)
  // =========================================================================
  function validatePhone() {
    const value = phoneInput.value.trim();
    if (value === '') {
      return setFieldError(phoneInput, phoneError, 'Số điện thoại không được để trống!');
    }
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(value)) {
      return setFieldError(phoneInput, phoneError, 'Số điện thoại VN không hợp lệ (10 số, bắt đầu 03, 05, 07, 08, 09)!');
    }
    return setFieldSuccess(phoneInput, phoneError);
  }

  // =========================================================================
  // 4. VALIDATION: MẬT KHẨU & PASSWORD STRENGTH METER
  // =========================================================================
  function updateRuleChip(element, isValid) {
    if (isValid) {
      element.classList.add('valid');
      element.querySelector('i').className = 'fa-solid fa-circle-check';
    } else {
      element.classList.remove('valid');
      element.querySelector('i').className = 'fa-solid fa-circle-dot';
    }
  }

  function validatePassword() {
    const value = passwordInput.value;
    if (value === '') {
      strengthBar.style.width = '0%';
      strengthLabel.textContent = 'Chưa nhập';
      strengthLabel.style.color = '#64748b';
      [ruleLength, ruleLower, ruleUpper, ruleNumber, ruleSpecial].forEach(el => updateRuleChip(el, false));
      return setFieldError(passwordInput, passwordError, 'Mật khẩu không được để trống!');
    }

    const hasLength = value.length >= 8;
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    updateRuleChip(ruleLength, hasLength);
    updateRuleChip(ruleLower, hasLower);
    updateRuleChip(ruleUpper, hasUpper);
    updateRuleChip(ruleNumber, hasNumber);
    updateRuleChip(ruleSpecial, hasSpecial);

    // Tính điểm (0 -> 5)
    let score = 0;
    if (hasLength) score++;
    if (hasLower) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    // Cập nhật thanh đo độ mạnh (Progress Bar)
    strengthBar.className = 'strength-bar';
    if (score <= 2) {
      strengthBar.style.width = '33%';
      strengthBar.classList.add('strength-weak');
      strengthLabel.textContent = 'Yếu (Chưa an toàn)';
      strengthLabel.style.color = 'var(--danger)';
    } else if (score <= 4) {
      strengthBar.style.width = '66%';
      strengthBar.classList.add('strength-medium');
      strengthLabel.textContent = 'Trung bình';
      strengthLabel.style.color = 'var(--warning)';
    } else {
      strengthBar.style.width = '100%';
      strengthBar.classList.add('strength-strong');
      strengthLabel.textContent = 'Rất mạnh (Tối ưu bảo mật)';
      strengthLabel.style.color = 'var(--success)';
    }

    if (!hasLength) {
      return setFieldError(passwordInput, passwordError, 'Mật khẩu phải có độ dài tối thiểu 8 ký tự!');
    } else if (score < 3) {
      return setFieldError(passwordInput, passwordError, 'Mật khẩu quá yếu! Hãy kết hợp thêm chữ hoa, số hoặc ký tự đặc biệt.');
    } else {
      return setFieldSuccess(passwordInput, passwordError);
    }
  }

  // =========================================================================
  // 5. VALIDATION: XÁC NHẬN MẬT KHẨU KHỚP NHAU
  // =========================================================================
  function validateConfirmPassword() {
    const p1 = passwordInput.value;
    const p2 = confirmInput.value;

    if (p2 === '') {
      return setFieldError(confirmInput, confirmError, 'Vui lòng xác nhận lại mật khẩu!');
    }
    if (p1 !== p2) {
      return setFieldError(confirmInput, confirmError, 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập!');
    }
    return setFieldSuccess(confirmInput, confirmError);
  }

  // =========================================================================
  // 6. TOGGLE SUBMIT BUTTON BẰNG CHECKBOX ĐIỀU KHOẢN
  // =========================================================================
  termsCheckbox.addEventListener('change', function () {
    if (this.checked) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-shield-halved"></i> Đăng Ký Tài Khoản An Toàn`;
      termsError.textContent = '';
    } else {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Đang Khóa (Vui lòng tick đồng ý Điều khoản)`;
    }
  });

  // =========================================================================
  // REAL-TIME EVENT LISTENERS (SỰ KIỆN INPUT)
  // =========================================================================
  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);
  passwordInput.addEventListener('input', () => {
    validatePassword();
    if (confirmInput.value.trim() !== '') {
      validateConfirmPassword();
    }
  });
  confirmInput.addEventListener('input', validateConfirmPassword);

  // =========================================================================
  // THÔNG BÁO THÀNH CÔNG MƯỢT MÀ VỚI SETTIMEOUT 3 GIÂY
  // =========================================================================
  function triggerSuccessToast(name, email, phone) {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTitle.textContent = "Đăng Ký Thành Công!";
    toastDesc.textContent = `Chào mừng ${name}! Thông tin đã được mã hóa an toàn.`;

    // Hiển thị Toast
    toast.classList.add('show');

    // Tự động đóng mượt mà sau đúng 3.000 ms (3 giây)
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
      console.log("[Toast Timer]: Đã tự động ẩn Toast sau 3 giây bằng setTimeout().");
    }, 3000);

    // Hiển thị Payload Inspector
    payloadCard.style.display = 'block';
    const payload = {
      status: 200,
      message: "Client Validation Passed Successfully",
      data: {
        fullName: name,
        email: email,
        phone: phone,
        passwordLength: passwordInput.value.length,
        passwordStrength: strengthLabel.textContent,
        acceptedTerms: true,
        timestamp: new Date().toISOString()
      }
    };
    payloadOutput.textContent = JSON.stringify(payload, null, 2);
  }

  // =========================================================================
  // SUBMIT HANDLER: EVENT.PREVENTDEFAULT() & FORM VALIDATION SWEEP
  // =========================================================================
  form.addEventListener('submit', function (event) {
    // 1. NGĂN CHẶN TẢI LẠI TRANG
    event.preventDefault();

    // 2. Kiểm tra lại toàn bộ form
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPassValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    const isTermsAgreed = termsCheckbox.checked;

    if (!isTermsAgreed) {
      termsError.textContent = 'Bạn bắt buộc phải đồng ý với Điều khoản sử dụng!';
      return;
    }

    if (isNameValid && isEmailValid && isPhoneValid && isPassValid && isConfirmValid) {
      // Thành công tuyệt đối
      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const phoneVal = phoneInput.value.trim();

      triggerSuccessToast(nameVal, emailVal, phoneVal);

      // Reset form sạch sẽ
      form.reset();
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Đang Khóa (Vui lòng tick đồng ý Điều khoản)`;

      // Xóa các border class
      [nameInput, emailInput, phoneInput, passwordInput, confirmInput].forEach(inp => {
        inp.classList.remove('input-success', 'input-error');
      });

      // Reset thanh đo mật khẩu
      strengthBar.style.width = '0%';
      strengthLabel.textContent = 'Chưa nhập';
      strengthLabel.style.color = '#64748b';
      [ruleLength, ruleLower, ruleUpper, ruleNumber, ruleSpecial].forEach(el => updateRuleChip(el, false));

    } else {
      // Focus vào ô lỗi đầu tiên
      const firstInvalid = form.querySelector('.input-error');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      console.warn("[Validation]: Biểu mẫu còn lỗi chưa hợp lệ!");
    }
  });
});

// Hàm hiển thị / ẩn mật khẩu (Eye icon toggle)
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}
