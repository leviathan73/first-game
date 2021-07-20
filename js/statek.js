class Statek {
  body2d = new Body2d(1);
  directionToX;
  directionToY;
    
  angle = 20;

  constructor() {
    this.body2d.setPosition(200, 100);
    this.body2d.setVelocity(1, 0.1);
  }

    update() {
      if(this.directionToX)
        this.angle = Math.PI/2 + Math.atan2(
          (this.directionToY - this.body2d.p.y) ,
            (this.directionToX - this.body2d.p.x)
        );
      this.body2d.update();
  }

  setDirectionTo(x, y) {
      this.directionToX = x;
      this.directionToY = y;
  }

  draw(context) {
    context.save();
    context.translate(this.body2d.p.x, this.body2d.p.y);
    // context.rotate((Math.PI / 180) * this.angle);
    context.rotate(this.angle);
    context.translate(0, -15);
    context.beginPath();
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.moveTo(0, 0);
    context.lineTo(0, -20);
    context.stroke();
    context.beginPath();
    context.strokeStyle = "yellow";
    context.moveTo(0, 0);
    context.lineTo(5, 20);
    context.lineTo(-5, 20);
    context.closePath();
      context.stroke();
     
      if (this.body2d.f.magnitude() > 0)
      {
        console.log(this.body2d.f.magnitude());
        context.beginPath();
        context.strokeStyle = "orange";
        context.lineWidth = 7;
        context.moveTo(0, 22);
        context.lineTo(0, 28);
        context.stroke();
      }    
    context.restore();
    this.body2d.draw(context);
  }
}