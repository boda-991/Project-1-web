function getCurrentAdminUser() {
    let currentUser = null;

    try {
        currentUser = JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
        currentUser = null;
    }

    if (!currentUser || !currentUser.accessToken) {
        window.location.href = "Login_register.html";
        return null;
    }

    if (!currentUser.is_admin) {
        window.location.href = "jobs.html";
        return null;
    }

    return currentUser;
}

window.getCurrentAdminUser = getCurrentAdminUser;
