"use strict";

let canvas, ctx, foo;

class ball{
    constructor(x, y) {
        this.x  = x;
        this.y = y;
        this.vx = 3;
        this.vy = 5;
        this.radius = 30;
        this.color = "blue";
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let Balls = []; //new ball(50, 70);

function draw(){
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let Ball of Balls){
        Ball.draw();
        if(Ball.x+Ball.vx+Ball.radius > canvas.width || Ball.x+Ball.vx-Ball.radius < 0){
            Ball.vx = Ball.vx>0?-Math.random()*10:Math.random()*10;
        }
        if(Ball.y+Ball.vy+Ball.radius>canvas.height || Ball.y+Ball.vy-Ball.radius < 0){
            Ball.vy = Ball.vy>0?-Math.random()*10:Math.random()*10;
        }
        Ball.x = Ball.x+Ball.vx;
        Ball.y = Ball.y+Ball.vy;
    }
    foo = window.requestAnimationFrame(draw);
}


$(()=>{
    canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 480;
    $("#gameWindow").append(canvas);
    ctx = canvas.getContext("2d");
    for(let i=0; i<5; i++){
        Balls[i] = new ball(Math.random()*1000%canvas.width, Math.random()*1000%canvas.width);
        Balls[i].draw();
    }
    canvas.addEventListener('mouseover', function(e){
        foo = window.requestAnimationFrame(draw);
    });
    canvas.addEventListener('mouseout', function(e){
        ctx.fillStyle = 'grey';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let Ball of Balls){
            Ball.draw();
        }
        window.cancelAnimationFrame(foo);
    });
});
