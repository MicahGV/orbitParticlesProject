
var myCanvas = document.getElementById("canV"),
    gameAreaId = document.getElementById("gameArea"),
    ctx = null,
    lastTime = performance.now(),
    currentTime = 0,
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

var controls = {
    clean:function(){
        ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    },
    clear:function(){
        gravityWellArray.length = 1;
        emitterArray.length = 0;
    },
    particleNum: 200,
    speedLimit:20,
    colorSpeedRatio:0.10,
    particleMax:200,
    randomize:function(){
        for(let i = 0; i < particleArray.length;i++){
            particleArray[i].speedX = 0;
            particleArray[i].speedY = 0;            
            particleArray[i].randomPosition();
        }
        for(let k = 1; k < gravityWellArray.length;k++){
            gravityWellArray[k].randomPosition();
        }
    },
    start:function start() {
        if (!requestId) {
           requestId = window.requestAnimationFrame(mainLoop);
        }
    },
    stop:function stop() {
        if (requestId) {
           window.cancelAnimationFrame(requestId);
           requestId = undefined;
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
    this.r = 10,
    this.mass = 4000,
    this.repulse = true,        
    this.innerHueNum = 160,
    this.outerHueNum = 320,
    this.innerHue1OrNeg1 = 1,
    this.outerHue1OrNeg1 = 1,
    this.innerColor = "blue",
    this.outerColor = "orange";
};

gravityWell.prototype = {
    drawBall:function(){
        var gradient = ctx.createRadialGradient(this.x,this.y,this.r*.5,this.x,this.y,this.r,this.x,this.y);
        gradient.addColorStop(0,this.innerColor);
        gradient.addColorStop(.8,this.outerColor);
        gradient.addColorStop(1,this.innerColor);
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle = gradient;
        ctx.fill();
    },
    randomPosition:function(){
        this.x = Math.random()*myCanvas.width;
        this.y = Math.random()*myCanvas.height;
    },
    transitionColor:function(){
        this.innerColor = "hsl("+this.innerHueNum+",100%,20%)";
        this.outerColor = "hsl("+this.outerHueNum+",100%,20%)";
        if(this.innerHueNum <= 160)
            this.innerHue1OrNeg1 = 1;
        else if(this.innerHueNum >= 320)
            this.innerHue1OrNeg1 = -1;
        if(this.outerHueNum <= 160)
            this.outerHue1OrNeg1 = 1;
        else if(this.outerHueNum >= 320)
            this.outerHue1OrNeg1 = -1;
        this.OuterHueNum += this.outerHue1OrNeg1*controls.colorSpeedRatio;        
        this.innerHueNum += this.innerHue1OrNeg1*controls.colorSpeedRatio;
    },
    createGravitywell: function createGravitywell(event,mouseX,mouseY){
        const key = event.key;
        if(key == 'g'){
            var gravityDot = null;
            for(let i = 1; i < gravityWellArray.length;i++){
                var x = gravityWellArray[i].x;
                var y = gravityWellArray[i].y;
                var distance = Math.sqrt(Math.pow((x - mouseX),2)+Math.pow(y-mouseY,2));
                if(distance <= gravityWellArray[i].r){
                    gravityWellArray[i].mass *= 1.25;
                    gravityWellArray[i].r *= 1.25;
                    return;
                }
            };
            if(gravityDot == null){
                gravityDot = new gravityWell(mouseX,mouseY);
            }
    
            gravityWellArray.push(gravityDot);
        }
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
    this.x = 0,
    this.y = 0,
    this.r = .5,
    this.speedX = 0,
    this.speedY = 0,
    this.mass = 50,    
    this.hueNum = 0,
    this.hue1OrNeg1 = 1,
    this.color = "blue";
};
/*
TODO: ISOLATE xAccel and yAccell
TODO: ADDING MIRRORING
TODO: TEST GRAVITY PULSE
*/
particle.prototype = {
    calculateOrbitSpeed: function (delta){
        var xAccel = 0;
        var yAccel = 0;
        for(var i = 0; i < gravityWellArray.length;i++){
            var distance = this.distance(gravityWellArray[i]) < 6 ? 100: Math.pow(this.distance(gravityWellArray[i]),2);
            if(gravityWellArray[i].repulse){
                xAccel -= ((gravityWellArray[i].x - this.x)*gravityWellArray[i].mass/distance);
                yAccel -= ((gravityWellArray[i].y - this.y)*gravityWellArray[i].mass/distance);
            }
            else {
                xAccel += ((gravityWellArray[i].x - this.x)*gravityWellArray[i].mass/distance);
                yAccel += ((gravityWellArray[i].y - this.y)*gravityWellArray[i].mass/distance);
            }
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
    
        if(this.y < -1)
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
        this.speedX = 0;
        this.speedY = 0;
    },
    transitionColor:function(){
            this.color = "hsl("+this.hueNum+",100%,50%)";
            if(this.hueNum <= 0)
                this.hue1OrNeg1 = 1;
            else if(this.hueNum >= 360)
                this.hue1OrNeg1 = -1;
            this.hueNum += this.hue1OrNeg1*controls.colorSpeedRatio;
    },
    emitterPositions:function(x,y,direction){
        this.x = x;
        this.y = y;
        this.speedX = 10*direction;
        this.speedY = 10/direction;
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
        newParticle.randomPosition();
        particleArray.push(newParticle);
    };    
}
/*
8888888888 888b     d888 888b     d888 8888888 88888888888 88888888888 8888888888 8888888b.  
888        8888b   d8888 8888b   d8888   888       888         888     888        888   Y88b 
888        88888b.d88888 88888b.d88888   888       888         888     888        888    888 
8888888    888Y88888P888 888Y88888P888   888       888         888     8888888    888   d88P 
888        888 Y888P 888 888 Y888P 888   888       888         888     888        8888888P"  
888        888  Y8P  888 888  Y8P  888   888       888         888     888        888 T88b   
888        888   "   888 888   "   888   888       888         888     888        888  T88b  
8888888888 888       888 888       888 8888888     888         888     8888888888 888   T88b

*/
var emitterArray = [];

function particleEmitter(x,y,direction){
     this.x = x,
     this.y = y,
     this.r = 1,
     this.direction = direction,
     this.color = "white"
}

particleEmitter.prototype = {
    createParticle: function(){
        if(controls.particleNum < controls.particleMax){
            var newParticle = new particle();
            newParticle.emitterPositions(this.x,this.y,this.direction)
            particleArray.push(newParticle);
            controls.particleNum++;
        }
    },
    drawBall:function(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
    },
    createEmitter: function(event,mouseX,mouseY){
        const key = event.key
        if(key == "e"){
            var newEmitter = new particleEmitter(mouseX,mouseY,1);
            emitterArray.push(newEmitter);
        }
    }
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
    speedX:1,
    speedY:1,
    repulse:false,            
    mass:5000,    
    color:"white",
    drawBall: drawBall,
    boundary: boundaryChecker,
    transitionColor: function(){}
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
var requestId;
function mainLoop(){
    requestId = undefined;
    render();
    controls.start()
};

function render(){
    currentTime = performance.now();
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
    ctx.fillStyle = 'rgba(0, 0, 0,0.05)';
    ctx.fillRect(0, 0, myCanvas.width ,myCanvas.height);
    //player.drawCircle();
    for(let j = 1; j < gravityWellArray.length; j++){
        gravityWellArray[j].transitionColor();
    }
    for(let k = 0; k < gravityWellArray.length; k++){
        gravityWellArray[k].drawBall();
    }
    for(let i = 0; i <particleArray.length;i++ ){
        particleArray[i].drawBall();        
    }
    for(let z = 0; z < emitterArray.length;z++){
        emitterArray[z].drawBall();
        emitterArray[z].createParticle();
    }
}

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
    var gui = new dat.GUI(),
    movingMass = gui.addFolder("Moving Mass"),
    particleControl = gui.addFolder("Particle Control");
    
   movingMass.add(player,"mass",0,100000);
   movingMass.add(player,"speedX",-1000,1000).listen();
   movingMass.add(player,"speedY",-1000,1000).listen();
   movingMass.open();
   particleControl.add(controls,"particleNum",0).onChange(e => particleFactory()).listen();
   particleControl.add(controls,"particleMax",0);
   particleControl.add(controls,"speedLimit",0);
   particleControl.add(controls,"colorSpeedRatio",0,2);
   particleControl.close()
    gui.add(controls,"clean");
    gui.add(controls,"clear");
    gui.add(controls,"randomize");
    gui.add(controls,"start");
    gui.add(controls,"stop");    
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
    window.addEventListener("keydown",e => {gravityWell.prototype.createGravitywell(e,mouseXPosition,mouseYPosition)}); 
    window.addEventListener("keydown",e => {particleEmitter.prototype.createEmitter(e,mouseXPosition,mouseYPosition)});
}

function onMouseDown(event){
    //console.log(Math.pow(particleArray[0].distance(gravityWellArray[0]),2));    
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


