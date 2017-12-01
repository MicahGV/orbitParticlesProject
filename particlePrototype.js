var myCanvas = document.getElementById("canV"),
ctx = null,
particleArray = [];

var Particle = function(){
    this.x = myCanvas.width/2+1,
    this.y = myCanvas.height/2-1,
    this.r = 2.5,
    this.numParticles = 10,
    this.ratio = 1/2,   
    this.axis = "y", 
    this.speedX = 0,
    this.speedY = 0,
    this.mass = 50,    
    this.color = "blue";
};

var player = {
    x:myCanvas.width/2,
    y:myCanvas.height/2,
    r:2.5,
    ratio:1/2,   
    axis:"y", 
    speedX:100,
    speedY:100,
    mass:400,    
    color:"red",
    //drawCircle: drawBall,
    //boundary: boundaryChecker
};

Particle.prototype = {
    calculateOrbitSpeed: function(delta) {
        var distance = this.calculateDistance() < 5 ? 100: Math.pow(this.calculateDistance(),2);
        var xAccel = ((player.x - this.x)*player.mass/distance);
        var yAccel = ((player.y - this.y)*player.mass/distance);
    
        this.speedX += xAccel*delta;
        this.speedY += yAccel*delta;
        this.x += this.speedX;
        this.y += this.speedY;
    },
    boundaryChecker: function(){
        if(this.x >= myCanvas.width || this.x <= 0){
            this.speedX *= -.75;
        }
        if(this.y >= myCanvas.height || this.y <= 0){
            this.speedY *= -.75;
        }
    
        if(this.x < -1)
            this.x = 1;
        if(this.x > myCanvas.width+1)
            this.x = myCanvas.width-1;
    
        if(this.y < 0)
            this.y = 1;
        if(this.y > myCanvas.height+1)
            this.y = myCanvas.height-1;
    },
    
    distance:function(){
        return Math.sqrt(Math.pow((player.x-this.x),2)+Math.pow(player.y-this.y,2));
    },
    drawBall:function(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
    },
    randomPosition:function(){
        this.x = Math.random()*myCanvas.width;
        this.y = Math.random()*myCanvas.height;
    }
};

function particleFactory(){
    for(let i = 0; i < 10; i++){
        var newParticle = new Particle();
        particleArray.push(newParticle);
    }
}

window.onload = function(){
    if (typeof (myCanvas.getContext) !== undefined) {
        ctx = myCanvas.getContext('2d');
        particleFactory();
        for(var i = 0; i < particleArray.length;i++){
            particleArray[i].distance();
        };
    }
};