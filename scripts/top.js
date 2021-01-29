import Control from "./control.js";
import {config} from "./config.js";

let control = new Control();

$(document).keyup(function (e){
    control.check(e.keyCode);
});

$("#reStart").click(()=>{
    control.restart();
});

$("#mode1").click(()=>{
    control.pause();
    swal("Mode Changed", "easy mode", "success");
    control.interval = config["mod1"];
});

$("#mode2").click(()=>{
    control.pause();
    swal("Mode Changed", "medium mode", "success");
    control.interval = config["mod2"];
});

$("#mode3").click(()=>{
    control.pause();
    swal("Mode Changed", "hard mode", "success");
    control.interval = config["mod3"];
});