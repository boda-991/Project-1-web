function getActiveJobs() {
    return loadTable("jobs")
        .map(function(job, index) {
            if (!job || job.deleted) {
                return null;
            }

            return Object.assign({}, job, { originalIndex: index });
        })
        .filter(function(job) {
            return Boolean(job);
        });
}

function renderJobs(jobArray) {
    const list = document.getElementById("jobList");
    list.innerHTML = "";

    if (jobArray.length === 0) {
        list.innerHTML = "<p class='no-results'>There are no available jobs at the moment.</p>";
        return;
    }

    jobArray.forEach(function(job) {
        const experienceText = `${job.experience || 0} Years Experience`;
        const companyText = job.company ? `<p>${job.company}</p>` : "";

        list.innerHTML += `
            <div class="job-card">
                <h3>${job.title}</h3>
                ${companyText}
                <p>${experienceText}</p>
                <a href="job-details.html?jobId=${job.originalIndex}" class="view-btn">View Details</a>
            </div>
        `;
    });
}

function displayAllJobs() {
    renderJobs(getActiveJobs());
}

function filterMyJobs(searchValue, expValue) {
    const filtered = getActiveJobs().filter(function(job) {
        const matchesTitle = job.title.toLowerCase().includes(searchValue.toLowerCase());
        const numericExp = Number(expValue);
        const matchesExp = expValue === "" || job.experience <= numericExp;

        return matchesTitle && matchesExp;
    });

    renderJobs(filtered);
}

document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchID");
    const expInput = document.getElementById("searchexp");

    if (!searchForm || !searchInput || !expInput) {
        return;
    }

    displayAllJobs();

    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        filterMyJobs(searchInput.value, expInput.value);
    });

    searchInput.addEventListener("input", function() {
        filterMyJobs(searchInput.value, expInput.value);
    });

    expInput.addEventListener("input", function() {
        filterMyJobs(searchInput.value, expInput.value);
    });
});
