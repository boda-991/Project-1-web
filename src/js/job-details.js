const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let currentJobID = urlParams.get("jobId");


function fetchJobDetails(jobID) {
    const jobs = loadTable("jobs");
    const job = jobs[jobID];

    if (!job || job.deleted) {
        return null;
    }

    return job;
}

function parseList(listArr) {
    if (!listArr || listArr.length === 0) {
        return "<p>None specified.</p>";
    }

    return "<ul>" + listArr.map(item => `<li>${item}</li>`).join("") + "</ul>";
}

function parseBreaks(text) {
    if (!text) {
        return "";
    }

    return text.replace(/\n/g, "<br>");
}

function populateJobDetails(job) {
    let jobDescCont = document.querySelector("#jobDescCont");
    let applyButton = document.querySelector("#applyBtn");
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

    document.querySelector("#jobTitle").innerText = job.title;
    document.querySelector("#companyName").innerText = job.company;
    document.querySelector("#workingHours").innerText = job.workingHourse;
    const formattedDate = new Date(job.date).toLocaleDateString();

    document.querySelector("#jobDate").innerText = formattedDate;
    document.querySelector("#jobDescCont").innerHTML = `<p class='jobDetailsHeader'>Job Descriprion:</p> <p>${parseBreaks(job.description)}</p> <p class='jobDetailsHeader'>Requirements:</p> <div class='jobDetailsList'>${parseList(job.skills)}</div> <p class='jobDetailsHeader'> Responsibilities:<p> <div class='jobDetailsList'>${parseList(job.responsibilities)}</div>`;
    
}

function findApplicationDuplicates(applications, username, jobID) {
    for(let i=0; i<applications.length; i++) {
        if (applications[i].username === username && applications[i].jobID === parseInt(jobID)) {
            return true;
        }
    }
    return false;
}

function getFormData() {
    let fname = document.querySelector("#fname").value;
    let lname = document.querySelector("#lname").value;
    let citySelectedIdx = document.querySelector("#cityOptions").selectedIndex;
    let eduLevelSelectedIdx = document.querySelector("#degreeOptions").selectedIndex;
    let city = document.querySelector("#cityOptions").options[citySelectedIdx].text;
    let eduLevel = document.querySelector("#degreeOptions").options[eduLevelSelectedIdx].text;
    let schoolName = document.querySelector("#uni").value;
    let yearsOfExperience = document.querySelector("#YOE").value;
    let employer = document.querySelector("#prevEmployerName").value;
    let jobDesc = document.querySelector("#prevJobDesc").value;

    let formData = {
        "fname": fname,
        "lname": lname,
        "city": city,
        "eduLevel": eduLevel,
        "schoolName": schoolName,
        "yearsOfExperience": yearsOfExperience,
        "employer": employer,
        "jobDesc": jobDesc
    }

    return formData;
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
    let jobID = parseInt(urlParams.get("jobId"));
    let formData = getFormData();
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let apps = loadTable("applications");
    let jobs = loadTable("jobs");
    let job = jobs[jobID];

    if (!job || job.deleted) {
        throw "This job is no longer available.";
    }

    if (!currentUser || !currentUser.username) {
        throw "Please sign in before applying.";
    }

    if (findApplicationDuplicates(apps, currentUser.username, jobID)) {
        throw "you have already applied to this job";
    }
    //jobID as an integer, not a string
    let appEntry = {"jobID": parseInt(jobID),
        "username": currentUser.username,
        "date": Date.now(),
        "formData": formData,
    }

    apps.push(appEntry);

    saveTable("applications", apps);

}

function main() {
    
    populateJobDetails(fetchJobDetails(currentJobID));
}



window.onload = main;