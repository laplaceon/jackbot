document.addEventListener('DOMContentLoaded', (event) => {
    console.log(event)
    var main = new Main()
})

class Renderer{

    canvas
    context
    camera
    limiter
    actors
    background
    foreground
    ready

    constructor(camera = new Camera()){

        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        this.limiter = {
            fps: 60,
            then: new Date().getTime(),
            now: new Date().getTime(),
            delta: null,
            interval: null,
        }

        this.camera = camera;

        this.limiter.interval = 1000 / this.limiter.fps;

        this.actors = [] ;
        this.background = []; 
        this.foreground = [];
        this.ready = false;

    }

    setGradient(stops ){
        
    }

    addActor(obj){
        //TODO: add sanatize
        this.actors.push(obj)
    }

    addBackground(obj){
        //TODO: add sanatize
        this.background.push(obj)
    }

    getActorsLength(){
        return this.actors.length
    }

    getBackgroundLength(){
        return this.background.length
    }

    clearBackgrounds(){
        this.background = []
    }

    checkReady(){
        var status = true
        this.actors.forEach( actor =>{
            if(!actor.isReady()){
                status = false;
            }
        })
        this.ready = status
    }

    render(){

        this.limiter.now = new Date().getTime();
        this.limiter.delta = this.limiter.now - this.limiter.then;
        
       
        
        if(this.limiter.delta > this.limiter.interval ){
            this.limiter.then = this.limiter.now - (this.limiter.delta % this.limiter.interval)
            this.canvas.width = window.innerWidth - 18;
            this.canvas.height = window.innerHeight;
            //exec loop

            this.checkReady()

            //clearScreen
            this.context.clearRect(0,0,this.canvas.width, this.canvas.height);

            this.camera.centerCamera( this.actors[0] , this.canvas)
            this.camera.moveCamera()

            if(this.ready){
                console.log("hit")
                this.background.forEach( object =>{
                    object.render(this.context, this.camera, this.canvas);
                })
                this.actors.forEach( object =>{
                    object.render(this.context, this.camera, this.canvas);
                })
                this.foreground.forEach( object =>{
                    object.render(this.context, this.camera, this.canvas);
                })
            }
            
            
        
        }

        requestAnimationFrame(()=>this.render());

        
    }

}

class Player{

    x
    y
    width
    height
    sprite
    direction
    endurance
    aspect
    stair
    ready

    constructor(){

        this.width = 20;
        this.height = 20;
        this.x = 0;
        this.y = 0;
        this.score = 0;
        this.stair = 0;
        this.direction = 1;
        this.endurance = 100;
        this.aspect = false;
        this.stair = 0;
        this.ready = false;
    }

    reset(){
        this.x = 0;
        this.y = 0;
        this.score = 0;
        this.stair = 0; 
        this.direction = 1;
        this.endurance = 100;
        this.stair = 0;
    }

    assignSprite(path){
        this.sprite = new Image();

        this.sprite.onload = ()=>{
            this.ready = true
        }
        this.sprite.src = path;
        this.width = this.sprite.width;
        this.height = this.sprite.height;
        this.aspect = this.width / this.height
    }

    isReady(){
        return this.ready;
    }

    changeDirection(){
        this.direction ? this.direction = 0 : this.direction = 1;
    }

    render(context, camera = { x:0 , y:0 }, canvas = { width: 0, height: 0}){

        if(this.ready == false){
            console.log(
                "not ready"
            )
            context.beginPath()
            context.rect(        
                camera.x + (this.x),
                camera.y + (this.y),
                this.width,
                this.height
            )
            context.fill();
            context.closePath()

        }else{
                context.drawImage(
                    this.sprite,
                    camera.x + (this.x),
                    camera.y + (this.y),
                    this.width,
                    this.width / this.aspect
                )    
        }
        
    }

}

class Camera{

    x
    y
    targetX
    targetY
    velX
    velY
    speed

    constructor(cords = {x:0,y:0}){
        this.x = cords.x
        this.y = cords.y
        this.targetX = cords.x
        this.targetY = cords.y
        this.velX = 0;
        this.velY = 0;
        this.speed = 2;
    }

    setCamera(cords = {x:0,y:0}){
        this.targetX = cords.x
        this.targetY = cords.y
    }

    centerCamera( object , canvas){
        this.setCamera(
            {
                x: ((canvas.width/2 - (object.width/2)) - object.x ),
                y: ((canvas.height/2 - (object.height/2)) - object.y )
            }

        )
    }

