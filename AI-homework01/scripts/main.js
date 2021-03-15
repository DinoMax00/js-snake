/*
 * 基本参数,常量
 */
// 画布大小
const videoWidth = 265;
const videoHeight = 158;
const gameWindowWidth = 480;
const gameWindowHeight = 480;
// 游戏信息
const initX = gameWindowWidth/2;
const initY = gameWindowWidth/2;
const baseLen = 10;
const diff = 20;
const fps = 6;
const sampleTime = 15;
let start = 0;
let score = 0;
let highestScore = 0;

/*
 * 交互部分的全局变量
 */
let controlMode = "keyboard";
let globalDirection = "right";
let dirCnt = 0;
let upNum = 0,
    downNum = 0,
    leftNum = 0,
    rightNum = 0;

/*
 * 目标检测部分
 * 采用instance mode会遇到奇怪的bug
 */

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = './my_model/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
    frameRate(100);
    let myWindow = createCanvas(videoWidth, videoHeight);
    myWindow.parent("aiWindow");
    // Create the video
    video = createCapture(VIDEO);
    video.size(videoWidth, videoHeight);
    video.hide();

    flippedVideo = ml5.flipImage(video);
    // Start classifying
    classifyVideo();
}

function draw() {
    background(0);
    // Draw the video
    image(flippedVideo, 0, 0);

    // Draw the label
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();

}

// 更新方向计数
function countDirection(direct){
    if(controlMode!=="gesture")
        return;
    switch(direct){
        case "up":
            upNum++;
            break;
        case "down":
            downNum++;
            break;
        case "left":
            leftNum++;
            break;
        case "right":
            rightNum++;
            break;
    }
    dirCnt++;
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;
    countDirection(label);
    // Classify again!
    classifyVideo();
}


/*
 * 贪吃蛇画布
 * instance mode
 */
new p5(p=>{
    let length = baseLen;
    let bodyX = [],
        bodyY = [];
    let foodX = 0,
        foodY = 0;
    let direction = "right";

    p.setup = function () {
        start = 0;
        let gameWindow = p.createCanvas(gameWindowWidth, gameWindowHeight);
        gameWindow.parent("gameWindow");

        p.frameRate(fps);
        p.stroke(255);
        p.strokeWeight(diff);

        // 初始化蛇
        for(let i=0; i<length; i++){
            bodyX.push(initX+i*diff);
            bodyY.push(initY);
        }
        updFood();
    };

    p.draw = function () {
        p.background(0);
        // 画蛇
        p.stroke("white");
        for(let i=0; i<length-1; i++){
            if(Math.abs(bodyX[i]-bodyX[i+1])<=diff && Math.abs(bodyY[i]-bodyY[i+1])<=diff)
            p.line(bodyX[i], bodyY[i], bodyX[i+1], bodyY[i+1]);
        }
        // 画吃的
        p.stroke("red");
        p.point(foodX, foodY);
        // 画布上方显示方向
        p.stroke("black");
        p.fill('white');
        p.textSize(16);
        p.textAlign(p.CENTER);
        p.text("current direction: "+direction, gameWindowWidth/2, 20);

        if(!start) return;

        foodDetect();
        // gameDetect();
        updPosition();
        updScore();
        if(controlMode==="gesture")
            updDirection();
    };

    /**
     * 方向更新
     */
    function updDirection(){
        if(dirCnt<sampleTime) return;
        if(upNum>max(downNum, max(leftNum, rightNum))) direction = "up";
        else if(downNum>max(upNum, max(leftNum, rightNum))) direction = "down";
        else if(leftNum>max(downNum, max(upNum, rightNum))) direction = "left";
        else if(rightNum>max(downNum, max(leftNum, upNum))) direction = "right";
        dirCnt = upNum = downNum = leftNum = rightNum = 0;
    }
    /**
     * 食物生成
     */
    function updFood(){
        foodX = floor(random(2, gameWindowWidth/diff-2))*diff;
        foodY = floor(random(2, gameWindowHeight/diff-2))*diff;
    }

    /**
     * 吃食物检测
     */
    function foodDetect(){
        if(foodX===bodyX[length-1] && foodY===bodyY[length-1]){
            bodyX.unshift(bodyX[0]);
            bodyY.unshift(bodyY[0]);
            length++;
            score += 10;
            updFood();
        }
    }

    /**
     * 重开
     */
    function reStart(){
        start = 0;
        // 初始化蛇
        bodyX = [];
        bodyY = [];
        direction = "right";
        length = baseLen;
        for(let i=0; i<length; i++){
            bodyX.push(initX+i*diff);
            bodyY.push(initY);
        }
        highestScore = max(highestScore, score);
        score = 0;
        updFood();
    }

    /**
     * 更新计分板
     */
    function updScore(){
        $("#scoreBoard").html("&nbsp Score: "+score);
        $("#historyScore").html("&nbsp Highest score: "+highestScore);
    }

    /**
     * 失败检测
     */
    function gameDetect(){
        for(let i=0; i<length-1; i++){
            if(bodyX[i]===bodyX[length-1] && bodyY[i]===bodyY[length-1]){
                alert("sb");
                reStart();
            }
        }
    }

    /**
     * 蛇身坐标更新
     */
    function updPosition(){
        for(let i=0; i<length-1; i++){
            bodyX[i] = bodyX[i+1];
            bodyY[i] = bodyY[i+1];
        }
        switch (direction){
            case "right":
                bodyX[length-1] += diff;
                break;
            case "left":
                bodyX[length-1] -= diff;
                break;
            case "down":
                bodyY[length-1] += diff;
                break;
            case "up":
                bodyY[length-1] -= diff;
                break;
            default:
                break;
        }
        if(bodyX[length-1]===gameWindowWidth+diff) bodyX[length-1]-=gameWindowWidth+diff;
        if(bodyY[length-1]===gameWindowHeight+diff) bodyY[length-1]-=gameWindowHeight+diff;
        if(bodyX[length-1]===-diff) bodyX[length-1]+=gameWindowWidth+diff;
        if(bodyY[length-1]===-diff) bodyY[length-1]+=gameWindowHeight+diff;
    }

    /**
     * 键盘事件监测
     */
    p.keyReleased = function () {
        if(keyCode===32){
            start = !start;
        }
        if(controlMode !== "keyboard")
            return;
        switch (keyCode) {
            case 74:
                if (direction !== 'right') {
                    direction = 'left';
                }
                break;
            case 76:
                if (direction !== 'left') {
                    direction = 'right';
                }
                break;
            case 73:
                if (direction !== 'down') {
                    direction = 'up';
                }
                break;
            case 75:
                if (direction !== 'up') {
                    direction = 'down';
                }
                break;
        }
    }
});
/**
 * 按钮控制
 */
$("#reStart").click(()=>{
    p.restart();
});

$("#mode1").click(()=>{
    start = 0;
    swal("Mode Changed", "Keyboard Control", "success");
    controlMode = "keyboard";
});

$("#mode2").click(()=>{
    start = 0;
    swal("Mode Changed", "Gesture Control", "success");
    controlMode = "gesture";
});

$("#mode3").click(()=>{
    start = 0;
    swal("Mode Changed", "Audio Control", "success");
    controlMode = "audio";
});