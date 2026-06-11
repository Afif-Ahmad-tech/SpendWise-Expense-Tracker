document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const loginEmail = document.getElementById("login-email").value.trim();
        const loginPassword = document.getElementById("login-password").value;

        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser || storedUser.email !== loginEmail || storedUser.password !== loginPassword) {
            alert("Invalid email or password!");
            return;
        }

        // Store logged-in user info
        localStorage.setItem("loggedInUser", storedUser.username);

        alert("Login successful! Redirecting to home page...");
        window.location.href = "../Main/main.html"; // Redirect to main page
    });
});
