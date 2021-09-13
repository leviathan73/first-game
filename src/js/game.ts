import { Ship, Meteor, Bullet } from "./actors";
import { Vector } from "./2dmath";
import * as THREE from "three";
import fontAsset from "../assets/Codystar-Regular.ttf"

console.log(fontAsset)

const maksZyc: number = 3;

interface KEYS {
	key: boolean
}

class Gra {
	//   status gry

	private _punktacja: number = 0;

	private _zycia: number = maksZyc;
	private _freeze: boolean = false;
	
	get zycia(): number {
		return this._zycia;
	}

	set zycia(value: number) {
		this._zycia = value < 0 ? 0 : value;
	}

	private _width: number = window.innerWidth;
	private _height: number = window.innerHeight;

	//2D
	private _canvas2D!: HTMLCanvasElement;

	//3D
	private _canvas3D!: HTMLCanvasElement;
	private _scene!: THREE.Scene;
	private _camera!: THREE.Camera;
	private _renderer!: THREE.Renderer;

	context!: CanvasRenderingContext2D;

	private _ship!: Ship;
	private _bullets: Bullet[] = [];
	private _meteors: Meteor[] = [];

	private _mouseX = 0;
	private _mouseY = 0;

	private _keys: any = {};

	private _speed: number = 0;

	private _isLeftMouseDown:boolean = false;

	private _starsImageData!: ImageData;

	constructor() {
		this.setupAll();
	}
	
	render3D() {
		this._renderer.render(this._scene, this._camera);
	}

