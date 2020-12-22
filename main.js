var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");

var player = {
    x:0,
    y:0,
    score:0,
    stair:0
}
var stairs = [
    {
        direction: 0,
        x: 0,
        y: 0
    }
]

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

limiter.interval = 1000 / this.limiter.fps



function generateStair(){
    var stair = {
        direction: Math.floor(Math.random() * 2),
        x: 0,
        y: stairs.length,
    }
    
    if(stair.direction){
        stair.x = stairs[stairs.length-1].x + 1
    }else{
        stair.x = stairs[stairs.length-1].x - 1
    }

    stairs.push(stair)
    //if there are too many stairs
    if(stairs.length >= 20){
        stairs.shift();
    }
}

function drawStairs(){

    stairs.forEach( stair =>{

   
        ctx.rect(        
                (canvas.width/2 - 20) + (stair.x * 80),
                (canvas.height - 40) - (stair.y * 80),
                100,
                10
        )
        
        ctx.stroke();

    })

}

function main(){

    limiter.now = new Date().getTime();
    limiter.delta = limiter.now - limiter.then

    
    if(limiter.delta > limiter.interval  ){
        limiter.then = limiter.now - (limiter.delta % limiter.interval)

        //exec loop
        drawStairs()
        
    }

    requestAnimationFrame(main);
}

main()