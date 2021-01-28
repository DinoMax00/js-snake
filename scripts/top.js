import Control from "./control.js";


let control = new Control();

$(document).keyup(function (e){
    control.check(e.keyCode);
});

$("#reStart").click(()=>{
    control.restart();
});