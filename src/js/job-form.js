(function() {
    const DEFAULT_JOB_VALUES = {
        experience: 0,
        working_hours: "Full Time",
        status: "Open",
        deleted: false
    };

    function getTodayDate() {
        return new Date().toISOString().split("T")[0];
    }

    function formatDateForInput(dateValue) {
        if (!dateValue) {
            return getTodayDate();
        }

        const parsedDate = new Date(dateValue);
        if (Number.isNaN(parsedDate.getTime())) {
            return getTodayDate();
        }

        return parsedDate.toISOString().split("T")[0];
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

    function listToTextarea(value) {
        return normalizeListValue(value).join("\n");
    }

    function getJobFormData(form) {
        return {
            title: form.querySelector("#jtitle").value.trim(),
            company: form.querySelector("#companyP").value.trim(),
            date: form.querySelector("#dateP").value,
            description: form.querySelector("#jobDescP").value.trim(),
            responsibilities: form.querySelector("#responsibilitiesP").value,
            skills: form.querySelector("#skills").value,
            experience: form.querySelector("#experience").value
        };
    }

    function validateJobFormData(formData) {
        if (!formData.title) {
            return { valid: false, message: "Please enter a job title." };
        }

        if (!formData.company) {
            return { valid: false, message: "Please enter the company name." };
        }

        if (!formData.date) {
            return { valid: false, message: "Please select a posted date." };
        }

        if (!formData.description) {
            return { valid: false, message: "Please add a job description." };
        }

        return { valid: true, message: "" };
    }

    function normalizeJobRecord(formData, existingJob) {
        const previousJob = existingJob && typeof existingJob === "object" ? existingJob : {};
        const safeExperience = Number(previousJob.experience) || Number(formData.experience);
        const responsibilitiesSource = Object.prototype.hasOwnProperty.call(formData, "responsibilities")
            ? formData.responsibilities
            : previousJob.responsibilities;
        const skillsSource = Object.prototype.hasOwnProperty.call(formData, "skills")
            ? formData.skills
            : previousJob.skills;

        return {
            title: formData.title || previousJob.title || "Untitled role",
            company: formData.company || previousJob.company || "Talentsy",
            date: formatDateForInput(formData.date || previousJob.date),
            description: formData.description || previousJob.description || "",
            responsibilities: normalizeListValue(responsibilitiesSource),
            skills: normalizeListValue(skillsSource),
            experience: Number.isFinite(safeExperience) ? safeExperience : DEFAULT_JOB_VALUES.experience,
            working_hours: previousJob.working_hours || DEFAULT_JOB_VALUES.working_hours,
            status: previousJob.status || DEFAULT_JOB_VALUES.status,
            deleted: previousJob.deleted === true ? true : DEFAULT_JOB_VALUES.deleted
        };
    }

    function populateJobForm(form, job) {
        form.querySelector("#jtitle").value = job.title || "";
        form.querySelector("#companyP").value = job.company || "";
        form.querySelector("#dateP").value = formatDateForInput(job.date);
        form.querySelector("#jobDescP").value = job.description || "";
        form.querySelector("#responsibilitiesP").value = listToTextarea(job.responsibilities);
        form.querySelector("#skills").value = listToTextarea(job.skills);
    }

    function resetJobForm(form) {
        form.reset();
        form.querySelector("#dateP").value = getTodayDate();
    }

    window.getTodayDate = getTodayDate;
    window.getJobFormData = getJobFormData;
    window.validateJobFormData = validateJobFormData;
    window.normalizeJobRecord = normalizeJobRecord;
    window.populateJobForm = populateJobForm;
    window.resetJobForm = resetJobForm;
})();
