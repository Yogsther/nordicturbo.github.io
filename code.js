var slideIndex = 0;

var credits = readCookie("credits");
var crates = readCookie("crates");

var musicEnabled = readCookie("musicToggle");


        // Decalre themeCards
        var superDarkCard = "img/superDark_card.png"; 
        var halloweenCard = "img/halloween2017_card.png";
        var emeraldCard = "img/emerald_card.png";
        var prideCard = "img/pride_2017_card.png";
        var swedenCard = "img/sweden_card.png";
        var coffeecard = "img/coffee_card.png"
        var superbrightCard = "img/Super-Bright_card.png"

// Declare Music variables

swedishMusic = new Audio("sound/swedish_national.mp3");



// Price of a crate (default should be 1000 credits)
var priceOfCrate = 1000;

runCrateFunctions();
runOnItemsPage();
checkForDev();
itemsPageCheck();
slideShowCheck();
checkIfThemeApplies();

countDownTimer();


function reloadPage(){
    location.reload();
}

function runCrateFunctions(){
    if (window.location.href.indexOf("crate") != -1){
        
        checkCrateStatus();
        // Get Credits
        getCredits();
        // Get Num of Crates
        getCrates();
    }
}

function checkIfThemeApplies(){
    if (window.location.href.indexOf("crate") != -1){
        return false;
    }else{
        getTheme();
        checkClaim();
        countDown();
    }
    
}

