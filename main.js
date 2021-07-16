
class Renderer{

    canvas
    context
    camera
    limiter
    actors
    background
    foreground
    ready
    mobile

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
        this.mobile = false;

    }

    checkMobile(){

        this.mobile = typeof window.orientation !== 'undefined';
        return this.mobile;
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

    addForeground(obj){
        //TODO: add sanatize
        this.foreground.push(obj)
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
            this.canvas.width = window.innerWidth;

            if(this.mobile){
                this.canvas.height = window.innerHeight-100;
            }else{
                this.canvas.height = window.innerHeight-200;
            }

            //exec loop

            this.checkReady()

            //clearScreen
            this.context.clearRect(0,0,this.canvas.width, this.canvas.height);

            this.camera.centerCamera( this.actors[0] , this.canvas)
            this.camera.moveCamera()

            if(this.ready){
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

            this.actors[0].checkEndurance()



        }

        requestAnimationFrame(()=>this.render());


    }

}

class Player{

    x
    y
    width
    height
    sprites
    direction
    endurance
    aspect
    stair
    ready
    frame
    score

    constructor(){

        this.width = 20;
        this.height = 20;
        this.x = 0;
        this.y = 0;
        this.stair = 0;
        this.direction = 1;
        this.endurance = null
        this.aspect = false;
        this.stair = 0;
        this.ready = false;
        this.sprites = []
        this.frame = 0;
    }

    reset(){
        this.x = 0;
        this.y = 0;
        this.stair = 0;
        this.direction = 1;
        this.endurance.setValue(100);
        this.stair = 0;
        this.frame = 0;
        this.score.reset()
    }

    async addSprite(path){
        var sprite = new Image();

        return new Promise((resolve)=>{
            sprite.src = path;
            sprite.onload = (e)=>{
                this.ready = true

                this.width = sprite.width;
                this.height = sprite.height;
                this.aspect = this.width / this.height
                this.sprites.push(sprite)
                resolve(sprite)
            }

        })

    }

    isReady(){
        return this.ready;
    }

    checkEndurance(){
        var endurance = this.endurance.getValue();
        endurance -= (this.stair * .0175)
        if(endurance <= 0){
            //this isnt great, but its the only way to reset the game
            main.resetGame();
        }else{
            this.endurance.setValue(endurance)
        }

    }

    addScore(object){
        this.score = object
    }

    changeDirection(){
        this.direction ? this.direction = 0 : this.direction = 1;
        if(this.sprites.length >= 2){
            this.frame ? this.frame = 0 : this.frame = 1;
        }
    }

    render(context, camera = { x:0 , y:0 }, canvas = { width: 0, height: 0}){

        if(this.ready == false){
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
            if(this.direction){
                context.drawImage(
                    this.sprites[this.frame],
                    camera.x + (this.x),
                    camera.y + (this.y),
                    this.width,
                    this.width / this.aspect
                )
            }else{
                context.drawImage(
                    this.sprites[this.frame],
                    camera.x + (this.x),
                    camera.y + (this.y),
                    this.width,
                    this.width / this.aspect
                )
            }

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
        if(typeof keyCode == "number"){
            document.addEventListener("keydown", (e)=>{
                e.preventDefault()
                //yeah yeah its deperacated, TODO: change this
                if(e.keyCode == keyCode){
                    callback()
                }
            })
        }else{
            var item = document.getElementById(keyCode)

            item.addEventListener("click", (e)=>{
                e.preventDefault()
                //yeah yeah its deperacated, TODO: change this
                callback()
            })
        }



    }



}

class ProgressBar{

    x
    y
    width
    height
    percent
    gradient

    constructor(x = 0, y  = 0, width = 100, height = 20, percent = 100){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.percent = percent;
    }

    setGradient(arr, context){
        this.gradient = context.createLinearGradient(0, 0, 150,0);
        arr.forEach( (color,i) =>{
            this.gradient.addColorStop((i+1) / arr.length, color);
        })
    }

    setValue(value){
        this.percent = value
    }

