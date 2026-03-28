// JavaScript for handling the login and registration logic

// Handles the UI transitions between Sign In and Sign Up forms
const signUpButton = document.getElementById('signUpBtn');
        const signInButton = document.getElementById('signInBtn');
        const container = document.getElementById('container');

        // Switches the visual state to "Sign Up"
        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });

        // Switches the visual state back to "Sign In"
        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });

        // Handles the conditional visibility of the Company input
        function toggleCompanyField() {
            const accountType = document.getElementById('accountType').value;
            const companyDiv = document.getElementById('companyField');
            
            if (accountType === 'admin') {
                companyDiv.style.display = 'block';
            } else {
                companyDiv.style.display = 'none';
            }
        }

// Register logic: Validates input and stores user data in localStorage
document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPass").value;
    const confirm = document.getElementById("regConfirm").value;
    const company = document.getElementById("companyInput").value;

    if (pass !== confirm) {
        alert("Passwords do not match");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(u => u.email === email);

    if (exists) {
        alert("User already exists");
        return;
    }

    users.push({ name, email, password: pass, company });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered successfully");
    setTimeout(() => { document.getElementById("registerForm").reset(); }, 1000);
    window.location.href = "Login_register.html";
});

// Login logic: Validates credentials against stored user data in localStorage
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("logEmail").value;
    const pass = document.getElementById("logPass").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email && u.password === pass);

    if (user) {
        alert("Login success: " + user.name);
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "admin-dashboard.html";

    } else {
        alert("Invalid email or password");
    }
});
