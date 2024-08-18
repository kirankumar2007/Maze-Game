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
        timeLimit: 60,
        lives: 3,
        scoreMultiplier: 1
    },
    {
        maze: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 2, 0, 0, 0, 0, 0, 0, 3, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        timeLimit: 50,
        lives: 2,
        scoreMultiplier: 2
    },
    // Add more levels here if desired
];

let currentLevel = 0;
let maze = levels[currentLevel].maze;
let playerPosition = { x: 1, y: 5 };
let score = 0;
let moves = 0;
let time = 0;
let lives = levels[currentLevel].lives;
let timer;
let soundEnabled = true;
let musicEnabled = false;
let moveSound = new Audio('move.mp3');
let collisionSound = new Audio('collision.mp3');
let backgroundMusic = new Audio('background.mp3');

const mazeElement = document.getElementById('maze');
const scoreDisplay = document.getElementById('score-display');
const movesDisplay = document.getElementById('moves-display');
const timeDisplay = document.getElementById('time-display');
const livesDisplay = document.getElementById('lives-display');
const levelDisplay = document.getElementById('level-display');
const messageDisplay = document.getElementById('message-display');
const soundToggle = document.getElementById('sound-toggle');
const musicToggle = document.getElementById('music-toggle');

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
}

function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (maze[newY][newX] !== 1) {
        if (maze[newY][newX] === 0) {
            score += 10 * levels[currentLevel].scoreMultiplier;
        } else if (maze[newY][newX] === 3) {
            score += 100 * levels[currentLevel].scoreMultiplier;
            if (currentLevel < levels.length - 1) {
                messageDisplay.textContent = 'Level Complete! Proceed to the next level!';
                clearInterval(timer);
            } else {
                messageDisplay.textContent = 'Congratulations! You completed all levels!';
                clearInterval(timer);
            }
            return;
        }

        maze[playerPosition.y][playerPosition.x] = 0;
        playerPosition.x = newX;
        playerPosition.y = newY;
        maze[newY][newX] = 2;
        moves++;
        renderMaze();

        if (soundEnabled) {
            moveSound.play();
        }
    } else {
        if (soundEnabled) {
            collisionSound.play();
        }
        lives--;
        livesDisplay.textContent = `Lives: ${lives}`;
        if (lives === 0) {
            messageDisplay.textContent = 'Game Over!';
            clearInterval(timer);
        }
    }

    updateUI();
}

function updateUI() {
    scoreDisplay.textContent = `Score: ${score}`;
    movesDisplay.textContent = `Moves: ${moves}`;
    levelDisplay.textContent = `Level: ${currentLevel + 1}`;
}

function startTimer() {
    time = levels[currentLevel].timeLimit;
    timeDisplay.textContent = `Time: ${time}s`;
    timer = setInterval(() => {
        time--;
        timeDisplay.textContent = `Time: ${time}s`;
        if (time === 0) {
            clearInterval(timer);
            messageDisplay.textContent = 'Time\'s up! Game Over!';
        }
    }, 1000);
}

function resetGame() {
    currentLevel = 0;
    maze = levels[currentLevel].maze;
    playerPosition = { x: 1, y: 5 };
    score = 0;
    moves = 0;
    lives = levels[currentLevel].lives;
    messageDisplay.textContent = '';
    clearInterval(timer);
    startTimer();
    renderMaze();
    updateUI();
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        maze = levels[currentLevel].maze;
        playerPosition = { x: 1, y: 5 };
        moves = 0;
        lives = levels[currentLevel].lives;
        messageDisplay.textContent = '';
        clearInterval(timer);
        startTimer();
        renderMaze();
        updateUI();
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        movePlayer(0, -1);
    } else if (event.key === 'ArrowDown') {
        movePlayer(0, 1);
    } else if (event.key === 'ArrowLeft') {
       
        movePlayer(-1, 0);
    } else if (event.key === 'ArrowRight') {
        movePlayer(1, 0);
    }
});

document.getElementById('reset-button').addEventListener('click', resetGame);
document.getElementById('next-level-button').addEventListener('click', nextLevel);
document.getElementById('sound-toggle').addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    document.getElementById('sound-toggle').textContent = soundEnabled ? 'Mute Sound' : 'Unmute Sound';
});

document.getElementById('music-toggle').addEventListener('click', () => {
    musicEnabled = !musicEnabled;
    if (musicEnabled) {
        backgroundMusic.loop = true;
        backgroundMusic.play();
        document.getElementById('music-toggle').textContent = 'Mute Music';
    } else {
        backgroundMusic.pause();
        document.getElementById('music-toggle').textContent = 'Unmute Music';
    }
});

function initializeGame() {
    renderMaze();
    updateUI();
    startTimer();
    if (musicEnabled) {
        backgroundMusic.loop = true;
        backgroundMusic.play();
    }
}

initializeGame();