    getValue(){
        return this.percent
    }

    render(context, camera = { x:0 , y:0 }, canvas = { width: 0, height: 0}){
        context.beginPath()
        context.save()

        context.fillStyle = this.gradient
        context.rect(
            (this.x),
            (this.y),
            (this.width * this.percent) / this.width * 2,
            this.height
        )
        context.fill();
        context.closePath()
        context.restore()
    }

}

class Score extends ProgressBar{

    score

    constructor(x = 0, y  = 0){
        super()
        this.score = 0
        this.x = x;
        this.y = y;
    }

    addScore(value){
        this.score += value;
        document.getElementById("hiddenScore").setAttribute("score", this.score);
    }

    render(context, camera = { x:0 , y:0 }, canvas = { width: 0, height: 0}){
        context.beginPath()
        context.font = '24px serif';
        context.fillText('Score: ' + this.score, this.x, this.y);
        context.closePath()
    }

    reset(){
        this.score = 0
        document.getElementById("hiddenScore").setAttribute("score", 0);
    }

}

class Overlay extends ProgressBar{

    constructor(x = 0, y  = 0){
        super()
        this.x = x;
        this.y = y;
    }

    render(context, camera = { x:0 , y:0 }, canvas = { width: 0, height: 0}){
        context.beginPath()
        context.font = '24px serif';
        context.fillText('Game over!', this.x, this.y);
        context.closePath()
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


        if(this.renderer.checkMobile()){
            document.getElementById("mobileControls").style.display = "block"
        }


        //setup gamestate
        this.settings = {
            stairsWidth: 100,
            stairsSpacingY: 120,
            stairsSpacingX: 80,
            stairSprite: "img/stair.png",
            endurance: null
        }


        //create player and setup sprite
        this.player = new Player()
        this.player.addSprite("img/catR.png")
        this.player.addSprite("img/catL.png")


        this.renderer.addActor(this.player)
        this.player.addScore(new Score(0,45))
        this.renderer.addForeground(this.player.score)

        //setup background objects
        this.renderer.setGradient([
            "red","blue"
        ] )
        this.player.endurance = new ProgressBar(0, 0, 400, 20, 100)
        this.renderer.addForeground(this.player.endurance)
        this.player.endurance.setGradient(["rgba(255,0,84,1)","rgba(255,254,0,1)","rgba(255,254,0,1)","rgba(255,254,0,1)","rgba(82,205,97,1)"], this.renderer.context)

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

        this.inputHandler.bind("upButton", ()=>{ //Spacebar - Move up
            this.movePlayer(this.player.direction)
            this.checkStair()
            this.createStair()
        })

        this.inputHandler.bind("directionButtton", ()=>{ //Ctrl - Change direction and move up
            this.player.changeDirection()
            this.movePlayer(this.player.direction)
            this.checkStair()
            this.createStair()
        })

        //start the loop
        setTimeout(()=>{
            this.renderer.render()
            this.resetGame()
        }, 50); //TODO: replace this horrid solution to wait till things loaded

    }

    createStair(){

        var direction = Math.floor(Math.random() * 2);
        var x = 0;
        var y = -(this.renderer.getBackgroundLength() * this.settings.stairsSpacingY) + this.player.height

        if(this.stairs.length == 1){
            //this is the first stair
            x = 0
            direction = 0
        }else if(this.stairs.length == 2){
            direction = 1
            if(direction){
                x = this.stairs[this.stairs.length-1].x + this.settings.stairsSpacingX
            }else{
                x = this.stairs[this.stairs.length-1].x - this.settings.stairsSpacingX
            }
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

        stair.addSprite(this.settings.stairSprite)
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
        var endurance = this.player.endurance.getValue()
        endurance += (this.player.stair * .5)
        if(endurance >= 100){
            endurance = 100;
        }
        this.player.score.addScore(5)
        this.player.endurance.setValue(endurance)
    }

    checkStair(){
        if(this.player.direction != this.stairs[this.player.stair+1].direction){
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


var main = new Main()
