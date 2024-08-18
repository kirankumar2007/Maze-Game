const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const mazeElement = document.getElementById('maze');
const scoreDisplay = document.getElementById('score-display');
const movesDisplay = document.getElementById('moves-display');
const messageDisplay = document.getElementById('message-display');
let playerPosition = { x: 1, y: 11 };
let score = 0;
let moves = 0;

function renderMaze() {
    mazeElement.innerHTML = '';
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (maze[y][x] === 1) {
                cell.classList.add('wall');
            } else if (maze[y][x] === 0) {
                cell.classList.add('path');
            } else if (maze[y][x] === 2) {
                cell.classList.add('player');
            } else if (maze[y][x] === 3) {
                cell.classList.add('exit');
            }

            mazeElement.appendChild(cell);
        }
        mazeElement.appendChild(document.createElement('br'));
    }
    updateScore();
    updateMoves();
}

function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (maze[newY][newX] !== 1) {
        maze[playerPosition.y][playerPosition.x] = 0;
        playerPosition.x = newX;
        playerPosition.y = newY;
        maze[newY][newX] = 2;
        renderMaze();
        moves++;
        checkWinCondition();
    }
}

function checkWinCondition() {
    if (playerPosition.x === 12 && playerPosition.y === 7) {
        score += 100;
        messageDisplay.textContent = 'Congratulations! You escaped the maze!';
    }
}

function resetGame() {
    playerPosition = { x: 1, y: 11 };
    maze[11][1] = 2;
    maze[7][12] = 3;
    score = 0;
    moves = 0;
    messageDisplay.textContent = '';
    renderMaze();
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateMoves() {
    movesDisplay.textContent = `Moves: ${moves}`;
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

document.getElementById('reset-button').addEventListener('click', resetGame);

renderMaze();
