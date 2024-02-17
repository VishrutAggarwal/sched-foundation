// Author: Vishrut Aggarwal
const amRow = document.getElementById('am-row');
const pmRow = document.getElementById('pm-row');
const hrRow = document.getElementById('hrs-row');
let tileCounter = 0;
let tiles = [];
const catCreate = document.getElementById('categoryCreationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const tileName = document.getElementById('tileName').value;
    const focusLvl = document.getElementById('focusLvl').value;

    document.getElementById('tileName').value = '';
    document.getElementById('focusLvl').value = '';

    const formData = {
        tileName: tileName,
        focusLvl: focusLvl
    };

    saveFormData(formData);

    createTileOptions();
});

const tileCreate = document.getElementById('tileCreationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const tileCategory = document.getElementById('tileCategory').value;

    const tile = createTile(tileCategory);
    document.getElementById('newTiles').appendChild(tile);
});

// Function to delete a category
// const catDelete = document.getElementById('categoryDeletionForm').addEventListener('submit', function(event) {
//     event.preventDefault();
    
//     const tileOptions = JSON.parse(localStorage.getItem('categoryData')) || [];
//     const scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || {am: [], pm: []};
//     const tileCategory = document.getElementById('deleteCategory').value;

//     for(let i = 0; i < tileOptions.length; i++) {
//         if(tileOptions[i].tileName.toLowerCase() === tileCategory) {
//             tileOptions.splice(i, 1);
//             console.log(tileOptions)
//             localStorage.setItem('categoryData', JSON.stringify(tileOptions));
//             createTileOptions();
//             return;
//         }
//     }

//     for(let i = 0; i < scheduleData.am.length; i++) {
//         if(Object.values(scheduleData.am[i])[0] === tileCategory) {
//             scheduleData.am.splice(i, 1);
//             localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
//             return;
//         }
//     }

//     for(let i = 0; i < scheduleData.pm.length; i++) {
//         if(Object.values(scheduleData.pm[i])[0] === tileCategory) {
//             scheduleData.pm.splice(i, 1);
//             localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
//             return;
//         }
//     }

// });

// Function to delete a tile from right clicking tile
// function deleteTile(event) {
//     if(event.button === 2) {
//         event.preventDefault();
//         console.log(event.target)
//         event.target.remove();
//     }
//     const deletedTiles = document.getElementsByClassName('deleted');
//     const scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || {am: [], pm: []};
// }

// Function to create a tile
function createTile(tileName) {
    tileCounter++;

    if(tiles.length >= 24) {
        alert('You can only add 24 tiles to the schedule');
        return;
    }

    const tileOptions = JSON.parse(localStorage.getItem('categoryData')) || [];
    const tileCategory = tileName;

    for(let i = 0; i < tileOptions.length; i++) {
        if(tileOptions[i].tileName.toLowerCase() === tileCategory) {
            const tile = document.createElement('div');
            const focusLvl = tileOptions[i].focusLvl;
            tile.classList.add('tile', focusLvl.toLowerCase(), tileName.toLowerCase());
            tile.innerText = tileName.toUpperCase();
            tile.id = `tile-${tileCounter}`;
            tile.draggable = true;
            tile.addEventListener('dragstart', handleDragStart);
            tile.addEventListener('click', deleteTile);
            tiles.push(tileName)
            return tile;
        }
    }
}

// Function to create tile options
function  createTileOptions() {
    const tileOptions = JSON.parse(localStorage.getItem('categoryData')) || [];

    const tileCategory = document.getElementById('tileCategory');
    tileCategory.innerHTML = '';

    const deleteCategory = document.getElementById('deleteCategory');
    deleteCategory.innerHTML = '';

    for(let i = 0; i < tileOptions.length; i++) {
        const option = document.createElement('option');
        option.value = tileOptions[i].tileName.toLowerCase();
        option.textContent = tileOptions[i].tileName;
        option.classList.add(tileOptions[i].focusLvl.toLowerCase());
        tileCategory.appendChild(option);
        deleteCategory.appendChild(option.cloneNode(true));
    }

    const savedSchedule = JSON.parse(localStorage.getItem('scheduleData'));
    if(savedSchedule) {
        for(let i = 0; i < savedSchedule.am.length; i++) {
            const tileName = Object.values(savedSchedule.am[i])[0];
            const tileHr = Object.keys(savedSchedule.am[i])[0];

            const tile = createTile(tileName);
            document.getElementById(`am-box-${tileHr}`).appendChild(tile);
        }

        for(let i = 0; i < savedSchedule.pm.length; i++) {
            const tileName = Object.values(savedSchedule.pm[i])[0];
            const tileHr = Object.keys(savedSchedule.pm[i])[0];

            const tile = createTile(tileName);
            document.getElementById(`pm-box-${tileHr}`).appendChild(tile);
        }
    }
}

// Function to save the form data
function saveFormData(formData) {
    const storedFormData = JSON.parse(localStorage.getItem('categoryData')) || [];

    storedFormData.push(formData);

    localStorage.setItem('categoryData', JSON.stringify(storedFormData));
}

// Function to create the drop boxes
function createDropBoxes() {
    for(let i = 1; i < 13; i++) {
        const amBox = document.createElement('div');
        amBox.id = `am-box-${i}`;
        amBox.addEventListener('dragover', handleDragOver);
        amBox.addEventListener('drop', handleDrop);
        amRow.appendChild(amBox);
    }
    
    for(let i = 1; i < 13; i++) {
        const pmBox = document.createElement('div');
        pmBox.id = `pm-box-${i}`;
        pmBox.addEventListener('dragover', handleDragOver);
        pmBox.addEventListener('drop', handleDrop);
        pmRow.appendChild(pmBox);
    }

    for(let i = 1; i < 13; i++) {
        const hrbox = document.createElement('p');
        hrbox.id = `hr-box-${i}`;
        hrbox.innerText = `${i}`;
        hrRow.appendChild(hrbox);
    }
}

// Function to save the schedule data
function saveScheduleData(scheduleData) {
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
}

// Function to handle the drag start event
function handleDragStart(event) {
    event.dataTransfer.setData('text/html', event.target.id);
}

// Function to handle the drag over event
function handleDragOver(event) {
    event.preventDefault();
}

// Function to handle the drop event and save schedule changes
function handleDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/html');
    const draggableElement = document.getElementById(data);
    event.target.appendChild(draggableElement);

    const scheduleData  = {
        am: [],
        pm: []
    }

    for(let i = 1; i < 13; ++i) {
        const amBoxChild = amRow.childNodes[i].childNodes;
        if(amBoxChild.length > 0) {
            const tileName = amBoxChild[0].innerText.toLowerCase();
            let tile = {};
            tile[i] = tileName;
            scheduleData.am.push(tile);
        }
    }

    for(let i = 1; i < 13; ++i) {
        const pmBoxChild = pmRow.childNodes[i].childNodes;
        if(pmBoxChild.length > 0) {
            const tileName = pmBoxChild[0].innerText.toLowerCase();
            let tile = {};
            tile[i] = tileName;
            scheduleData.pm.push(tile);
        }
    }
    
    saveScheduleData(scheduleData);
}

window.onload = createDropBoxes();
window.onload = createTileOptions();





// const tile = document.getElementById(`tile-${tileName}`);
// if(tile) {
//     tile.remove();
// }