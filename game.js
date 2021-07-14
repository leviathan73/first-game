const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const keys = [];

class Player {
  constructor(x, y, width, height, dx, dy) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
  }

  drawPlayer() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillText(`${this.dx} , ${this.dy}`, this.x, this.y - 5);
  }

  movePlayer() {
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
    if(this.dy == 0) this.setYMovement(height)
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

const player = new Player(900, 0, 50, 50, 0, 2);
const floor = new Platform(
  0,
  canvas.height - 53,
  canvas.width,
  50,
  "rgb(33, 33, 49)"
);

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

  platforms.forEach(function (platforma) {
    platforma.drawPlatform();
  });

  floor.drawPlatform();
  player.movePlayer();
  player.drawPlayer();
}

window.addEventListener("keydown", function (e) {
  keys[e.key] = true;
  console.log(keys);
});

window.addEventListener("keyup", function (e) {
  delete keys[e.key];
});

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  floor.width = canvas.width;
  floor.y = canvas.height - 53;
});

animate();
window.setInterval(() => {
  
}, 17)