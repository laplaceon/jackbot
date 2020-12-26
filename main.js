class Renderer{

    canvas
    context
    camera
    limiter
    actors
    background
    foreground

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

    render(){

        this.limiter.now = new Date().getTime();
        this.limiter.delta = this.limiter.now - this.limiter.then;


        if(this.limiter.delta > this.limiter.interval  ){
            this.limiter.then = this.limiter.now - (this.limiter.delta % this.limiter.interval)
            this.canvas.width = window.innerWidth - 18;
            this.canvas.height = window.innerHeight;
            //exec loop

            //clearScreen
            this.context.clearRect(0,0,this.canvas.width, this.canvas.height);

            this.camera.centerCamera( this.actors[0] , this.canvas)
            this.camera.moveCamera()

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

    }

    assignSprite(path){
        this.sprite = new Image();
        this.sprite.src = path;
        this.width = sprite.width;
        this.height = sprite.height;
        this.aspect = this.width / this.height
    }

    render(context, camera = { x:0 , y:0 }, canvas = { width: 0, height: 0}){

        if(!this.aspect){
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
            context.beginPath()
            context.drawImage(
                this.sprite,
                camera.x + (this.x),
                camera.y + (this.y),
                this.width,
                this.width / this.aspect
            )
            context.fill();
            context.closePath()
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

class Main {

    renderer
    player
    stairs
    settings

    constructor(){
        this.renderer = new Renderer()
        this.player = new Player()
        this.renderer.addActor(this.player)
        this.stairs = [
            {
                direction: 0,
                x:0,
                y:0
            }
        ]

        this.renderer.render()

        this.settings = {
            stairsWidth: 100,
            stairsSpacingY: 100,
            stairsSpacingX: 80,

        }
        
        this.createStair()
        this.createStair()
        this.createStair()
        
    }

    createStair(){

        var direction = Math.floor(Math.random() * 2);
        var x = 0;
        var y = -(this.renderer.getBackgroundLength() * this.settings.stairsSpacingY) + 30

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

        this.renderer.background.push(new Stair( 
            x,
            y,
            direction,
            this.player,
            this.settings.stairsWidth
        ))

    }

    movePlayer(direction){

        if(direction){
            this.player.x += this.settings.stairsSpacingX
        }else{ 
            this.player.x -= this.settings.stairsSpacingX
        }

        this.player.y -= this.settings.stairsSpacingY
        
    }


}

//left is 0 : right is 1

var main = new Main()


