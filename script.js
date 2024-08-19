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
    },
    {
        maze: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 3, 1],
            [1, 2, 1, 1, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        lives: 2,
        timeLimit: 60
    }
];

let currentLevel = 0;
let maze = levels[currentLevel].maze;
let playerPosition = { x: 1, y: maze.length - 2 };
let score = 0;
let moves = 0;
let lives = levels[currentLevel].lives;
let time = levels[currentLevel].timeLimit;
let soundEnabled = true;
let musicEnabled = true;
let timer;
let theme = 'light';

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
                playerPosition = { x, y };
            } else if (maze[y][x] === 3) {
                cell.classList.add('exit');
            } else if (maze[y][x] === 4) {
                cell.classList.add('trap');
            }

            mazeElement.appendChild(cell);
        }
    }
    renderMiniMap();
}

function renderMiniMap() {
    miniMapElement.innerHTML = '';
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            const miniCell = document.createElement('div');
            miniCell.classList.add('mini-cell');
            if (maze[y][x] === 2) {
                miniCell.classList.add('mini-player');
            } else if (maze[y][x] === 3) {
                miniCell.classList.add('mini-exit');
            }
            miniMapElement.appendChild(miniCell);
        }
    }
}

function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (maze[newY][newX] === 1) {
        return; // Wall, no movement
    } else if (maze[newY][newX] === 4) {
        lives--;
        livesDisplay.textContent = `Lives: ${lives}`;
        if (lives <= 0) {
            endGame(false);
            return;
        }
    } else if (maze[newY][newX] === 3) {
        score += time * lives;
        scoreDisplay.textContent = `Score: ${score}`;
        nextLevel();
        return;
    }

    maze[playerPosition.y][playerPosition.x] = 0;
    maze[newY][newX] = 2;
    playerPosition = { x: newX, y: newY };
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
    renderMaze();
}

function handleKeydown(event) {
    switch (event.key) {
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
}

function startGame() {
    score = 0;
    moves = 0;
    lives = levels[currentLevel].lives;
    time = levels[currentLevel].timeLimit;
    scoreDisplay.textContent = `Score: ${score}`;
    movesDisplay.textContent = `Moves: ${moves}`;
    levelDisplay.textContent = `Level: ${currentLevel + 1}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    timeDisplay.textContent = `Time: ${time}s`;
    messageDisplay.textContent = '';
    renderMaze();
    startTimer();
    if (musicEnabled) {
        backgroundMusic.loop = true;
        backgroundMusic.play();
    }
}

function startTimer() {
    timer = setInterval(() => {
        time--;
        timeDisplay.textContent = `Time: ${time}s`;
        if (time <= 0) {
            clearInterval(timer);
            endGame(false);
        }
    }, 1000);
}

function endGame(won) {
    clearInterval(timer);
    messageDisplay.textContent = won ? 'You won!' : 'Game Over';
    document.removeEventListener('keydown', handleKeydown);
    if (musicEnabled) {
        backgroundMusic.pause();
    }
}

function resetGame() {
    currentLevel = 0;
    startGame();
    document.addEventListener('keydown', handleKeydown);
}

function nextLevel() {
    currentLevel++;
    if (currentLevel >= levels.length) {
        endGame(true);
    } else {
        startGame();
    }
}

document.getElementById('reset-button').addEventListener('click', resetGame);
document.getElementById('next-level-button').addEventListener('click', nextLevel);

document.getElementById('pause-button').addEventListener('click', () => {
    clearInterval(timer);
    document.removeEventListener('keydown', handleKeydown);
    document.getElementById('pause-button').style.display = 'none';
    document.getElementById('resume-button').style.display = 'inline-block';
});

document.getElementById('resume-button').addEventListener('click', () => {
    startTimer();
    document.addEventListener('keydown', handleKeydown);
    document.getElementById('pause-button').style.display = 'inline-block';
    document.getElementById('resume-button').style.display = 'none';
});

document.getElementById('hint-button').addEventListener('click', () => {
    alert('Hint: Try exploring all paths!');
});

document.getElementById('sound-toggle').addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    document.getElementById('sound-toggle').textContent = soundEnabled ? 'Sound: On' : 'Sound: Off';
});

document.getElementById('music-toggle').addEventListener('click', () => {
    musicEnabled = !musicEnabled;
    document.getElementById('music-toggle').textContent = musicEnabled ? 'Music: On' : 'Music: Off';
    if (musicEnabled) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    document.body.className = theme;
    document.getElementById('theme-toggle').textContent = theme === 'light' ? 'Theme: Light' : 'Theme: Dark';
});

resetGame();
