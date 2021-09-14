import { Vector } from "./2dmath";
import { Body2d } from "./body2d";
import * as THREE from "three";
import fireSound from "../assets/gun2.mp3"
import explosionSound from "../assets/explode.wav"
import { Clock, FloatType, ShaderMaterial } from "three";

const fireAudio = new Audio(fireSound);
fireAudio.volume = 0.1;

const explosionAudio = new Audio(explosionSound);
explosionAudio.volume = 0.1;

export class Ship extends Body2d {
	angle: number = Math.PI / 60;
	mesh: THREE.Mesh;
	time: Clock;

	turnLeft() {
		if (this.freeze == true) return;
		this.d.rotate2(-this.angle);
		//this.mesh.rotateZ(this.angle);
	}
	turnRight() {
		if (this.freeze == true) return;
		this.d.rotate2(this.angle);
		this.mesh.rotateZ(-this.angle);
	}

	audio = null;
	constructor() {
		super();
		this.time = new THREE.Clock(true)
		this.time.start();
		// const geometry = new THREE.ConeGeometry(0.05, 0.1, 30);
		// const geometry = new THREE.CircleGeometry(2, 10, -0.5 + Math.PI, 0.5);
		const geometry = new THREE.CircleGeometry(0.4, 5, 0, 2 * Math.PI);
		const vertex = /* glsl */`
		#ifdef GL_ES
			precision highp float;
		#endif

		uniform float time;
		uniform vec2 start;
		varying vec2 vuv;
		

		void main() {
			float angle = time*0.0;
			mat4  rotation = mat4(
		    vec4( cos(angle), -sin(angle), 0.0,  0.0 ),
		    vec4( sin(angle), cos(angle),  0.0,  0.0 ),
		    vec4( 0.0,        0.0,         1.0,  0.0 ),
		    vec4( 0.0,        0.0,         0.0,  1.0 ));
			vuv = uv;
			//gl_PointSize = 1.0;
		  	gl_Position = projectionMatrix * modelViewMatrix * rotation * vec4(position, 1.0) ;
		}`

		const fragment = /* glsl */`
  	#ifdef GL_ES
		precision highp float;
	#endif

   	uniform float time;
	varying vec2 vuv;
	

    void main() {
		float d = distance(vec2(.5,.5), vuv);
		// gl_FragColor = vec4(0.6 +.4*sin(time*10.0),0,0,0);
		float c = 0.4 - 1.8*sin(d);
		gl_FragColor = vec4(c, c, c, 0);
    }`

		const material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },
			},
			vertexShader: vertex,
			fragmentShader: fragment,
		});

		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(0, 0, 0.0);
		this.mesh.visible = false;
	}

	getMesh() {
		return this.mesh;
	}

	//TODO 
	update() {
		super.update();
		let aspect = window.innerWidth / window.innerHeight;
		let y = this.p.y / window.innerHeight - 0.5;
		let x = this.p.x / window.innerWidth - 0.5;

		y *= 2;
		x *= 2 * aspect;

		(this.mesh.material as ShaderMaterial).uniforms.time.value = this.time.getElapsedTime();
		this.mesh.position.set(x, -y, 0);
	}

	draw(context: CanvasRenderingContext2D) {
		context.save();
		context.translate(this.p.x, this.p.y);
		context.rotate(this.d.angle());
		context.translate(0, -25);
		this.drawShipBody(context, false);
		this.drawEngine(context);
		context.restore();
		//super.draw(context);
	}

	drawShipBody(context: CanvasRenderingContext2D, noFill: boolean) {
		context.save();
		//lasery
		context.beginPath();
		context.moveTo(8, 25);
		context.lineTo(8, 10);
		context.moveTo(-8, 25);
		context.lineTo(-8, 10);

		context.shadowBlur = 5;
		context.shadowColor = "white";
		context.strokeStyle = "white";
		context.lineCap = "round";
		context.lineWidth = 1;
		context.stroke();

		//hull
		context.beginPath();
		const r = 2;
		context.moveTo(-r, r);
		context.arcTo(-r, 0, 0, 0, r);
		context.arcTo(r, 0, r, r, r);
		context.lineTo(10, 30);
		context.lineTo(10, 40);
		context.lineTo(0, 35);
		context.lineTo(-10, 40);
		context.lineTo(-10, 30);
		context.closePath();

		context.strokeStyle = "RGBA(250,250,250,1)";
		context.lineWidth = 2;
		context.stroke();

		if (!noFill) {
			context.fillStyle = "RGBA(50,50,50,1)";
		} else {
			context.fillStyle = "RGBA(0,0,0,1)";
		}

		context.fill();
		context.restore();
	}

	drawEngine(context: CanvasRenderingContext2D) {
		if (this.v.magnitude() > 0) {
			context.save();
			context.beginPath();
			context.moveTo(0, 52);
			context.lineTo(0, 45);

			context.shadowBlur = 10;
			context.shadowColor = "white";
			context.strokeStyle = "white";
			context.lineWidth = 8;
			context.lineCap = "round";
			context.globalAlpha = 0.4;
			context.stroke();
			context.fill();
			context.restore();
		}
	}

	shoot() {
		fireAudio.currentTime = 0;
		fireAudio.play();
	}
}

