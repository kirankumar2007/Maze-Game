const maze = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 0, 1],
    [1, 2, 0, 0, 1, 0, 3],
    [1, 1, 1, 1, 1, 1, 1]
];

const mazeElement = document.getElementById('maze');
let playerPosition = { x: 1, y: 5 };

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
        maze[playerPosition.y][playerPosition.x] = 0;
        playerPosition.x = newX;
        playerPosition.y = newY;
        maze[newY][newX] = 2;
        renderMaze();

        if (newX === 6 && newY === 5) {
            alert('Congratulations! You escaped the maze!');
        }
    }
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

renderMaze();