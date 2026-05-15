const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let currentJobID = urlParams.get("jobId");


async function fetchJobDetails(jobID) {
    try {
        const response = await fetch(`http://${BASE_URL}/api/jobs/${jobID}/`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch job details");
        }

        const jobData = await response.json();
        return jobData;
    } catch (error) {
        console.error("Error fetching job details:", error);
        return null;
     }
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
    let applyButton = document.querySelector("#openApplyBtn");
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
    document.querySelector("#workingHours").innerText = job.working_hours || job.workingHourse || "--";
    const formattedDate = new Date(job.date).toLocaleDateString();

    document.querySelector("#jobDate").innerText = formattedDate;
    document.querySelector("#jobDescCont").innerHTML = `<p class='jobDetailsHeader'>Job Descriprion:</p> <p>${parseBreaks(job.description)}</p> <p class='jobDetailsHeader'>Requirements:</p> <div class='jobDetailsList'>${parseList(job.skills)}</div> <p class='jobDetailsHeader'> Responsibilities:<p> <div class='jobDetailsList'>${parseList(job.responsibilities)}</div>`;
    
}



function getFormData() {
    let fname = document.querySelector("#fname").value;
    let lname = document.querySelector("#lname").value;
    let contactInfo = document.querySelector("#contactInfo").value;
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
        "contactInfo": contactInfo,
        "city": city,
        "eduLevel": eduLevel,
        "schoolName": schoolName,
        "yearsOfExperience": yearsOfExperience,
        "employer": employer,
        "jobDesc": jobDesc
    }

    return formData;
}

async function applyToJob() {
    try {
        await apply();
        //alert("Applied successfully");
        closeAllDialogues();
        openDialogue("successDBox");
        
    } catch (e) {
        closeAllDialogues();
        openDialogue("errorDBox");
        document.querySelector("#errorMsg").innerText = e;
        
    }
}

async function apply() {
    let jobID = parseInt(urlParams.get("jobId"));
    let formData = getFormData();
    let currentUser = getCurrentUser();

    if (!currentUser || !currentUser.accessToken) {
        throw "Please sign in before applying.";
    }
    
    const response = await fetch(`http://${BASE_URL}/api/applications/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentUser.accessToken}`
        },
        body: JSON.stringify({
            job: jobID,
            form_data: formData
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw errorData.detail || "Failed to apply for the job.";
    }

}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
        return null;
    }
}

function showApplyError(message) {
    closeAllDialogues();
    openDialogue("errorDBox");
    document.querySelector("#errorMsg").innerText = message;
}

function openApplyForm() {
    const currentUser = getCurrentUser();

    if (!currentUser || !currentUser.accessToken) {
        showApplyError("Please sign in before applying.");
        return;
    }

    openDialogue("apply-dBox");
}

async function main() {
    document.querySelector("#openApplyBtn").addEventListener("click", openApplyForm);
    document.querySelector("#submitApplyBtn").addEventListener("click", async () => {
        await applyToJob();
    });
    populateJobDetails(await fetchJobDetails(currentJobID));
}



window.onload = main;
