function setAddJobFeedback(message, type) {
    const feedback = document.getElementById("form-feedback");

    feedback.textContent = message;
    feedback.className = `notice notice--${type}`;
    feedback.hidden = false;
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("job-form");

    if (!form) {
        return;
    }

    resetJobForm(form);

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = getJobFormData(form);
        const validation = validateJobFormData(formData);

        if (!validation.valid) {
            setAddJobFeedback(validation.message, "error");
            return;
        }

        const jobs = loadTable("jobs");
        jobs.push(normalizeJobRecord(formData));
        saveTable("jobs", jobs);

        setAddJobFeedback("Job saved successfully. Redirecting to the dashboard...", "success");
        resetJobForm(form);

        window.setTimeout(function() {
            window.location.href = "admin-dashboard.html";
        }, 900);
    });
});
