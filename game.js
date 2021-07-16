const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 30*30;
canvas.height = 20*30;

const keys = [];

class Enemy {
  position = new Position(100, 100);
  direction = new Vector(0, 0);
  constructor(position, width, height, direction) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.direction = direction;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  move() {
    this.position = this.position.add(this.direction);
  }

  setMovementVector(v) {
    this.direction = v;
  }

  setYMovement(dy) {
    this.direction.y = dy;
  }

  setXMovement(dx) {
    this.direction.x = dx;
  }
}

class Player {
  constructor(x, y, width, height, dx, dy) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillText(`${this.dx} , ${this.dy}`, this.x, this.y - 5);
  }

  move() {
    this.setYMovement(this.dy + 0.2);

    platforms.forEach((platforma) => {
      this.checkCollision(platforma);
    });
    this.checkCollision(floor);
    this.x += this.dx;
    this.y += this.dy;
    // if (keys["ArrowDown"]) player.x += player.dx;
  }

  setMovementVector(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  setYMovement(dy) {
    this.dy = dy;
  }

  setXMovement(dx) {
    this.dx = dx;
  }

  checkCollision(obj) {
    if (this.dy > 0) {
      if (
        !(
          this.x > obj.x + obj.width ||
          this.x + this.width < obj.x ||
          this.y > obj.y + obj.height ||
          this.y + this.height < obj.y
        )
      ) {
        this.setYMovement(0);
        this.y = obj.y - this.height;
      }
    }
    // if (this.dy < 0) {
    //   if (
    //     !(
    //       this.x > obj.x + obj.width ||
    //       this.x + this.width < obj.x ||
    //       this.y > obj.y + obj.height
    //     )
    //   ) {
    //     this.setYMovement(0);
    //   }
    // }
  }
  jump(height) {
    if (this.dy == 0) this.setYMovement(height);
  }
}

class Platform {
  constructor(x, y, width, height, colour) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;
  }

  drawPlatform() {
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
class Board {
  width = canvas.width;
  height = canvas.height;
  gridW = 30;
  gridH = 30;
  constructor() {}

  draw() {
    ctx.beginPath();
    // ctx.strokeStyle = "white";
    ctx.fillStyle = "none";
    ctx.strokeRect(0, 0, this.width, this.height);
    for (let i = 0; i <= this.width / this.gridW; i++) {
      ctx.beginPath();
      // ctx.strokeStyle = "white";
      ctx.moveTo(this.gridW * i, 0);
      ctx.lineTo(this.gridW * i, this.height);
      // ctx.stroke();
    }
    for (let i = 0; i <= this.height / this.gridH; i++) {
      ctx.beginPath();
      // ctx.strokeStyle = "white";
      ctx.moveTo(0, this.gridH * i);
      ctx.lineTo(this.width, this.gridH * i);
      // ctx.stroke();
    }
  }
}

const player = new Player(900, 0, 50, 50, 0, 2);
const enemy = new Enemy(new Point(30, 30), 50, 50, new Vector(1, 1));
const floor = new Platform(
  0,
  canvas.height - 53,
  canvas.width,
  50,
  "rgb(33, 33, 49)"
);
const board = new Board();
const platform1 = new Platform(300, 600, 200, 50, "rgb(44, 44, 65)");
const platform2 = new Platform(1450, 600, 200, 50, "rgb(44, 44, 65)");
const platform3 = new Platform(
  canvas.width / 3,
  100,
  canvas.width,
  50,
  "rgb(44, 44, 65)"
);
const platforms = [platform1, platform3, platform2];

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Input checking phase
  player.setXMovement(0);
  if (keys["ArrowLeft"] && keys["ArrowRight"]) {
    player.setXMovement(0);
  } else if (keys["ArrowLeft"]) {
    player.setXMovement(-5);
  } else if (keys["ArrowRight"]) {
    player.setXMovement(5);
  }

  if (keys["ArrowUp"]) {
    player.jump(-12);
  }

  //Model updating phase
  player.move();

  //  converting enemy's motion direction vector
  enemy.setMovementVector(
    enemy.position
      .vectorTo(new Position(player.x, player.y))
      .normalize()
      .multiply(6)
  );
  enemy.move();

  // Rendering

  player.draw();
  enemy.draw();
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.moveTo(enemy.position.x, enemy.position.y);
  ctx.lineTo(player.x, player.y);
  ctx.stroke();
  ctx.closePath();
  platforms.forEach(function (platforma) {
    platforma.drawPlatform();
  });

  floor.drawPlatform();
  board.draw();
}

window.addEventListener("keydown", function (e) {
  keys[e.key] = true;
});

window.addEventListener("keyup", function (e) {
  delete keys[e.key];
});


animate();
window.setInterval(() => {}, 17);
