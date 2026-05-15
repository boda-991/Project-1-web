function getCurrentAdminUser() {
    let currentUser = null;

    try {
        currentUser = JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
        currentUser = null;
    }

        if (!currentUser || !currentUser.accessToken) {
        const directToken = localStorage.getItem("access_token");
        if (directToken) {
            currentUser = {
                accessToken: directToken,
                refreshToken: localStorage.getItem("refresh_token"),
                is_admin: true  // You might need to check this
            };
        }
    }
    if (!currentUser || !currentUser.accessToken) {
        window.location.href = "/login-register/";
        return null;
    }

    if (!currentUser.is_admin) {
        window.location.href = "/api/jobs/adminDashboard/";
        return null;
    }

    return currentUser;
}

window.getCurrentAdminUser = getCurrentAdminUser;
