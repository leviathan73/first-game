const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const keys = [];

var board = [
  [0, 0, 0, 0, 0, 0, 0, 0], //board[0] = row
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

class Player {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
}

class Platform {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
}

function drawPlayer() {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(canvas.width / 2, canvas.height - 150, 100, 100);
}
function drawBoard() {
    let xSize = canvas.width/8
    let ySize = canvas.height/8
    
  for (var i = 0; i < board.length; i++) {
    let row = board[i];
    for (var j = 0; j < row.length; j++) {
      if (row[j] != 0) {
        console.log(`blok w pozycji ${i}, ${j}`);
          ctx.beginPath();
          if (row[j] == 1) ctx.fillStyle = "white";
          if (row[j] == 2) ctx.fillStyle = "yellow";
        ctx.fillRect(j * xSize, i * ySize, xSize, ySize);
      }
    }
  }

  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(canvas.width / 2, canvas.height - 150, 100, 100);
}
drawBoard();
drawPlayer();
