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

