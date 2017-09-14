var slideIndex = 0;

slideShowCheck();

loadGif();

function slideShowCheck(){
if (window.location.href.indexOf("index.html") != -1){
    slideShow();
    }
}
    
    

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


function loadGif(){
    // Reload gif when reloading the website
    document.getElementById("header_logo").src="img/website_logo_gif.gif";
 
}




// Slide show 

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
        progressBar();
    } else if (slideIndex == 2){
        document.getElementById("slide_image").src="img/slideshow_image02.png"
        progressBar();
    } else if (slideIndex == 3){
        document.getElementById("slide_image").src="img/slideshow_image03.png"
        progressBar();
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



// Wait function, use wait(5000); waits for 5 seconds.

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}


//Progress bar

function progressBar() {
    var elem = document.getElementById("progress_bar"); 
    var width = 1;
    var id = setInterval(frame, 40);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++; 
            elem.style.width = width + '%'; 
        }
    }
}



 








