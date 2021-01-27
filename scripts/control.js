import {config} from "./config.js";
import Snake from "./snake.js";

let fps = 30;
let then = Date.now();
let interval = 10000/fps;

export default class Control{
    constructor() {
        this.snake = new Snake();
        this.canvas = document.createElement("canvas");
        this.canvas.width = config["canvasWidth"];
        this.canvas.height = config["canvasHeight"];
        $("#gameWindow").append(this.canvas);
        this.running = false;
        this.event = null;
    }
    init(){
        this.snake.draw();

        console.log("window init");
    }
    move(){
        this.event = window.requestAnimationFrame(this.move);
        let now = Date.now();
        let delta = now-then;
        if(delta > interval){
            then = now - delta%interval;
            this.snake.move();
            this.snake.draw();
        }
    }
    start(){
        console.log("start running");
        this.running = true;
        this.event = window.requestAnimationFrame(this.move);
    }
    pause(){
        console.log("stop");
        this.running = false;
        window.cancelAnimationFrame(this.event);
    }
}