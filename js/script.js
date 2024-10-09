function generateAndRandomizeMatrix() {
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;
    const randomness = document.getElementById('randomness').value;
    const matrixContainer = document.getElementById('matrix-container');
    
    matrixContainer.innerHTML = '';

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

        cell.addEventListener('click', () => {
            if (cell.classList.contains('wall')) {
                cell.classList.remove('wall');
            } else {
                cell.classList.add('wall');
            }
        });
    }

    for (let i = 0; i < wallsCount; i++) {
        const randomIndex = Math.floor(Math.random() * totalCells);

        if(cells[randomIndex].classList.contains('wall')) {
            i--;
            continue;
        }
        cells[randomIndex].classList.add('wall');
    }
}

function updateRandomnessLabel() {
    const randomness = document.getElementById('randomness').value;
    document.getElementById('randomnessValue').textContent = `${Math.floor(randomness * 100)}%`;
}
