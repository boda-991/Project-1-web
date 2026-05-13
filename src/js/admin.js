function formatAdminDate(dateValue) {
    if (!dateValue) {
        return "Not set";
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
        return "Not set";
    }

    return parsedDate.toLocaleDateString();
}

const BASE_URL = window.BASE_URL || "127.0.0.1:8000";
const API_ROOT = `http://${BASE_URL}`;

function getJobStatus(job) {
    const rawStatus = typeof job.status === "string" ? job.status.trim() : "";
    return rawStatus || "Open";
}

function getCurrentUser() {
    if (typeof getCurrentAdminUser === "function") {
        return getCurrentAdminUser();
    }

    try {
        return JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
        return null;
    }
}

function getAuthHeaders() {
    const currentUser = getCurrentUser();

    if (!currentUser || !currentUser.accessToken) {
        throw new Error("Please sign in as an admin to view this dashboard.");
    }

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentUser.accessToken}`
    };
}

async function fetchAdminJson(path, options) {
    const response = await fetch(`${API_ROOT}${path}`, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...(options && options.headers ? options.headers : {})
        }
    });

    if (!response.ok) {
        let message = `Request failed with status ${response.status}`;

        try {
            const errorData = await response.json();
            message = errorData.detail || message;
        } catch (error) {
            // Use the status message if the backend did not send JSON.
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function renderDashboardStats(stats) {
    document.getElementById("totalJobs").textContent = String(stats.totalJobs || 0);
    document.getElementById("openJobs").textContent = String(stats.openJobs || 0);
    document.getElementById("closedJobs").textContent = String(stats.closedJobs || 0);
    document.getElementById("totalApplications").textContent = String(stats.totalApplications || 0);
}

function renderDashboardTable(jobs) {
    const tableBody = document.getElementById("adminJobTable");
    const emptyState = document.getElementById("dashboardEmptyState");
    const tableWrap = document.querySelector(".admin-table-wrap");

    tableBody.innerHTML = "";

    if (jobs.length === 0) {
        emptyState.style.display = "grid";
        tableWrap.hidden = true;
        return;
    }

    emptyState.style.display = "none";
    tableWrap.hidden = false;

    jobs.forEach(function(job) {
        const status = getJobStatus(job);
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${job.title}</td>
            <td>${job.company || "Unknown"}</td>
            <td>${formatAdminDate(job.date)}</td>
            <td><span class="status-pill ${status.toLowerCase() === "closed" ? "status-pill--closed" : "status-pill--open"}">${status}</span></td>
            <td>${job.experience || 0} years</td>
            <td>
                <div class="table-actions">
                    <a class="btnSecondary uLink" href="edit-job.html?jobId=${job.id}">Edit</a>
                    <button class="btn btn-danger" type="button" data-delete-job="${job.id}">Delete</button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function normalizeListResponse(data) {
    if (Array.isArray(data)) {
        return data;
    }

    return data && Array.isArray(data.results) ? data.results : [];
}

function renderDashboardMessage(message) {
    const tableBody = document.getElementById("adminJobTable");
    const emptyState = document.getElementById("dashboardEmptyState");
    const tableWrap = document.querySelector(".admin-table-wrap");

    tableBody.innerHTML = `<tr><td colspan="6">${message}</td></tr>`;
    emptyState.style.display = "none";
    tableWrap.hidden = false;
}

async function refreshAdminDashboard() {
    renderDashboardMessage("Loading dashboard...");

    try {
        const stats = await fetchAdminJson("/api/jobs/admin/stats/");
        const jobs = await fetchAdminJson("/api/jobs/admin/");

        renderDashboardStats(stats);
        renderDashboardTable(normalizeListResponse(jobs));
    } catch (error) {
        renderDashboardMessage(error.message || "Failed to load dashboard.");
    }
}

async function deleteAdminJob(jobId) {
    await fetchAdminJson(`/api/jobs/${jobId}/`, {
        method: "DELETE"
    });
    await refreshAdminDashboard();
}

document.addEventListener("DOMContentLoaded", function() {
    if (!getCurrentUser()) {
        return;
    }

    const tableBody = document.getElementById("adminJobTable");
    if (!tableBody) {
        return;
    }

    refreshAdminDashboard();

    tableBody.addEventListener("click", function(event) {
        const deleteButton = event.target.closest("[data-delete-job]");

        if (!deleteButton) {
            return;
        }

        const jobId = Number(deleteButton.dataset.deleteJob);
        const confirmed = window.confirm("Remove this job from active listings?");

        if (!confirmed) {
            return;
        }

        deleteButton.disabled = true;
        deleteAdminJob(jobId).catch(function(error) {
            deleteButton.disabled = false;
            renderDashboardMessage(error.message || "Failed to delete job.");
        });
    });
});
