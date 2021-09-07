import { Ship, Meteor, Bullet } from "./actors.js";
import { Vector } from "./2dmath.js";
import * as THREE from "three";

const maksZyc = 3;
/**
 * A song
 * @typedef {{title: string,
 *            artist: string,
 *            year: number}} Song
 * @type {Song}
 */

class Gra {
  //   status gry

  /**
   * @type {Number}
   * */
  punktacja = 0;

  /**
   * @type {Number}
   * */
  _zycia = maksZyc;

  get zycia() {
    return this._zycia;
  }

  set zycia(value) {
    this._zycia = value < 0 ? 0 : value;
  }

  /**
   * @type {Number}
   * */
  width = window.innerWidth;

  /**
   * @type {Number}
   * */
  height = window.innerHeight;

  //   obiekty rysowania
  /**
   * @type {HTMLCanvasElement}
   * */
  canvas;
  scene;
  camera;
  renderer;

  /**
   * @type {CanvasRenderingContext2D}
   * */
  context;

  //assety
  /**
   * @type {HTMLImageElement}
   * */
  zycieImage;

  // ingame objects
  /**
   * @type {Ship}
   * */
  ship;

  /**
   * @type {Bullet[]}
   * */
  bullets = [];

  /**
   * @type {Meteor[]}
   * */
  meteors = [];

  /**
   * @type {Number}
   * */
  mouseX = 0;

  /**
   * @type {Number}
   * */
  mouseY = 0;

  /**
   * @type {Object}
   * */
  keys = {};

  /**
   * @type {Number}
   * */
  speed = 0;

  /**
   * @type {Boolean}
   * */
  isLeftMouseDown = false;

  /**
   * @type {ImageData}
   * */
  starsImageData;

  constructor() {
    this.setupAll();
  }
  render3D() {
    this.renderer.render(this.scene, this.camera);
  }

  render2D() {
    this.clearCanvas(); // 3a
    // this.context.putImageData(this.starsImageData, 100, 100);
    this.drawStars();

    this.drawPlayground();
    this.animateBulltes(); // 3b
    this.animateMeteors(); // 3c
    this.animatePlayer(); // 3b
    this.drawScore(); // 3d
    this.drawLives(); // 3e
  }

  drawStars() {
    this.context.globalAlpha = 0.5;
    this.context.fill(this.starsPath);
    this.context.globalAlpha = 1;
  }

  drawPlayground() {
    this.context.save();
    this.drawGridLines("#333333");

    this.context.restore();
  }

  drawGridLines(kolor1) {
    this.context.save();
    this.context.translate(5, 5);

    this.context.beginPath();
    this.context.strokeStyle = kolor1;
    for (let i = 0; i < 100; i++) {
      this.context.moveTo(-10000, i * 100);
      this.context.lineTo(10000, i * 100);
      this.context.moveTo(i * 100, -10000);
      this.context.lineTo(i * 100, 10000);
    }
    this.context.stroke();
    this.context.restore();
  }

  setupAll() {
    this.punktacja = 20;
    this.setupCanvas();
    this.setupStars();
    this.setupAssets();
    this.setupPlayer();
    this.setupMeteors(2);
    this.setupListeners();
  }

  setupAssets() {
    this.zycieImage = new Image(25, 25);
    this.zycieImage.src = "../assets/heart.svg";

    // @ts-ignore
    this.font = new FontFace("DotsFont", "url(../assets/Codystar-Regular.ttf)");
    this.font.load().then(function (font) {
      // with canvas, if this is ommited won't work
      // @ts-ignore
      document.fonts.add(font);
    });
  }

