function setEditJobFeedback(message, type) {
    const feedback = document.getElementById("form-feedback");

    feedback.textContent = message;
    feedback.className = `notice notice--${type}`;
    feedback.hidden = false;
}

function getEditableJobs() {
    return loadTable("jobs")
        .map(function(job, index) {
            return { job: job, index: index };
        })
        .filter(function(entry) {
            return entry.job && !entry.job.deleted;
        });
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("job-form");
    const selector = document.getElementById("jobOptions");
    const deleteButton = document.getElementById("deleteJobBtn");
    const emptyState = document.getElementById("edit-empty-state");
    if (!form || !selector || !deleteButton || !emptyState) {
        return;
    }

    function setFormDisabled(disabled) {
        const controls = form.querySelectorAll("input, textarea, button");
        controls.forEach(function(control) {
            control.disabled = disabled;
        });
    }

    function getSelectedJobId() {
        return Number(selector.value);
    }

    function populateSelector(preferredJobId) {
        const jobs = getEditableJobs();
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

        jobs.forEach(function(entry) {
            const option = document.createElement("option");
            option.value = String(entry.index);
            option.textContent = `${entry.job.title} - ${entry.job.company}`;
            selector.appendChild(option);
        });

        const canUsePreferred = jobs.some(function(entry) {
            return entry.index === preferredJobId;
        });

        selector.value = String(canUsePreferred ? preferredJobId : jobs[0].index);
        populateSelectedJob();
    }

    function populateSelectedJob() {
        const jobs = loadTable("jobs");
        const job = jobs[getSelectedJobId()];

        if (!job || job.deleted) {
            populateSelector();
            return;
        }

        populateJobForm(form, job);
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const selectedJobId = getSelectedJobId();
        const jobs = loadTable("jobs");
        const currentJob = jobs[selectedJobId];

        if (!currentJob || currentJob.deleted) {
            setEditJobFeedback("This job is no longer available to edit.", "error");
            populateSelector();
            return;
        }

        const formData = getJobFormData(form);
        const validation = validateJobFormData(formData);

        if (!validation.valid) {
            setEditJobFeedback(validation.message, "error");
            return;
        }

        jobs[selectedJobId] = normalizeJobRecord(formData, currentJob);
        jobs[selectedJobId].deleted = false;
        saveTable("jobs", jobs);

        setEditJobFeedback("Job updated successfully.", "success");
        populateSelector(selectedJobId);
    });

    deleteButton.addEventListener("click", function() {
        const selectedJobId = getSelectedJobId();
        const jobs = loadTable("jobs");
        const currentJob = jobs[selectedJobId];

        if (!currentJob || currentJob.deleted) {
            setEditJobFeedback("This job is no longer available to delete.", "error");
            populateSelector();
            return;
        }

        if (!window.confirm("Remove this job from active listings?")) {
            return;
        }

        currentJob.deleted = true;
        currentJob.status = "Closed";
        saveTable("jobs", jobs);
        setEditJobFeedback("Job removed from active listings.", "success");
        populateSelector();
    });

    selector.addEventListener("change", populateSelectedJob);

    const queryParams = new URLSearchParams(window.location.search);
    const preferredJobId = Number(queryParams.get("jobId"));
    populateSelector(preferredJobId);
});
