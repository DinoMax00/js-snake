import {config} from "./config.js";
import Snake from "./snake.js";
import Food from "./food.js";

let then = Date.now();
let delta = undefined;

export default class Control{
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = config["canvasWidth"];
        this.canvas.height = config["canvasHeight"];
        $("#gameWindow").append(this.canvas);
        this.ctx = this.canvas.getContext("2d");

        this.snake = new Snake();
        this.snake.draw();
        this.running = false;
        this.event = null;
        this.food = new Food();
        this.food.generate(this.snake.getHead());
        this.moved = false;
        this.score = 0;
        this.highestScore = 0;
        this.interval = 166;
        console.log("window init");
    }
    /**
     * 进行地图场景的一次更新
     */
    move(){
        this.event = window.requestAnimationFrame(this.move.bind(this));    // be careful of "this"
        let now = Date.now();
        delta = now-then;
        if(delta > this.interval){
            then = now - delta%this.interval;
            this.ctx.fillStyle = config["canvasColor"];
            this.ctx.fillRect(0, 0, config["canvasWidth"], config["canvasHeight"]);
            this.food.draw();
            this.snake.move();
            this.snake.draw();
            this.moved = true;
            let status = this.snake.check(this.food.x, this.food.y);
            if(status===-1){
                this.gameOver();
            }
            else if(status===1){
                this.score += 10;
                this.scoreUpd();
                this.food.generate(this.snake.getHead());
                if(this.snake.length === Math.floor(config["canvasHeight"]*config["canvasWidth"]/config["nodeRadius"]/config["nodeRadius"]/4/4*3)){
                    this.win();
                }
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
     * 重新开始游戏的初始化
     */
    restart(){
        this.pause();
        this.score = 0;
        this.snake = new Snake();
        this.food = new Food();
        this.food.generate(this.snake.getHead());
        this.ctx.fillStyle = config["canvasColor"];
        this.ctx.fillRect(0, 0, config["canvasWidth"], config["canvasHeight"]);
        this.snake.draw();
        this.scoreUpd();
    }
    gameOver(){
        swal("GameOver!", "The highest score has been updated", "error");
        this.highestScore = Math.max(this.highestScore, this.score);
        this.score = 0;
        this.pause();
        this.restart();
    }

    /**
     * 蛇身太长时，调用该函数结束游戏
     */
    win(){
        swal("You Win", "The highest score has been updated", "success");
        this.highestScore = Math.max(this.highestScore, this.score);
        this.score = 0;
        this.pause();
        this.restart();
    }
    /**
     * 更新计分板
     */
    scoreUpd(){
        $("#scoreBoard").html("&nbsp Score: "+this.score);
        $("#historyScore").html("&nbsp Highest score: "+this.highestScore);
    }
    /**
     * 处理键盘按键
     * @param {number} keyCode
     */
    check(keyCode){
        if(keyCode === 32){
            console.log("space clicked");
            if(this.running){
                this.pause();
            }
            else {
                this.start();
            }
        }
        else if(this.moved){
            switch (keyCode){
                case 37:
                    this.snake.change("left");
                    this.moved = false;
                    break;
                case 38:
                    this.snake.change("up");
                    this.moved = false;
                    break;
                case 39:
                    this.snake.change("right");
                    this.moved = false;
                    break;
                case 40:
                    this.snake.change("down");
                    this.moved = false;
                    break;
            }
        }
    }
}