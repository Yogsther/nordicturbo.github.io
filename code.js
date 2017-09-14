var slideIndex = 0;
slideShow();

function git(){
    window.location.href = "git.html";
}
function home(){
    window.location.href = "index.html"
}

function error(){
    var audio = new Audio("sound/error.wav");
    audio.play();
}


function slideShow(){
    
    
    
    if (slideIndex < 3){
        slideIndex = slideIndex + 1;
        console.log("Index: " + slideIndex);
    } else {
        slideIndex = 1;
        console.log("Index: " + slideIndex + " Index set to 1");
    }
    
    
    document.getElementById("slide_image").src="img/slideshow_image03.png";
    console.log("working as intended?");
    setTimeout(slideShow, 4000); 
    // Run slideShow() every 4 seconds.
    
    if (slideIndex == 1){
        document.getElementById("slide_image").src="img/slideshow_image01.png"
    } else if (slideIndex == 2){
        document.getElementById("slide_image").src="img/slideshow_image02.png"
    } else if (slideIndex == 3){
        document.getElementById("slide_image").src="img/slideshow_image03.png"
    }
    
}

function slideRedirect(){
    if (slideIndex == 1){
        console.log("Sorry, you cant click this image");
    } else if (slideIndex == 2){
        window.location.href = "https://twitter.com/NordicTurbo";
    } else if (slideIndex == 3){
        window.location.href = "https://github.com/Yogsther/nordicturbo.github.io"
    }
}