	render2D() {
		this.clearCanvas(); // 3a
		// this.context.putImageData(this.starsImageData, 100, 100);
		this.drawStars();
		this.drawPlayground();
		this.animateBulltes(); 
		this.animateMeteors(); 
		this.animatePlayer(); 
		this.drawScore(); 
		this.drawLives(); 
		this.drawHelp()
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

	drawGridLines(color: string | CanvasGradient | CanvasPattern) {
		this.context.save();
		this.context.translate(5, 5);

		this.context.beginPath();
		this.context.strokeStyle = color;
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
		this._punktacja = 20;
		this.setupCanvas();
		this.setupStars();
		this.setupPlayer();
		this.setupMeteors(2);
		this.setupListeners();
	}

	font!: FontFace;
	async setupAssets() {
		// @ts-ignore
		this.font = new FontFace("DotsFont", `url(${fontAsset})`);
		return this.font.load()
	}

	setupCanvas() {
		// @ts-ignore
		this._canvas2D = document.querySelector("#canvas2D")!;
		this._canvas3D = document.querySelector("#canvas3D")!;
		// @ts-ignore
		this.context = this._canvas2D.getContext("2d");
		this._canvas2D.width = this._width;
		this._canvas2D.height = this._height;

		window.addEventListener("resize", ()=>{

			this._width = window.innerWidth;
			this._height = window.innerHeight;
			this._canvas2D.width = this._width;
			this._canvas2D.height = this._height;
		})

		this._scene = new THREE.Scene();
		this._camera = new THREE.PerspectiveCamera(
			90,
			this._width / this._height,
			0.1,
			1000
		);
		this._renderer = new THREE.WebGLRenderer({
			alpha: true,
			canvas: this._canvas3D!,
		});
		this._renderer.setSize(this._width, this._height);
		const geometry = new THREE.IcosahedronGeometry(1, 0);
		const material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
		const cube = new THREE.Mesh(geometry, material);
		const light1 = new THREE.PointLight(0xffffff, 0.5, 100);

		/*calculate*/
		this._scene.add(light1);
		// this.scene.add(cube);
		this._camera.position.set(0, 0, 1);
		light1.position.set(0, 0, 5);
	}

    starsPath!: Path2D;
	setupStars() {
		const maxStars = 100;

		this.context.save();
		this.context.fillStyle = "white";

		this.context.shadowColor = "white";

		this.starsPath = new Path2D();

		for (let i = 0; i <= maxStars; i++) {
			const size = Math.random() * 2;
			this.context.beginPath();

			let xPath = Math.random() * this._width;
			let yPath = Math.random() * this._height;

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
		bullet.setDirection2(this._ship.d.copy());
		bullet.setPosition2(this._ship.p);
		bullet.setVelocity2(this._ship.d.setMagnitude(10)); //.add(this.ship.v)
		this._bullets.push(bullet);
		this._ship.shoot();
	}

	setupPlayer() {
		this._ship = new Ship();
		this._ship.setPosition(this._width / 2, this._height / 2);
		this._ship.setRadius(10);
		this._scene.add(this._ship.getMesh());
	}

	_bulletGeneratorInterval!: number;
	setupListeners() {
		window.addEventListener("mousemove", (e) => {
			this._mouseX = e.clientX;
			this._mouseY = e.clientY;
		});

		const fireSpeed = 1000 / 6; // 5 na sekunde
		window.addEventListener("mousedown", (e) => {
			if (this._freeze) return;
			this.addPlayerBullet();
			this._ship.shoot();
			if (e.button == 0) {
				this._isLeftMouseDown = true;
				this._bulletGeneratorInterval = window.setInterval(() => {
					this.addPlayerBullet();
				}, fireSpeed);
			}
		});

		window.addEventListener("mousedown", (e) => {
			if (this._freeze) return;
			let freeze = false;
			if (e.button == 1) {
				this.freezeAllActors();
				freeze = true;
			}
		});

		window.addEventListener("mouseup", (e) => {
			if (this._freeze) return;
			if (e.button == 0) {
				this._isLeftMouseDown = false;
				clearInterval(this._bulletGeneratorInterval);
			}
		});

		window.addEventListener("keydown", (e) => {
			if (this._freeze) return;
			if (e.code == "Space" && !this._keys["Space"]) this.addPlayerBullet();
			this._keys[e.code] = true;
		});

		window.addEventListener("keyup", (e) => {
			if (this._freeze) return;
			this._keys[e.code] = false;
		});
	}

	freezeAllActors() {
		this._freeze = true;
		this._ship.freeze = true;
		this._meteors.forEach(function (meteor:Meteor) {
			meteor.freeze = true;
		});
		this._bullets.forEach(function (bullet1:Bullet) {
			bullet1.freeze = true;
		});
	}

	turnShip() {
		if (this._keys["ArrowLeft"]) {
			this._ship.turnLeft();
		}

		if (this._keys["ArrowRight"]) {
			this._ship.turnRight();
		}
	}

	accelerateShip() {
		//accelerate
		if (this._keys["ArrowUp"]) {
			//accelerate
			this._speed += 0.5;
			if (this._speed >= 5) this._speed = 5; //limit
			this._ship.setVelocity2(
				this._ship.v.add(this._ship.d.setMagnitude(this._speed / 100))
			);
			if (this._ship.v.magnitude() >= 5) this._ship.v.setMagnitude2(5);
		} else if (this._keys["ArrowDown"]) {
			if (this._ship.v.magnitude() > 0)
				this._ship.v.setMagnitude2(this._ship.v.magnitude() * 0.9);
		} else {
			//slow deaccelerate
			if (this._ship.v.magnitude() > 0.01) {
				this._speed -= 0.1;
				if (this._speed < 0) this._speed = 0; //limit
				this._ship.v.setMagnitude2(this._ship.v.magnitude() * 0.97);
			}
		}
	}

	animatePlayer() {
		this.accelerateShip();
		this.turnShip();
		this._ship.update();
		this.keepOnScreen(this._ship);
		this._ship.draw(this.context);
	}

	keepOnScreen(actor: Meteor | Ship) {
		if (actor.p.x - actor.radius > this._width) {
			actor.p.x = 0 - actor.radius;
		}
		if (actor.p.x + actor.radius < 0) {
			actor.p.x = this._width + actor.radius;
		}
		if (actor.p.y - actor.radius > this._height) {
			actor.p.y = 0 - actor.radius;
		}
		if (actor.p.y + actor.radius < 0) {
			actor.p.y = this._height + actor.radius;
		}
	}

	drawScore() {
		this.context.strokeStyle = "#DDDDDD";
		this.context.lineWidth = 1;

		this.context.fillStyle = "black";
		this.context.font = "64px DotsFont";
		this.context.fillText(`${this._punktacja}`, 10, 60, 200);
		this.context.strokeText(`${this._punktacja}`, 10, 60, 200);
	}

	drawLives() {
		let i = this.zycia;
		while (i--) {
			this.context.save();
			this.context.translate(this._width - 30 - i * 40, 15);
			this._ship.drawShipBody(this.context, i >= this.zycia);
			this.context.restore();
		}
	}

	drawHelp() {
			this.context.save();
			this.context
			this.context.font = "17px DotsFont";
			this.context.strokeText("Use ARROWS and SPACEBAR.",10,this._height-20)			
			this.context.restore();
	}

	clearCanvas() {
		this.context.strokeStyle = "white";
		this.context.fillStyle = "#DDDDDD";
		this.context.clearRect(0, 0, this._width, this._height);
	}

	animateMeteors() {
		let newMeteors: Meteor[] = [];
		this._meteors = this._meteors.filter((meteor) => {
			meteor.update();
			this.keepOnScreen(meteor);
			meteor.draw(this.context);

			if (this._ship.checkCollision(meteor)) {
			  this.zycia--;
			//   newMeteors.push(...meteor.explode(this._ship.d));
			  this.freezeAllActors();
			  return false;
			}

			for (const bullet of this._bullets) {
				if (!bullet.ghost && bullet.checkCollision(meteor)) {
					bullet.ghost = true;
					newMeteors.push(...meteor.explode(bullet.d));
					this._punktacja += 10;
					return false;
				}
			}
			return true;
		});
		this._meteors = this._meteors.concat(newMeteors);
	}

	animateBulltes() {
		//clear bullets outside the view
		this._bullets = this._bullets.filter((bullet) => {
			bullet.update();
			bullet.draw(this.context);
			return bullet.p.inBox(0, 0, this._width, this._height);
		});
	}

	setupMeteors(ile: number) {
		for (let i = 0; i < ile; i++) {
			const meteor = new Meteor(3);
			meteor.setPosition(
				Math.random() * this._width,
				Math.random() * this._height
			);
			meteor.setRadius(60);
			let v = new Vector((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
			v = v.setMagnitude(2);
			meteor.setVelocity2(v);
			meteor.setDirection2(v);
			this._meteors.push(meteor);
		}
	}
}

const gra = new Gra(); // 1
gra.setupAssets().then(function (font) {
	// with canvas, if this is ommited won't work
	// @ts-ignore
	document.fonts.add(font);
	petlaGry(); // 2
});

function petlaGry() {
	gra.render2D(); // 3, 4 ,5 ,6 ,7 ,8

	gra.render3D();
	requestAnimationFrame(petlaGry);
}


