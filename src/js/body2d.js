import { Vector, Position, Box, Point } from "./2dmath.js";

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

  constructor() {}

  /**
   * Nadaje siłę obracającą
   * @param {number} force najlepiej zaczynać od wartości od 0 do 1
   */
  setTorgueForce(force) {
    this.af = force;
  }
  /**
   * ustawia przyśpieszenie obrotowe
   * @param {number} aa najlepiej zaczynać od wartości od 0 do 1
   */
  setAngularAcceleration(aa) {
    this.aa = aa;
  }
  /**
   * ustawia prędkość obrotową
   * @param {number} omega najlepiej zaczynać od wartości od 0 do 1
   */
  setAngularVelocity(omega) {
    this.omega = omega;
  }

  addForce(force) {
    this.f = this.f.add(force);
  }

  setForce(x, y) {
    this.f.x = x;
    this.f.y = y;
  }

  /**
   * @param {number} r
   */
  setRadius(r) {
    this.radius = r;
    this.d = this.d.normalize().multiply(this.radius);
  }

  setPosition(x, y) {
    this.p.x = x;
    this.p.y = y;
  }

  setPosition2(p) {
    this.p = p;
  }

  setDirection(x, y) {
    this.d.x = x;
    this.d.y = y;
    this.d = this.d.normalize().multiply(this.radius);
  }
  setDirection2(d) {
    this.d = d.normalize().multiply(this.radius);
  }

  setAcceleration(x, y) {
    this.a.x = x;
    this.a.y = y;
  }

  setVelocity(x, y) {
    this.v.x = x;
    this.v.y = y;
  }

  setVelocity2(v) {
    this.v = v;
  }

  setMass(m) {
    this.m = m;
  }

  update() {
    if (this.freeze) return;
    // ruch liniowy
    var a = this.a.add(this.f.divide(this.m));
    this.v = this.v.add(a);
    this.p = this.p.add(this.v);

    //ruch obrotowy
    var torque = this.af * this.radius;
    var inertia = 0.5 * this.m * this.radius * this.radius; //tylko dla pelnego walca. inne ksztalty powinny miec inny wzór

    var aa = this.aa + torque / inertia;
    this.omega += aa;
    this.d.rotate2(this.omega);
  }

  draw(context) {
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
  checkCollision(/** @type {Body2d} */ intruder) {
    const v = this.p.vectorTo(intruder.p);
    return v.magnitude() <= this.radius + intruder.radius;
  }
}
