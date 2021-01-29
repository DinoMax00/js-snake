import {config} from "./config.js";

export default class Node{
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = config["nodeRadius"];
        this.ctx = $("canvas")[0].getContext("2d");
    }
    draw(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.stroke();
    }
    clear(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.fillStyle = config["canvasColor"];
        this.ctx.strokeStyle = config["canvasColor"];
        this.ctx.fill();
        this.ctx.stroke();
    }
}