  setupCanvas() {
    // @ts-ignore
    this.canvas = document.querySelector("#canvas2D");
    this.canvas3D = document.querySelector("#canvas3D");
    // @ts-ignore
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      90,
      this.width / this.height,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: this.canvas3D,
    });
    this.renderer.setSize(this.width, this.height);
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
    const cube = new THREE.Mesh(geometry, material);
    const light1 = new THREE.PointLight(0xffffff, 0.5, 100);

    /*calculate*/
    this.scene.add(light1);
    // this.scene.add(cube);
    this.camera.position.set(0, 0, 1);
    light1.position.set(0, 0, 5);
    const axesHelper = new THREE.AxesHelper(1);
    this.scene.add(axesHelper);
  }

  /** @type {Path2D} */ starsPath;
  setupStars() {
    const maxStars = 100;

    this.context.save();
    this.context.fillStyle = "white";

    this.context.shadowColor = "white";

    this.starsPath = new Path2D();

    for (let i = 0; i <= maxStars; i++) {
      const size = Math.random() * 2;
      this.context.beginPath();

      let xPath = Math.random() * this.width;
      let yPath = Math.random() * this.height;

      this.starsPath.moveTo(xPath, yPath);
      this.starsPath.arc(
        xPath,
        yPath,
        1 + size,
        (Math.PI / 180) * 0,
        (Math.PI / 180) * 360
      );

      this.context.globalAlpha = Math.random() * 0.6;
      this.context.shadowBlur = 3 + size * 3;
      this.context.stroke();
      this.context.fill();
    }

    this.context.restore();
  }

  addPlayerBullet() {
    const bullet = new Bullet();
    bullet.setDirection2(this.ship.d.copy());
    bullet.setPosition2(this.ship.p);
    bullet.setVelocity2(this.ship.d.setMagnitude(10)); //.add(this.ship.v)
    this.bullets.push(bullet);
    this.ship.shoot();
  }

  setupPlayer() {
    this.ship = new Ship();
    this.ship.setPosition(this.width / 2, this.height / 2);
    this.ship.setRadius(10);
    this.scene.add(this.ship.getMesh());
  }

  setupListeners() {
    window.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    const fireSpeed = 1000 / 6; // 5 na sekunde

    window.addEventListener("mousedown", (e) => {
      this.addPlayerBullet();
      this.ship.shoot();
      if (e.button == 0) {
        this.isLeftMouseDown = true;
        this.bulletGeneratorInterval = setInterval(() => {
          this.addPlayerBullet();
        }, fireSpeed);
      }
    });

    window.addEventListener("mousedown", (e) => {
      let freeze = false;
      if (e.button == 1) {
        this.freezeAllActors();
        freeze = true;
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (e.button == 0) {
        this.isLeftMouseDown = false;
        clearInterval(this.bulletGeneratorInterval);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.code == "Space" && !this.keys["Space"]) this.addPlayerBullet();
      this.keys[e.code] = true;
      console.log(this.keys);
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
  }

  freezeAllActors() {
    this.ship.freeze = true;
    this.meteors.forEach(function (/**@type {Meteor}*/ meteor) {
      meteor.freeze = true;
    });
    this.bullets.forEach(function (/**@type {Bullet}*/ bullet1) {
      bullet1.freeze = true;
    });
  }

  turnShip() {
    if (this.keys["ArrowLeft"]) {
      this.ship.turnLeft();
    }

    if (this.keys["ArrowRight"]) {
      this.ship.turnRight();
    }
  }

  accelerateShip() {
    //accelerate
    if (this.keys["ArrowUp"]) {
      //accelerate
      this.speed += 0.5;
      if (this.speed >= 5) this.speed = 5; //limit
      this.ship.setVelocity2(
        this.ship.v.add(this.ship.d.setMagnitude(this.speed / 100))
      );
      if (this.ship.v.magnitude() >= 5) this.ship.v.setMagnitude2(5);
    } else if (this.keys["ArrowDown"]) {
      if (this.ship.v.magnitude() > 0)
        this.ship.v.setMagnitude2(this.ship.v.magnitude() * 0.9);
    } else {
      //slow deaccelerate
      if (this.ship.v.magnitude() > 0.01) {
        this.speed -= 0.1;
        if (this.speed < 0) this.speed = 0; //limit
        this.ship.v.setMagnitude2(this.ship.v.magnitude() * 0.97);
      }
    }
  }

  animatePlayer() {
    this.accelerateShip();
    this.turnShip();
    this.ship.update();
    this.keepOnScreen(this.ship);
    this.ship.draw(this.context);
  }

  keepOnScreen(actor) {
    if (actor.p.x - actor.radius > this.width) {
      actor.p.x = 0 - actor.radius;
    }
    if (actor.p.x + actor.radius < 0) {
      actor.p.x = this.width + actor.radius;
    }
    if (actor.p.y - actor.radius > this.height) {
      actor.p.y = 0 - actor.radius;
    }
    if (actor.p.y + actor.radius < 0) {
      actor.p.y = this.height + actor.radius;
    }
  }

  drawScore() {
    this.context.strokeStyle = "#DDDDDD";
    this.context.fillStyle = "#DDDDDD";
    this.context.font = "64px DotsFont";
    this.context.fillText(`${this.punktacja}`, 10, 60);
  }

  drawLives() {
    let i = this.zycia;
    while (i--) {
      this.context.save();
      this.context.translate(this.width - 30 - i * 40, 15);
      this.ship.drawShipBody(this.context, i >= this.zycia);
      this.context.restore();
    }
  }

  clearCanvas() {
    this.context.strokeStyle = "white";
    this.context.fillStyle = "#DDDDDD";
    this.context.clearRect(0, 0, this.width, this.height);
  }

  animateMeteors() {
    let newMeteors = [];
    this.meteors = this.meteors.filter((meteor) => {
      meteor.update();
      this.keepOnScreen(meteor);
      meteor.draw(this.context);

      // if (this.ship.checkCollision(meteor)) {
      //   this.zycia--;
      //   //newMeteors.push(...meteor.explode(this.ship.d));
      //   this.freezeAllActors();
      //   //return false;
      // }

      for (const bullet of this.bullets) {
        if (!bullet.ghost && bullet.checkCollision(meteor)) {
          bullet.ghost = true;
          newMeteors.push(...meteor.explode(bullet.d));
          this.punktacja += 10;
          return false;
        }
      }
      return true;
    });
    this.meteors = this.meteors.concat(newMeteors);
  }

  animateBulltes() {
    //clear bullets outside the view
    this.bullets = this.bullets.filter((bullet) => {
      bullet.update();
      bullet.draw(this.context);
      return bullet.p.inBox(0, 0, this.width, this.height);
    });
  }

  setupMeteors(ile) {
    for (let i = 0; i < ile; i++) {
      const meteor = new Meteor(3);
      meteor.setPosition(
        Math.random() * this.width,
        Math.random() * this.height
      );
      meteor.setRadius(60);
      let v = new Vector((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
      v = v.setMagnitude(2);
      meteor.setVelocity2(v);
      meteor.setDirection2(v);
      this.meteors.push(meteor);
    }
  }
}

const gra = new Gra(); // 1

function petlaGry() {
  gra.render2D(); // 3, 4 ,5 ,6 ,7 ,8

  gra.render3D();
  requestAnimationFrame(petlaGry);
}

petlaGry(); // 2
