function loadTable(key) {
    let data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function displayAppliedJobs() {
    const tableBody = document.getElementById('application-table');
    const applications = loadTable("applications"); 
    const allJobs = loadTable("jobs"); 
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); 
    tableBody.innerHTML = '';
    const myApps = applications.filter(app => app.username === currentUser.username);
    if (myApps.length === 0) {
        tableBody.innerHTML = `
        <tr>
        <td colspan="5">You haven\'t applied to any jobs yet.</td>
        </tr>`;
        return;
    }
    myApps.forEach((app, index) => {
        const jobDetails = allJobs[app.jobID]; 
        if (jobDetails) {
            const row = document.createElement('tr');
            const isArchived = jobDetails.deleted === true;
            const statusClass = isArchived ? 'Status2' : 'Status1';
            const statusText = isArchived ? 'Archived' : 'Pending';
            row.innerHTML = `
                <td>${jobDetails.title}</td>
                <td>${jobDetails.company}</td>
                <td>${new Date(app.date).toLocaleDateString()}</td>
                <td class="${statusClass}">${statusText}</td>
                <td>
                    <button onclick="withdrawApp(${index})" class="btn btn-danger">Withdraw</button>
                </td>
            `;
            tableBody.appendChild(row);
        }
    });
}

function withdrawApp(indexInMyApps) {
    if (confirm("Are you sure you want to withdraw?")) {
        let applications = loadTable("applications");
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        let realIndex = applications.findIndex((app, i) => 
            app.username === currentUser.username && i === indexInMyApps
        );
        if (realIndex > -1) {
            applications.splice(realIndex, 1);
            localStorage.setItem("applications", JSON.stringify(applications));
            displayAppliedJobs();
        }
    }
}
window.onload = displayAppliedJobs;
