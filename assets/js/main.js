/**
 * SCRIPT ĐIỀU KHIỂN HUB TRUNG TÂM - TUẦN 11
 * Đại học Lạc Hồng - Học phần 111101 Thiết kế Web
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Quản lý chuyển Tab trên giao diện chính
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function switchTab(targetTabId) {
    tabButtons.forEach(btn => {
      if (btn.dataset.tab === targetTabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === targetTabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Cập nhật URL Hash
    window.location.hash = targetTabId;
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const tabId = this.dataset.tab;
      switchTab(tabId);
    });
  });

  // Hỗ trợ truy cập trực tiếp qua Hash (ví dụ: index.html#homework)
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash && document.getElementById(currentHash)) {
    switchTab(currentHash);
  }

  // 2. Tự động highlight code nếu có
  console.log("%c[LHU Web Design] Dashboard Tuần 11 đã sẵn sàng!", "color: #2563eb; font-weight: bold; font-size: 14px;");
});
