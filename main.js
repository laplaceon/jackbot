var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");

// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

if (typeof window.orientation !== 'undefined') { 
    document.getElementById("mobileControls").style.display = "grid"
}


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

    ctx.beginPath()
    ctx.fillStyle = "grey"
    ctx.font = '18px serif';
    ctx.fillText('Endurance', 55, canvas.height -5);
    ctx.fillStyle = "black"
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

function drawScore(){
    ctx.beginPath()
    ctx.font = '18px serif';
    ctx.fillText('Score: ', 5, canvas.height - 28);
    ctx.fillText(player.score, 55, canvas.height - 28);
    ctx.closePath()
}


function main(){

    limiter.now = new Date().getTime();
    limiter.delta = limiter.now - limiter.then
    
    
    if(limiter.delta > limiter.interval  ){
        limiter.then = limiter.now - (limiter.delta % limiter.interval)
        canvas.width = window.innerWidth - 18;
        canvas.height = window.innerHeight;
        //exec loop

        drain()
        
        moveCameraY()
        moveCameraX()
        ctx.clearRect(0,0,canvas.width, canvas.height)
        drawHealth()
        drawStairs()
        drawPlayer()
        drawScore()

        
        
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
    player.score += 5
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

document.getElementById("directionButton").onclick = function(e){
    player.stair ++;      
    player.direction ? player.direction = 0 : player.direction = 1;
    if(player.direction == stairs[player.stair].direction){
        alert("gameover")
        reset()
    }else{
        move()
    }
}

document.getElementById("upButton").onclick = function(e){
    player.stair ++;

    if(player.direction == stairs[player.stair].direction){
        alert("gameover")
        reset()
    }else{
        move()
    }
}