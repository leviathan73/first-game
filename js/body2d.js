class Body2d {
  p = new Position(0, 0);
  v = new Vector(0, 0);
  a = new Vector(0, 0);
  f = new Vector(0, 0);
  d = new Vector(1, 0);
  m = 1;

  //colisionRadius
  radius = 10;

  constructor() {
  }

  addForce(force) {
    this.f = this.f.add(force);
  }

  setForce(x, y) {
    this.f.x = x;
    this.f.y = y;
  }
  setRadius(r) {
    this.radius = r;
  }

  setPosition(x, y) {
    this.p.x = x;
    this.p.y = y;
  }

  setDirection(x, y) {
    this.d.x = x;
    this.d.y = y;
  }

  setAcceleration(x, y) {
    this.a.x = x;
    this.a.y = y;
  }

  setVelocity(x, y) {
    this.v.x = x;
    this.v.y = y;
  }

  setMass(m) {
    this.m = m;
  }

  update() {
    var a = this.a.add(this.f.divide(this.m));
    this.v = this.v.add(a);
    this.p = this.p.add(this.v);
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
    context.moveTo(this.p.x, this.p.y);
    var n = this.d.normalize().multiply(this.radius)
    context.lineTo(this.p.x + n.x, this.p.y + n.y);
    context.stroke();
    
    context.restore();
  }
}