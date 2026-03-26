const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let currentJobID = urlParams.get("jobId");

function fetchJobDetails(jobID) {
    let jobs = JSON.parse(localStorage.getItem("jobs"));
    let job = jobs[jobID];
    if (job === null) {
        console.error("no job with the ID:" + jobID + "was found");
    }
    if (job.status === 0) {
        return null;
    }
    return job
}

function populateJobDetails(job) {
    document.querySelector("#jobTitle").innerText = job.title;
    document.querySelector("#companyName").innerText = job.company;
    document.querySelector("#workingHours").innerText = job.workingHourse;
    const formattedDate = new Date(job.date).toLocaleDateString();

    document.querySelector("#jobDate").innerText = formattedDate;
    document.querySelector("#jobDescCont").innerHTML = `<p>Job Descriprion:</p> ${job.description}`;
    
}

function findApplicationDuplicates(applications, username) {
    for(i=0; i<applications.length; i++) {
        if (applications[i].username === username) {
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

function apply() {
    let jobID = currentJobID;
    let formData = getFormData();
    console.log(formData);
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let apps = loadTable("applications");
    if (findApplicationDuplicates(apps, currentUser.username)) {
        throw "you have already applied to this job";
    }
    
    let appEntry = {"jobID": toString(jobID),
        "username": currentUser.username,
        "date": Date.now,
        "formData": formData,
    }

    apps.push(appEntry);

    saveTable("applications", apps);

}

function main() {
    
    populateJobDetails(fetchJobDetails(currentJobID));
}



window.onload = main;