export class Meteor extends Body2d {

	_baseSpeed: number

//#region SETUP
	constructor(size: number) {
		super();
		this.size = size;
		this._baseSpeed = size + 1;
		this.setMass(0.4 + Math.random() * 2);
		this.setAngularVelocity(0.02 - Math.random() * 0.04);
	}

	helper = null;
	shapeSteps = [
		{ x: 20.942705491366354, y: -36.27382995899827 },
		{ x: 42.522363331768396, y: -24.550297916175577 },
		{ x: 41.22362825718526, y: -2.3432919679854233e-14 },
		{ x: 42.534987208462546, y: 24.557586314783098 },
		{ x: 24.887606402107515, y: 43.106598767226615 },
		{ x: 3.54035365363216e-14, y: 41.521706758483255 },
		{ x: -5.00590288128736, y: 31.60602689904441 },
		{ x: -15.450849718747332, y: 47.552825814757696 },
		{ x: -25.44384809985071, y: 31.42053566981547 },
		{ x: -36.745624343564224, y: 21.21509610629771 },
		{ x: -49.22448094573534, y: 7.796391864856141 },
		{ x: -32, y: 3.1263880373444404e-14 },
		{ x: -49.3844170297569, y: -7.821723252011495 },
		{ x: -35.42782175701256, y: -20.45426242821323 },
		{ x: -28.29829765706, y: -34.94548731148582 },
		{ x: -15.222166153193896, y: -46.84901016983103 },
	];

	shapeSteps1 = [
		{ x: 5.318771811367848, y: -33.58140358023468 },
		{ x: 15.450849718747369, y: -47.55282581475767 },
		{ x: 25.6922598124345, y: -31.727298587335138 },
		{ x: 35.90249211782031, y: -20.728313488801977 },
		{ x: 44.614760119914756, y: -7.066283811806148 },
		{ x: 41.72503833990866, y: 8.868930685080821 },
		{ x: 37.403937670217154, y: 24.290401138525404 },
		{ x: 26.458067502596002, y: 36.416405761179 },
		{ x: 15.435676991144604, y: 30.2942218224045 },
		{ x: 15.450849718747396, y: 47.55282581475767 },
		{ x: -2.3026678053851954, y: 43.93751914098659 },
		{ x: -19.228703743440658, y: 43.18837572227746 },
		{ x: -29.581608307922306, y: 29.58160830792235 },
		{ x: -27.506577808748197, y: 19.984698577944112 },
		{ x: -44.55032620941838, y: 22.69952498697738 },
		{ x: -44.00055478584826, y: 4.624644662032122 },
		{ x: -45.48568163517699, y: -12.187851661324775 },
		{ x: -39.553554054025575, y: -28.737339154008367 },
	];

	shapeSteps2 = [
		{ x: 20.942705491366354, y: -36.27382995899827 },
		{ x: 42.522363331768396, y: -24.550297916175577 },
		{ x: 41.22362825718526, y: -2.3432919679854233e-14 },
		{ x: 42.534987208462546, y: 24.557586314783098 },
		{ x: 24.887606402107515, y: 43.106598767226615 },
		{ x: 3.54035365363216e-14, y: 41.521706758483255 },
		{ x: -5.00590288128736, y: 31.60602689904441 },
		{ x: -15.450849718747332, y: 47.552825814757696 },
		{ x: -25.44384809985071, y: 31.42053566981547 },
		{ x: -36.745624343564224, y: 21.21509610629771 },
		{ x: -49.22448094573534, y: 7.796391864856141 },
		{ x: -32, y: 3.1263880373444404e-14 },
		{ x: -49.3844170297569, y: -7.821723252011495 },
		{ x: -35.42782175701256, y: -20.45426242821323 },
		{ x: -28.29829765706, y: -34.94548731148582 },
		{ x: -15.222166153193896, y: -46.84901016983103 },
		{ x: 5.005902881287387, y: -31.606026899044405 },
		{ x: 15.450849718747373, y: -47.55282581475768 },
		{ x: 27.888614774401187, y: -34.439571084609454 },
		{ x: 37.05286178101318, y: -21.392479723513958 },
		{ x: 47.43865933144729, y: -7.513545507957627 },
		{ x: 39.62268618149345, y: 8.422061938868536 },
		{ x: 37.70966128599299, y: 24.488940376030033 },
		{ x: 24.333382622522326, y: 33.492027905547125 },
		{ x: 11.870394794621353, y: 44.300916479427926 },
		{ x: -4.816813289307518, y: 45.828917142414674 },
		{ x: -21.088171950393118, y: 41.38786781174064 },
		{ x: -19.98469857794407, y: 27.506577808748222 },
		{ x: -35.35533905932735, y: 35.35533905932739 },
		{ x: -39.01115139290088, y: 17.368883647033556 },
		{ x: -44.32707156077547, y: 2.323083382620724 },
		{ x: -45.54477282456403, y: -14.798393751154036 },
	];

