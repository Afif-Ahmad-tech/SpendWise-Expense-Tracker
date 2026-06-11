document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        //  Local Storage
        const user = { username, email, password };
        localStorage.setItem("user", JSON.stringify(user));

        alert("Sign-up successful! Redirecting to login page...");
        window.location.href = "Login/login.html"; // Redirect to login page
    });
});
