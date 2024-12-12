const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');
const undoButton = document.getElementById('undoButton');

const CELL_SIZE = 40;
let board = [];
let currentPlayer = 'black';
let moveHistory = [];

function initBoard() {
  for (let i = 0; i < 10; i++) {
    board[i] = [];
    for (let j = 0; j < 10; j++) {
      board[i][j] = 0;
    }
  }
}

function drawBoard() {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function drawPiece(row, col, color) {
  const x = col * CELL_SIZE + CELL_SIZE / 2;
  const y = row * CELL_SIZE + CELL_SIZE / 2;
  ctx.beginPath();
  ctx.arc(x, y, CELL_SIZE / 2 - 5, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function placePiece(row, col) {
  if (board[row][col] === 0) {
    board[row][col] = currentPlayer === 'black' ? 1 : 2;
    moveHistory.push({ row, col, player: currentPlayer });
    const pieceColor = currentPlayer === 'black' ? 'black' : 'green'; // 改为绿色
    drawPiece(row, col, pieceColor);
    if (checkWin(row, col)) {
      message.textContent = `${currentPlayer} 获胜！`;
      undoButton.disabled = true;
    } else {
      currentPlayer = currentPlayer === 'black' ? 'green' : 'black'; // 改为绿色
    }
  }
}

function checkWin(row, col) {
  const directions = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: -1 },
    { dx: 1, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: -1 }
  ];

  for (let i = 0; i < directions.length; i++) {
    let count = 1;
    for (let j = 1; j < 5; j++) {
      let newRow = row + j * directions[i].dy;
      let newCol = col + j * directions[i].dx;
      if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10 && board[newRow][newCol] === board[row][col]) {
        count++;
      } else {
        break;
      }
    }
    for (let j = 1; j < 5; j++) {
      let newRow = row - j * directions[i].dy;
      let newCol = col - j * directions[i].dx;
      if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10 && board[newRow][newCol] === board[row][col]) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 5) {
      return true;
    }
  }
  return false;
}

function undoMove() {
  if (moveHistory.length > 0) {
    const lastMove = moveHistory.pop();
    board[lastMove.row][lastMove.col] = 0;
    ctx.clearRect(lastMove.col * CELL_SIZE, lastMove.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.strokeRect(lastMove.col * CELL_SIZE, lastMove.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    currentPlayer = lastMove.player;
    if (message.textContent) {
      message.textContent = '';
      undoButton.disabled = false;
    }
  }
}

canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const row = Math.floor(y / CELL_SIZE);
  const col = Math.floor(x / CELL_SIZE);
  placePiece(row, col);
});

undoButton.addEventListener('click', undoMove);

initBoard();
drawBoard();
