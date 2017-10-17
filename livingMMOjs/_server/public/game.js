






var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);


canvas.width = 512;
canvas.height = 480;

// Image prep
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    console.log("Loaded image");
    bgReady = true;
};
bgImage.src = "spr/bg.jpg"; 

// Player prep
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
    console.log("Loaded image");
    playerReady = true;
};
playerImage.src = "spr/player.png"; 

var player = {
    speed: 10,
    x: 0,
    y: 0
}

// Detect input
// & Update

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var flipped = false;

var update = function () {

    

    if (87 in keysDown) { // Player holding up
		player.y -= player.speed;
        flipped = false;
        
	}
	if (83 in keysDown) { // Player holding down
		player.y += player.speed;
        flipped = false;
	}
	if (65 in keysDown) { // Player holding left
		player.x -= player.speed;
        flipped = true;
    }
	
	if (68 in keysDown) { // Player holding right
		player.x += player.speed;
        flipped = false;
	}
       

    //console.log("Pos: " +player.x + " - " + player.y);
    
}


var render = function render(){

    if(bgReady){
        ctx.drawImage(bgImage, 0, 0, 1000, 1000);
    }
    
    if(playerReady){
        if(flipped){
        
            ctx.drawImage(playerImage, player.x, player.y, 100, 100);
        }
        if(flipped != true){
        ctx.drawImage(playerImage, player.x, player.y, 100, 100);
        }
    }
    
    
    
    
    
    
    
    
};


function loop(){
    
    update();
	render();

	requestAnimationFrame(loop);
}


start();
function start(){
    then = Date.now();
    console.log(Date.now());
    loop();
}