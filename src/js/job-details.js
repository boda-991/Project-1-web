const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const currentJobID = Number(urlParams.get("jobId"));

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function normalizeList(value) {
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }

    return String(value || "")
        .split(/\r?\n/)
        .map(function(item) {
            return item.trim();
        })
        .filter(Boolean);
}

function fetchJobDetails(jobID) {
    const jobs = loadTable("jobs");
    const job = jobs[jobID];

    if (!job || job.deleted) {
        return null;
    }

    return job;
}

function buildListSection(title, items) {
    if (items.length === 0) {
        return "";
    }

    return `
        <h4>${escapeHtml(title)}</h4>
        <ul>
            ${items.map(function(item) {
                return `<li>${escapeHtml(item)}</li>`;
            }).join("")}
        </ul>
    `;
}

function populateJobDetails(job) {
    const applyButton = document.querySelector("button.btn[onclick*='openDialogue']");
    const jobDescCont = document.querySelector("#jobDescCont");

    if (!job) {
        document.querySelector("#jobTitle").innerText = "Job Not Available";
        document.querySelector("#companyName").innerText = "This listing is no longer active.";
        document.querySelector("#workingHours").innerText = "--";
        document.querySelector("#jobDate").innerText = "--";
        jobDescCont.innerHTML = "<p>This job could not be found or has been removed from active listings.</p>";

        if (applyButton) {
            applyButton.disabled = true;
            applyButton.classList.add("btn--disabled");
            applyButton.textContent = "Unavailable";
        }

        return;
    }

    const formattedDate = job.date ? new Date(job.date).toLocaleDateString() : "Not set";
    const responsibilities = normalizeList(job.responsibilities);
    const skills = normalizeList(job.skills);

    document.querySelector("#jobTitle").innerText = job.title || "Untitled role";
    document.querySelector("#companyName").innerText = job.company || "Talentsy";
    document.querySelector("#workingHours").innerText = job.workingHourse || "Full Time";
    document.querySelector("#jobDate").innerText = formattedDate;
    jobDescCont.innerHTML = `
        <p>Job Description:</p>
        <p>${escapeHtml(job.description || "No description available yet.")}</p>
        ${buildListSection("Key Responsibilities", responsibilities)}
        ${buildListSection("Required Skills and Qualifications", skills)}
    `;
}

function findApplicationDuplicates(applications, username, jobID) {
    for (let i = 0; i < applications.length; i++) {
        if (applications[i].username === username && Number(applications[i].jobID) === Number(jobID)) {
            return true;
        }
    }
    return false;
}

function getFormData() {
    const citySelectedIdx = document.querySelector("#cityOptions").selectedIndex;
    const eduLevelSelectedIdx = document.querySelector("#degreeOptions").selectedIndex;

    return {
        fname: document.querySelector("#fname").value,
        lname: document.querySelector("#lname").value,
        city: document.querySelector("#cityOptions").options[citySelectedIdx].text,
        eduLevel: document.querySelector("#degreeOptions").options[eduLevelSelectedIdx].text,
        schoolName: document.querySelector("#uni").value,
        yearsOfExperience: document.querySelector("#YOE").value,
        employer: document.querySelector("#prevEmployerName").value,
        jobDesc: document.querySelector("#prevJobDesc").value
    };
}

function applyToJob() {
    try {
        apply();
        //alert("Applied successfully");
        closeAllDialogues();
        openDialogue("successDBox");
        
    } catch (e) {
        closeAllDialogues();
        openDialogue("errorDBox");
        document.querySelector("#errorMsg").innerText = e;
        
    }
}

function apply() {
    const job = fetchJobDetails(currentJobID);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!job) {
        throw "This job is no longer available.";
    }

    if (!currentUser || !currentUser.username) {
        throw "Please sign in before applying.";
    }

    const formData = getFormData();
    const apps = loadTable("applications");

    if (findApplicationDuplicates(apps, currentUser.username, currentJobID)) {
        throw "You have already applied to this job.";
    }

    const appEntry = {
        jobID: Number(currentJobID),
        username: currentUser.username,
        date: Date.now(),
        formData: formData
    };

    apps.push(appEntry);
    saveTable("applications", apps);
}

function main() {
    populateJobDetails(fetchJobDetails(currentJobID));
}

window.apply = apply;
window.applyToJob = applyToJob;
document.addEventListener("DOMContentLoaded", main);
