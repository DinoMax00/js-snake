import Snake from "./snake.js";
import {config} from "./config.js";

let fps = 30;
let now;
let then = Date.now();
let interval = 10000/fps;
let delta;

console.log("loading js");


let canvas = document.createElement("canvas");
canvas.width = config["canvasWidth"];
canvas.height = config["canvasHeight"];
$("#gameWindow").append(canvas);
console.log("canvas is ready");
let snake = new Snake();
snake.draw();


function test(){
    window.requestAnimationFrame(test);
    now = Date.now();
    delta = now-then;
    if(delta > interval){
        then = now - delta%interval;
        snake.move();
        snake.draw();
    }
}

$(document).keyup(function (e){console.log(e.keyCode);
    switch (e.keyCode){
        case 32 :
            console.log("space clicked");
            window.requestAnimationFrame(test);
            break;
        case 37:
            if(e.keyCode === 38) console.log("up left");
            console.log("left clicked");
            snake.change("left");
            break;
        case 38:
            console.log("up clicked");
            snake.change("up");
            break;
        case 39:
            console.log("right clicked");
            snake.change("right");
            break;
        case 40:
            console.log("down clicked");
            snake.change("down");
            break;
    }
});