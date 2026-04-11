function closeDialogue(idd) {
    //console.log(document.querySelector(`#${idd}`).parentElement.parentElement);
    document.querySelector(`#${idd}`).style.display = "none";
    document.querySelector(`#${idd}`).parentElement.parentElement.style.display = "none";
}

function openDialogue(idd) {
    document.querySelector(`#${idd}`).parentElement.parentElement.style.display = "block";
    document.querySelector(`#${idd}`).style.display = "block";
}

function closeAllDialogues() {
    let dialogues = document.querySelectorAll(".dBox");
    dialogues.forEach(d => {
        d.style.display = "none";
        d.parentElement.parentElement.style.display = "none";
    });
}

function saveTable(tableName, tableObj) {
    localStorage.setItem(tableName, JSON.stringify(tableObj));
}

function loadTable(tableName) {
    return JSON.parse(localStorage.getItem(tableName));
}