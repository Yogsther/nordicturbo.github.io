var dotSpeed = 350;
var animateIndex = 0;
var dots;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function animateTitle(){
    if(animateIndex == 3){
        animateIndex = 0;
        console.log(animateIndex);
        animateDots();
    } else {
        animateIndex = animateIndex + 1;
        console.log(animateIndex);
        animateDots();
    }
}


function animateDots(){
    if(animateIndex == 0){
        dots = "";
    }
    if(animateIndex == 1){
        dots = ".";
    }
    if(animateIndex == 2){
        dots = "..";
    }
    if(animateIndex == 3){
        dots = "...";
    }
    
    document.getElementById("dots").innerHTML = dots;
}

setInterval(function() {
  animateTitle();
}, dotSpeed);


function addBot(){
    window.location.href = "https://discordapp.com/oauth2/authorize?client_id=363749001788522496&scope=bot&permissions=1341643969";
}

function expand01(){
    
    document.getElementById("expand_commands").innerHTML = '<br><span id="second_command">!wire -<i> Send money to another person.</i></span><br><span id="second_command">!startpot -<i> Start a Jackpot.</i></span><br><span id="second_command">!add [amount] -<i> Bett money on the current Jackpot.</i></span><br>'
    document.getElementById("expand").innerHTML = "";
    document.getElementById("header_image").src = "https://i.imgur.com/almEaUq.png"
    
}

function expandDong(){
    document.getElementById("header_image").src = "https://i.imgur.com/Vq6tFX8.png"
    document.getElementById("add_dong").innerHTML = " dong";
}

function despandDong(){
    document.getElementById("header_image").src = "https://i.imgur.com/almEaUq.png"
    document.getElementById("add_dong").innerHTML = "";
}





















