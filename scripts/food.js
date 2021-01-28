import {config} from "./config.js";
import {Node} from "./lib.js";

export default class Food extends Node{
    constructor() {
        super(undefined, undefined, config["foodColor"]);
    }
    /**
     * 生成新的食物坐标
     * @param {[]} pos
     */
    generate(pos){
        let [x, y] = pos;
        let posX = Math.floor(Math.random()*1000)%(config["canvasWidth"]/this.radius/2)*this.radius*2+this.radius;
        let posY = Math.floor(Math.random()*1000)%(config["canvasHeight"]/this.radius/2)*this.radius*2+this.radius;
        while(x===posX && y===posY){
            posX = Math.floor(Math.random()*1000)%(config["canvasWidth"]/this.radius/2)*this.radius*2+this.radius;
            posY = Math.floor(Math.random()*1000)%(config["canvasHeight"]/this.radius/2)*this.radius*2+this.radius;
        }
        this.x = posX;
        this.y = posY;
    }
}