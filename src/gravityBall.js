
var myCanvas = document.getElementById("canV"),
    ctx = null,
    lastTime = (new Date().getTime()),
    currentTime = 0,
    requestId,
    particleArray = [],
    paused = false;
    delta = 0;    
myCanvas.width = window.innerWidth*.95;
myCanvas.height = window.innerHeight*.95; 
myCanvas.style.height = window.innerHeight;
myCanvas.style.width = window.innerWidth;
var drawBall = function(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
}

var boundaryChecker = function(){
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
};


var particle = function(){
    this.x = myCanvas.width/2+1,
    this.y = myCanvas.height/2-1,
    this.r = 1.5,
    this.numParticles = 10,
    this.ratio = 1/2,   
    this.axis = "y", 
    this.speedX = 0,
    this.speedY = 0,
    this.mass = 50,    
    this.color = "blue";
};

var controls = {
    clear:function(){ctx.clearRect(0,0,myCanvas.width,myCanvas.height);},
    particleNum: 200,
    speedLimit:20,
};

particle.prototype = {
    calculateOrbitSpeed: function(delta) {
        var distance = this.distance() < 5 ? 100: Math.pow(this.distance(),2);
        var xAccel = ((player.x - this.x)*player.mass/distance);
        var yAccel = ((player.y - this.y)*player.mass/distance);
    
        this.speedX += xAccel*delta;
        this.speedY += yAccel*delta;
        this.x += this.speedX;
        this.y += this.speedY;
        if(Math.abs(this.speedX) > controls.speedLimit)
            this.speedX = this.speedX < 0? -controls.speedLimit: controls.speedLimit;
        if(Math.abs(this.speedY) > controls.speedLimit)
            this.speedY = this.speedY < 0 ? -controls.speedLimit: controls.speedLimit;
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
    if(controls.particleNum - particleArray)
    for(let i = 0; i < controls.particleNum - particleArray.length; i++){
        var newParticle = new particle();
        newParticle.randomPosition();
        particleArray.push(newParticle);
    }
}


var player = {
    x:myCanvas.width/2,
    y:myCanvas.height/2,
    r:2.5,
    ratio:1/2,   
    axis:"y", 
    speedX:0,
    speedY:0,
    mass:2000,    
    color:"black",
    drawCircle: drawBall,
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
###     ###  ########### ############ ###    ##
####   ####  ##       ##      ##      ####   ##
## ##### ##  ##       ##      ##      ## ##  ##
##  ###  ##  ###########      ##      ##  ## ##
##   #   ##  ##       ##      ##      ##   #### 
##       ##  ##       ## ###########  ##    ###
*/
function mainLoop(){
    window.requestAnimationFrame(mainLoop);
    currentTime = (new Date().getTime());
    delta = (currentTime - lastTime) / 1000;
    player.boundary();
    for(let i = 0; i < particleArray.length;i++){
        particleArray[i].boundaryChecker();        
        particleArray[i].calculateOrbitSpeed(delta);
    };
    player.x += (player.speedX*delta);
    player.y += (player.speedY*delta);
    lastTime = currentTime;
    ctx.fillStyle = 'rgba(132, 131, 128,0.05)';
    ctx.fillRect(0, 0, myCanvas.width ,myCanvas.height);
    player.drawCircle();
    for(let i = 0; i <particleArray.length;i++ ){
        particleArray[i].drawBall();        
    }
    //triangleConnection();
};

var speedRatio = function(){
    if(player.speedX < 0)
        player.speedX = -100;
    else
        player.speedX = 100;
    if(player.speedY < 0)
        player.speedY = -100;
    else
        player.speedY = 100;
    if(player.axis =="y"){
        player.speedX *= player.ratio;
        player.speedY /= player.ratio;
    } else {
        player.speedX /= player.ratio;
        player.speedY *= player.ratio;
    }
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
};

window.onload = function(){
    if (typeof (myCanvas.getContext) !== undefined) {
        ctx = myCanvas.getContext('2d');
        var gui = new dat.GUI();
        var ball = gui.addFolder("Ball");
        particleFactory();
        ball.add(player,"mass",0,100000);
        ball.add(player,"speedX",-1000,1000).listen();
        ball.add(player,"speedY",-1000,1000).listen();
        gui.add(controls,"clear");
        //gui.add(controls,"particleNum");
        gui.close();
        mainLoop();
    }
}

var initialX;
var initialY;
function onMouseDown(event){
    dragging = true;
    var rect = myCanvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    player.x = mouseX;
    player.y = mouseY;
    initialX = mouseX;
    initialY = mouseY;
    player.speedX = 0;
    player.speedY = 0;    
}
function onMouseUp(event){
    var rect = myCanvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    player.speedX = initialX - mouseX;
    player.speedY = initialY - mouseY;   
    player.x = initialX;
    player.y = initialY;
    dragging = true;
}

function adjustCanvas(event){
    // set the canvas resolution to CSS pixels (innerWidth and Height are in CSS pixels)
    myCanvas.width = window.innerWidth   // floor with |0
    myCanvas.height = window.innerHeight 

    // match the display size to the resolution set above
    myCanvas.style.width = canvas.width + "px"; 
    myCanvas.style.height = canvas.height + "px";
}

myCanvas.addEventListener("mousedown",e => {onMouseDown(e)});
//myCanvas.addEventListener("mousemove",e=>{onMouseMove(e)});
myCanvas.addEventListener("mouseup",e=>{onMouseUp(e)});
window.addEventListener("resize",e =>{adjustCanvas(e)});


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


