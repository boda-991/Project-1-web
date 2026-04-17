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

function getActiveAdminJobs() {
    return loadTable("jobs")
        .map(function(job, index) {
            return { job: job, index: index };
        })
        .filter(function(entry) {
            return entry.job && !entry.job.deleted;
        });
}

function getJobStatus(job) {
    const rawStatus = typeof job.status === "string" ? job.status.trim() : "";
    return rawStatus || "Open";
}

function renderDashboardStats(activeJobs, applications) {
    const openJobs = activeJobs.filter(function(entry) {
        return getJobStatus(entry.job).toLowerCase() !== "closed";
    });

    const closedJobs = activeJobs.filter(function(entry) {
        return getJobStatus(entry.job).toLowerCase() === "closed";
    });

    document.getElementById("totalJobs").textContent = String(activeJobs.length);
    document.getElementById("openJobs").textContent = String(openJobs.length);
    document.getElementById("closedJobs").textContent = String(closedJobs.length);
    document.getElementById("totalApplications").textContent = String(applications.length);
}

function renderDashboardTable(activeJobs) {
    const tableBody = document.getElementById("adminJobTable");
    const emptyState = document.getElementById("dashboardEmptyState");
    const tableWrap = document.querySelector(".admin-table-wrap");

    tableBody.innerHTML = "";

    if (activeJobs.length === 0) {
        emptyState.style.display = "grid";
        tableWrap.hidden = true;
        return;
    }

    emptyState.style.display = "none";
    tableWrap.hidden = false;

    activeJobs.forEach(function(entry) {
        const status = getJobStatus(entry.job);
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${entry.job.title}</td>
            <td>${entry.job.company}</td>
            <td>${formatAdminDate(entry.job.date)}</td>
            <td><span class="status-pill ${status.toLowerCase() === "closed" ? "status-pill--closed" : "status-pill--open"}">${status}</span></td>
            <td>${entry.job.experience || 0} years</td>
            <td>
                <div class="table-actions">
                    <a class="btnSecondary uLink" href="edit-job.html?jobId=${entry.index}">Edit</a>
                    <button class="btn btn-danger" type="button" data-delete-job="${entry.index}">Delete</button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function refreshAdminDashboard() {
    const activeJobs = getActiveAdminJobs();
    const applications = loadTable("applications");

    renderDashboardStats(activeJobs, applications);
    renderDashboardTable(activeJobs);
}

function deleteAdminJob(jobId) {
    const jobs = loadTable("jobs");
    const job = jobs[jobId];

    if (!job || job.deleted) {
        return;
    }

    job.deleted = true;
    job.status = "Closed";
    saveTable("jobs", jobs);
    refreshAdminDashboard();
}

document.addEventListener("DOMContentLoaded", function() {
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

        deleteAdminJob(jobId);
    });
});
