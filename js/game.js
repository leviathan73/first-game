const maksZyc = 3;

class Gra {
  //   status gry
  punktacja = 0;
  zycia = maksZyc;
  width = window.innerWidth;
  height = window.innerHeight;
  //   obiekty rysowania
  canvas = null;
  context = null;

  //assety
  zycieImage = null;

  //bodies
  bodies = [];

  constructor(zycia) {
    this.punktacja = 20;
    if (zycia) this.zycia = zycia;
    this.konfiguracja();
  }

  konfiguracja() {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.zycieImage = new Image(25, 25);
    this.zycieImage.src = "gfx/heart.svg";

    this.body1 = new Body2d();
    this.body1.setPosition(200, 200);
    this.body1.setRadius(50);

    this.body2 = new Body2d();
    this.body2.setPosition(200, 200);
    this.body2.setRadius(50);

    this.bodies.push(this.body1);
    this.bodies.push(this.body2);

    window.addEventListener("mousemove", (e) => {
      let vx = e.clientX - this.body2.p.x;
      let vy = e.clientY - this.body2.p.y;
      let v = new Vector(vx, vy)
      v = v.normalize().multiply(2)
      this.body2.setVelocity(v.x, v.y);
      this.body2.setDirection(v.x, v.y);
    });

    window.addEventListener("mousedown", (e) => {});

    window.addEventListener("keydown", (e) => {});

    window.addEventListener("keyup", (e) => {});
  }

  uruchom() {
    this.wyczyscCanvas();

    this.animateBodies();

    this.wyswietlPunkty();
    this.wyswietlZycia();
  }

  animateBodies() {
    for (let body of this.bodies) {
      body.update();
      body.draw(this.context);
    }
  }

  wyswietlPunkty() {
    this.context.strokeStyle = "#DDDDDD";
    this.context.fillStyle = "#DDDDDD";
    this.context.font = "35px sans-serif";
    this.context.fillText(`${this.punktacja}`, 10, 30);
  }

  wyswietlZycia() {
    this.context.strokeStyle = "#DDDDDD";
    this.context.font = "35px sans-serif";
    this.context.fillText(`${this.zycia}`, this.width - 100, 30);
    this.context.drawImage(this.zycieImage, this.width - 70, 5, 25, 25);
  }

  wyczyscCanvas() {
    this.context.strokeStyle = "white";
    this.context.fillStyle = "#DDDDDD";
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

const gra = new Gra();

function petlaGry() {
  gra.uruchom();
  requestAnimationFrame(petlaGry);
}

petlaGry();
