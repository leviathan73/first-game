class Body2d {
  p = new Position(100, 100);
  v = new Vector(0, 0);
  a = new Vector(0, 0);
  f = new Vector(0, 0);
  m = 1;

  //colisionRadius
  radius = 10;

  constructor(m) {
    this.m = m;
  }

    addForce(force) {
    this.f = this.f.add(force);
  }

  applyForce(force) {
    this.f = force;
  }

  setPosition(x, y) {
    this.p.x = x;
    this.p.y = y;
  }

  setVelocity(x, y) {
    this.v.x = x;
    this.v.y = y;
  }

  update() {
    this.a = this.f.multiply(1 / this.m).multiply(0.01);
    this.v = this.v.add(this.a);
    if (this.v.magnitude() > 10) this.v = this.v.normalize().multiply(10);
      this.p = this.p.add(this.v);
      if (this.p.y > window.innerHeight) this.p.y = 0
      if (this.p.y < 0) this.p.y = window.innerHeight;
      if (this.p.x > window.innerWidth) this.p.x = 0
      if (this.p.x < 0) this.p.x = window.innerWidth;

  }

  draw(context) {
      context.save();
      context.beginPath();
      context.font = "11px sans-serif";

      context.fillStyle='rgba(34,34,34,0.7)';
      
      context.strokeStyle = "white";
    
      context.arc(
      this.p.x,
      this.p.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
      );


            
      context.fillRect(this.p.x + this.radius + 5, this.p.y - 15, 100, 100);
      context.strokeRect(this.p.x + this.radius + 5, this.p.y - 15, 100, 100);
      context.stroke();
      context.fillStyle = "#FFFFFF";
      context.fillText(`p = (${Math.floor(this.p.x)},${Math.floor(this.p.y)})`, this.p.x + this.radius + 10, this.p.y);
      context.fillText(
        `v = (${Math.floor(this.v.x*100)/100},${Math.floor(this.v.y*100)/100})`,
        this.p.x + this.radius + 10,
        this.p.y+40
      );
      context.fillText(
        `|v| = ${Math.floor(this.v.magnitude()*100)/100}.000 `.substring(0,10),
        this.p.x + this.radius + 10,
        this.p.y + 20
      );
      
      context.stroke();
      context.restore();
  }
}