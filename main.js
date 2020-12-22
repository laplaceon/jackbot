var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");

var player = {
    x:0,
    y:0,
    score:0,
    stair:0
}
var stairs = []

var keymap = {
    down: 40,
    up: 38,
    left: 37,
    right: 29
}

var limiter = {
    fps: 60,
    then: new Date().getTime(),
    now: new Date().getTime(),
    delta: null,
    interval: null,
}



function generateStair(){
    var stair = {
        direction: Math.floor(Math.random() * 2)
    }
    stairs.push(stair)
    //if there are too many stairs
    if(stairs.length >= 10){
        stairs.shift();
    }
}

function main(){

    limiter.now = new Date().getTime();
    limiter.delta = limiter.now - limiter.then

    
    if(limiter.delta > limiter.interval  ){
        limiter.then = limiter.now - (limiter.delta % limiter.interval)

        //exec loop
        
       
        
    }


    requestAnimationFrame(main);
}