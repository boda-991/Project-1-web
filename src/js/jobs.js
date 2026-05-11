const BASE_URL = window.BASE_URL || "127.0.0.1:8000";
const API_ROOT = `http://${BASE_URL}`;
let allJobs = [];

async function displayAllJobs() {
    const jobList = document.getElementById("jobList");
    if (!jobList) return;

    try {
        const response = await fetch(`${API_ROOT}/api/jobs/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        allJobs = Array.isArray(data) ? data : (data.results || []);
        renderJobs(allJobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        jobList.innerHTML = "<p class='no-results' style='text-align:center;'>Failed to load jobs. Please try again later.</p>";
    }
}

function renderJobs(jobs) {
    const list = document.getElementById("jobList");
    if (!list) return;

    const visibleJobs = Array.isArray(jobs)
        ? jobs.filter(job => !job.deleted)
        : [];

    if (visibleJobs.length === 0) {
        list.innerHTML = "<p class='no-results' style='text-align:center;'>There are no available jobs at the moment.</p>";
        return;
    }

    list.innerHTML = visibleJobs.map(job => {
        return `
            <div class="job-card">
                <h3>${job.title || "Untitled Job"}</h3>
                <p>Company: ${job.company || "Unknown"}</p>
                <p>Experience: ${job.experience || 0} Years</p>
                <a href="job-details.html?jobId=${job.id}" class="view-btn">View Details</a>
            </div>
        `;
    }).join("");
}

function filterJobs(searchValue, expValue) {
    const filtered = allJobs.filter(job => {
        if (!job || job.deleted) return false;

        const matchesTitle = !searchValue || job.title?.toLowerCase().includes(searchValue.toLowerCase());
        const matchesExperience = !expValue || parseInt(job.experience, 10) <= parseInt(expValue, 10);

        return matchesTitle && matchesExperience;
    });

    renderJobs(filtered);
}

window.addEventListener("DOMContentLoaded", () => {
    displayAllJobs();

    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", event => {
            event.preventDefault();
            const titleValue = document.getElementById("searchID")?.value || "";
            const expValue = document.getElementById("searchexp")?.value || "";
            filterJobs(titleValue, expValue);
        });
    }

    const searchInput = document.getElementById("searchID");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const titleValue = searchInput.value || "";
            const expValue = document.getElementById("searchexp")?.value || "";
            filterJobs(titleValue, expValue);
        });
    }
});