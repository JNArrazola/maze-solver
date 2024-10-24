let selectedEntry;  
let selectedExit;   
let isAlgorithmRunning;
let cellsMatrix = []; 

function generateAndRandomizeMatrix() {
    selectedEntry = null;
    selectedExit = null;
    isAlgorithmRunning = false;

    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;

    const randomness = document.getElementById('randomness').value;
    const matrixContainer = document.getElementById('matrix-container');
    
    matrixContainer.innerHTML = '';
    selectedEntry = null;
    selectedExit = null;

    matrixContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    matrixContainer.style.gridAutoRows = '30px';

    cellsMatrix = Array.from({ length: rows }, () => Array(cols).fill(null)); 

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cellsMatrix[i][j] = cell; 
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
    }

    const totalCells = rows * cols;
    const wallsCount = Math.floor(totalCells * randomness);

    for (let i = 0; i < wallsCount; i++) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);

        if (cellsMatrix[randomRow][randomCol].classList.contains('wall')) {
            i--;
            continue;
        }
        cellsMatrix[randomRow][randomCol].classList.add('wall');
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
        cell.style.backgroundColor = 'white'; 
    } 
    else if (cell === selectedExit) {
        cell.classList.remove('exit');
        selectedExit = null; 
        cell.style.backgroundColor = 'white'; 
    } 
    else if (!selectedEntry) {
        cell.classList.add('entry');
        selectedEntry = cell; 
        cell.style.backgroundColor = 'green'; 
    } 
    else if (!selectedExit) {
        cell.classList.add('exit');
        selectedExit = cell; 
        cell.style.backgroundColor = 'red'; 
    } 
    else {
        alert("Ya has seleccionado una entrada y una salida.");
    }
}

function toggleWall(cell) {
    if (cell.classList.contains('entry') || cell.classList.contains('exit')) {
        return; 
    }

    if (cell.classList.contains('wall')) {
        cell.classList.remove('wall');
        cell.style.backgroundColor = 'white'; 
    } else {
        cell.classList.add('wall');
        cell.style.backgroundColor = 'black';
    }
}

function updateRandomnessLabel() {
    const randomness = document.getElementById('randomness').value;
    document.getElementById('randomnessValue').textContent = `${Math.floor(randomness * 100)}%`;
}

function convertToBinaryMatrix() {
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;

    let binaryMatrix = [];
    
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            const cell = cellsMatrix[i][j];
            
            if (cell.classList.contains('wall')) 
                row.push(1);  
            else 
                row.push(0);  
        }
        binaryMatrix.push(row);
    }
    
    return binaryMatrix;
}

async function solveBFS() {
    if(isAlgorithmRunning) {
        alert("Ya hay un algoritmo en ejecución.");
        return;
    }

    if(!selectedEntry || !selectedExit) {
        alert("Selecciona una entrada y una salida antes de validar el laberinto.");
        return false;
    }
    
    if (validateMaze() === false) {
        return;
    }
    
    resetCells();

    isAlgorithmRunning = true;

    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);

    let entryPosition, exitPosition;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (cellsMatrix[i][j] === selectedEntry) {
                entryPosition = [i, j];
            }
            if (cellsMatrix[i][j] === selectedExit) {
                exitPosition = [i, j];
            }
        }
    }

    const directions = [
        [0, 1],    // Right
        [1, 0],    // Down
        [-1, 0],   // Up
        [0, -1]    // Left
    ];

    const queue = [[entryPosition, []]];
    const visited = new Set();
    visited.add(entryPosition.toString());

    let previousNode = null;  
    
    while (queue.length > 0) {
        const [[currentRow, currentCol], path] = queue.shift();  
        const currentCell = cellsMatrix[currentRow][currentCol];

        if (previousNode && !previousNode.classList.contains('entry') && !previousNode.classList.contains('exit')) {
            previousNode.style.backgroundColor = 'yellow';
        }

        if (!currentCell.classList.contains('entry') && !currentCell.classList.contains('exit')) {
            currentCell.style.backgroundColor = "#f58c24";  
        }

        await delay(100); 

        if (currentRow === exitPosition[0] && currentCol === exitPosition[1]) {
            await highlightPath(path);
            return;
        }
        
        for (let [dx, dy] of directions) {
            const newRow = currentRow + dx;
            const newCol = currentCol + dy;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const nextCell = cellsMatrix[newRow][newCol];

                if (!visited.has([newRow, newCol].toString()) && !nextCell.classList.contains('wall')) {
                    visited.add([newRow, newCol].toString());
                    queue.push([[newRow, newCol], [...path, [currentRow, currentCol]]]);
                }
            }
        }

        previousNode = currentCell;
    }

    if (previousNode) 
        previousNode.style.backgroundColor = 'yellow';

    isAlgorithmRunning = false;
    alert("No se encontró un camino.");
}