function runOnItemsPage(){
    
    if (window.location.href.indexOf("items.html") != -1){
        musicToggleButtonStatus();
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


function goToCrates(){
    window.location.href = "crate.html";
}

function slideShowCheck(){
if (window.location.href.indexOf("index.html") != -1){
    slideShow();
    }
}

function itemsPageCheck(){
if (window.location.href.indexOf("items.html") != -1){
    getSavedSkins();
    }
}

function toggleMusic(){
    
    var musicEnabled = readCookie("musicToggle");
    
    if(musicEnabled == null){
        // If this is the first time the button is clicked, ever.
        createCookie("musicToggle", true, 10000);
        console.log("Cookie was created for music toggle");
        toggleMusic();
    } else if(musicEnabled == "true") {
        // Music has been disabled
        console.log("Music has been disabled");
        createCookie("musicToggle", false, 10000);
    } else if(musicEnabled == "false"){
        // Music has been enabled
        console.log("Music enabled.");
        createCookie("musicToggle", true, 10000);
    } else {
        console.error("Something went wrong, please tell the notu.co devs about this. Error code: 55:2");
    }
    musicToggleButtonStatus();
}

function musicToggleButtonStatus(){
    
    var musicEnabled = readCookie("musicToggle");
    
    if(musicEnabled == "true") {
        document.getElementById("music_toggle_button").style.backgroundColor = "#2baf2b";
        document.getElementById("musicToggleText").innerHTML = "Enabled"; 
    } else if(musicEnabled == "false"){
        document.getElementById("music_toggle_button").style.backgroundColor = "#b2403a";
        document.getElementById("musicToggleText").innerHTML = "Disabled"; 
        
    } else {
        createCookie("musicToggle", true, 10000);
        musicToggleButtonStatus();
    }
}


    
// Button redirect functions    

function git(){
    window.location.href = "git.html";
}

function home(){
    window.location.href = "index.html"
}

function items(){
    window.location.href = "items.html"
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
        window.setTimeout(Red,300); 
        createCookie("Theme", "Red", 10000); 
        console.log("Theme changed to Red");
    } else {
        // Change back to defualt if the current theme is not defult.
        createCookie("Theme", "Default", 10000); 
        window.setTimeout(Default,300);
        
    }

    
    
    document.getElementById("header_logo").src="img/website_logo_gif.gif";
    var click = new Audio("sound/click.wav");
    click.play();
    // Stop all music
    swedishMusic.pause();
    
 
}

// Theme skins code

function addSkins(){
    var skinName = document.getElementById("theme_chooser").value;
    document.getElementById("theme_chooser").value = "";
    console.log(skinName);
    
    var addSkinFunction = skinName + "();" 
    eval(addSkinFunction);
    
    getSavedSkins();
    reloadPage();
}

function getSavedSkins(){
    
    //Read every saved skin
    var superDark = readCookie("superDark");
    var Emerald = readCookie("Emerald");
    var Halloween2017 = readCookie("Halloween2017");
    var LGBT2017 = readCookie("LGBT2017");
    var Sweden = readCookie("Sweden");
    var Coffee = readCookie("Coffee");
    var Superbright = readCookie("Superbright");
    var Devtheme = readCookie("Devtheme");
    
    // Check every theme
    
    
    if(Devtheme == "true"){
        var devtheme_button = readCookie("devthemebutton");
        document.getElementById("saved_skins").innerHTML += devtheme_button;
        // Remove "No THemes Found"
        document.getElementById("no_themes").innerHTML = "";
    }
    
    
    if(Halloween2017 == "true"){
        document.getElementById("saved_skins").innerHTML += '<span id="legendary">Halloween 2017</span>        <button class="btn" onclick="Halloween2017()">Choose</button><br>';
        // Remove "No THemes Found"
        document.getElementById("no_themes").innerHTML = "";
    }
    
    if(Sweden == "true"){
      document.getElementById("saved_skins").innerHTML += '<span id="legendary">Sweden </span>       <button class="btn" onclick="Sweden()">Choose</button><br>';
        // Remove "No THemes Found"
        document.getElementById("no_themes").innerHTML = "";}
    
    if(Coffee == "true"){
        document.getElementById("saved_skins").innerHTML += '<span id="epic">Coffee    </span>    <button class="btn" onclick="Coffee()">Choose</button><br>';
    // Remove "No THemes Found"
        document.getElementById("no_themes").innerHTML = "";}
    
    if(LGBT2017 == "true"){
      document.getElementById("saved_skins").innerHTML += '<span id="epic">Pride 2017  </span>      <button class="btn" onclick="LGBT2017()">Choose</button><br>';
    // Remove "No THemes Found"
        document.getElementById("no_themes").innerHTML = "";}
    
    if(superDark == "true"){
        document.getElementById("saved_skins").innerHTML += '<span id="epic"> superDark</span>        <button class="btn" onclick="superDark()">Choose</button><br>';
    // Remove "No THemes Found"
        document.getElementById("no_themes").innerHTML = "";}
    
    if(Emerald == "true"){
        document.getElementById("saved_skins").innerHTML += '<span id="common">Emerald    </span>    <button class="btn" onclick="Emerald()">Choose</button><br>';
    // Remove "No THemes Found"
        document.getElementById("no_themes").innerHTML = "";}
    
    if(Superbright == "true"){
        document.getElementById("saved_skins").innerHTML += '<span id="common">Super Bright    </span>    <button class="btn" onclick="Superbright()">Choose</button><br>';
    // Remove "No THemes Found"
        document.getElementById("no_themes").innerHTML = "";}

}


// New theme manager:
function getTheme(){
    var currentThemeName = readCookie("Theme");
    
    if(currentThemeName == null){
        // Create cookie if user is new to the site.
        createCookie("Theme", "Default", 10000); 
        console.log("Created Cookie, Default theme.");
        getTheme();
        
    } else { 
    console.log("Current theme is: " + currentThemeName + ".");
    var finalFunction = currentThemeName + "();";
    eval(finalFunction);
    }
}





function LGBT2017(){
    
    // Save theme
    createCookie("LGBT2017", true, 10000);
    
    // Set Text Color
        document.getElementById("home_page").style.color = "white";
    
    // Change colors and banner
        document.getElementById("background_div").style.backgroundColor = "#bc3131";
        document.getElementById("header_table").style.backgroundImage = "url(img/banner_lgbt_2017.gif)";
    

    // Change to theme 
    createCookie("Theme", "LGBT2017", 10000);
    
    
    
    
}


function Devtheme(){
    
    
        var devtheme_button = '<span id="legendary">Custom Dev theme</span> <input type="text" placeholder="ffffff" class="text_field" maxlength="6" id="devtheme_headercolor"><input type="text" placeholder="111111" class="text_field" maxlength="6" id="devtheme_backgroundcolor"> <input type="text" placeholder="http://" class="text_field" id="devtheme_headerurl"><button class="btn" onclick="Devtheme()">weeb</button><br><i>Current colors: <font color="#FFFFFF">#?????? <font color="white">& <font color="#ffffff">#??????</font></font></i><br><a href="javascript:removeDevTheme()">Remove Devtheme<br><br>';
        
        createCookie("devthemebutton", devtheme_button, 10000);
    
        // Save theme
        createCookie("Devtheme", true, 10000);
        
    
        if (window.location.href.indexOf("items.html") != -1){
        // Only on /items.html
    
        var headerColor = document.getElementById("devtheme_headercolor").value;
        var backgroundColor = document.getElementById("devtheme_backgroundcolor").value;
        var headerURL = document.getElementById("devtheme_headerurl").value;
    
        if(headerColor != ""){
            headerColor = "#" + headerColor;
            document.getElementById("header_table").style.backgroundColor = headerColor;
            createCookie("devtheme_headercolor", headerColor, 10000);
        }
        if(backgroundColor != ""){
            backgroundColor = "#" + backgroundColor;
            document.getElementById("background_div").style.backgroundColor = backgroundColor;
            createCookie("devtheme_backgroundcolor", backgroundColor, 10000);
        }
        if(headerURL != ""){
            headerURL = "url(" + headerURL + ")"
            document.getElementById("header_table").style.backgroundImage = headerURL;
            createCookie("header_image_url_input", headerURL, 10000);
        }
    }
        headerColor = readCookie("devtheme_headercolor");  
        backgroundColor = readCookie("devtheme_backgroundcolor"); 
        headerURL = readCookie("header_image_url_input");

    
        if(headerColor != ""){
            document.getElementById("header_table").style.backgroundColor = headerColor;
            createCookie("devtheme_headercolor", headerColor, 10000);
        }
        if(backgroundColor != ""){
            document.getElementById("background_div").style.backgroundColor = backgroundColor;
            createCookie("devtheme_backgroundcolor", backgroundColor, 10000);
        }
        if(headerURL != ""){
            document.getElementById("header_table").style.backgroundImage = headerURL;
            createCookie("header_image_url_input", headerURL, 10000);
        }
        
      
        
        var devtheme_button = '<span id="legendary">Custom Dev theme</span> <input type="text" placeholder="111111" class="text_field" maxlength="6" id="devtheme_backgroundcolor"><input type="text" placeholder="ffffff" class="text_field" maxlength="6" id="devtheme_headercolor"> <input type="text" placeholder="http://" class="text_field" id="devtheme_headerurl"><button class="btn" onclick="Devtheme()">weeb</button><br>Current colors: <font color="' + headerColor + '">' + headerColor + ' <font color="white">& <font color="' + backgroundColor + '">' + backgroundColor + ' </font></font><br><a href="javascript:removeDevTheme()">Remove Devtheme<br><br>';
        
        createCookie("devthemebutton", devtheme_button, 10000);
        // Change to theme 
        createCookie("Theme", "Devtheme", 10000);
   
}       
        
function removeDevTheme(){
        eraseCookie("Devtheme");
        createCookie("Theme", "Default", 10000);
        reloadPage();
}



function Sweden(){
    
    // Save theme
    createCookie("Sweden", true, 10000);
    
    // Set Text Color
        document.getElementById("home_page").style.color = "white";
    
    
    // Change colors
    document.getElementById("background_div").style.backgroundColor = "#1c263a";
    document.getElementById("header_table").style.backgroundImage = "url(img/banner_sweden.gif)";
    
    // Check if music is enabled.
    if (musicEnabled == "true"){
    // Check if this is the homepage.
    if (window.location.href.indexOf("index.html") != -1){ 
    swedishMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    swedishMusic.volume = .25;
    swedishMusic.play();
    }
    
}
    // Change to theme 
    createCookie("Theme", "Sweden", 10000);
    }


function Halloween2017(){
    // Save theme
    createCookie("Halloween2017", true, 10000);
    
    // Set Text Color
        document.getElementById("home_page").style.color = "white";
    
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
        
        // Set Text Color
        document.getElementById("home_page").style.color = "white";
        
        document.getElementById("background_div").style.backgroundColor = "#03492b";
        document.getElementById("header_table").style.backgroundColor = "#1e603d";
        document.getElementById("header_table").style.backgroundImage = "url()";
// IMG        document.getElementById("header_table").style.backgroundImage = "url()";
    
    
    // Change to theme 
    createCookie("Theme", "Emerald", 10000);
    
}


function Superbright(){
    
    // Save theme
    createCookie("Superbright", true, 10000);
    
    // Change colors
    
    // Set Text Color
    document.getElementById("home_page").style.color = "black";
    // Set background color.
    document.getElementById("background_div").style.backgroundColor = "#f7f7f7";
    // Set color of header.
    document.getElementById("header_table").style.backgroundColor = "#dadada";
    document.getElementById("header_table").style.backgroundImage = "url()";
    
    // Set background banner. (! un-comment the line below if you want a banner !) Make sure you have img/ before!
    // document.getElementById("header_table").style.backgroundImage = "url(img/banner_THEME-NAME.gif)";
    
    // Change to theme 
    createCookie("Theme", "Superbright", 10000);
}



// Change to superDark & save it. 
function superDark(){
    // Save superDark
        createCookie("superDark", true, 10000);
        console.log("Saved superDark");
        console.log("superDark skin selected!");
        
        // Set Text Color
        document.getElementById("home_page").style.color = "white";
        
        // Change colors
        document.getElementById("background_div").style.backgroundColor = "#3a3a3a";
        document.getElementById("header_table").style.backgroundColor = "#1e1e1e";
        document.getElementById("header_table").style.backgroundImage = "url()";
        
        
        // CHANGE TO SUPER DARK HERE!!!
        createCookie("Theme", "superDark", 10000);
}


// Theme coffee
function Coffee(){
    
    // Save theme
    createCookie("Coffee", true, 10000);
    
    // Change colors
    // Set Text Color
    document.getElementById("home_page").style.color = "white";
    // Set background color.
    document.getElementById("background_div").style.backgroundColor = "#5b3017";
    
    document.getElementById("header_table").style.backgroundImage = "url(img/coffee_banner.png)";
    
    // Change to theme 
    createCookie("Theme", "Coffee", 10000);
}



// Change to Theme: Red
function Red(){
        // Set Text Color
        document.getElementById("home_page").style.color = "white";
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
function Default(){
        // Set Text Color
        document.getElementById("home_page").style.color = "white";
    
        document.getElementById("background_div").style.backgroundColor = "#2d3f53";
        document.getElementById("header_table").style.backgroundColor = "#436a95";
        console.log("Defualt theme is selected.");
        document.getElementById("header_table").style.backgroundImage = "url()";
        // Debug
    
        // Background Color  document.getElementById("members_background_shadow").style.backgroundColor = "#cd932d";
        // Text color  document.getElementById("members_header_text").style.color = "#f9ba4c"; 
}



function getMinutes(){
    var currentdate = new Date(); 
    var minutes = currentdate.getMinutes();
    return minutes;
}



function countDown(){
    
    
    
    var claimStatus = readCookie("creditsClaimed");
    if(claimStatus == "true"){
    // If hourly credits are claimed, run & display countdown

    var currentMinutes = getMinutes();
    var lastTimeClaimed = readCookie("lastClaimed");
    var thirtyMinutes = readCookie("claimInThirty");
    
    if (Number(lastTimeClaimed) > Number(currentMinutes)){
        var minutesLeft = Number(lastTimeClaimed) - Number(currentMinutes);
    }
    if (Number(currentMinutes) > Number(lastTimeClaimed)){
        var newTime = 60 - Number(currentMinutes);
        var minutesLeft = Number(newTime) + Number(lastTimeClaimed);
    }
    if (Number(currentMinutes) == Number(lastTimeClaimed) && (thirtyMinutes == "true")){
        var minutesLeft = "60";
    } else if (Number(currentMinutes) == Number(lastTimeClaimed)){
        var minutesLeft = "0";
    }
    console.log("Minutes left: " + minutesLeft);
    
    if(claimStatus != true){
        checkClaim();
    }    
    
    document.getElementById("insert_claim_countdown").innerHTML = "<i>Minutes until next claim: " + minutesLeft + "</i>"; 
    
    }
    
}

function countDownTimer(){
    setInterval(countDown, 30000); 
}


// Claiming button function

function claimHourlyCredits(){
    
    var minutes = getMinutes();
    createCookie("lastClaimed", minutes, 0.04166);
    createCookie("claimInThirty", true, 0.02);
    createCookie("creditsClaimed", true, 0.04166);
    
    // Play Cash sound effect
    var audio = new Audio("sound/cash.wav");
    audio.volume = 0.25;
    audio.play();
    
    // Debug
    console.log("You have claimed 250 credits.");
    
    // Add credits
    document.getElementById("insert_claim_button_here").innerHTML = "";
    countDown();
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
    
    
    document.getElementById("slide_image").src="https://i.imgur.com/E2Td1BM.png";
    
    // Run slideShow() every 4 seconds.
    
    if (slideIndex == 1){
        document.getElementById("slide_image").src="https://i.imgur.com/5eSQh2j.png"
        progressBar();
    } else if (slideIndex == 2){
        document.getElementById("slide_image").src="https://i.imgur.com/JDGDg05.png"
        progressBar();
    } else if (slideIndex == 3){
        document.getElementById("slide_image").src="https://i.imgur.com/E2Td1BM.png"
        progressBar();
    }
    
}

function slideRedirect(){
    if (slideIndex == 1){
            window.open("https://www.youtube.com/watch?v=gv3G5LGKjlA",'_blank');
            
    } else if (slideIndex == 2){
        window.open("https://twitter.com/NordicTurbo",'_blank');
    } else if (slideIndex == 3){
        window.open("https://github.com/Yogsther/nordicturbo.github.io",'_blank');
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
            
            rarityLegendary();
            
        } else if (rareNumber >= epicNum){
            
            rarityEpic();
            
        } else {
            rarityCommon();
        }
            
            
        // Cleared to open crate
        
        
        // Delete one crate
        crates = Number(crates) - 1;
        addCrates(-1); 
    
        
        

        
        
        // Change Button
            document.getElementById("open_crate_button_spot").innerHTML = '<button class="btn" id="openCrateButton" onclick="reloadPage()">Ok</button>'
            
        } else {
            console.error("This shouldn't have happened. Error code 420:69, Please contact Olle about this.");
        }
    }
    
    

    
    
function rarityLegendary(){
    // Item is legendary tier.
    console.log("You got a Legendary!!");
    var whatEpicNum = Math.floor(Math.random() * 2) + 1;
        
    if(whatEpicNum == 1){
        // Get item halloween
        document.getElementById("themeCard").src=halloweenCard;
        createCookie("Halloween2017", true, 10000);
        
    } else if (whatEpicNum == 2){
        document.getElementById("themeCard").src=swedenCard;
        createCookie("Sweden", true, 10000);
    }
    
    // Play opening animation
    document.getElementById("unbox_layer_01").src="https://i.imgur.com/EtPCQfw.gif";
}
    
function rarityEpic(){
    // Item is epic tier.
    console.log("You got an Epic!");
    var whatEpicNum = Math.floor(Math.random() * 3) + 1;
    
    if(whatEpicNum == 1){
        
        // Get first item, superDark
        document.getElementById("themeCard").src=superDarkCard;
        createCookie("superDark", true, 10000);
    } else if (whatEpicNum == 2){
        
        // Get second item, Pride 2017
        document.getElementById("themeCard").src=prideCard;
        createCookie("LGBT2017", true, 10000);
    } else if (whatEpicNum == 3){
        
        // Coffee
        document.getElementById("themeCard").src=coffeecard;
        createCookie("Coffee", true, 10000);
    } 
    
    
    
    // Play opening animation
    document.getElementById("unbox_layer_01").src="https://i.imgur.com/vT8Nzpr.gif";
}

function rarityCommon(){
    
    // Item is common tier.
    console.log("You got a common.");
    
    
    var whatEpicNum = Math.floor(Math.random() * 3) + 1;
    
    if(whatEpicNum == 1){
        
        // Get first item, superWhite
        document.getElementById("themeCard").src=superbrightCard;
        createCookie("Superbright", true, 10000);
    } else if (whatEpicNum == 2){
        
        // Unlock Emerald
        document.getElementById("themeCard").src=emeraldCard;
        createCookie("Emerald", true, 10000);
    }
    
    
    
    
    // Play opening animation
    document.getElementById("unbox_layer_01").src="https://i.imgur.com/JUpfLOn.gif";
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
        runCrateFunctions(); 
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
 








