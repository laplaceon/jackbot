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

function main(){

    limiter.now = new Date().getTime();
    limiter.delta = limiter.now - limiter.then

    
    if(limiter.delta > limiter.interval  ){
        limiter.then = limiter.now - (limiter.delta % limiter.interval)

        //exec loop
        
       
        
    }


    requestAnimationFrame(main);
}