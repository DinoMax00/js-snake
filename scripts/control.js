import {config} from "./config.js";
import Snake from "./snake.js";
import Food from "./food.js";

let fps = 30;
let then = Date.now();
let delta = undefined;
let interval = 5000/fps;

export default class Control{
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = config["canvasWidth"];
        this.canvas.height = config["canvasHeight"];
        $("#gameWindow").append(this.canvas);
        this.snake = new Snake();
        this.snake.draw();
        console.log("window init");
        this.running = false;
        this.event = null;
        this.food = new Food();
        this.food.generate(this.snake.getHead());
    }
    move(){
        this.event = window.requestAnimationFrame(this.move.bind(this));    // be careful of "this"
        let now = Date.now();
        delta = now-then;
        if(delta > interval){
            then = now - delta%interval;
            this.food.draw();
            this.snake.move();
            this.snake.draw();
            if(this.snake.checkFood(this.food.x, this.food.y)){
                this.food.clear();
                this.food.generate(this.snake.getHead());
            }
        }
    }
    start(){
        console.log("start running");
        this.running = true;
        this.event = window.requestAnimationFrame(this.move.bind(this));
    }
    pause(){
        console.log("stop");
        this.running = false;
        window.cancelAnimationFrame(this.event);
    }
    /**
     * 处理键盘按键
     * @param {number} keyCode
     */
    check(keyCode){
        switch (keyCode){
            case 32 :
                console.log("space clicked");
                if(this.running){
                    this.pause();
                }
                else {
                    this.start();
                }
                break;
            case 37:
                console.log("left clicked");
                this.snake.change("left");
                break;
            case 38:
                console.log("up clicked");
                this.snake.change("up");
                break;
            case 39:
                console.log("right clicked");
                this.snake.change("right");
                break;
            case 40:
                console.log("down clicked");
                this.snake.change("down");
                break;
        }
    }
}