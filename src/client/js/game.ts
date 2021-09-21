import { Ship, Meteor, Bullet, Ufo } from "./actors";
import { Dialog } from "./dialog";
import { Position, Vector } from "./2dmath";
import fontAsset from "../assets/Codystar-Regular.ttf"
import backgroundMusic from "../assets/game-music.mp3"
import _, { method } from "lodash"
import * as DGUI from "dat.gui"
import { Body2d } from "./body2d";

let controls = new DGUI.GUI()
controls.add(Body2d, "debug").onChange(() => {

})

let mobileAndTabletCheck = function () {
	let check = false;
	(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
	return check;
};

const maksZyc: number = 5;

interface KEYS {
	key: boolean
}

class Gra {
	//   status gry

	/* #region properties */

	private _punktacja: number = 0;

	private _zycia: number = maksZyc;
	private _freeze: boolean = false;
	private _level: number = 1;
	private _dialog!: Dialog;
	private _ufoGunInterval!: number;

	get zycia(): number {
		return this._zycia;
	}

	set zycia(value: number) {
		this._zycia = value < 0 ? 0 : value;
	}

	private _canvasWidth: number = window.innerWidth;
	private _canvasHeight: number = window.innerHeight;

	//2D
	private _canvas2D!: HTMLCanvasElement;

	//3D
	private _canvas3D!: HTMLCanvasElement;
	private _scene!: THREE.Scene;
	private _camera!: THREE.Camera;
	private _renderer!: THREE.Renderer;

	_context!: CanvasRenderingContext2D;

	private _ship!: Ship;
	private _shipBullets: Bullet[] = [];
	private _ufoBullets: Bullet[] = [];

	private _meteors: Meteor[] = [];
	private _ufo!: Ufo;

	private _mouseX = 0;
	private _mouseY = 0;

	private _keys: any = {};

	private _speed: number = 0;

	private _isLeftMouseDown: boolean = false;

	private _starsImageData!: ImageData;

	// #endregion

	constructor() {
		this._dialog = new Dialog()
		this.setupAll();
	}

	setupAll() {
		this._punktacja = 0;
		this.setupCanvas();
		this.setupStars();
		this.setupPlayer();

		if (mobileAndTabletCheck()) {
			this._dialog.showDialog("mobile devices not suported", true, Infinity, () => {
				this._freeze = true
			})
		} else {
			this._dialog.showDialog("Press any key to start", true, Infinity, () => {
				this.setupListeners();
				this.setupMeteors();
				this.setupUfo()
				this.setupMusic();
				this._dialog.showDialog("level 1", false, 2000)
			})
		}
	}

	setupUfo() {
		this._ufo = new Ufo(1)
		this.sendUfo()
	}

	sendUfo() {
		setInterval(() => {
			this._ufo.startUfo(this._canvasWidth, this._canvasHeight)
			this._ufoBullets.push(this._ufo.shootAt(this._ship.p))
			clearInterval(this._ufoGunInterval)
			this._ufoGunInterval = window.setInterval(() => {
				if(!this._ufo.ghost)
				this._ufoBullets.push(this._ufo.shootAt(this._ship.p))
			}, 2 * 1000)
		}, 30 * 1000)
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
		this._context = this._canvas2D.getContext("2d");
		this._canvas2D.width = this._canvasWidth;
		this._canvas2D.height = this._canvasHeight;

		window.addEventListener("resize", () => {

			this._canvasWidth = window.innerWidth;
			this._canvasHeight = window.innerHeight;
			this._canvas2D.width = this._canvasWidth;
			this._canvas2D.height = this._canvasHeight;
			this.setupStars()
		})
	}

	starsPath!: Path2D;
	setupStars() {
		const maxStars = 100;

		this._context.save();
		this._context.fillStyle = "white";

		this._context.shadowColor = "white";

		this.starsPath = new Path2D();

		for (let i = 0; i <= maxStars; i++) {
			const size = Math.random() * 2;
			this._context.beginPath();

			let xPath = Math.random() * this._canvasWidth;
			let yPath = Math.random() * this._canvasHeight;

			this.starsPath.moveTo(xPath, yPath);
			this.starsPath.arc(
				xPath,
				yPath,
				1 + size,
				(Math.PI / 180) * 0,
				(Math.PI / 180) * 360
			);

			this._context.globalAlpha = Math.random() * 0.6;
			this._context.shadowBlur = 3 + size * 3;
			this._context.stroke();
			this._context.fill();
		}

		this._context.restore();
	}

	addPlayerBullet() {
		const bullet = new Bullet();
		bullet.setDirection2(this._ship.d.copy());
		bullet.setPosition2(this._ship.p);
		bullet.setVelocity2(this._ship.d.setMagnitude(10)); //.add(this.ship.v)
		this._shipBullets.push(bullet);
		this._ship.shoot();
	}

	setupPlayer() {
		this._ship = new Ship();
		this._ship.setPosition(this._canvasWidth / 2, this._canvasHeight / 2);
	}


	render3D() {
		this._renderer.render(this._scene, this._camera);
	}

	render2D() {
		this.clearCanvas(); // 3a
		this.drawBoard();

		if (!this._dialog?.drawDialog(this._context, this._canvasWidth, this._canvasHeight)) {
			if (this._freeze) return
			this.animateMeteors();
			this.animateBulltes()
			this.animatePlayer();
			this.animateUfoBulets()
			this.animateUfo();
		}
	}

	clearCanvas() {
		this._context.strokeStyle = "white";
		this._context.fillStyle = "#DDDDDD";
		this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
	}

	animatePlayer() {
		this.accelerateShip();
		this.turnShip();
		this._ship.update();
		this.keepOnScreen(this._ship);
		this._ship.draw(this._context);
	}

	animateBulltes() {
		//clear bullets outside the view
		this._shipBullets = this._shipBullets.filter((bullet) => {
			bullet.update();
			bullet.draw(this._context);
			return bullet.p.inBox(0, 0, this._canvasWidth, this._canvasHeight);
		});
	}

	animateMeteors() {
		let newMeteors: Meteor[] = [];
		this._meteors = this._meteors.filter((meteor) => {
			let keepMeteor = true
			meteor.update();
			this.keepOnScreen(meteor);
			meteor.draw(this._context);

			if (this._ship.checkCollision(meteor)) {
				this.playerCrashed();
				keepMeteor = false;
			}

			for (let bullet of this._shipBullets) {
				if (bullet.checkCollision(meteor)) {
					bullet.ghost = true;
					newMeteors.push(...meteor.explode(bullet.d));
					this._punktacja += 10;
					keepMeteor = false
				}

				if (bullet.checkCollision(this._ufo)) {
					bullet.ghost = true;
					clearInterval(this._bulletGeneratorInterval)
					this._ufo.stopUfo()
					this._punktacja += 200;
				}
			};
			return keepMeteor;
		});
		this._meteors = this._meteors.concat(newMeteors);
		if (this._meteors.length == 0) {
			this.nextLevel()
		}
	}

	private playerCrashed() {
		this.zycia--;
		if (this.zycia > 0)
			this.resetPlayer();
		else
			this.gameOver();
	}

	animateUfoBulets() {
		this._ufoBullets.filter((bullet)=>{
			bullet.update()
			bullet.draw(this._context)
			if(bullet.checkCollision(this._ship)) {
				this.playerCrashed();
				return true
			}
			return !bullet.p.inBox(0,0, this._canvasWidth, this._canvasWidth)
		})
	}

	animateUfo() {
		if (!this._ufo.ghost) {
			this._ufo.update()
			this.keepOnScreen(this._ufo)
			this._ufo.draw(this._context)
			if(!this._ufo.p.inBox(0,0, this._canvasWidth, this._canvasHeight)){
				clearInterval(this._bulletGeneratorInterval)
				this._ufo?.stopUfo()
			}
		}
	}

	drawBoard() {
		this.drawStars();
		this.drawScore();
		this.drawLives();
		this.drawHelp();
		this.drawPlayground();
	}

	drawStars() {
		this._context.globalAlpha = 0.5;
		this._context.fill(this.starsPath);
		this._context.globalAlpha = 1;
	}

	drawPlayground() {
		this._context.save();
		this.drawGridLines("#333333");
		this._context.restore();
	}

	drawGridLines(color: string | CanvasGradient | CanvasPattern) {
		this._context.save();
		this._context.translate(5, 5);

		this._context.beginPath();
		this._context.strokeStyle = color;
		for (let i = 0; i < 100; i++) {
			this._context.moveTo(-10000, i * 100);
			this._context.lineTo(10000, i * 100);
			this._context.moveTo(i * 100, -10000);
			this._context.lineTo(i * 100, 10000);
		}
		this._context.stroke();
		this._context.restore();
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
		this._shipBullets.forEach(function (bullet1: Bullet) {
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
			this._speed += 0.5 * this._ship.dt * Body2d.speedfactor;
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
			if (this._ship.v.magnitude() > 0.0001) {
				this._speed -= 0.1;
				if (this._speed < 0) this._speed = 0; //limit
				this._ship.v.setMagnitude2(this._ship.v.magnitude() * 0.97);
			} else {

			}
		}
	}

	keepOnScreen(actor: Meteor | Ship | Ufo) {
		if (actor.p.x - actor.radius > this._canvasWidth) {
			actor.p.x = 0 - actor.radius;
		}
		if (actor.p.x + actor.radius < 0) {
			actor.p.x = this._canvasWidth + actor.radius;
		}
		if (actor.p.y - actor.radius > this._canvasHeight) {
			actor.p.y = 0 - actor.radius;
		}
		if (actor.p.y + actor.radius < 0) {
			actor.p.y = this._canvasHeight + actor.radius;
		}
	}

	drawScore() {
		this._context.strokeStyle = "#DDDDDD";
		this._context.lineWidth = 1;

		this._context.fillStyle = "black";
		this._context.font = "32px DotsFont";
		this._context.fillText(`${this._punktacja}`, 10, 40);
		this._context.strokeText(`${this._punktacja}`, 10, 40);
	}

	drawLives() {
		let i = this.zycia;
		while (i--) {
			this._context.save();
			this._context.translate(this._canvasWidth - 30 - i * 20, 15);
			this._context.scale(0.6, 0.6)
			this._ship.drawShipBody(this._context, i >= this.zycia);
			this._context.restore();
		}
	}

	drawHelp() {
		this._context.save();
		this._context
		this._context.font = "17px DotsFont";
		this._context.strokeText("Use ARROWS and SPACEBAR.", 10, this._canvasHeight - 20)
		this._context.restore();
	}

	gameOver() {
		this._dialog.showDialog("game over", true, Infinity);
		this.freezeAllActors();
	}

	resetPlayer() {
		this._ship.makeGhost(5000);
		this._dialog.showDialog("shield active", false, 5000);
		this._ship.setPosition(this._canvasWidth / 2, this._canvasHeight / 2);
	}

	nextLevel() {
		this._level++
		this.setupMeteors();
		this._dialog.showDialog(`level ${this._level}`, false, 2000)
	}

	setupMeteors() {
		console.log("setupMeteors " + this._level);
		for (let i = 0; i < this._level; i++) {
			console.log("setupMeteors");
			const meteor = new Meteor(3);
			meteor.randomizeInitialParams(this._canvasWidth, this._canvasHeight)
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
	//	gra.render3D();
	requestAnimationFrame(petlaGry);
}


