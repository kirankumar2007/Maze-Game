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
                miniCell.classList.add('wall');
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
        if (maze[newY][newX] === 4) {
            lives--;
            livesDisplay.textContent = `Lives: ${lives}`;
            if (lives === 0) {
                messageDisplay.textContent = 'Game Over!';
                clearInterval(timer);
                return;
            }
        }
        maze[playerPosition.y][playerPosition.x] = 0;
        playerPosition.x = newX;
        playerPosition.y = newY;
        maze[newY][newX] = 2;
        moves++;
        renderMaze();
        updateUI();

        if (newX === levels[currentLevel].maze[0].length - 2 && newY === levels[currentLevel].maze.length - 2) {
            score += 100;
            alert('Congratulations! You escaped the maze!');
            nextLevel();
        }
    }
}

function updateUI() {
    scoreDisplay.textContent = `Score: ${score}`;
    movesDisplay.textContent = `Moves: ${moves}`;
    timeDisplay.textContent = `Time: ${time}s`;
    livesDisplay.textContent = `Lives: ${lives}`;
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
    lives = levels[currentLevel].lives;
    score = 0;
    moves = 0;
    maze = levels[currentLevel].maze;
    playerPosition = { x: 1, y: maze.length - 2 };
    renderMaze();
    updateUI();
    startTimer();
    messageDisplay.textContent = '';
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        lives = levels[currentLevel].lives;
        maze = levels[currentLevel].maze;
        playerPosition = { x: 1, y: maze.length - 2 };
        renderMaze();
        updateUI();
        startTimer();
        messageDisplay.textContent = '';
    } else {
        alert('You completed all levels!');
    }
}

function pauseGame() {
    clearInterval(timer);
    document.getElementById('pause-button').style.display = 'none';
    document.getElementById('resume-button').style.display = 'inline-block';
}

function resumeGame() {
    startTimer();
    document.getElementById('pause-button').style.display = 'inline-block';
    document.getElementById('resume-button').style.display = 'none';
}

function showHint() {
    alert('Hint: Follow the path that doesn\'t hit a wall!');
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
document.getElementById('pause-button').addEventListener('click', pauseGame);
document.getElementById('resume-button').addEventListener('click', resumeGame);
document.getElementById('hint-button').addEventListener('click', showHint);
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
