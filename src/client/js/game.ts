import { Ship, Meteor, Bullet } from "./actors";
import { Dialog } from "./dialog";
import { Position, Vector } from "./2dmath";
import * as THREE from "three";
import {GUI as DATAGUI} from 'dat.gui';
import fontAsset from "../assets/Codystar-Regular.ttf"
import backgroundMusic from "../assets/game-music.mp3"
import { Body2d } from "./body2d";


// const gui = new DATAGUI({
// 	autoPlace:true,
// 	closeOnTop: true,
// });
// gui.add(Body2d, '_speedfactor').min(0.001).max(0.5).step(0.025).name("time factor") 

const maksZyc: number = 5;

interface KEYS {
	key: boolean
}

class Gra {
	//   status gry

	private _punktacja: number = 0;

	private _zycia: number = maksZyc;
	private _freeze: boolean = false;
	private _level: number = 1;
	private _dialog!: Dialog;

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

	private _isLeftMouseDown: boolean = false;

	private _starsImageData!: ImageData;

	constructor() {
		this._dialog = new Dialog()
		this.setupAll();
	}

	render3D() {
		this._renderer.render(this._scene, this._camera);
	}

	render2D() {
		this.clearCanvas(); // 3a
		// this.context.putImageData(this.starsImageData, 100, 100);
		this.drawStars();
		this.drawScore();
		this.drawLives();
		this.drawHelp()
		this.drawPlayground();
	
		if (!this._dialog?.drawDialog(this.context, this._width, this._height)) {
			if (!mobileAndTabletCheck()) {
				this.animateMeteors();
				this.animateBulltes()
				this.animatePlayer();
			} else {
				this.freezeAllActors()
				this._freeze = true;
				this.drawMobileNotSuported()
			}
		}
	}
	drawMobileNotSuported() {
		this.context.lineWidth = 1;
		this.context.fillStyle = "white";
		this.context.font = "18px DotsFont";
		this.context.fillText(`sorry, mobile devices not supported yet ...`, this._width / 2 - 200, this._height / 2);
		this.context.fillText(`sorry, mobile devices not supported yet ...`, this._width / 2 - 200, this._height / 2);
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
		this._punktacja = 0;
		this.setupCanvas();
		this.setupStars();
		this.setupPlayer();
		
		
		this._dialog.showDialog("Press any key to start", true, Infinity, ()=>{
			this.setupListeners();
			this.setupMeteors();
			this.setupMusic();
			this._dialog.showDialog("level 1", false, 2000)
		}) 
		
	}
	setupMusic() {
		const backgroundAudio = new Audio(backgroundMusic);
		backgroundAudio.muted = true;
		backgroundAudio.volume = 0.02;
		backgroundAudio.loop = true;
		backgroundAudio.autoplay = false;
		backgroundAudio.muted = false;
		backgroundAudio.play()
		
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

		window.addEventListener("resize", () => {

			this._width = window.innerWidth;
			this._height = window.innerHeight;
			this._canvas2D.width = this._width;
			this._canvas2D.height = this._height;
			this.setupStars()
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

		window.document.body.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			e.stopPropagation()
			e.cancelBubble = true;
			return false;
		})

		window.addEventListener("mousedown", (e) => {
			if (this._freeze) return;
			this._freeze = false;
			if (e.button == 2) {
				this._freeze = true;
				this.freezeAllActors();
				return false;
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
		this._meteors.forEach(function (meteor: Meteor) {
			meteor.freeze = true;
		});
		this._bullets.forEach(function (bullet1: Bullet) {
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
		this.context.font = "32px DotsFont";
		this.context.fillText(`${this._punktacja}`, 10, 40);
		this.context.strokeText(`${this._punktacja}`, 10, 40);
	}

	drawLives() {
		let i = this.zycia;
		while (i--) {
			this.context.save();
			this.context.translate(this._width - 30 - i * 20, 15);
			this.context.scale(0.6,0.6)
			this._ship.drawShipBody(this.context, i >= this.zycia);
			this.context.restore();
		}
	}

	drawHelp() {
		this.context.save();
		this.context
		this.context.font = "17px DotsFont";
		this.context.strokeText("Use ARROWS and SPACEBAR.", 10, this._height - 20)
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
				if(this.zycia>0)
					this.resetPlayer();
				 else
					this.gameOver();
				return true;
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
		if (this._meteors.length == 0) {
			this.resetPlayer();
			this.nextLevel()
		}
	}

	private gameOver() {
		this._dialog.showDialog("game over", true, 1000 * 10);
		this.freezeAllActors();
	}

	private resetPlayer() {
		this._ship.makeGhost(5000);
		this._dialog.showDialog("shield active", false, 5000);
		this._ship.setPosition(this._width / 2, this._height / 2);
		this._ship.setRadius(10);
	}

	nextLevel() {
		console.log(this._level)
		this._level++
		this.setupMeteors();
		this._dialog.showDialog(`level ${this._level}`, false, 2000)
	}

	animateBulltes() {
		//clear bullets outside the view
		this._bullets = this._bullets.filter((bullet) => {
			bullet.update();
			bullet.draw(this.context);
			return bullet.p.inBox(0, 0, this._width, this._height);
		});
	}

	setupMeteors() {
		console.log("setupMeteors " + this._level);
		for (let i = 0; i < this._level; i++) {
			console.log("setupMeteors");
			const meteor = new Meteor(3);
			let randomX = Math.random() * this._width;
			let randomY = Math.random() * this._height;

			meteor.setRadius(60);
			let v = new Vector((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);

			let position = new Position(randomX, randomY);
			position = position.add(v.multiply(-(randomX > randomY ? randomX : randomY)))
			meteor.setPosition2(
				position
			);

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

let mobileAndTabletCheck = function () {
	let check = false;
	(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
	return check;
};


function petlaGry() {
	gra.render2D(); // 3, 4 ,5 ,6 ,7 ,8
	//	gra.render3D();
	requestAnimationFrame(petlaGry);
}


