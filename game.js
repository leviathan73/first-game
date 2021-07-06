const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor(x,y,speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
}
function drawPlayer() {
    ctx.beginPath()
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2, canvas.height - 150, 100, 100);
}

function update() {
    
}
drawPlayer()