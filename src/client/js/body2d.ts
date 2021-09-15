import { Vector, Position, Box, Point } from "./2dmath";
import { Meteor } from "./actors";

export class Body2d {
  p = new Position(0, 0);
  v = new Vector(0, 0);
  a = new Vector(0, 0);
  f = new Vector(0, 0);
  d = new Vector(1, 0);
  omega = 0; //prędkość obrotu
  aa = 0; //przyspieszenie kątowe
  af = 0; //siła przyłożona w punkcie gdzie body "patrzy"
  m = 1;
  radius = 10;
  freeze = false;

  private _lastupdate: number;
	_speedfactor: number;
	private _fps: number;
	
	getFPSString() {
		return `fps: ${Math.floor(this._fps)}`
	} 
  
  constructor() {
	  this._lastupdate = performance.now();
	  this._speedfactor = 0.05;
	  this._fps = 0;
  }

  /**
   * Nadaje siłę obracającą
   * @param {number} force najlepiej zaczynać od wartości od 0 do 1
   */
  setTorgueForce(force: number) {
    this.af = force;
  }
  /**
   * ustawia przyśpieszenie obrotowe
   * @param {number} aa najlepiej zaczynać od wartości od 0 do 1
   */
  setAngularAcceleration(aa: number) {
    this.aa = aa;
  }
  /**
   * ustawia prędkość obrotową
   * @param {number} omega najlepiej zaczynać od wartości od 0 do 1
   */
  setAngularVelocity(omega: number) {
    this.omega = omega;
  }

  addForce(force: Vector) {
    this.f = this.f.add(force);
  }

  setForce(x: number, y: number) {
    this.f.x = x;
    this.f.y = y;
  }

  /**
   * @param {number} r
   */
  setRadius(r: number) {
    this.radius = r;
    this.d = this.d.normalize().multiply(this.radius);
  }

  setPosition(x: number, y: number) {
    this.p.x = x;
    this.p.y = y;
  }

  setPosition2(p: Position) {
    this.p = p;
  }

  setDirection(x: number, y: number) {
    this.d.x = x;
    this.d.y = y;
    this.d = this.d.normalize().multiply(this.radius);
  }
  setDirection2(d: Vector) {
    this.d = d.normalize().multiply(this.radius);
  }

  setAcceleration(x: number, y: number) {
    this.a.x = x;
    this.a.y = y;
  }

  setVelocity(x: number, y: number) {
    this.v.x = x;
    this.v.y = y;
  }

  setVelocity2(v: Vector) {
    this.v = v;
  }

  setMass(m: number) {
    this.m = m;
  }

  update() {
    if (this.freeze) return;
	const dt = performance.now() - this._lastupdate;
	this._fps =  Math.abs(this._fps - (1000/dt)) > 3?(1000/dt):this._fps;
    // ruch liniowy
    var a = this.a.add(this.f.divide(this.m));
    this.v = this.v.add(a.multiply(dt*this._speedfactor));
    this.p = this.p.add(this.v.multiply(dt*this._speedfactor));
    
    //ruch obrotowy
    var torque = this.af * this.radius;
    var inertia = 0.5 * this.m * this.radius * this.radius; //tylko dla pelnego walca. inne ksztalty powinny miec inny wzór

    var aa = this.aa + torque / inertia;
    this.omega += aa;
    this.d.rotate2(this.omega);
	this._lastupdate = performance.now();
  }

  draw(context: CanvasRenderingContext2D) {
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

    context.stroke();
    context.beginPath();
    context.strokeStyle = "blue";
    context.moveTo(this.p.x, this.p.y);
    var n = this.d.normalize().multiply(this.radius);
    context.lineTo(this.p.x + n.x, this.p.y + n.y);
    context.stroke();
    context.save();
    context.strokeStyle = "yellow";
    var af = this.d
      .normalize()
      .multiply(this.af * 1000 * 3)
      .rotate(Math.PI / 2);
    var afp = this.p.add(n).add(af);
    context.beginPath();
    context.moveTo(this.p.x + n.x, this.p.y + n.y);
    context.lineTo(afp.x, afp.y);
    context.stroke();
    context.restore();

    context.restore();
  }

  /**
   *
   * @param {Body2d} intruder
   * @returns {boolean}
   */
  checkCollision(/** @type {Body2d} */ intruder: Meteor) {
    const v = this.p.vectorTo(intruder.p);
    return v.magnitude() <= this.radius + intruder.radius;
  }
}