async function solveDFS() {
    if(isAlgorithmRunning) {
        alert("Ya hay un algoritmo en ejecución.");
        return;
    }
    
    if(!selectedEntry || !selectedExit) {
        alert("Selecciona una entrada y una salida antes de validar el laberinto.");
        return false;
    }

    if (validateMaze() === false) {
        return;
    }

    isAlgorithmRunning = true;
    resetCells();

    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);

    let entryPosition, exitPosition;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (cellsMatrix[i][j] === selectedEntry) {
                entryPosition = [i, j];
            }
            if (cellsMatrix[i][j] === selectedExit) {
                exitPosition = [i, j];
            }
        }
    }

    const directions = [
        [0, 1],    // Right
        [1, 0],    // Down
        [-1, 0],   // Up
        [0, -1]    // Left
    ];

    const stack = [[entryPosition, []]];
    const visited = new Set();
    visited.add(entryPosition.toString());

    let previousNode = null;  
    
    while (stack.length > 0) {
        const [[currentRow, currentCol], path] = stack.pop();  
        const currentCell = cellsMatrix[currentRow][currentCol];

        if (previousNode && !previousNode.classList.contains('entry') && !previousNode.classList.contains('exit')) {
            previousNode.style.backgroundColor = 'yellow';
        }

        if (!currentCell.classList.contains('entry') && !currentCell.classList.contains('exit')) {
            currentCell.style.backgroundColor = "#f58c24";  
        }

        await delay(100); 

        if (currentRow === exitPosition[0] && currentCol === exitPosition[1]) {
            await highlightPath(path);
            return;
        }
        
        for (let [dx, dy] of directions) {
            const newRow = currentRow + dx;
            const newCol = currentCol + dy;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const nextCell = cellsMatrix[newRow][newCol];

                if (!visited.has([newRow, newCol].toString()) && !nextCell.classList.contains('wall')) {
                    visited.add([newRow, newCol].toString());
                    stack.push([[newRow, newCol], [...path, [currentRow, currentCol]]]);
                }
            }
        }

        previousNode = currentCell;
    }

    if (previousNode) 
        previousNode.style.backgroundColor = 'yellow';
    isAlgorithmRunning = false;
    alert("No se encontró un camino.");
}

async function solveAStar() {
    if(isAlgorithmRunning) {
        alert("Ya hay un algoritmo en ejecución.");
        return;
    }

    if(!selectedEntry || !selectedExit) {
        alert("Selecciona una entrada y una salida antes de validar el laberinto.");
        return false;
    }

    if (validateMaze() === false) {
        return;
    }

    isAlgorithmRunning = true;
    resetCells();

    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);

    let entryPosition, exitPosition;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (cellsMatrix[i][j] === selectedEntry) {
                entryPosition = [i, j];
            }
            if (cellsMatrix[i][j] === selectedExit) {
                exitPosition = [i, j];
            }
        }
    }

    const directions = [
        [0, 1],    // Right
        [1, 0],    // Down
        [-1, 0],   // Up
        [0, -1]    // Left
    ];

    const openSet = new PriorityQueue();
    openSet.enqueue([entryPosition, []], 0);

    const gScore = Array(rows).fill(null).map(() => Array(cols).fill(Infinity));
    gScore[entryPosition[0]][entryPosition[1]] = 0;

    const visited = new Set();
    let previousNode = null;  
    
    while (!openSet.isEmpty()) {
        const [[currentRow, currentCol], path] = openSet.dequeue();
        const currentCell = cellsMatrix[currentRow][currentCol];

        if (previousNode && !previousNode.classList.contains('entry') && !previousNode.classList.contains('exit')) {
            previousNode.style.backgroundColor = 'yellow';
        }

        if (!currentCell.classList.contains('entry') && !currentCell.classList.contains('exit')) {
            currentCell.style.backgroundColor = "#f58c24";  
        }

        await delay(100);

        if (currentRow === exitPosition[0] && currentCol === exitPosition[1]) {
            await highlightPath(path);
            return;
        }

        visited.add([currentRow, currentCol].toString());

        for (let [dx, dy] of directions) {
            const newRow = currentRow + dx;
            const newCol = currentCol + dy;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const nextCell = cellsMatrix[newRow][newCol];

                if (!visited.has([newRow, newCol].toString()) && !nextCell.classList.contains('wall')) {
                    const tentativeGScore = gScore[currentRow][currentCol] + 1;

                    if (tentativeGScore < gScore[newRow][newCol]) {
                        gScore[newRow][newCol] = tentativeGScore;
                        const fScore = tentativeGScore + manhattanDistance(newRow, newCol, exitPosition[0], exitPosition[1]);
                        openSet.enqueue([[newRow, newCol], [...path, [currentRow, currentCol]]], fScore);
                    }
                }
            }
        }

        previousNode = currentCell;
    }

    if (previousNode) 
        previousNode.style.backgroundColor = 'yellow';
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

    for (let [row, col] of path) {
        const cell = cellsMatrix[row][col];
        
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
    for (let row of cellsMatrix) {
        for (let cell of row) {
            if (cell.classList.contains('entry')) {
                cell.style.backgroundColor = 'green'; 
            } else if (cell.classList.contains('exit')) {
                cell.style.backgroundColor = 'red';   
            } else if (cell.style.backgroundColor === 'yellow' || cell.style.backgroundColor === 'lightblue') {
                cell.style.backgroundColor = 'white'; 
            }
        }
    }
}

function clearMaze() {
    if(isAlgorithmRunning) {
        alert("Ya hay un algoritmo en ejecución.");
        return;
    }

    for (let row of cellsMatrix) {
        for (let cell of row) {
            if (cell.classList.contains('entry')) {
                cell.classList.remove('entry');  
                cell.style.backgroundColor = 'white'; 
            } else if (cell.classList.contains('exit')) {
                cell.classList.remove('exit');   
                cell.style.backgroundColor = 'white'; 
            } else if (cell.style.backgroundColor === 'yellow' || cell.style.backgroundColor === 'lightblue') {
                cell.style.backgroundColor = 'white';  
            }
        }
    }

    selectedEntry = null;
    selectedExit = null;
}

async function validateMaze() {
    if(isAlgorithmRunning) 
        return false;
    

    if(!selectedEntry || !selectedExit) {
        alert("Selecciona una entrada y una salida antes de validar el laberinto.");
        return false;
    }

    isAlgorithmRunning = true;
    return true;
}
