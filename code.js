var slideIndex = 0;

var credits = readCookie("credits");
var crates = readCookie("crates");


// Price of a crate (default should be 1000 credits)
var priceOfCrate = 1000;

checkForDev();
aboutPageCheck();
slideShowCheck();
checkIfThemeApplies();
checkCrateStatus();

// Get Credits
getCredits();
// Get Num of Crates
getCrates();

function reloadPage(){
    location.reload();
}

function checkIfThemeApplies(){
    if (window.location.href.indexOf("crate") != -1){
        return false;
    }else{
        getTheme();
        checkClaim();
    }
    
}

function checkForDev(){
    
    if (window.location.href.indexOf("crate") != -1){
        var devMode = readCookie("dev");
        if(devMode == "true"){
        // Get devmode buttons for crate.html
            // Summon Credit Button
            document.getElementById("dev_buttons_crate").innerHTML += '<button class="btn" style="width: 100px;" onclick="addCredits(1000);">Add Credits</button> <button class="btn" style="width: 100px;" onclick="addCrates(1);">Add Crates</button> <button class="btn" style="width: 210px; background-color: red; color: white;" onclick="disableDev();">Disable Devmode</button>';
            
            console.log("Devmode is active.");
        }
}
}

function enableDev(){
    var devMode = true;
    createCookie("dev", devMode, 10000);
    console.log("Devmode has been enabled.");
    checkForDev();
    location.reload();
}

function disableDev(){
    var devMode = false;
    createCookie("dev", devMode, 10000);
    checkForDev();
    location.reload();
}

function slideShowCheck(){
if (window.location.href.indexOf("index.html") != -1){
    slideShow();
    }
}

function aboutPageCheck(){
if (window.location.href.indexOf("about.html") != -1){
    getSavedSkins();
    }
}
    
// Button redirect functions    

function git(){
    window.location.href = "git.html";
}

function home(){
    window.location.href = "index.html"
}

function about(){
    window.location.href = "about.html"
}

function error(){
    var audio = new Audio("sound/error.wav");
    audio.play();
}

// Only for the two default themes - Red and Blue
function changeTheme(){
    // Change theme and play a little sound.
    getTheme();
    var currentTheme = readCookie("Theme");
    if(currentTheme == "Default"){
        // Change to red
        window.setTimeout(ThemeRed,300); 
        createCookie("Theme", "Red", 10000); 
        console.log("Theme changed to Red");
    } else {
        // Change back to defualt if the current theme is not defult.
        createCookie("Theme", "Default", 10000); 
        window.setTimeout(ThemeDefault,300);
        
    }

    
    
    document.getElementById("header_logo").src="img/website_logo_gif.gif";
    var click = new Audio("sound/click.wav");
    click.play();
    
 
}

// Theme skins code

function addSkins(){
    var skinName = document.getElementById("theme_chooser").value;
    document.getElementById("theme_chooser").value = "";
    console.log(skinName);
    
    // Change skin to superDark
    if(skinName.toLowerCase() == "superdark"){
        superDark();
        console.log("You saved SuperDark");
    }
    
    if(skinName.toLowerCase() == "emerald"){
        Emerald(); }
    
    if(skinName.toLowerCase() == "halloween2017"){
        Halloween2017(); }
    
    if(skinName.toLocaleLowerCase() == "lgbt2017"){
        LGBT2017();
    }
    
    
    getSavedSkins();
    window.location.reload(false); 
}

function getSavedSkins(){
    
    //Read every saved skin
    var superDark = readCookie("superDark");
    var Emerald = readCookie("Emerald");
    var Halloween2017 = readCookie("Halloween2017");
    var LGBT2017 = readCookie("LGBT2017");
    
    // Check every theme
    if(superDark == "true"){
        document.getElementById("saved_skins").innerHTML += 'superDark        <button class="btn" onclick="superDark()">Choose</button><br>';}
    if(Emerald == "true"){
        document.getElementById("saved_skins").innerHTML += 'Emerald        <button class="btn" onclick="Emerald()">Choose</button><br>';}
    if(Halloween2017 == "true"){
        document.getElementById("saved_skins").innerHTML += 'Halloween 2017        <button class="btn" onclick="Halloween2017()">Choose</button><br>';}
    
    if(LGBT2017 == "true"){
      document.getElementById("saved_skins").innerHTML += 'Pride 2017        <button class="btn" onclick="LGBT2017()">Choose</button><br>';}
    
}

function LGBT2017(){
    
    // Save theme
    createCookie("LGBT2017", true, 10000);
    
    // Change colors and banner
        document.getElementById("background_div").style.backgroundColor = "#e2403b";
        document.getElementById("header_table").style.backgroundImage = "url(img/banner_lgbt_2017.gif)";

    // Change to theme 
    createCookie("Theme", "LGBT2017", 10000);
    
    
    
}



