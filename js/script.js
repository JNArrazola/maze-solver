let selectedEntry = null;  
let selectedExit = null;   
let isAlgorithmRunning = false;

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

    document.getElementById('algorithm-buttons').style.display = 'block';
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

function convertToBinaryMatrix() {
    const matrixContainer = document.getElementById('matrix-container');
    const cells = Array.from(matrixContainer.children);
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;
    
    let binaryMatrix = [];
    
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            const cell = cells[i * cols + j];
            
            if (cell.classList.contains('wall')) 
                row.push(1);  
            else 
                row.push(0);  
            
        }
        binaryMatrix.push(row);
    }
    
    return binaryMatrix;
}

// Asynchronous BFS function with delay
async function solveBFS() {
    if(isAlgorithmRunning) {
        alert("Ya hay un algoritmo en ejecución.");
        return;
    }
    
    resetCells();
    isAlgorithmRunning = true;

    const matrixContainer = document.getElementById('matrix-container');
    const cells = Array.from(matrixContainer.children);
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    
    if (!selectedEntry || !selectedExit) {
        alert("Selecciona una entrada y una salida antes de ejecutar BFS.");
        return;
    }

    const entryIndex = cells.indexOf(selectedEntry);
    const exitIndex = cells.indexOf(selectedExit);
    
    const directions = [
        [0, 1],    // Right
        [1, 0],    // Down
        [-1, 0],   // Up
        [0, -1]    // Left
    ];

    const queue = [[entryIndex, []]];  // Cola para BFS (almacena el índice actual y el camino recorrido)
    const visited = new Set();
    visited.add(entryIndex);
    
    while (queue.length > 0) {
        const [currentIndex, path] = queue.shift();  
        
        if (currentIndex === exitIndex) {
            await highlightPath(path);
            return;
        }
        
        for (let [dx, dy] of directions) {
            const currentRow = Math.floor(currentIndex / cols);
            const currentCol = currentIndex % cols;
            const newRow = currentRow + dx;
            const newCol = currentCol + dy;
            const newIndex = newRow * cols + newCol;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const nextCell = cells[newIndex];

                if (!visited.has(newIndex) && !nextCell.classList.contains('wall')) {
                    visited.add(newIndex);
                    queue.push([newIndex, [...path, currentIndex]]);
                    
                    if(!nextCell.classList.contains('entry') && !nextCell.classList.contains('exit'))
                        nextCell.style.backgroundColor = 'yellow';
                    await delay(100);  
                }
            }
        }
    }

    alert("No se encontró un camino.");
    isAlgorithmRunning = false;
}

async function solveDFS() {
    if(isAlgorithmRunning) {
        alert("Ya hay un algoritmo en ejecución.");
        return;
    }

    isAlgorithmRunning = true;
    resetCells();

    
    const matrixContainer = document.getElementById('matrix-container');
    const cells = Array.from(matrixContainer.children);
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    
    if (!selectedEntry || !selectedExit) {
        alert("Selecciona una entrada y una salida antes de ejecutar DFS.");
        return;
    }

    const entryIndex = cells.indexOf(selectedEntry);
    const exitIndex = cells.indexOf(selectedExit);
    
    const directions = [
        [0, 1],    // Right
        [1, 0],    // Down
        [-1, 0],   // Up
        [0, -1]    // Left
    ];

    const stack = [[entryIndex, []]];
    const visited = new Set();
    visited.add(entryIndex);
    
    while (stack.length > 0) {
        const [currentIndex, path] = stack.pop();
        
        if (currentIndex === exitIndex) {
            await highlightPath(path);
            return;
        }

        for (let [dx, dy] of directions) {
            const currentRow = Math.floor(currentIndex / cols);
            const currentCol = currentIndex % cols;
            const newRow = currentRow + dx;
            const newCol = currentCol + dy;
            const newIndex = newRow * cols + newCol;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const nextCell = cells[newIndex];

                if (!visited.has(newIndex) && !nextCell.classList.contains('wall')) {
                    visited.add(newIndex);
                    stack.push([newIndex, [...path, currentIndex]]);
                    
                    if(!nextCell.classList.contains('entry') && !nextCell.classList.contains('exit'))
                        nextCell.style.backgroundColor = 'yellow';
                    await delay(100);
                }
            }
        }
    }

    alert("No se encontró un camino.");
}

async function solveAStar() {
    if(isAlgorithmRunning) {
        alert("Ya hay un algoritmo en ejecución.");
        return;
    }

    isAlgorithmRunning = true;
    
    resetCells();

    const matrixContainer = document.getElementById('matrix-container');
    const cells = Array.from(matrixContainer.children);
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    
    if (!selectedEntry || !selectedExit) {
        alert("Selecciona una entrada y una salida antes de ejecutar A*.");
        return;
    }

    const entryIndex = cells.indexOf(selectedEntry);
    const exitIndex = cells.indexOf(selectedExit);
    const exitRow = Math.floor(exitIndex / cols);
    const exitCol = exitIndex % cols;

    const directions = [
        [0, 1],    // Right
        [1, 0],    // Down
        [-1, 0],   // Up
        [0, -1]    // Left
    ];

    const openSet = new PriorityQueue();
    openSet.enqueue([entryIndex, []], 0);

    const gScore = Array(rows * cols).fill(Infinity);
    gScore[entryIndex] = 0;

    const visited = new Set();
    
    while (!openSet.isEmpty()) {
        const [currentIndex, path] = openSet.dequeue();
        
        if (currentIndex === exitIndex) {
            await highlightPath(path);
            return;
        }

        visited.add(currentIndex);

        for (let [dx, dy] of directions) {
            const currentRow = Math.floor(currentIndex / cols);
            const currentCol = currentIndex % cols;
            const newRow = currentRow + dx;
            const newCol = currentCol + dy;
            const newIndex = newRow * cols + newCol;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const nextCell = cells[newIndex];

                if (!visited.has(newIndex) && !nextCell.classList.contains('wall')) {
                    const tentativeGScore = gScore[currentIndex] + 1;

                    if (tentativeGScore < gScore[newIndex]) {
                        gScore[newIndex] = tentativeGScore;
                        const fScore = tentativeGScore + manhattanDistance(newRow, newCol, exitRow, exitCol);
                        openSet.enqueue([newIndex, [...path, currentIndex]], fScore);

                        if(!nextCell.classList.contains('entry') && !nextCell.classList.contains('exit')) 
                            nextCell.style.backgroundColor = 'yellow';
                        await delay(100);
                    }
                }
            }
        }
    }

    alert("No se encontró un camino.");
    isAlgorithmRunning = false;
}

function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(item, priority) {
        this.elements.push({ item, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().item;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}


async function highlightPath(path) {
    const matrixContainer = document.getElementById('matrix-container');
    const cells = Array.from(matrixContainer.children);

    for (let index of path) {
        const cell = cells[index];
        
        if (!cell.classList.contains('entry') && !cell.classList.contains('exit')) 
            cell.style.backgroundColor = 'lightblue';  
        

        await delay(50);  
    }
    isAlgorithmRunning = false;
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetCells() {
    const matrixContainer = document.getElementById('matrix-container');
    const cells = Array.from(matrixContainer.children);
    
    cells.forEach(cell => {
        if (cell.classList.contains('entry')) {
            cell.style.backgroundColor = 'green'; 
        } else if (cell.classList.contains('exit')) {
            cell.style.backgroundColor = 'red';   
        } else if (cell.style.backgroundColor === 'yellow' || cell.style.backgroundColor === 'lightblue') {
            cell.style.backgroundColor = 'white'; 
        }
    });
}

