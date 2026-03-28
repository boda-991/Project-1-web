function displayAlljobs() {
  let jobs = loadTable("jobs");
  let list = document.getElementById("jobList") ;
  if (jobs.length === 0) { 
      
      list.innerHTML = "<p style='text-align:center;'>There are no available jobs at the moment.</p>";
      return; // terminate the function
  }

   list.innerHTML = "" ;  // at begining is empty
  for (let i = 0; i < jobs.length; i++){
  
    let job = jobs[i];
    let jobCard = `
            <div class="job-card">
                <h3>${job.title}</h3>
                <a href="job-details.html?jobId=${i}">View Details</a>
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

        if(matchJobTitle&&matchesExp){
            job.originalIndex = i;
          filtered.push(job); 
        }
    }
          renderJobs(filtered) ; //display only the matches result
}
function renderJobs(Array){
    let list = document.getElementById("jobList"); // the place of filtered jobs
    list.innerHTML = ""; // delete all prev jobs
    if(Array.length===0){
        list.innerHTML = "<p>there is no aval jobs </p>"
        return ;
    }
    
  

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
