let currentUser;
try {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
} catch (e) {
    console.error("Error parsing currentUser from localStorage, User could be logged out:", e);
    currentUser = null;
}

if (!currentUser) {
    document.getElementById("login-link").style.display = "inline";
    document.getElementById("btn-logout").style.display = "none";
} else {
    document.getElementById("login-link").style.display = "none";
    document.getElementById("btn-logout").style.display = "inline";
}

let userRole = currentUser && currentUser.is_admin ? "admin" : "user";

if (userRole === "admin") {
    document.getElementById("admin-dashboard-link").style.display = "inline";
    document.getElementById("post-job-link").style.display = "inline";

    document.getElementById("my-jobs-link").style.display = "none";

} else if (userRole === "user") {
    document.getElementById("my-jobs-link").style.display = "inline";

    document.getElementById("post-job-link").style.display = "none";
    document.getElementById("admin-dashboard-link").style.display = "none";
}


function logout() {
    localStorage.setItem("currentUser", null);
    window.location.href = "../layouts/Login_register.html";
}
