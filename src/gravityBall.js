
var myCanvas = document.getElementById("canV"),
    gameAreaId = document.getElementById("gameArea"),
    ctx = null,
    lastTime = (new Date().getTime()),
    currentTime = 0,
    requestId,
    paused = false,
    delta = 0;    
myCanvas.width = window.innerWidth*.95;
myCanvas.height = window.innerHeight*.95; 
//myCanvas.style.height = window.innerHeight;
//myCanvas.style.width = window.innerWidth;
/*
888b     d888 8888888 .d8888b.   .d8888b.  
8888b   d8888   888  d88P  Y88b d88P  Y88b 
88888b.d88888   888  Y88b.      888    888 
888Y88888P888   888   "Y888b.   888        
888 Y888P 888   888      "Y88b. 888        
888  Y8P  888   888        "888 888    888 
888   "   888   888  Y88b  d88P Y88b  d88P 
888       888 8888888 "Y8888P"   "Y8888P" 
 */

function newGradient() {
    var c1 = {
        r: Math.floor(Math.random()*255),
        g: Math.floor(Math.random()*255),
        b: Math.floor(Math.random()*255)
    };
    return 'rgb('+c1.r+','+c1.g+','+c1.b+')';
}


var controls = {
    clean:function(){
        ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    },
    clear:function(){gravityWellArray.length = 1;},
    particleNum: 200,
    speedLimit:20,
    colorSpeedRatio:0.10,
    randomize:function(){
        for(let i = 0; i < particleArray.length;i++){
        particleArray[i].randomPosition();
        }
        for(let k = 1; k < gravityWellArray.length;k++){
            gravityWellArray[k].randomPosition();
        }
    }
};

/* 
 .d8888b.  8888888b.         d8888 888     888 8888888 88888888888 Y88b   d88P      888       888 8888888888 888      888      888      
d88P  Y88b 888   Y88b       d88888 888     888   888       888      Y88b d88P       888   o   888 888        888      888      888      
888    888 888    888      d88P888 888     888   888       888       Y88o88P        888  d8b  888 888        888      888      888      
888        888   d88P     d88P 888 Y88b   d88P   888       888        Y888P         888 d888b 888 8888888    888      888      888      
888  88888 8888888P"     d88P  888  Y88b d88P    888       888         888          888d88888b888 888        888      888      888      
888    888 888 T88b     d88P   888   Y88o88P     888       888         888          88888P Y88888 888        888      888      888      
Y88b  d88P 888  T88b   d8888888888    Y888P      888       888         888          8888P   Y8888 888        888      888      888      
 "Y8888P88 888   T88b d88P     888     Y8P     8888888     888         888          888P     Y888 8888888888 88888888 88888888 88888888  */
var gravityWellArray = [];

var gravityWell = function(x,y){
    this.x = x,
    this.y = y,
    this.r = 4,
    this.mass = 1000,
    this.color = "black";
};

gravityWell.prototype = {
    drawBall:function(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
    },
    randomPosition:function(){
        this.x = Math.random()*myCanvas.width;
        this.y = Math.random()*myCanvas.height;
    },
};

function createGravitywell(event,mouseX,mouseY){
    const key = event.key;
    if(key == 'g'){
        var gravityDot = new gravityWell(mouseX,mouseY);
        gravityWellArray.push(gravityDot);
    }
};
/*
8888888b.     d8888 8888888b. 88888888888 8888888 .d8888b.  888      8888888888 
888   Y88b   d88888 888   Y88b    888       888  d88P  Y88b 888      888        
888    888  d88P888 888    888    888       888  888    888 888      888        
888   d88P d88P 888 888   d88P    888       888  888        888      8888888    
8888888P" d88P  888 8888888P"     888       888  888        888      888        
888      d88P   888 888 T88b      888       888  888    888 888      888        
888     d8888888888 888  T88b     888       888  Y88b  d88P 888      888        
888    d88P     888 888   T88b    888     8888888 "Y8888P"  88888888 8888888888
 */
var particleArray = [];

var particle = function(){
    this.x = Math.random()*myCanvas.width,
    this.y = Math.random()*myCanvas.height,
    this.r = 1.5,
    this.speedX = 0,
    this.speedY = 0,
    this.mass = 50,    
    this.hueNum = 0,
    this.hue1OrNeg1 = 1,
    this.color = "blue";
};

