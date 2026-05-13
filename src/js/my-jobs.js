async function displayAppliedJobs() {
    const tableBody = document.getElementById('application-table');
    tableBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

    try {
        const response = await fetch('http://127.0.0.1:8000/api/applications/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            alert("Session expired. Please login again.");
            window.location.href = "login.html";
            return;
        }

        const applications = await response.json();
        tableBody.innerHTML = '';

        if (applications.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">You haven\'t applied to any jobs yet.</td></tr>';
            return;
        }

        applications.forEach((app) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${app.job_title}</td>
                <td>${app.job_company}</td>
                <td>${new Date(app.date).toLocaleDateString()}</td>
                <td class="${app.status === 'Pending' ? 'Status1' : 'Status2'}">${app.status}</td>
                <td>
                    <button onclick="withdrawApp(${app.id})" class="btn btn-danger">Withdraw</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error:", error);
        tableBody.innerHTML = '<tr><td colspan="5">Error connecting to server.</td></tr>';
    }
}

async function withdrawApp(appId) {
    if (confirm("Are you sure you want to withdraw?")) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/applications/${appId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                alert("Withdrawn successfully!");
                displayAppliedJobs();
            } else {
                alert("Action failed.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}
window.onload = displayAppliedJobs;