	shapeSteps3 = [
		{ x: 20.942705491366354, y: -36.27382995899827 },
		{ x: 42.522363331768396, y: -24.550297916175577 },
		{ x: 41.22362825718526, y: -2.3432919679854233e-14 },
		{ x: 42.534987208462546, y: 24.557586314783098 },
		{ x: 24.887606402107515, y: 43.106598767226615 },
		{ x: 3.54035365363216e-14, y: 41.521706758483255 },
		{ x: -25.44384809985071, y: 31.42053566981547 },
		{ x: -36.745624343564224, y: 21.21509610629771 },
		{ x: -49.22448094573534, y: 7.796391864856141 },
		{ x: -32, y: 3.1263880373444404e-14 },
		{ x: -49.3844170297569, y: -7.821723252011495 },
		{ x: -35.42782175701256, y: -20.45426242821323 },
		{ x: -28.29829765706, y: -34.94548731148582 },
		{ x: -15.222166153193896, y: -46.84901016983103 },
		{ x: 5.005902881287387, y: -31.606026899044405 },
		{ x: 15.450849718747373, y: -47.55282581475768 },
		{ x: 43.44288487285723, y: 9.234070237601125 },
		{ x: 38.83554643060442, y: 25.220098738008954 },
		{ x: 25.670397582050818, y: 35.33227112324162 },
		{ x: 10.781431978554927, y: 40.23685192231469 },
		{ x: -5.196715254593896, y: 49.44344289702489 },
		{ x: -18.435631169649703, y: 36.1819634091728 },
		{ x: -18.809128073359112, y: 25.888543819998336 },
		{ x: -35.35533905932734, y: 35.35533905932741 },
		{ x: -42.581847521836046, y: 18.958659990155663 },
		{ x: -43.67849772360049, y: 2.289093068113324 },
		{ x: -44.25518109436087, y: -14.379379997911935 },
	];

	setRadius(r: number) {
		super.setRadius(r);
		this.generateShape();
	}

	generateShape() {
		const type = Math.floor(Math.random() * 20);
		switch (type % 3) {
			case 0:
				this.shapeSteps = this.shapeSteps1;
				break;
			case 1:
				this.shapeSteps = this.shapeSteps2;
				break;
			case 2:
				this.shapeSteps = this.shapeSteps3;
				break;
		}
	}
//#endregion 

	size = 3;
	explode(shootVector: Vector): Array<Meteor> {
		const fragments: Array<Meteor> = [];
		if (this.size > 1) {
			let angle = 0 | Math.PI + Math.PI / (4 - Math.floor(Math.random() * this.size * 2));
			let helperVector = shootVector.rotate(angle);
			for (let i = this.size; i > 0; i--) {
				const fragment = new Meteor(this.size - 1);
				fragment.setRadius(this.size * 10);
				fragment.setPosition2(this.p.add(helperVector));
				helperVector.setMagnitude2(this._baseSpeed - this.size);
				fragment.setVelocity2(helperVector.copy());
				fragment.setDirection2(helperVector.copy());
				let av = 1.5 - Math.random() * 3;
				av = Math.abs(av) < 2 ? 2 : av;
				fragment.setAngularVelocity(this.omega * 1.5 * av);
				fragments.push(fragment);
				helperVector.rotate2((Math.PI * 2) / this.size);
			}
		}
		explosionAudio.currentTime = 0;
		explosionAudio.play();
		return fragments;
	}

	draw(context: CanvasRenderingContext2D) {
		context.save();

		context.translate(this.p.x, this.p.y);
		context.rotate(this.d.angle());
		//context.scale(this.size * 0.34, this.size * 0.34);

		context.beginPath();

		context.moveTo(this.shapeSteps[0].x*this.size * 0.34, this.shapeSteps[0].y*this.size * 0.34);
		this.shapeSteps.forEach((e) => {
			context.lineTo(e.x*this.size * 0.34, e.y*this.size * 0.34);
		});

		context.closePath();

		context.strokeStyle = "white";
		context.lineWidth = 2;
		context.shadowBlur = 5;
		context.shadowColor = "white";
		context.stroke();

		context.fillStyle = "RGBA(40,40,40,1)";
		context.fill();

		context.restore();
	}
}

export class Bullet extends Body2d {
	ghost: boolean = false;

	constructor() {
		super();
		this.setRadius(3);
	}

	draw(context: CanvasRenderingContext2D) {
		if (this.ghost) return;
		context.save();

		context.beginPath();
		context.arc(
			this.p.x,
			this.p.y,
			this.radius,
			(Math.PI / 180) * 0,
			(Math.PI / 180) * 360,
			false
		);

		context.lineWidth = 2;
		context.shadowBlur = 10;
		context.shadowColor = "white";
		context.strokeStyle = "white";
		if (this.ghost) {
			context.shadowColor = "blue";
			context.strokeStyle = "blue";
			context.fillStyle = "blue";
		}
		context.stroke();

		context.globalAlpha = 1;
		context.fillStyle = "white";
		context.fill();

		context.restore();
	}
}
