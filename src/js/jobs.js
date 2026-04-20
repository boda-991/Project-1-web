function displayAlljobs() {
  let jobs = loadTable("jobs");
     
  let list = document.getElementById("jobList") ;
 let activeJobs = [];
  for (let i = 0; i < jobs.length; i++) {
      if (!jobs[i].deleted) {
          let jobCopy = jobs[i];
          jobCopy.originalIndex = i; 
          activeJobs.push(jobCopy);
      }
  }

  if (activeJobs.length === 0) { 
      list.innerHTML = "<p class='no-results' style='text-align:center;'>There are no available jobs at the moment.</p>";
      return;
  }

  list.innerHTML = "";
  for (let i = 0; i < activeJobs.length; i++) {
    let job = activeJobs[i];
    let jobCard = `
            <div class="job-card">
                <h3>${job.title}</h3>
                <p>Experience: ${job.experience} Years</p>
                <a href="job-details.html?jobId=${job.originalIndex}" class="view-btn">View Details</a>
            </div>
        `;
    list.innerHTML += jobCard;
  }
} 
window.onload = displayAlljobs ; 

const search = document.getElementById("searchForm") ;
search.addEventListener("submit" ,  function(e) {
    e.preventDefault() ;
    let input = document.getElementById("searchID").value;
    let expyears = document.getElementById("searchexp").value ; 
    filterMyjobs(input , expyears) ;
} ) ;

const searchInput = document.getElementById("searchID");
searchInput.addEventListener("input", function() {
    let input = searchInput.value; 
    let expyears = document.getElementById("searchexp").value;
    filterMyjobs(input, expyears);
});

function filterMyjobs(searchValue , expValue){
    let jobs = loadTable("jobs");
    let filtered = [] ; //the filtered jobs

    for(let i = 0 ; i < jobs.length ; i++){
        let job = jobs[i] ;
        let matchJobTitle = job.title.toLowerCase().includes(searchValue.toLowerCase());
        let matchesExp = (expValue === "") || (parseInt(job.experience) <= parseInt(expValue));
        let isNotDeleted = !job.deleted; 

        if(matchJobTitle && matchesExp && isNotDeleted){
            job.originalIndex = i;
          filtered.push(job); 
        }
    }
          renderJobs(filtered) ; //display only the matches result
}
function renderJobs(Array){
    let list = document.getElementById("jobList"); // the place of filtered jobs
    list.innerHTML = " "; // delete all prev jobs
    
   if (Array.length === 0) {
    list.innerHTML = "<p class='no-results'  style='text-align:center;' >There are no available jobs at the moment.</p>";
    return;
}

    displayAllJobs();

    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        filterMyJobs(searchInput.value, expInput.value);
    });

    searchInput.addEventListener("input", function() {
        filterMyJobs(searchInput.value, expInput.value);
    });

    expInput.addEventListener("input", function() {
        filterMyJobs(searchInput.value, expInput.value);
});
    for(let i = 0 ; i<Array.length ; i++) {

        let job = Array[i] ;
       let idToSend;

       if (job.originalIndex !== undefined) {
    idToSend = job.originalIndex; 
} else {
    idToSend = i; 
}
        list.innerHTML += `
    <div class="job-card">
        <h3>${job.title}</h3>
        <p>Experience: ${job.experience} Years</p>
        <a href="job-details.html?jobId=${idToSend}" class="view-btn">View Details</a>
    </div>
`;
    }
}
