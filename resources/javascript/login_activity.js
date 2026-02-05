//登錄功能.
// 獲取表單元素
const loginForm = document.querySelector('form');
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// 全局變量（可選）
let username = "";
let password = "";

// 監聽輸入事件（可選，用於實時追蹤）
usernameInput.addEventListener("input", function(event) {
    username = event.target.value;
    console.log("用戶名更新:", username);
});

passwordInput.addEventListener("input", function(event) {
    password = event.target.value;
    console.log("密碼長度:", password.length);
});

// 處理表單提交
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    // 方法1：使用輸入框的當前值
    const currentUsername = usernameInput.value.trim();
    const currentPassword = passwordInput.value;
    
    // 或方法2：使用全局變量（如果監聽了 input 事件）
    // const currentUsername = username;
    // const currentPassword = password;
    
    // 驗證
    if (!currentUsername) {
        alert("請輸入用戶名");
        usernameInput.focus();
        return;
    }
    
    if (!currentPassword) {
        alert("請輸入密碼");
        passwordInput.focus();
        return;
    }
    
    console.log("提交 - 用戶名:", currentUsername);
    console.log("提交 - 密碼:", currentPassword);
    
    // 簡單的驗證邏輯
    if (currentUsername === "admin" && currentPassword === "123456") {
        alert("登入成功！");
        // 這裡可以跳轉頁面
        // window.location.href = "/dashboard.html";
    } else {
        alert("帳號或密碼錯誤！");
        passwordInput.value = ""; // 清空密碼
        passwordInput.focus();
    }
});