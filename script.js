const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const mazeElement = document.getElementById('maze');
const minimapElement = document.getElementById('minimap');
const scoreDisplay = document.getElementById('score-display');
const movesDisplay = document.getElementById('moves-display');
const timeDisplay = document.getElementById('time-display');
const messageDisplay = document.getElementById('message-display');
const highScoreDisplay = document.createElement('p');
const musicToggle = document.createElement('button');
let playerPosition = { x: 1, y: 11 };
let score = 0;
let moves = 0;
let time = 0;
let highScore = 0;
let timer;
let musicPlaying = false;
let moveSound = new Audio('move.mp3');
let collisionSound = new Audio('collision.mp3');
let backgroundMusic = new Audio('background.mp3');

// Initialize high score and music toggle button
highScoreDisplay.id = 'high-score-display';
highScoreDisplay.textContent = `High Score: ${highScore}`;
document.getElementById('game-container').appendChild(highScoreDisplay);

musicToggle.id = 'music-toggle';
musicToggle.textContent = 'Toggle Music';
document.getElementById('game-container').appendChild(musicToggle);

musicToggle.addEventListener('click', toggleMusic);

function renderMaze(element) {
    element.innerHTML = '';
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
                cell.classList.add('obstacle');
            }

            element.appendChild(cell);
        }
        element.appendChild(document.createElement('br'));
    }
    updateScore();
    updateMoves();
    updateTime();
}

function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (maze[newY][newX] !== 1) {
        if (maze[newY][newX] === 4) {
            score -= 20;
            messageDisplay.textContent = 'Oh no! You hit an obstacle!';
            collisionSound.play();
        } else {
            moveSound.play();
        }

        maze[playerPosition.y][playerPosition.x] = 0;
        playerPosition.x = newX;
        playerPosition.y = newY;
        maze[newY][newX] = 2;
        renderMaze(mazeElement);
        renderMaze(minimapElement);
        moves++;
        checkWinCondition();
    }
}

function checkWinCondition() {
    if (playerPosition.x === 12 && playerPosition.y === 7) {
        clearInterval(timer);
        score += Math.max(100 - time, 0);
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
        messageDisplay.textContent = 'Congratulations! You escaped the maze!';
    }
}

function toggleMusic() {
    if (musicPlaying) {
        backgroundMusic.pause();
        musicPlaying = false;
    } else {
        backgroundMusic.loop = true;
        backgroundMusic.play();
        musicPlaying = true;
    }
}

function resetGame() {
    playerPosition = { x: 1, y: 11 };
    maze[11][1] = 2;
    maze[7][12] = 3;
    score = 0;
    moves = 0;
    time = 0;
    messageDisplay.textContent = '';
    clearInterval(timer);
    startTimer();
    renderMaze(mazeElement);
    renderMaze(minimapElement);
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateMoves() {
    movesDisplay.textContent = `Moves: ${moves}`;
}

function updateTime() {
    timeDisplay.textContent = `Time: ${time}s`;
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        updateTime();
    }, 1000);
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

resetGame();
startTimer();