particle.prototype = {
    calculateOrbitSpeed: function (delta){
        var xAccel = 0;
        var yAccel = 0;
        for(var i = 0; i < gravityWellArray.length;i++){
            var distance = this.distance(gravityWellArray[i]) < 5 ? 200: Math.pow(this.distance(gravityWellArray[i]),2);
            xAccel += ((gravityWellArray[i].x - this.x)*gravityWellArray[i].mass/distance);
            yAccel += ((gravityWellArray[i].y - this.y)*gravityWellArray[i].mass/distance);
        }
        this.speedX += xAccel*delta;
        this.speedY += yAccel*delta;
        this.x += this.speedX;
        this.y += this.speedY;
        if(Math.abs(this.speedX) > controls.speedLimit)
            this.speedX = this.speedX < 0? -controls.speedLimit: controls.speedLimit;
        if(Math.abs(this.speedY) > controls.speedLimit)
            this.speedY = this.speedY < 0 ? -controls.speedLimit: controls.speedLimit;
    },
    distance:function (gravityDot){
        return Math.sqrt(Math.pow((gravityDot.x-this.x),2)+Math.pow(gravityDot.y-this.y,2));
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
    drawBall:function(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
    },
    randomPosition:function(){
        this.x = Math.random()*myCanvas.width;
        this.y = Math.random()*myCanvas.height;
    },
    transitionColor:function(){
            this.color = "hsl("+this.hueNum+",100%,50%)";
            if(this.hueNum <= 0)
                this.hue1OrNeg1 = 1;
            else if(this.hueNum >= 360)
                this.hue1OrNeg1 = -1;
            this.hueNum += this.hue1OrNeg1*controls.colorSpeedRatio;
    }
};

function particleFactory(){
    var particleLength = particleArray.length;
    if(controls.particleNum - particleLength < 0){
        let num = Math.abs(controls.particleNum - particleLength);
        for(;num > 0;num--){
            particleArray.pop();
        }
    }; 
    for(let i = 0; i < controls.particleNum - particleLength; i++){
        var newParticle = new particle();
        particleArray.push(newParticle);
    };    
}


/*
8888888b.  888             d8888 Y88b   d88P 8888888888 8888888b.  
888   Y88b 888            d88888  Y88b d88P  888        888   Y88b 
888    888 888           d88P888   Y88o88P   888        888    888 
888   d88P 888          d88P 888    Y888P    8888888    888   d88P 
8888888P"  888         d88P  888     888     888        8888888P"  
888        888        d88P   888     888     888        888 T88b   
888        888       d8888888888     888     888        888  T88b  
888        88888888 d88P     888     888     8888888888 888   T88b */
var drawBall = function(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
}

var boundaryChecker = function(){
    if(this.x >= myCanvas.width || this.x <= 0){
        this.speedX *= -1;
    }
    if(this.y >= myCanvas.height || this.y <= 0){
        this.speedY *= -1;
    }

    if(this.x < -1)
        this.x = 1;
    if(this.x > myCanvas.width+1)
        this.x = myCanvas.width-1;

    if(this.y < 0)
        this.y = 1;
    if(this.y > myCanvas.height+1)
        this.y = myCanvas.height-1;
};

var player = {
    x:myCanvas.width/2,
    y:myCanvas.height/2,
    r:2.5,
    speedX:0,
    speedY:0,
    mass:2000,    
    color:"black",
    drawBall: drawBall,
    boundary: boundaryChecker
};

function triangleConnection() {
    ctx.beginPath();
    ctx.moveTo(particle.x,particle.y);
    ctx.lineTo(player.x,player.y);
    ctx.lineTo(player.x,particle.y);
    ctx.lineTo(particle.x,particle.y);
    ctx.stroke();
};

/*
888b     d888        d8888 8888888 888b    888 
8888b   d8888       d88888   888   8888b   888 
88888b.d88888      d88P888   888   88888b  888 
888Y88888P888     d88P 888   888   888Y88b 888 
888 Y888P 888    d88P  888   888   888 Y88b888 
888  Y8P  888   d88P   888   888   888  Y88888 
888   "   888  d8888888888   888   888   Y8888 
888       888 d88P     888 8888888 888    Y888 
                                               
*/
function mainLoop(){
    window.requestAnimationFrame(mainLoop);
    currentTime = (new Date().getTime());
    delta = (currentTime - lastTime) / 1000;
    player.boundary();
    for(let i = 0; i < particleArray.length;i++){
        particleArray[i].boundaryChecker();        
        particleArray[i].calculateOrbitSpeed(delta);
        particleArray[i].transitionColor();
    };
    //particleArray[0].calculateOrbitSpeed(delta);
    player.x += (player.speedX*delta);
    player.y += (player.speedY*delta);
    lastTime = currentTime;
    ctx.fillStyle = 'rgba(132, 131, 128,0.05)';
    ctx.fillRect(0, 0, myCanvas.width ,myCanvas.height);
    //player.drawCircle();
    for(let i = 0; i <particleArray.length;i++ ){
        particleArray[i].drawBall();        
    }
    for(let k = 0; k < gravityWellArray.length; k++){
        gravityWellArray[k].drawBall();
    }
    //triangleConnection();
};

window.onload = function(){
    if (typeof (myCanvas.getContext) !== undefined) {
        ctx = myCanvas.getContext('2d');
        createGUI();
        events();
        gravityWellArray.push(player);
        particleFactory();
        mainLoop();
    }
};


function createGUI(){
    var gui = new dat.GUI();
    var ball = gui.addFolder("Ball");
    ball.add(player,"mass",0,100000);
    ball.add(player,"speedX",-1000,1000).listen();
    ball.add(player,"speedY",-1000,1000).listen();
    ball.open();
    gui.add(controls,"particleNum",0).onChange(e => particleFactory());
    gui.add(controls,"speedLimit",0);
    gui.add(controls,"colorSpeedRatio",0,2);
    gui.add(controls,"clean");
    gui.add(controls,"clear");
    gui.add(controls,"randomize");
    gui.close();
};

/*
8888888888 888     888 8888888888 888b    888 88888888888 .d8888b.  
888        888     888 888        8888b   888     888    d88P  Y88b 
888        888     888 888        88888b  888     888    Y88b.      
8888888    Y88b   d88P 8888888    888Y88b 888     888     "Y888b.   
888         Y88b d88P  888        888 Y88b888     888        "Y88b. 
888          Y88o88P   888        888  Y88888     888          "888 
888           Y888P    888        888   Y8888     888    Y88b  d88P 
8888888888     Y8P     8888888888 888    Y888     888     "Y8888P"  
*/
var initialX, initialY;

var mouseXPosition, mouseYPosition;

function events(){
    myCanvas.addEventListener("mousedown",e => {onMouseDown(e)});
    myCanvas.addEventListener("mousemove",e=>{onMouseMove(e)});
    myCanvas.addEventListener("mouseup",e=>{onMouseUp(e)});
    window.addEventListener("resize",e =>{adjustCanvas(e)});
    window.addEventListener("keydown",e => {createGravitywell(e,mouseXPosition,mouseYPosition)}); 
}

function onMouseDown(event){
    var rect = myCanvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    player.x = mouseX;
    player.y = mouseY;
    initialX = mouseX;
    initialY = mouseY;
    player.speedX = 0;
    player.speedY = 0;    
};
function onMouseMove(event){
    var rect = myCanvas.getBoundingClientRect();    
    mouseXPosition = event.clientX - rect.left;
    mouseYPosition = event.clientY - rect.top;
}

function onMouseUp(event){
    var rect = myCanvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    player.speedX = initialX - mouseX;
    player.speedY = initialY - mouseY;   
    player.x = initialX;
    player.y = initialY;
};

function adjustCanvas(event){
    // set the canvas resolution to CSS pixels (innerWidth and Height are in CSS pixels)
    myCanvas.width = window.innerWidth*.95;
    myCanvas.height = window.innerHeight*.95;  
    gameAreaId.style.height = window.innerWidth*.95;
    gameAreaId.style.width = window.innerHeight*.95;  
    // match the display size to the resolution set above
   // myCanvas.style.width = myCanvas.width + "px"; 
    //myCanvas.style.height = myCanvas.height + "px";
};

/*

8888888b.   .d88888b.  888    Y88b   d88P 8888888888 8888888 888      888      
888   Y88b d88P" "Y88b 888     Y88b d88P  888          888   888      888      
888    888 888     888 888      Y88o88P   888          888   888      888      
888   d88P 888     888 888       Y888P    8888888      888   888      888      
8888888P"  888     888 888        888     888          888   888      888      
888        888     888 888        888     888          888   888      888      
888        Y88b. .d88P 888        888     888          888   888      888      
888         "Y88888P"  88888888   888     888        8888888 88888888 88888888 
                                                                            
*/
// requestAnimationFrame polyfill by Erik Moeller
var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };


