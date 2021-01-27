import {config} from "./config.js";
import {Node} from "./lib.js";


export default class Snake{
    constructor() {
        this.direction = "up";
        this.length = config["baseLength"];
        this.speed = config["baseSpeed"];
        this.body = [];
        this.body.push(new Node(config["canvasWidth"]/2+config["nodeRadius"], config["canvasHeight"]/2+config["nodeRadius"], config["headColor"]));
        for(let i=1; i<this.length; i++){
            let x = this.body[i-1].x -2 * config["nodeRadius"];
            let y = this.body[i-1].y;
            let color = (i%2) ? config["bodyColorOdd"] : config["bodyColorEven"];
            this.body.push(new Node(x, y, color));
        }
    }
    /**
     * 画蛇
     */
    draw(){
        for(let node of this.body){
            node.draw();
        }
    }
    /**
     *  蛇移动一次
     */
    move(){
        this.body[this.length-1].clear();
        for(let i=this.length-1; i>=1; i--){
            this.body[i].x = this.body[i-1].x;
            this.body[i].y = this.body[i-1].y;
        }
        switch (this.direction){
            case "right":
                this.body[0].x += this.speed;
                this.body[0].x %= config["canvasWidth"];
                break;
            case "left":
                this.body[0].x -= this.speed;
                this.body[0].x += config["canvasWidth"];
                this.body[0].x %= config["canvasWidth"];
                break;
            case "down":
                this.body[0].y += this.speed;
                this.body[0].y %= config["canvasHeight"];
                break;
            case "up":
                this.body[0].y -= this.speed;
                this.body[0].y += config["canvasHeight"];
                this.body[0].y %= config["canvasHeight"];
                break;
            default : alert("direction error!");
        }
    }
    /**
     * 改变运动方向
     * @param {string} Direction 改变的方向
     */
    change(Direction){
        if(this.direction === "up" || this.direction === "down"){
            if(Direction === "left" || Direction === "right"){
                this.direction = Direction;
            }
        }
        else if(this.direction === "left" || this.direction === "right"){
            if(Direction === "up" || Direction === "down"){
                this.direction = Direction;
            }
        }
    }
}