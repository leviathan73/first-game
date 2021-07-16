class Point {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  vectorTo(p) {
    return new Vector(p.x - this.x, p.y - this.y);
  }
  add(v) {
    return new Point(this.x + v.x, this.y + v.y);
  }
}

class Position {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  vectorTo(p) {
    return new Vector(p.x - this.x, p.y - this.y);
  }
  add(v) {
    return new Position(this.x + v.x, this.y + v.y);
  }
}

class Vector {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  normalize() {
    let normX = this.x / this.magnitude();
    let normY = this.y / this.magnitude();
    return new Vector(normX, normY);
  }

  multiply(a) {
    return new Vector(this.x * a, this.y * a);
  }
}

class Box {
  x = 0;
    y = 0;
    
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }


}