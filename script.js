// Maze configurations with additional levels, traps, and collectibles
const levels = [
    {
        maze: [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 4, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 5, 0, 2, 1, 0, 1],
            [1, 1, 1, 0, 0, 6, 1],
            [1, 0, 0, 0, 1, 0, 3],
            [1, 1, 1, 1, 1, 1, 1]
        ],
        lives: 3,
        timeLimit: 30
    },
    {
        maze: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 4, 0, 1, 5, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 3, 1],
            [1, 2, 1, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ],
        lives: 3,
        timeLimit: 45
    },
    {
        maze: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 4, 0, 0, 6, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 1],
            [1, 0, 1, 5, 1, 0, 0, 1, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 1, 3, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 0, 0, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        lives: 3,
        timeLimit: 60
    }
];

let currentLevel = 0;
let maze = levels[currentLevel].maze;
let playerPosition = { x: 1, y: 6 };
let score = 0;
let moves = 0;
let lives = levels[currentLevel].lives;
let time = levels[currentLevel].timeLimit;
let soundEnabled = true;
let musicEnabled = true;
let theme = 'light';
let timer;
let collectedItems = 0;

const scoreDisplay = document.getElementById('score-display');
const movesDisplay = document.getElementById('moves-display');
const timeDisplay = document.getElementById('time-display');
const levelDisplay = document.getElementById('level-display');
const livesDisplay = document.getElementById('lives-display');
const messageDisplay = document.getElementById('message-display');
const miniMapElement = document.getElementById('mini-map');
const backgroundMusic = new Audio('background-music.mp3');

function renderMaze() {
    const mazeElement = document.getElementById('maze');
    mazeElement.innerHTML = ''; // Clear previous maze rendering

    for (let y = 0; y < maze.length; y++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row'); // Add a class for styling rows

        for (let x = 0; x < maze[y].length; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            switch (maze[y][x]) {
                case 1:
                    cell.classList.add('wall');
                    break;
                case 0:
                    cell.classList.add('path');
                    break;
                case 2:
                    cell.classList.add('player');
                    break;
                case 3:
                    cell.classList.add('exit');
                    break;
                case 4:
                    cell.classList.add('trap');
                    break;
                case 5:
                    cell.classList.add('collectible');
                    break;
                case 6:
                    cell.classList.add('power-up');
                    break;
                default:
                    // Handle unexpected values if necessary
                    break;
            }

            rowElement.appendChild(cell);
        }
        mazeElement.appendChild(rowElement);
    }
    renderMiniMap();
}


function renderMiniMap() {
    miniMapElement.innerHTML = '';
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            const miniCell = document.createElement('div');
            miniCell.classList.add('mini-cell');

            if (maze[y][x] === 1) {
                miniCell.classList.add('wall');
            } else if (maze[y][x] === 2) {
                miniCell.classList.add('mini-player');
            } else if (maze[y][x] === 3) {
                miniCell.classList.add('mini-exit');
            } else if (maze[y][x] === 4) {
                miniCell.classList.add('mini-trap');
            } else if (maze[y][x] === 5) {
                miniCell.classList.add('mini-collectible');
            } else if (maze[y][x] === 6) {
                miniCell.classList.add('mini-power-up');
            }

            miniMapElement.appendChild(miniCell);
        }
        miniMapElement.appendChild(document.createElement('br'));
    }
}

// A* Pathfinding Algorithm
function findPath(start, end) {
    const openList = [start];
    const closedList = [];
    const gScores = new Map();
    const fScores = new Map();
    gScores.set(JSON.stringify(start), 0);
    fScores.set(JSON.stringify(start), heuristic(start, end));

    while (openList.length > 0) {
        openList.sort((a, b) => fScores.get(JSON.stringify(a)) - fScores.get(JSON.stringify(b)));
        const current = openList.shift();

        if (current.x === end.x && current.y === end.y) {
            return reconstructPath(current);
        }

        closedList.push(current);

        getNeighbors(current).forEach(neighbor => {
            if (closedList.find(n => n.x === neighbor.x && n.y === neighbor.y)) return;

            const tentativeGScore = gScores.get(JSON.stringify(current)) + 1;
            const neighborKey = JSON.stringify(neighbor);

            if (!openList.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
                openList.push(neighbor);
            } else if (tentativeGScore >= gScores.get(neighborKey)) {
                return;
            }

            gScores.set(neighborKey, tentativeGScore);
            fScores.set(neighborKey, tentativeGScore + heuristic(neighbor, end));
            neighbor.parent = current;
        });
    }

    return [];
}

