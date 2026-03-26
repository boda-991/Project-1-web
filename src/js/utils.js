function closeDialogue(idd) {
    //console.log(document.querySelector(`#${idd}`).parentElement.parentElement);
    document.querySelector(`#${idd}`).style.display = "none";
    document.querySelector(`#${idd}`).parentElement.parentElement.style.display = "none";
}

function openDialogue(idd) {
    document.querySelector(`#${idd}`).parentElement.parentElement.style.display = "block";
    document.querySelector(`#${idd}`).style.display = "block";
}