var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");

var player = {
    x:0,
    y:0,
    score:0,
    stair:0,
    direction: 1,
    endurance: 100,
}

var camera = {
    x:0,
    y:-80,
    xTarget:0,
    yTarget:-80
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
    camera.yTarget += 80;
    camera.xTarget += 80;

    player.y += 1;
    player.x -= 1

    generateStair()
}

function playerRight(){
    camera.yTarget += 80;
    camera.xTarget -= 80;

    player.y += 1;
    player.x += 1

    generateStair()
}

function drawHealth(){
    ctx.beginPath()
    ctx.rect(        
            0,
            canvas.height - 20,
            player.endurance *2,
            20
    )
    ctx.fill();
    ctx.closePath()
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

function drain(){
    player.endurance -= (player.stair * .0175) 
    if(player.endurance <= 0){
        alert("game over!")
        reset()
    }
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

        drain()
        
        moveCameraY()
        moveCameraX()
        ctx.clearRect(0,0,canvas.width, canvas.height)
        drawHealth()
        drawStairs()
        drawPlayer()

        
        
    }

    requestAnimationFrame(main);
}

function moveCameraX(){
    if(camera.x == camera.xTarget ){
        return
    }
    if(camera.x > camera.xTarget){
        camera.x -= 8
    }else{
        camera.x += 8
    }
}

function moveCameraY(){
    if(camera.y == camera.yTarget ){
        return
    }
    if(camera.y > camera.yTarget){
        camera.y -= 8
    }else{
        camera.y += 8
    }
}

main()

function move(){
    player.endurance += (player.stair * .5)
    if(player.endurance >= 100){
        player.endurance = 100;
    }
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
        direction: 0,
        endurance: 100
    }
    camera = {
        x:0,
        y:-80,
        xTarget:0,
        yTarget:-80
    }
    for(var i = 0; i< 15;i++){
        generateStair()
    }
}

document.addEventListener("keydown",(e)=>{

    if(e.keyCode == keymap.space){
        player.stair ++;

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