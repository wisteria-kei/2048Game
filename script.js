const grid = document.getElementById("gameGrid");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

const gridSize = 4;
let gridArray = [];
let score = 0;

document.addEventListener('keydown', handleKeyPress);

function initGame() {
    grid.innerHTML = '';
    gridArray = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    score = 0;
    scoreDisplay.textContent = score;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            grid.appendChild(tile);
        }
    }
    addRandomTile();
    addRandomTile();
    renderBoard();
}

function addRandomTile() {
    const emptyTiles = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gridArray[i][j] === 0) emptyTiles.push({ x: i, y: j });
        }
    }

    if (emptyTiles.length > 0) {
        const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        gridArray[x][y] = Math.random() < 0.9 ? 2 : 4;
        renderBoard();
    }
}

function renderBoard() {
    const tiles = grid.getElementsByClassName('tile');
    let tileIndex = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const value = gridArray[i][j];
            const tile = tiles[tileIndex++];
            tile.textContent = value === 0 ? '' : value;
            tile.style.backgroundColor = value ? getTileColor(value) : '#cdc1b4';
        }
    }
}

function getTileColor(value) {
    const colors = {
        2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f',
        64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    return colors[value] || '#cdc1b4';
}

function resetGame() {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.classList.remove('game-over', 'game-win');
    initGame();
    restartButton.style.display = 'none';
}

function showGameOver() {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.classList.add('game-over');
    restartButton.style.display = 'inline-block';
}

function checkGameOver() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gridArray[i][j] === 0) return false;
            if (i < gridSize - 1 && gridArray[i][j] === gridArray[i + 1][j]) return false;
            if (j < gridSize - 1 && gridArray[i][j] === gridArray[i][j + 1]) return false;
        }
    }
    showGameOver();
    return true;
}

function handleKeyPress(e) {
    if (checkGameOver()) return;
    let moved = false;

    switch (e.key) {
        case 'ArrowUp': moved = moveTiles('up'); break;
        case 'ArrowDown': moved = moveTiles('down'); break;
        case 'ArrowLeft': moved = moveTiles('left'); break;
        case 'ArrowRight': moved = moveTiles('right'); break;
    }

    if (moved) {
        addRandomTile();
        checkGameOver();
    }
}

function moveTiles(direction) {
    let moved = false;
    const operations = {
        up: moveUp,
        down: moveDown,
        left: moveLeft,
        right: moveRight
    };

    moved = operations[direction]();
    renderBoard();
    scoreDisplay.textContent = score;
    return moved;
}

function moveUp() {
    return move('up');
}

function moveDown() {
    return move('down');
}

function moveLeft() {
    return move('left');
}

function moveRight() {
    return move('right');
}

function move(direction) {
    let moved = false;
    const isVertical = direction === 'up' || direction === 'down';
    const isReversed = direction === 'down' || direction === 'right';

    for (let i = 0; i < gridSize; i++) {
        let stack = [];
        for (let j = 0; j < gridSize; j++) {
            const x = isVertical ? j : i;
            const y = isVertical ? i : j;

            if (gridArray[x][y] !== 0) stack.push(gridArray[x][y]);
        }

        let newStack = [];
        for (let i = 0; i < stack.length; i++) {
            if (stack[i] === stack[i + 1]) {
                newStack.push(stack[i] * 2);
                score += stack[i] * 2;
                i++;
            } else {
                newStack.push(stack[i]);
            }
        }

        while (newStack.length < gridSize) newStack.push(0);

        for (let j = 0; j < gridSize; j++) {
            const x = isVertical ? j : i;
            const y = isVertical ? i : j;
            if (gridArray[x][y] !== newStack[isReversed ? gridSize - 1 - j : j]) {
                gridArray[x][y] = newStack[isReversed ? gridSize - 1 - j : j];
                moved = true;
            }
        }
    }
    return moved;
}

initGame();
