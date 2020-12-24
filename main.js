var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");

var player = {
    x:0,
    y:0,
    score:0,
    stair:0,
    direction: 1
}

var camera = {
    x:0,
    y:-80,
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
    right: 39,
    space: 32,
    direction: 17
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
    // if(stairs.length >= 20){
    //     stairs.shift();
    // }
}

function drawPlayer(){

    ctx.beginPath()
    ctx.rect(        
        camera.x + (canvas.width/2 + 20) + (player.x * 80),
        camera.y + (canvas.height - 80) - (player.y * 80),
        20,
        20
    )
    ctx.fill();
    ctx.closePath()
    
}

function playerLeft(){
    camera.y += 80;
    camera.x += 80;

    player.y += 1;
    player.x -= 1

    generateStair()
}

function playerRight(){
    camera.y += 80;
    camera.x -= 80;

    player.y += 1;
    player.x += 1

    generateStair()
}

function drawStairs(){

    stairs.forEach( stair =>{

        ctx.beginPath()
        ctx.rect(        
                camera.x + (canvas.width/2 - 20) + (stair.x * 80),
                camera.y + (canvas.height - 40) - (stair.y * 80),
                100,
                10
        )
        ctx.fill();
        ctx.closePath()
        

    })

}

for(var i = 0; i< 15;i++){
    generateStair()
}


function main(){

    limiter.now = new Date().getTime();
    limiter.delta = limiter.now - limiter.then

    
    if(limiter.delta > limiter.interval  ){
        limiter.then = limiter.now - (limiter.delta % limiter.interval)

        //exec loop
        
        ctx.clearRect(0,0,canvas.width, canvas.height)
        drawStairs()
        drawPlayer()
        
    }

    requestAnimationFrame(main);
}

main()

function move(){
    if(player.direction){
        playerLeft()
    }else{
        playerRight()
    }
}

function reset(){
    stairs = [
        {
            direction: 0,
            x: 0,
            y: 0
        }
    ]

    player = {
        x:0,
        y:0,
        score:0,
        stair:0,
        direction: 0
    }
    camera = {
        x:0,
        y:-80,
    }
    for(var i = 0; i< 15;i++){
        generateStair()
    }
}

document.addEventListener("keydown",(e)=>{

    if(e.keyCode == keymap.space){
        player.stair ++;
        console.log("player: " +player.direction)
        console.log("stairs: " +stairs[player.stair].direction)

        if(player.direction == stairs[player.stair].direction){
            alert("gameover")
            reset()
        }else{
            move()
        }
        
    }
    else if(e.keyCode == keymap.direction){

        
        player.stair ++;      
        player.direction ? player.direction = 0 : player.direction = 1;
        console.log("player: " +player.direction)
        console.log("stairs: " +stairs[player.stair].direction)
        if(player.direction == stairs[player.stair].direction){
            alert("gameover")
            reset()
        }else{
            move()
        }
        
        
    }

    if(e.keyCode == 87){
        camera.y -= 1
    }
    if(e.keyCode == 83){
        camera.y += 1
    }

    if(e.keyCode == 65){
        camera.x -= 1
    }

    if(e.keyCode == 68){
        camera.y += 1
    }
})