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
        this.actors.push(obj)
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
                camera.x + (canvas.width/2 + 20) + (this.x * 80),
                camera.y + (canvas.height - 80) - (this.y * 80),
                this.width,
                this.height
            )
            context.fill();
            context.closePath()

        }else{
            context.beginPath()
            context.drawImage(
                this.sprite,
                camera.x + (canvas.width/2 + 20) + (this.x * 80),
                camera.y + (canvas.height - 80) - (this.y * 80),
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

    setSpeed(value){
        if(typeof value != 'number') return false;
        this.speed = value
    }

    moveCamera(){
        
        if(this.x == this.targetX ){
            this.velX = 0
        }else if(this.x > this.targetX){
            this.velX = -Math.floor(Math.abs(this.targetX-  this.x) / this.speed)
        }else if(this.x < this.targetX){
            this.velX = Math.floor(Math.abs(this.targetX-  this.x) / this.speed)
        }

        if(this.y == this.targetY ){
            this.velY = 0
        }else if(this.y > this.targetY){
            this.velY = -Math.floor(Math.abs(this.targetY -  this.y) / this.speed)
        }else if(this.y < this.targetY){
            this.velY = Math.floor(Math.abs(this.targetY -  this.y) / this.speed)
        }

        this.x += this.velX
        this.y += this.velY

    }

}

class Background{

}

var renderer = new Renderer()
renderer.addActor(new Player())
renderer.render()