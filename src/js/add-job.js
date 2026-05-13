function setAddJobFeedback(message, type) {
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

async function createJob(jobData, accessToken) {
    const BASE_URL = window.BASE_URL || "127.0.0.1:8000";
    const response = await fetch(`http://${BASE_URL}/api/jobs/admin/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(jobData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create job');
    }

    return await response.json();
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("job-form");

    if (!form) {
        return;
    }

    resetJobForm(form);

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const currentUser = getCurrentAdminUser();
        if (!currentUser) {
            return;
        }

        const formData = getJobFormData(form);
        const validation = validateJobFormData(formData);

        if (!validation.valid) {
            setAddJobFeedback(validation.message, "error");
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
            await createJob(jobData, currentUser.accessToken);
            setAddJobFeedback("Job created successfully. Redirecting to the dashboard...", "success");
            resetJobForm(form);

            window.setTimeout(function() {
                window.location.href = "admin-dashboard.html";
            }, 900);
        } catch (error) {
            console.error('Error creating job:', error);
            setAddJobFeedback("Failed to create job: " + error.message, "error");
        }
    });
});
