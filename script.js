const levels = [
    {
        maze: [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 0, 0, 0, 1],
            [1, 2, 0, 0, 1, 0, 3],
            [1, 1, 1, 1, 1, 1, 1]
        ],
        lives: 3,
        timeLimit: 30
    },
    {
        maze: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 3, 1],
            [1, 2, 1, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ],
        lives: 3,
        timeLimit: 45
    }
];

let currentLevel = 0;
let maze = levels[currentLevel].maze;
let playerPosition = { x: 1, y: 5 };
let score = 0;
let moves = 0;
let lives = levels[currentLevel].lives;
let time = levels[currentLevel].timeLimit;
let soundEnabled = true;
let musicEnabled = true;
let timer;

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
            } else if (maze[y][x] === 4) {
                cell.classList.add('trap');
            }

            mazeElement.appendChild(cell);
        }
        mazeElement.appendChild(document.createElement('br'));
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
                miniCell.classList.add('mini-wall');
            } else if (maze[y][x] === 2) {
                miniCell.classList.add('mini-player');
            } else if (maze[y][x] === 3) {
                miniCell.classList.add('mini-exit');
            }

            miniMapElement.appendChild(miniCell);
        }
        miniMapElement.appendChild(document.createElement('br'));
    }
}

function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (maze[newY][newX] !== 1) {
        if (maze[newY][newX] === 3) {
            score += 100;
            moves++;
            nextLevel();
        } else {
            maze[playerPosition.y][playerPosition.x] = 0;
            playerPosition.x = newX;
            playerPosition.y = newY;
            maze[playerPosition.y][playerPosition.x] = 2;
            score += 10;
            moves++;
            renderMaze();
        }
    }

    scoreDisplay.textContent = `Score: ${score}`;
    movesDisplay.textContent = `Moves: ${moves}`;
    timeDisplay.textContent = `Time: ${time}s`;
    livesDisplay.textContent = `Lives: ${lives}`;
}

function nextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
        maze = levels[currentLevel].maze;
        playerPosition = { x: 1, y: 5 };
        scoreDisplay.textContent = `Score: ${score}`;
        movesDisplay.textContent = `Moves: ${moves}`;
        levelDisplay.textContent = `Level: ${currentLevel + 1}`;
        livesDisplay.textContent = `Lives: ${lives}`;
        time = levels[currentLevel].timeLimit;
        renderMaze();
        messageDisplay.textContent = 'Level Up!';
    } else {
        messageDisplay.textContent = 'Congratulations! You completed all levels!';
        clearInterval(timer);
    }
}

function resetGame() {
    currentLevel = 0;
    maze = levels[currentLevel].maze;
    playerPosition = { x: 1, y: 5 };
    score = 0;
    moves = 0;
    lives = levels[currentLevel].lives;
    time = levels[currentLevel].timeLimit;
    renderMaze();
    messageDisplay.textContent = 'Game reset!';
    timer = setInterval(updateTime, 1000);
}

function updateTime() {
    time--;
    timeDisplay.textContent = `Time: ${time}s`;

    if (time <= 0) {
        lives--;
        if (lives > 0) {
            resetGame();
            messageDisplay.textContent = 'Out of time! Try again.';
        } else {
            messageDisplay.textContent = 'Game Over!';
            clearInterval(timer);
        }
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('sound-toggle').textContent = soundEnabled ? 'Mute Sound' : 'Unmute Sound';
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (musicEnabled) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
    document.getElementById('music-toggle').textContent = musicEnabled ? 'Mute Music' : 'Unmute Music';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') movePlayer(0, -1);
    if (event.key === 'ArrowDown') movePlayer(0, 1);
    if (event.key === 'ArrowLeft') movePlayer(-1, 0);
    if (event.key === 'ArrowRight') movePlayer(1, 0);
});

document.getElementById('reset-button').addEventListener('click', resetGame);
document.getElementById('next-level-button').addEventListener('click', nextLevel);
document.getElementById('pause-button').addEventListener('click', () => clearInterval(timer));
document.getElementById('resume-button').addEventListener('click', () => timer = setInterval(updateTime, 1000));
document.getElementById('sound-toggle').addEventListener('click', toggleSound);
document.getElementById('music-toggle').addEventListener('click', toggleMusic);

resetGame();
