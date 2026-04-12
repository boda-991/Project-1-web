function closeDialogue(idd) {
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
    const tableValue = localStorage.getItem(tableName);

    if (!tableValue) {
        return [];
    }

    try {
        const parsedValue = JSON.parse(tableValue);
        return Array.isArray(parsedValue) ? parsedValue : [];
    } catch (error) {
        console.error(`Unable to parse table "${tableName}".`, error);
        return [];
    }
}