function Halloween2017(){
    // Save theme
    createCookie("Halloween2017", true, 10000);
    
    // Change colors
        document.getElementById("background_div").style.backgroundColor = "#111111";
        document.getElementById("header_table").style.backgroundImage = "url(img/banner_halloween2017.gif)";
    
// IMG        document.getElementById("header_table").style.backgroundImage = "url()";
    
    
    // Change to theme 
    createCookie("Theme", "Halloween2017", 10000);
    
}


// Change to Emerald & save it.
function Emerald(){
    // Save theme
    createCookie("Emerald", true, 10000);
    
    // Change colors
        document.getElementById("background_div").style.backgroundColor = "#6df75b";
        document.getElementById("header_table").style.backgroundColor = "#43a337";
        document.getElementById("header_table").style.backgroundImage = "url()";
// IMG        document.getElementById("header_table").style.backgroundImage = "url()";
    
    
    // Change to theme 
    createCookie("Theme", "Emerald", 10000);
    
}



// Change to superDark & save it. 
function superDark(){
    // Save superDark
        createCookie("superDark", true, 10000);
        console.log("Saved superDark");
        console.log("superDark skin selected!");
        
        // Change colors
        document.getElementById("background_div").style.backgroundColor = "#3a3a3a";
        document.getElementById("header_table").style.backgroundColor = "#1e1e1e";
        document.getElementById("header_table").style.backgroundImage = "url()";
        
        
        // CHANGE TO SUPER DARK HERE!!!
        createCookie("Theme", "superDark", 10000);
}





// Theme manager:

function getTheme(){
    
    var currentTheme = readCookie("Theme");
    if(currentTheme == null){
        // Create cookie if user is new to the site.
        createCookie("Theme", "Default", 10000); 
        console.log("Created Cookie, Default theme.");
        
    } else if (currentTheme == "Default"){
        window.setTimeout(ThemeDefault,300); 
        
    } else if (currentTheme == "Red"){
        // Change theme to Red.
       // window.setTimeout(ThemeRed,300); 
        ThemeRed();    
    } else if (currentTheme == "superDark"){
        // Change theme to superDark
        superDark();
            
    } else if (currentTheme == "Emerald"){
        // Change theme to Emerald
        Emerald();
    } else if (currentTheme == "Halloween2017"){
        // Change theme to Emerald
        Halloween2017();
    } else if (currentTheme == "LGBT2017"){
        // Change theme to Emerald
        LGBT2017();
    }
    
    
    
    
    
    else {
        // Error, this should not happen.
        console.error("Error: 1 - No theme found!");
    }
  
}


// Change to Theme: Red
function ThemeRed(){
        // Background color
        document.getElementById("background_div").style.backgroundColor = "#ce2d2d";
        // Header color
        document.getElementById("header_table").style.backgroundColor = "#f44242";
        document.getElementById("header_table").style.backgroundImage = "url()";
        // Debug
        console.log("Red theme is selected.");  
    
        // Background Color  document.getElementById("members_background_shadow").style.backgroundColor = "#cd932d";
        // Text color  document.getElementById("members_header_text").style.color = "#f9ba4c"; 
}

// Change to Theme: Default
function ThemeDefault(){
        
        document.getElementById("background_div").style.backgroundColor = "#2d3f53";
        document.getElementById("header_table").style.backgroundColor = "#436a95";
        console.log("Defualt theme is selected.");
        document.getElementById("header_table").style.backgroundImage = "url()";
        // Debug
    
        // Background Color  document.getElementById("members_background_shadow").style.backgroundColor = "#cd932d";
        // Text color  document.getElementById("members_header_text").style.color = "#f9ba4c"; 
}




// Claiming button function

function claimHourlyCredits(){
    
    
    createCookie("creditsClaimed", true, 0.04166);
    // Play Cash sound effect
    var audio = new Audio("sound/cash.wav");
    audio.volume = 0.25;
    audio.play();
    
    // Debug
    console.log("You have claimed 250 credits.");
    
    // Add credits
    document.getElementById("insert_claim_button_here").innerHTML = "";
    addCredits(250);
    
}

function claimAnimation(animationStatus){
    
    if(animationStatus == 1){
        document.getElementById("claim_button").src="https://i.imgur.com/Kjxgl4t.gif";
        //Hover on
        console.log("Hover off");
    } else if(animationStatus == 2){
        document.getElementById("claim_button").src="https://i.imgur.com/AE30uLU.gif";
        // Hover off
        console.log("Hover on");
    }
    
    
}


function checkClaim(){
    // Check if hourly credits have been claimed
    // and display button if they have naaaaht.
    var claimStatus = readCookie("creditsClaimed");

    
    if(claimStatus == "true"){
        console.log("Claimed");
    } else {
        console.log("Not claimed");
        document.getElementById("insert_claim_button_here").innerHTML = '<img src="img/button_claim.gif" id="claim_button" onclick="claimHourlyCredits();" onmouseover="claimAnimation(1)"; onmouseout="claimAnimation(2)">';
        }
    }
    
    
    









// Slide show 


