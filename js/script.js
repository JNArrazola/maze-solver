let selectedEntry = null;  
let selectedExit = null;   

function generateAndRandomizeMatrix() {
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;
    const randomness = document.getElementById('randomness').value;
    const matrixContainer = document.getElementById('matrix-container');
    
    matrixContainer.innerHTML = '';
    selectedEntry = null;
    selectedExit = null;

    matrixContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    matrixContainer.style.gridAutoRows = '30px';
    
    const totalCells = rows * cols;
    const wallsCount = Math.floor(totalCells * randomness); 

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cells.push(cell);
        matrixContainer.appendChild(cell);

        cell.addEventListener('click', (event) => {
            if (event.button === 0) { 
                selectEntryOrExit(cell);
            }
        });

        cell.addEventListener('contextmenu', (event) => {
            event.preventDefault(); 
            toggleWall(cell);
        });
    }

    for (let i = 0; i < wallsCount; i++) {
        const randomIndex = Math.floor(Math.random() * totalCells);

        if (cells[randomIndex].classList.contains('wall')) {
            i--;
            continue;
        }
        cells[randomIndex].classList.add('wall');
    }
}

function selectEntryOrExit(cell) {
    if (cell.classList.contains('wall')) {
        return; 
    }

    if (cell === selectedEntry) {
        cell.classList.remove('entry');
        selectedEntry = null;
    } else if (cell === selectedExit) {
        cell.classList.remove('exit');
        selectedExit = null;
    } else if (!selectedEntry) {
        cell.classList.add('entry');
        selectedEntry = cell;
    } else if (!selectedExit) {
        cell.classList.add('exit');
        selectedExit = cell;
    } else {
        alert("Ya has seleccionado una entrada y una salida.");
    }
}

function toggleWall(cell) {
    if (cell.classList.contains('entry') || cell.classList.contains('exit')) {
        return; 
    }

    if (cell.classList.contains('wall')) {
        cell.classList.remove('wall');
    } else {
        cell.classList.add('wall');
    }
}

function updateRandomnessLabel() {
    const randomness = document.getElementById('randomness').value;
    document.getElementById('randomnessValue').textContent = `${Math.floor(randomness * 100)}%`;
}
