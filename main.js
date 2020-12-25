class Render{

    canvas
    context
    limiter

    constructor(){

        this.canvas = document.getElementById("myCanvas")
        this.context = this.canvas.getContext("2d")

        this.limiter = {
            fps: 60,
            then: new Date().getTime(),
            now: new Date().getTime(),
            delta: null,
            interval: null,
        }

        this.limiter.interval = 1000 / this.limiter.fps


    }

    render(){

        limiter.now = new Date().getTime();
        limiter.delta = limiter.now - limiter.then


        if(limiter.delta > limiter.interval  ){
            limiter.then = limiter.now - (limiter.delta % limiter.interval)
            canvas.width = window.innerWidth - 18;
            canvas.height = window.innerHeight;
            //exec loop

            //clearScreen
            ctx.clearRect(0,0,canvas.width, canvas.height)
        
        }

        requestAnimationFrame( (this)=>{
            this.render()
        });

        
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

    }

    assignSprite(path){
        this.sprite = new Image();
        this.sprite.src = path;
        this.width = sprite.width;
        this.height = sprite.height;
    }



}