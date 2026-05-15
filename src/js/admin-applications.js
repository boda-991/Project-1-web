const BASE_URL = window.BASE_URL || "127.0.0.1:8000";
const API_ROOT = `http://${BASE_URL}`;
const queryParams = new URLSearchParams(window.location.search);
const selectedJobId = queryParams.get("jobId");

function getAuthHeaders() {
    const currentUser = getCurrentAdminUser();

    if (!currentUser || !currentUser.accessToken) {
        throw new Error("Please sign in as an admin to view applications.");
    }

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentUser.accessToken}`
    };
}

async function fetchAdminApplications() {
    const response = await fetch(`${API_ROOT}/api/applications/`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        let message = `Request failed with status ${response.status}`;

        try {
            const errorData = await response.json();
            message = errorData.detail || message;
        } catch (error) {
            // Keep the status message when the response is not JSON.
        }

        throw new Error(message);
    }

    return response.json();
}

function formatDate(dateValue) {
    const parsedDate = new Date(dateValue);

    if (!dateValue || Number.isNaN(parsedDate.getTime())) {
        return "Not set";
    }

    return parsedDate.toLocaleDateString();
}

function formatFormData(formData) {
    if (!formData || typeof formData !== "object") {
        return "No details submitted.";
    }

    const fullName = [formData.fname, formData.lname].filter(Boolean).join(" ");
    const details = [
        fullName ? `Name: ${fullName}` : "",
        formData.contactInfo ? `Contact: ${formData.contactInfo}` : "",
        formData.city ? `City: ${formData.city}` : "",
        formData.eduLevel ? `Education: ${formData.eduLevel}` : "",
        formData.schoolName ? `School: ${formData.schoolName}` : "",
        formData.yearsOfExperience ? `Experience: ${formData.yearsOfExperience} years` : "",
        formData.employer ? `Previous employer: ${formData.employer}` : "",
        formData.jobDesc ? `Previous work: ${formData.jobDesc}` : ""
    ].filter(Boolean);

    return details.length ? details.join("<br>") : "No details submitted.";
}

function renderApplicationsMessage(message) {
    const tableBody = document.getElementById("adminApplicationsTable");
    const emptyState = document.getElementById("applicationsEmptyState");
    const tableWrap = document.querySelector(".admin-table-wrap");

    tableBody.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
    emptyState.style.display = "none";
    tableWrap.hidden = false;
}

function renderApplications(applications) {
    const tableBody = document.getElementById("adminApplicationsTable");
    const emptyState = document.getElementById("applicationsEmptyState");
    const tableWrap = document.querySelector(".admin-table-wrap");

    const visibleApplications = selectedJobId
        ? applications.filter(function(application) {
            return String(application.job) === String(selectedJobId);
        })
        : applications;

    tableBody.innerHTML = "";

    if (visibleApplications.length === 0) {
        emptyState.style.display = "grid";
        tableWrap.hidden = true;
        return;
    }

    emptyState.style.display = "none";
    tableWrap.hidden = false;

    visibleApplications.forEach(function(application) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${application.job_title || "Unknown job"}</td>
            <td>${application.username || "Unknown applicant"}</td>
            <td>${formatDate(application.date)}</td>
            <td><span class="status-pill status-pill--open">${application.status || "Pending"}</span></td>
            <td>${formatFormData(application.form_data)}</td>
        `;

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", async function() {
    if (!getCurrentAdminUser()) {
        return;
    }

    renderApplicationsMessage("Loading applications...");

    try {
        const applications = await fetchAdminApplications();
        renderApplications(Array.isArray(applications) ? applications : []);
    } catch (error) {
        renderApplicationsMessage(error.message || "Failed to load applications.");
    }
});
