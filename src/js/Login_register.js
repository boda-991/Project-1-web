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
    const username = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPass").value;
    const confirm = document.getElementById("regConfirm").value;
    const company = document.getElementById("companyInput").value;
    const accountType = document.getElementById("accountType").value;
    let is_admin = false;

    if (accountType === "admin" && company.trim() === "") {
        alert("Company name is required for admin accounts");
        return;
    }

    if (accountType === "admin") {
        is_admin = true;
    } else if (accountType === "user") {
        is_admin = false;
    }


    if (pass !== confirm) {
        alert("Passwords do not match");
        return;
    }

    /*let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(u => u.username === username);

    if (exists) {
        alert("User already exists");
        return;
    }

    users.push({ name, username, password: pass, company, is_admin });

    localStorage.setItem("users", JSON.stringify(users));
    */
    register(username, username, pass, confirm, is_admin, company)
    .then(result => {
        alert("Registered successfully");
        setTimeout(() => { document.getElementById("registerForm").reset(); }, 1000);
        window.location.href = "Login_register.html";
    })
    .catch(error => {
        alert("Registration failed: " + error.message);
        return;
    });
    
});

// Login logic: Validates credentials against stored user data in localStorage
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("logEmail").value;
    const pass = document.getElementById("logPass").value;

    /*let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.username === username && u.password === pass);
    */
    login(username, pass)
    .then(user => {
        alert("Login successful: " + user.username);
        localStorage.setItem("currentUser", JSON.stringify(user));
        if (user.is_admin) {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href="jobs.html";
        }
    })
    .catch(error => {
         alert("Login failed: " + error.message);
         return;
    });
})