    setSpeed(value){
        if(typeof value != 'number') return false;
        this.speed = value
    }

    moveCamera(){
        
        if(this.x == this.targetX ){
            this.velX = 0
        }else if(this.x > this.targetX){
            this.velX = -Math.floor(Math.abs(this.targetX-  this.x) / 2)
        }else if(this.x < this.targetX){
            this.velX = Math.floor(Math.abs(this.targetX-  this.x) / 2)
        }

        if(this.y == this.targetY ){
            this.velY = 0
        }else if(this.y > this.targetY){
            this.velY = -Math.floor(Math.abs(this.targetY -  this.y) / 2)
        }else if(this.y < this.targetY){
            this.velY = Math.floor(Math.abs(this.targetY -  this.y) / 2)
        }

        this.x += this.velX
        this.y += this.velY

    }

}

class Stair extends Player{

    constructor(x = 0 , y = 0 , direction = (Math.floor(Math.random() * 2)), player, width){
        super()
        this.direction = direction;
        
        this.width = width

        this.x = x - (this.width/2 - (player.width/2));
        this.y = y;
    }

}

class Input {

    inputs

    constructor(){
        this.inputs = []
    }

    bind(keyCode, callback = ()=>{
        console.log("empty bind")
    }){
        document.addEventListener("keydown", (e)=>{
            if(e.keyCode == keyCode){
                callback()
            }
        })
        
    }

}

class ProgressBar{

    x
    y
    width
    height
    percent

    constructor(x = 0, y  = 0, width = 100, height = 20, percent = 100){



    }

    render(){

    }

}

class Main {

    renderer
    player
    stairs
    settings
    inputHandler

    constructor(){
        //init the renderer 
        this.renderer = new Renderer()


        //setup gamestate
        this.settings = {
            stairsWidth: 100,
            stairsSpacingY: 120,
            stairsSpacingX: 80,
            playerSprite: "img/cat.png",
            stairSprite: "img/stair.png"
        }
        

        //create player and setup sprite
        this.player = new Player()
        this.player.assignSprite(this.settings.playerSprite)


        this.renderer.addActor(this.player)

        //setup background objects
        this.renderer.setGradient([
            "red","blue"
        ] )

        //input handling and binding
        this.inputHandler = new Input()
        this.inputHandler.bind(32, ()=>{ //Spacebar - Move up
            this.movePlayer(this.player.direction)
            this.checkStair()
            this.createStair()
        })

        this.inputHandler.bind(17, ()=>{ //Ctrl - Change direction and move up
            this.player.changeDirection()
            this.movePlayer(this.player.direction)
            this.checkStair()
            this.createStair()
        })
        
        //start the loop
        this.renderer.checkReady()
        this.resetGame()
        this.renderer.render()
    }

    createStair(){

        var direction = Math.floor(Math.random() * 2);
        var x = 0;
        var y = -(this.renderer.getBackgroundLength() * this.settings.stairsSpacingY) + this.player.height

        if(this.stairs.length == 1){
            //this is the first stair
            x = 0
        }else{
            
            if(direction){
                x = this.stairs[this.stairs.length-1].x + this.settings.stairsSpacingX
            }else{
                x = this.stairs[this.stairs.length-1].x - this.settings.stairsSpacingX
            }

        }


        this.stairs.push({
            direction: direction,
            x:x,
            y:y
        })

        var stair = new Stair( 
            x,
            y,
            direction,
            this.player,
            this.settings.stairsWidth
        )

        stair.assignSprite(this.settings.stairSprite)
        this.renderer.background.push(stair)



    }

    movePlayer(direction){

        if(direction){
            this.player.x += this.settings.stairsSpacingX
        }else{ 
            this.player.x -= this.settings.stairsSpacingX
        }

        
        this.player.y -= this.settings.stairsSpacingY
        this.player.stair ++
    }

    checkStair(){
        if(this.player.direction != this.stairs[this.player.stair+1].direction){
            console.log("failed")
            this.resetGame()
        }
    }

    resetGame(){

        this.stairs = [
            {
                direction: 0,
                x:0,
                y:0
            }
        ]
        this.renderer.clearBackgrounds()
        for(var i = 0; i < 20; i++){
            this.createStair()
        }
        this.player.reset()

    }

    
}
//left is 0 : right is 1




