// main.js
document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");

    // 2초 후 mainPages.html로 리다이렉트
    setTimeout(() => {
        window.location.href = "./src/pages/home/mainPage.html";
    });

    // 로딩 메시지 표시
    app.textContent = "Redirecting to the main page...";
});