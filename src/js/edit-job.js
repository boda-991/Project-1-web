function setEditJobFeedback(message, type) {
    const feedback = document.getElementById("form-feedback");

    feedback.textContent = message;
    feedback.className = `notice notice--${type}`;
    feedback.hidden = false;
}

function normalizeListValue(value) {
    if (Array.isArray(value)) {
        return value
            .map(function(item) {
                return String(item).trim();
            })
            .filter(Boolean);
    }

    return String(value || "")
        .split(/\r?\n/)
        .map(function(item) {
            return item.trim();
        })
        .filter(Boolean);
}

async function fetchUserJobs(accessToken) {
    const BASE_URL = window.BASE_URL || "127.0.0.1:8000";
    const response = await fetch(`http://${BASE_URL}/api/jobs/admin/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch jobs');
    }

    return await response.json();
}

async function fetchJobDetails(jobId, accessToken) {
    const BASE_URL = window.BASE_URL || "127.0.0.1:8000";
    const response = await fetch(`http://${BASE_URL}/api/jobs/${jobId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch job details');
    }

    return await response.json();
}

async function updateJob(jobId, jobData, accessToken) {
    const BASE_URL = window.BASE_URL || "127.0.0.1:8000";
    const response = await fetch(`http://${BASE_URL}/api/jobs/${jobId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(jobData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update job');
    }

    return await response.json();
}

async function deleteJob(jobId, accessToken) {
    const BASE_URL = window.BASE_URL || "127.0.0.1:8000";
    const response = await fetch(`http://${BASE_URL}/api/jobs/${jobId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete job');
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    const form = document.getElementById("job-form");
    const selector = document.getElementById("jobOptions");
    const deleteButton = document.getElementById("deleteJobBtn");
    const emptyState = document.getElementById("edit-empty-state");

    if (!form || !selector || !deleteButton || !emptyState) {
        return;
    }

    const currentUser = getCurrentAdminUser();
    if (!currentUser) {
        return;
    }

    let jobs = [];

    function setFormDisabled(disabled) {
        const controls = form.querySelectorAll("input, textarea, button");
        controls.forEach(function(control) {
            control.disabled = disabled;
        });
    }

    function getSelectedJobId() {
        return Number(selector.value);
    }

    async function populateSelector(preferredJobId) {
        try {
            jobs = await fetchUserJobs(currentUser.accessToken);

            selector.innerHTML = "";

            if (jobs.length === 0) {
                selector.disabled = true;
                emptyState.style.display = "grid";
                setFormDisabled(true);
                form.style.display = "none";
                return;
            }

            selector.disabled = false;
            form.style.display = "grid";
            emptyState.style.display = "none";
            setFormDisabled(false);

            jobs.forEach(function(job) {
                const option = document.createElement("option");
                option.value = String(job.id);
                option.textContent = `${job.title} - ${job.company}`;
                selector.appendChild(option);
            });

            const canUsePreferred = jobs.some(function(job) {
                return job.id === preferredJobId;
            });

            selector.value = String(canUsePreferred ? preferredJobId : jobs[0].id);
            await populateSelectedJob();
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setEditJobFeedback("Failed to load jobs: " + error.message, "error");
        }
    }

    async function populateSelectedJob() {
        const jobId = getSelectedJobId();

        try {
            const job = await fetchJobDetails(jobId, currentUser.accessToken);
            populateJobForm(form, job);
        } catch (error) {
            console.error('Error fetching job details:', error);
            setEditJobFeedback("Failed to load job details: " + error.message, "error");
        }
    }

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const selectedJobId = getSelectedJobId();

        const formData = getJobFormData(form);
        const validation = validateJobFormData(formData);

        if (!validation.valid) {
            setEditJobFeedback(validation.message, "error");
            return;
        }

        
        const jobData = {
            title: formData.title,
            company: formData.company,
            description: formData.description,
            responsibilities: normalizeListValue(formData.responsibilities),
            skills: normalizeListValue(formData.skills),
            experience: parseInt(formData.experience) || 0,
            working_hours: "Full Time", // Default value
            status: "Open", // Default value
            deleted: false // Default value
        };

        try {
            await updateJob(selectedJobId, jobData, currentUser.accessToken);
            setEditJobFeedback("Job updated successfully.", "success");
            await populateSelector(selectedJobId);
        } catch (error) {
            console.error('Error updating job:', error);
            setEditJobFeedback("Failed to update job: " + error.message, "error");
        }
    });

    deleteButton.addEventListener("click", async function() {
        const selectedJobId = getSelectedJobId();

        if (!window.confirm("Remove this job from active listings?")) {
            return;
        }

        try {
            await deleteJob(selectedJobId, currentUser.accessToken);
            setEditJobFeedback("Job removed from active listings.", "success");
            await populateSelector();
        } catch (error) {
            console.error('Error deleting job:', error);
            setEditJobFeedback("Failed to delete job: " + error.message, "error");
        }
    });

    selector.addEventListener("change", populateSelectedJob);

    const queryParams = new URLSearchParams(window.location.search);
    const preferredJobId = Number(queryParams.get("jobId"));
    await populateSelector(preferredJobId);
});