function heuristic(pos0, pos1) {
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
}

function reconstructPath(current) {
    const path = [];
    while (current.parent) {
        path.push(current);
        current = current.parent;
    }
    return path.reverse();
}

function getNeighbors(position) {
    const { x, y } = position;
    const neighbors = [];

    if (maze[y - 1] && maze[y - 1][x] !== 1) neighbors.push({ x, y: y - 1 });
    if (maze[y + 1] && maze[y + 1][x] !== 1) neighbors.push({ x, y: y + 1 });
    if (maze[y][x - 1] !== undefined && maze[y][x - 1] !== 1) neighbors.push({ x: x - 1, y });
    if (maze[y][x + 1] !== undefined && maze[y][x + 1] !== 1) neighbors.push({ x: x + 1, y });

    return neighbors;
}

function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (maze[newY][newX] !== 1) {
        const oldPosition = { ...playerPosition };
        playerPosition.x = newX;
        playerPosition.y = newY;

        if (maze[newY][newX] === 3) {
            messageDisplay.textContent = 'You escaped!';
            clearInterval(timer);
            goToNextLevel();
        } else if (maze[newY][newX] === 4) {
            lives--;
            livesDisplay.textContent = `Lives: ${lives}`;
            if (lives <= 0) {
                messageDisplay.textContent = 'Game Over';
                resetGame();
            } else {
                messageDisplay.textContent = 'Trap! You lost a life.';
            }
        } else if (maze[newY][newX] === 5) {
            collectedItems++;
            score += 100;
            maze[newY][newX] = 0;
            messageDisplay.textContent = 'You found a collectible!';
        } else if (maze[newY][newX] === 6) {
            lives++;
            maze[newY][newX] = 0;
            messageDisplay.textContent = 'You found a power-up!';
        }

        maze[oldPosition.y][oldPosition.x] = 0;
        maze[playerPosition.y][playerPosition.x] = 2;
        scoreDisplay.textContent = `Score: ${score}`;
        movesDisplay.textContent = `Moves: ${++moves}`;
        renderMaze();
    }
}

function startGame() {
    renderMaze();
    livesDisplay.textContent = `Lives: ${lives}`;
    levelDisplay.textContent = `Level: ${currentLevel + 1}`;
    scoreDisplay.textContent = `Score: ${score}`;
    movesDisplay.textContent = `Moves: ${moves}`;
    timeDisplay.textContent = `Time: ${time}`;
    if (musicEnabled) backgroundMusic.play();

    timer = setInterval(() => {
        time--;
        timeDisplay.textContent = `Time: ${time}`;
        if (time <= 0) {
            messageDisplay.textContent = 'Time\'s up! Game Over.';
            resetGame();
        }
    }, 1000);
}

function goToNextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        maze = levels[currentLevel].maze;
        playerPosition = { x: 1, y: maze.length - 2 };
        lives = levels[currentLevel].lives;
        time = levels[currentLevel].timeLimit;
        moves = 0;
        collectedItems = 0;
        startGame();
    } else {
        messageDisplay.textContent = 'Congratulations! You completed all levels.';
        clearInterval(timer);
    }
}

function resetGame() {
    currentLevel = 0;
    score = 0;
    moves = 0;
    lives = levels[currentLevel].lives;
    time = levels[currentLevel].timeLimit;
    maze = levels[currentLevel].maze;
    playerPosition = { x: 1, y: maze.length - 2 };
    collectedItems = 0;
    startGame();
}

// Keyboard control for player movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') movePlayer(0, -1);
    if (e.key === 'ArrowDown') movePlayer(0, 1);
    if (e.key === 'ArrowLeft') movePlayer(-1, 0);
    if (e.key === 'ArrowRight') movePlayer(1, 0);
});

// Start the game
startGame();