function slideShow(){
    
    if (slideIndex < 3){
        slideIndex = slideIndex + 1;
        
    } else {
        slideIndex = 1;
       
    }
    
    
    document.getElementById("slide_image").src="img/slideshow_image03.png";
    
    // Run slideShow() every 4 seconds.
    
    if (slideIndex == 1){
        document.getElementById("slide_image").src="img/slideshow_image01.gif"
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






//Progress bar

function progressBar() {
    var elem = document.getElementById("progress_bar"); 
    var width = 1;
    var id = setInterval(frame, 60);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
            slideShow();
        } else {
            width++; 
            elem.style.width = width + '%'; 
        }
    }
}


// Crate functions vvv

function checkCrateStatus(){
    
    if(credits < priceOfCrate){
        document.getElementById("buy_crate").style.backgroundColor = "#ad3c31";
    }
    
    if(crates >= 1){
        
        document.getElementById("open_crate_button_spot").innerHTML = '<button class="btn" id="openCrateButton" onclick="openCrate()">Open Crate</button>'
    } else if (crates < 1) {
        document.getElementById("unbox_layer_01").src="img/no_box.png";
    }


}


function buyCrate(){

    if (credits >= priceOfCrate){
        // Cleared to buy one crate.
       
        credits = Number(credits) - 1000;
        createCookie("credits",credits,10000);
        
        addCrates(1);
        
        console.log("1 Crate baught.");
        } else {
            
        var neededFunds = priceOfCrate - credits;
        alert("Not sufficient funds, you need " + neededFunds + " more credits to buy this item.");
        console.log("Not sufficient funds, you need " + neededFunds + " more credits to buy this item.");
        
    }
    getCredits();
    checkCrateStatus();
    location.reload();
}


function openCrate(){

        // Check if user has any crates
        
        if (crates >= 1){
            
            
        // Decalre themeCards
        var superDarkCard = "img/superDark_card.png"; 
        var halloweenCard = "img/halloween2017_card.png";
        var emeraldCard = "img/emerald_card.png";
            
            
        // Get rarity of crate item.
            // Generate random number between 1-100
            // 90-100   = Legendary     = 10%
            // 70-89    = Epic          = 20%
            // 1-69     = Common        = 70%
        
        var legendaryNum = 90;
        var epicNum = 70;
            
        var rareNumber = Math.floor(Math.random() * 100) + 1;
        console.log("rarNumber = " + rareNumber);
            
        // Set rarity    
        
        if (rareNumber >= legendaryNum){
            // Item is legendary tier.
            console.log("You got a Legendary!!");
            
            document.getElementById("themeCard").src=halloweenCard;
            createCookie("Halloween2017", true, 10000);
           
            
            
            
        } else if (rareNumber >= epicNum){
            // Item is epic tier.
            console.log("You got an Epic!");
            
            document.getElementById("themeCard").src=superDarkCard;
            createCookie("superDark", true, 10000);
            
        } else {
            // Item is common tier.
            console.log("You got a common.");
            
            // Unlock Emerald
            document.getElementById("themeCard").src=emeraldCard;
            createCookie("Emerald", true, 10000);
        }
            
            
        // Cleared to open crate
        
        
        // Delete one crate
        crates = Number(crates) - 1;
        addCrates(-1); 
    
        
        // Play opening animation
        document.getElementById("unbox_layer_01").src="https://i.imgur.com/s0tfTeO.gif";

        
        
        // Change Button
            document.getElementById("open_crate_button_spot").innerHTML = '<button class="btn" id="openCrateButton" onclick="reloadPage()">Ok</button>'
            
        } else {
            console.error("This shouldn't have happened. Error code 420:69, Please contact Olle about this.");
        }
    }
    
    

    
    

    


function addCredits(amount){
    
    var credits = readCookie("credits");
        
        if(credits == null){
            createCookie("credits",0,10000);
            credits = Number(credits) + Number(amount);
            createCookie("credits",credits, 10000);
            console.log("Added " + amount);
        } else {
            credits = Number(credits) + amount;
            createCookie("credits",credits, 10000);
            console.log("Added " + amount + ", total credits: " + credits + ".");
        }
        getCredits();
}

function addCrates(amount){
    
    var crates = readCookie("crates");
        
        if(crates == null){
            createCookie("crates",0,10000);
            crates = Number(crates) + Number(amount);
            createCookie("crates",crates, 10000);
            console.log("Added " + amount);
        } else {
            crates = Number(crates) + amount;
            createCookie("crates",crates, 10000);
            console.log("Added " + amount + ", total crates: " + crates + ".");
        }
        getCrates();
}

function getCrates(){
    var crates = readCookie("crates");
    if(crates == null){
        crates = 0;
        createCookie("crates",0,10000);
    }
    if(crates == 1){
        document.getElementById("numCrates").innerHTML = crates + " crate";
    } else {
    document.getElementById("numCrates").innerHTML = crates + " crates";
        }
}

function getCredits(){
    var credits = readCookie("credits");
    if(credits == null){
        credits = 0;
        createCookie("credits",0,10000);
    }
    document.getElementById("numCredits").innerHTML = credits;
    
}


// Cookie functions from Overstacked


function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}
 








