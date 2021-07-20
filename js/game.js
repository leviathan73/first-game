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

  bullets = [];
  ship = new Statek();

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

    this.bodies.push(new Body2d(2));
    this.bodies.push(new Body2d(1));
    this.bodies.push(new Body2d(7));

    for (let body of this.bodies) {
      body.addForce(new Vector(1, 1));
    }

    window.addEventListener("mousemove", (e) => {
      this.ship.setDirectionTo(e.clientX, e.clientY);
    });

    
      window.addEventListener("mousedown", (e) => {
            const f = this.ship.body2d.p
              .vectorTo(
                new Point(this.ship.directionToX, this.ship.directionToY)
              )
              .normalize()
              .multiply(4);
          
          const bullet = new Body2d(0.1)
          bullet.radius = 2;
          bullet.setPosition(this.ship.body2d.p.x, this.ship.body2d.p.y);
        bullet.setVelocity(f.x, f.y);
        this.bullets.push(bullet)        
    });

    window.addEventListener("keydown", (e) => {
      const f = this.ship.body2d.p
        .vectorTo(new Point(this.ship.directionToX, this.ship.directionToY))
        .normalize()
        .multiply(10);
      this.ship.body2d.applyForce(f);
    });

    window.addEventListener("keyup", (e) => {
      this.ship.body2d.applyForce(new Vector(0, 0));
    });
  }

  uruchom() {
    this.wyczyscCanvas();
    this.animateBodies();
      this.animateShip();
      this.animateBullets();
    this.wyswietlPunkty();
    this.wyswietlZycia();
  }

  animateBodies() {
    for (let body of this.bodies) {
      body.update();
      body.draw(this.context);
    }
  }

  animateBullets() {
    for (let b of this.bullets) {
      b.update();
      b.draw(this.context);
    }
  }

  animateShip() {
    this.ship.update();
    this.ship.draw(this.context);
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
        gra.uruchom()
        requestAnimationFrame(petlaGry);
}

petlaGry()