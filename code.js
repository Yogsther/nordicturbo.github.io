// Sale settings
var sale = false;
var priceOfCrate = 1000;
// Amount of XP you gain by being idle on the website every 10 seconds.
var idleXP = 1;

// Event background settings, leave blank for black.
// File path of image or URL i.e (/img/halloweenbackground.png)
var eventBackground = "";

yearlyCrate();

var id = readCookie("persID");

// Give free crates to users every year, and on the first time they log on.
function yearlyCrate(){
    var newuser = readCookie("brandnew");
    if(newuser == null){
        createCookie("brandnew", false, 365);
        addCrates(1);
        showCratesOnIndex();
    }
}



// Background image
var customBackround = readCookie("customBackground");

setTimeout(function(){
    setInterval(addXP(1), 10000);
}, 10000);

// Declare settings for CSS Profile preview on unlock
var profTopCSS = "-98.5px";
var profHeightCSS = "78px";


var credits = readCookie("credits");
var crates = readCookie("crates");

var musicEnabled = readCookie("musicToggle");
var slideIndex = 0;

        // Decalre themeCards
        var superDarkCard = "img/superDark_card.png"; 
        var halloweenCard = "img/halloween2017_card.png";
        var emeraldCard = "img/emerald_card.png";
        var prideCard = "img/pride_2017_card.png";
        var swedenCard = "img/sweden_card.png";
        var coffeecard = "img/coffee_card.png"
        var superbrightCard = "img/Super-Bright_card.png"
        var rubyCard = "img/ruby_card.png";
        var sapphireCard = "img/sapphire_card.png";
        var piCard = "img/pi_card.png"; 
        var deepfriedTheme = "img/deepfried_card.png"


// Declare Music variables for every theme with music.
var swedishMusic = new Audio("sound/swedish_national.mp3");



runCrateFunctions();
runOnItemsPage();
checkForDev();
itemsPageCheck();
slideShowCheck();
checkIfThemeApplies();
runOnIndex();
countDownTimer();
checkForSale();



function getBackgroundImage(){
    customBackround = readCookie("customBackground");
    
    if(customBackround == "true"){
        return;
    } else {
        // EVENT BACKGROUND 
        document.body.style.backgroundImage = "url(" + eventBackground + ")";
        document.body.style.backgroundColor = "#000000";
    }
}


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
        showCratesOnIndex();
        getBackgroundImage();
        getTheme();
        checkClaim();
        countDown();
          
    }
    
}

function runOnIndex(){
    
  
    
    if(window.location.href.toLowerCase() == "http://livingforit.xyz/" || window.location.href.indexOf("index.html") != -1){
        getXP();
        getBankStatus();
        insertProfile();
    }
}

function runOnItemsPage(){
    
    if (window.location.href.indexOf("items.html") != -1){
        musicToggleButtonStatus();
        insertUsername();
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





function showCratesOnIndex(){
    
    var currentCrates = readCookie("crates");
    
    if(crates == 0){
       document.getElementById("insertBlob").style.visibility = "hidden";
    } else {
        document.getElementById("insertBlob").style.visibility = "visible";
    }
    if(crates != null){
    var crateLenght = crates.toString().length * 15;
    if(crates.toString().length == 1){
        crateLenght = 20;
    }
    }
    var finalLenght = crateLenght + "px";
    
    document.getElementById("insertBlob").innerHTML = '<div id="crateStatusBlobDiv" style="width: ' + finalLenght +';">' + currentCrates + '</div>';
    
}



// Profiles


var username = readCookie("username"); 

function insertProfile(){
    username = readCookie("username"); 
    if(username == null){
        // Give brand new users one free lootbox
        // Generate & save profile name, user has no saved Name.
        var newRandom = Math.floor(Math.random()*8999)+1000;
        username = "New #" + newRandom;
        createCookie("username", username, 10000);
        createCookie("profileLocation", "http://livingforit.xyz/img/profiles/profile_none.png", 10000)

    }
    
    document.getElementById("insert-username").innerHTML = username;
    
    var profPic = readCookie("profileLocation");
    if(profPic != null){
        document.getElementById("insert-profile").src = profPic;
    }
    
    
    
    //TODO
}

function getUsername(){
    username = readCookie("username"); 
    if(username == null){
        // Generate & save profile name, user has no saved Name.
        var newRandom = Math.floor(Math.random()*8999)+1000;
        username = "New #" + newRandom;
        createCookie("username", username, 10000);

    }
    return username;
}


function changeUsername(){
    
    var newUsername = document.getElementById("newUserName").value;
    if(document.getElementById("newUserName").value !== ""){
        createCookie("username", newUsername, 10000);
        insertUsername();
    }
    document.getElementById("newUserName").value = "";
    
}

function insertUsername(){
    username = getUsername();
    var profPic = readCookie("profileLocation");
    document.getElementById("prof-preview").src = profPic;
    document.getElementById("insertUsername").innerHTML = username;
}


function changeProfile(pic){
   
    var newPic = pic.src;
    createCookie("profileLocation", newPic, 10000);
    insertUsername();
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

function checkForSale(){
    if(sale == true){
        if (window.location.href.indexOf("index") != -1){
        document.getElementById("crate_advert").src = "https://i.imgur.com/i3XcZH7.png";}
        if (window.location.href.indexOf("crate") != -1){
        document.getElementById("buy_crates_image").src = "https://i.imgur.com/1WFshCx.png";}
        
        
        
    }
    
}


function goToCrates(){
    window.location.href = "crate.html";
}

function botCard(){
    window.location.href = "bot.html";
}

function quickdrawCard(){
    window.location.href = "quickdraw";
}

function pagesCard(){
    window.location.href = "pages";
}

function rouletteCard(){
    window.location.href = "roulette";
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
     
        toggleMusic();
    } else if(musicEnabled == "true") {
        // Music has been disabled
     
        createCookie("musicToggle", false, 10000);
    } else if(musicEnabled == "false"){
        // Music has been enabled
      
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

function home(){
    window.location.href = "index.html"
}

function goToCrates(){
    window.location.href = "crate.html"
}

function project(){
    window.location.href = "browse.html"
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

profanityButtonStyle();

// Get button style for profanity toggle
function profanityButtonStyle(){
    var profanityStatus = readCookie("profanityFilter");
    if(profanityStatus == null){
        createCookie("profanityFilter", "enabled", 10000);
    }
    if(profanityStatus == "enabled"){
        document.getElementById("profanity_toggle_button").style.backgroundColor = "#2b2b2b";
        document.getElementById("profanity_toggle_button").style.color = "#dbdbdb";
        document.getElementById("profanity_toggle_button").innerHTML = "Enabled";
    }
    if(profanityStatus == "disabled"){
        document.getElementById("profanity_toggle_button").style.backgroundColor = "#dbdbdb";
        document.getElementById("profanity_toggle_button").style.color = "#2b2b2b";
        document.getElementById("profanity_toggle_button").innerHTML = "Disabled";
    }
}

// Profanity filter toggle
function toggleProfanityFilter(){
    
    var profanityStatus = readCookie("profanityFilter");
    if(profanityStatus == null){
        createCookie("profanityFilter", "enabled", 10000);
    }
    if(profanityStatus == "enabled"){
        createCookie("profanityFilter", "disabled", 10000);
        profanityButtonStyle();
    }
    if(profanityStatus == "disabled"){
        createCookie("profanityFilter", "enabled", 10000);
        profanityButtonStyle();
    }
    
}



// Button hover color change
function buttonOn(buttonID){
    var buttonColor = "black";
    
    var currentTheme = readCookie("Theme")
    var functionName = currentTheme + "('buttonColor');";
    var buttonColor = eval(functionName);
    
    if(buttonColor != "undefined"){
 
    document.getElementById(buttonID).style.background = buttonColor;
    }
}

function buttonOff(buttonID){
    document.getElementById(buttonID).style.background = "";
}


// Theme skins code

function addSkins(){
    var skinName = document.getElementById("theme_chooser").value;
    document.getElementById("theme_chooser").value = "";
 
    
    var addSkinFunction = skinName + "();" 
    eval(addSkinFunction);
    
    getSavedSkins();
    reloadPage();
}

function unlockProfile(name){
    
    // Read cookie
    var animatedPictures = readCookie("animatedProfiles");
    if(animatedPictures == undefined || animatedPictures == null){
        createCookie("animatedProfiles", "", 10000);
        animatedPictures = readCookie("animatedProfiles");
    }
    animatedPictures = animatedPictures.split("|")
    
    // Modify value
    if(animatedPictures.indexOf(name) == -1){
    animatedPictures.push(name);
    }
    
    // Save cookie
    animatedPictures = animatedPictures.join("|");
    createCookie("animatedProfiles", animatedPictures, 10000)
    
 
    
}

function getProfileLoc(name){
        var imageLoc = "img/profiles/unlock_" + name + ".gif";
        return imageLoc;
}



function getSavedSkins(){
    
    // Save all default profile pictures, for later adding.
    var defualtPictures = document.getElementById("all_profiles").innerHTML;
    // Delete all pictures from the html, add them later
    document.getElementById("all_profiles").innerHTML = "";
    
    // Get saved animated profile pictures
    var animatedPictures = readCookie("animatedProfiles");
    if(animatedPictures == undefined || animatedPictures == null){
        createCookie("animatedProfiles", "", 10000);
        animatedPictures = readCookie("animatedProfiles");
    }
    animatedPictures = animatedPictures.split("|")
    
    var i = animatedPictures.length;
    while(i > 0){
        
        if(animatedPictures[i] == null){
        } else {
            var name = animatedPictures[i];
            var nameOfImage = "img/profiles/unlock_" + animatedPictures[i] + ".gif";
            document.getElementById("all_profiles").innerHTML += '<img onclick="changeProfile(this);" id="profile-img" src="' + nameOfImage + '" title="'+ name +'">';
           
        }
        i = i-1;   
    }
    
    // Add back old profile pictures 
    document.getElementById("all_profiles").innerHTML += defualtPictures;
    
    //Read every saved skin
    var superDark = readCookie("superDark");
    var Emerald = readCookie("Emerald");
    var Halloween2017 = readCookie("Halloween2017");
    var LGBT2017 = readCookie("LGBT2017");
    var Sweden = readCookie("Sweden");
    var Coffee = readCookie("Coffee");
    var Pi = readCookie("Pi");
    var Superbright = readCookie("Superbright");
    var Devtheme = readCookie("Devtheme");
    var Ruby = readCookie("Ruby");
    var Sapphire = readCookie("Sapphire");
    var Deepfried = readCookie("Deepfried");
    
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
    
    if(Deepfried == "true"){
    
        document.getElementById("saved_skins").innerHTML += '<span id="epic">Deepfried    </span>    <button class="btn" onclick="Deepfried()">Choose</button><br>';
    // Remove "No THemes Found"
        document.getElementById("no_themes").innerHTML = "";
    }
    
    
    if(Pi == "true"){
        document.getElementById("saved_skins").innerHTML += '<span id="epic">Pi    </span>    <button class="btn" onclick="Pi()">Choose</button><br>';
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
    
    if(Ruby == "true"){
        document.getElementById("saved_skins").innerHTML += '<span id="common">Ruby    </span>    <button class="btn" onclick="Ruby()">Choose</button><br>';
    // Remove "No THemes Found"
        document.getElementById("no_themes").innerHTML = "";}
    
    
    if(Sapphire == "true"){
        document.getElementById("saved_skins").innerHTML += '<span id="common">Sapphire    </span>    <button class="btn" onclick="Sapphire()">Choose</button><br>';
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
        
        getTheme();
        
    } else { 
    
    var finalFunction = currentThemeName + "();";
    eval(finalFunction);
    }
}





function LGBT2017(request){
    
    var buttonColor = "#d84138";
    
    if(request == "buttonColor"){
        return buttonColor;
    }
    
    
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



function Sweden(request){
    
    var buttonColor = "#efda39";
    
    if(request == "buttonColor"){
        return buttonColor;
    }
    
    // Save theme
    createCookie("Sweden", true, 10000);
    
    // Set Text Color
        document.getElementById("home_page").style.color = "white";
    createCookie("customBackground", "false", 10000);
        getBackgroundImage();
    
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


function Halloween2017(request){
    
    var buttonColor = "#ff9021";
    
    if(request == "buttonColor"){
        return buttonColor;
    }
    
    // Save theme
    createCookie("Halloween2017", true, 10000);
    createCookie("customBackground", "false", 10000);
        getBackgroundImage();
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
function Emerald(request){
    
    var buttonColor = "#1e603d";
    
    if(request == "buttonColor"){
        return buttonColor;
    }
    // Save theme
    createCookie("Emerald", true, 10000);
    createCookie("customBackground", "false", 10000);
        getBackgroundImage();
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




function Pi(request){
    
    var buttonColor = "#da3030";
    
    if(request == "buttonColor"){
        return buttonColor;
    }
   
    createCookie("customBackground", "true", 10000);
    // Background color
    document.body.style.backgroundColor = "#111111";
    // Background Image
    document.body.style.backgroundImage = "url(img/pi_background.png)";
    getBackgroundImage();
    
    // Save theme
    createCookie("Pi", true, 10000);
    
    // Set Text Color
    document.getElementById("home_page").style.color = "white";
    
    // Change colors
    document.getElementById("background_div").style.backgroundColor = "#252525";
    document.getElementById("header_table").style.backgroundImage = "url(img/pi_banner.png)";

    
    
    // Change to theme 
    createCookie("Theme", "Pi", 10000);
    
}


function Deepfried(request){
    
    var buttonColor = "#da3030";
    
    if(request == "buttonColor"){
        return buttonColor;
    }
    // If theme has custom bg
    createCookie("customBackground", "true", 10000);
    // Background color
    document.body.style.backgroundColor = "#000000";
    // Background Image
    document.body.style.backgroundImage = "url(img/deepfired_theme_background.png)";
    getBackgroundImage();
    
    // Save theme
    createCookie("Deepfried", true, 10000);
    
    // Set Text Color
    document.getElementById("home_page").style.color = "white";
    
    // Change colors
    document.getElementById("background_div").style.backgroundColor = "#252525";
    document.getElementById("header_table").style.backgroundImage = "url(img/deepfired_theme_banner.png)";

    
    
    // Change to theme 
    createCookie("Theme", "Deepfried", 10000);
    
}



function Ruby(request){
        var buttonColor = "#db1313";
    
            if(request == "buttonColor"){
                    return buttonColor;
            }
        // Save theme
        createCookie("Ruby", true, 10000);
    
    createCookie("customBackground", "false", 10000);
        getBackgroundImage();
    
        // Change colors
        // Set Text Color
        document.getElementById("home_page").style.color = "white";
        
        document.getElementById("background_div").style.backgroundColor = "#860000";
        document.getElementById("header_table").style.backgroundColor = "#db1313";
        document.getElementById("header_table").style.backgroundImage = "url()";
        // IMG        document.getElementById("header_table").style.backgroundImage = "url()";
    
    
        // Change to theme 
        createCookie("Theme", "Ruby", 10000);    
}


function Sapphire(request){
        // Save theme
        createCookie("Sapphire", true, 10000);
         var buttonColor = "#3043cc";
    
            if(request == "buttonColor"){
                    return buttonColor;
            }
        // Change colors
        // Set Text Color
        document.getElementById("home_page").style.color = "white";
    
    createCookie("customBackground", "false", 10000);
        getBackgroundImage();
    
        
        document.getElementById("background_div").style.backgroundColor = "#1d2872";
        document.getElementById("header_table").style.backgroundColor = "#3043cc";
        document.getElementById("header_table").style.backgroundImage = "url()";
        // IMG        document.getElementById("header_table").style.backgroundImage = "url()";
    
    
        // Change to theme 
        createCookie("Theme", "Sapphire", 10000);    
}



function Superbright(request){
    
    // Save theme
    createCookie("Superbright", true, 10000);
    
    // Change colors
     var buttonColor = "#f7f7f7";
    
            if(request == "buttonColor"){
                    return buttonColor;
            }
    
    
    createCookie("customBackground", "false", 10000);
        getBackgroundImage();
    
    
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
function superDark(request){
    
    var buttonColor = "#3d3d3d";
    
    if(request == "buttonColor"){
        return buttonColor;
    }
    
    
    
    createCookie("customBackground", "false", 10000);
        getBackgroundImage();
    
    
    // Save superDark
        createCookie("superDark", true, 10000);
        console.log("Saved superDark");
        console.log("superDark skin selected!");
        
        // Set Text Color
        document.getElementById("home_page").style.color = "white";
        
        // Change colors
        document.getElementById("background_div").style.backgroundColor = "#111111";
        document.getElementById("header_table").style.backgroundColor = "#1c1c1c";
        document.getElementById("header_table").style.backgroundImage = "url()";
        
        
        // CHANGE TO SUPER DARK HERE!!!
        createCookie("Theme", "superDark", 10000);
}


// Theme coffee
function Coffee(request){
    
    var buttonColor = "#d5b17e";
    
    if(request == "buttonColor"){
        return buttonColor;
    }
    
    createCookie("customBackground", "false", 10000);
    getBackgroundImage();
    
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
function Red(request){
    
        var buttonColor = "#ef4f4f";
        
        if(request == "buttonColor"){
            return buttonColor;
        }
        
        
        createCookie("customBackground", "false", 10000);
        getBackgroundImage();
    
    
        // Set Text Color
        document.getElementById("home_page").style.color = "white";
        // Background color
        document.getElementById("background_div").style.backgroundColor = "#ce2d2d";
        // Header color
        document.getElementById("header_table").style.backgroundColor = "#f44242";
        document.getElementById("header_table").style.backgroundImage = "url()";
        // Debug
       
    
        // Background Color  document.getElementById("members_background_shadow").style.backgroundColor = "#cd932d";
        // Text color  document.getElementById("members_header_text").style.color = "#f9ba4c"; 
}

// Change to Theme: Default
function Default(){
        // Set Text Color
        
        createCookie("customBackground", "false", 10000);
        getBackgroundImage();
    
        document.getElementById("home_page").style.color = "white";
    
        document.getElementById("background_div").style.backgroundColor = "#2d3f53";
        document.getElementById("header_table").style.backgroundColor = "#436a95";
        
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
        checkCrateStatus();
        checkClaim();
    }
    
    
    
    
    document.getElementById("insert_claim_countdown").innerHTML = "<i>Minutes until next claim: " + minutesLeft + "<br><span id='rightText'></span></i>"; 
    
    }
    
}

function countDownTimer(){
    setInterval(countDown, 30000); 
}

// Update bank status

function getBankStatus(){
    
    var bankStatus = readCookie("credits");
    document.getElementById("insert_number_of_credits").innerHTML = bankStatus;
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
    addXP(100);
    getXP();
    getBankStatus();
    
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
    
    } else {
       
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
        // Slide show 1
        document.getElementById("slide_image").src="https://i.imgur.com/iYh2uBA.png"
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
            window.open("bot.html");
            
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
       
        credits = Number(credits) - priceOfCrate;
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
    
    var profTopCSS = "-98.5px";
    var profHeightCSS = "78px";
    
    
    // Item is legendary tier.
    console.log("You got a Legendary!!");
    var whatEpicNum = Math.floor(Math.random() * 9) + 1;
        
    if(whatEpicNum == 1){
        // Get item halloween
        console.log("You got Halloween 2017");
        document.getElementById("themeCard").src=halloweenCard;
        createCookie("Halloween2017", true, 10000);
        
    } else if (whatEpicNum == 2){
        console.log("You got Sweden");
        document.getElementById("themeCard").src=swedenCard;
        createCookie("Sweden", true, 10000);
    } 
    if(whatEpicNum >= 3 && whatEpicNum < 9){
        // Name of unlock
        // Get random common
        var legendaryPics = ["happysale", "flagsv", "toad", "toad2", "sonicmania", "luigidab", "proto", "myboy"]; 
        var unlockName = legendaryPics[Math.floor(Math.random()*legendaryPics.length)];
    
        console.log("You got a profile picture! > " + unlockName);
        unlockProfile(unlockName);
        var imageLocation = getProfileLoc(unlockName);
        document.getElementById("themeCard").src = imageLocation;
        document.getElementById("themeCard").src = imageLocation;
        console.log(profHeightCSS);
        document.getElementById("themeCard").style.height = profHeightCSS;
        document.getElementById("themeCard").style.top = profTopCSS;
        document.getElementById("themeCard").style.borderRadius = "80px";
        //document.getElementById("themeCard").style.boxShadow = 
        } 
     
    
    
    
    // Play opening animation
    document.getElementById("unbox_layer_01").src="https://i.imgur.com/EtPCQfw.gif";
}
    
function rarityEpic(){
    // Item is epic tier.
    console.log("You got an Epic!");
    var whatEpicNum = Math.floor(Math.random() * 6) + 1;
    
    if(whatEpicNum == 1){
        console.log("You got superDark");
        // Get first item, superDark
        document.getElementById("themeCard").src=superDarkCard;
        createCookie("superDark", true, 10000);
    } else if (whatEpicNum == 2){
        console.log("You got Pride 2017");
        // Get second item, Pride 2017
        document.getElementById("themeCard").src=prideCard;
        createCookie("LGBT2017", true, 10000);
    } else if (whatEpicNum == 3){
        console.log("You got Coffee");
        // Coffee
        document.getElementById("themeCard").src=coffeecard;
        createCookie("Coffee", true, 10000);
    }  else if (whatEpicNum == 4){
        console.log("You got Pi");
        // Coffee
        document.getElementById("themeCard").src=piCard;
        createCookie("Pi", true, 10000);
    } else if (whatEpicNum == 5){
        console.log("You got Deepfried");
        // Coffee
        document.getElementById("themeCard").src=deepfriedTheme;
        createCookie("Deepfried", true, 10000);
    }
    if(whatEpicNum == 6){
        // Name of unlock
        var unlockName = "animated_halloween2017";
        console.log("You got a profile picture! > " + unlockName);
        unlockProfile(unlockName);
        var imageLocation = getProfileLoc(unlockName);
        document.getElementById("themeCard").src = imageLocation;
        document.getElementById("themeCard").src = imageLocation;
        document.getElementById("themeCard").style.height = profHeightCSS;
        document.getElementById("themeCard").style.top = profTopCSS;
        document.getElementById("themeCard").style.borderRadius = "80px";
    }
    
    
    
    // Play opening animation
    document.getElementById("unbox_layer_01").src="https://i.imgur.com/vT8Nzpr.gif";
}

function rarityCommon(){
    
    // Item is common tier.
    console.log("You got a common.");
    
    
    var whatEpicNum = Math.floor(Math.random() * 10) + 1;
    
    if(whatEpicNum == 1){
        console.log("You got SuperBright");
        // Get first item, superWhite
        document.getElementById("themeCard").src=superbrightCard;
        createCookie("Superbright", true, 10000);
    } else if (whatEpicNum == 2){
        console.log("You got Emerald");
        // Unlock Emerald
        document.getElementById("themeCard").src=emeraldCard;
        createCookie("Emerald", true, 10000);
    } else if (whatEpicNum == 3){
        console.log("You got Ruby");
        // Unlock Ruby
        document.getElementById("themeCard").src=rubyCard;
        createCookie("Ruby", true, 10000);
    } else if (whatEpicNum == 4){
        console.log("You got Sapphire");
        // Unlock Sapphire
        document.getElementById("themeCard").src=sapphireCard;
        createCookie("Sapphire", true, 10000);
    }
    
    if(whatEpicNum >= 5 && whatEpicNum <= 10){
        
        // Get random common
        var commonPics = ["trump_won", "sonicdab", "halloween-2017", "deepfriedhumanbean", "yoshi", "mariomexico", "tjhenry", "haventheardthatnameinyears", "sonicgreen"]
        var unlockName = commonPics[Math.floor(Math.random()*commonPics.length)];
    
        console.log("You got a profile picture! > " + unlockName);
        unlockProfile(unlockName);
        var imageLocation = getProfileLoc(unlockName);
        document.getElementById("themeCard").src = imageLocation;
        document.getElementById("themeCard").src = imageLocation;
        document.getElementById("themeCard").style.height = profHeightCSS;
        document.getElementById("themeCard").style.top = profTopCSS;
        document.getElementById("themeCard").style.borderRadius = "80px";
    }
    
    
    
    
    // Play opening animation
    document.getElementById("unbox_layer_01").src="https://i.imgur.com/JUpfLOn.gif";
}


// XP System

function getXP(){
    
    var xpBackgroundAnimated;
    var level;
    var xpLeft;
    var xpBar;
    
    var xpBarColor = "#5ccae0";
    
    var xp = readCookie("xp");
    if(xp == "null"){
        createCookie("xp",0,10000);
    }
    
    if(xp >= 1000){
        // If player has higher level than 1
        
        level = xp / 1000;
        level = Math.floor(level);
        
        xpLeft = level * 1000;
        xpLeft = xp - xpLeft;
        xpLeft = 1000 - xpLeft;
        
    
        
        
        
    } else {
        level = 0;
        xpLeft = 1000 - xp;
    }
    

    xpBar = xpLeft / 10;
    xpBar = 100 - xpBar;
    
    
    level = level + 1;
    
    //Get xp level portrait
    
    if (level > 100){
        level = 100;
    }
    
    var xpPortraitLocation = "img/lvl/" + level + ".png"
    if(level > 24){
        xpPortraitLocation = "img/lvl/over.gif"
    }

    
    if (level >= 2){
        xpBarColor = "#7c4fd1";
    }
    if (level >= 3){
        xpBarColor = "#ba1da7";
    }
    if (level >= 4){
        xpBarColor = "#a8174c";
    }
    if (level >= 5){
        xpBarColor = "#ce0c3c";
    }
    if (level >= 6){
        xpBarColor = "#ff4774";
    }
    if (level >= 7){
        xpBarColor = "#326617";
    }
    if (level >= 8){
        xpBarColor = "#5bc425";
    }
    if (level >= 9){
        xpBarColor = "#75f931";
    }
    if (level >= 10){
        xpBarColor = "#e0b731";
    }
    if (level >= 15){
        xpBarColor = "#f24e1d";
    }
    
    if (level >= 20){
        xpBarColor = "#f1bc1d";
    }
    
    if (level >= 30){
        xpBarColor = "#ff1622";
    }
    
    if (level >= 40){
        xpBarColor = "#ff3030";
    }
    
    if (level >= 50){
        xpBarColor = "#262626";
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    document.getElementById("xp_bar").style.background = xpBarColor;
    document.getElementById("xp_bar").style.width = xpBar + "%";
    document.getElementById("level_disaply").innerHTML = "Lvl " + level;
    document.getElementById("xp_left").innerHTML = xpLeft + "xp left";
    document.getElementById("xp_portrait_img").src = xpPortraitLocation;

    document.getElementById("xp_div").style.color = "white";
    
    
    
    return xp;
}

function addXP(amount){
    var xp = getXP();
    var oldLvl = parseInt(Math.floor(xp / 1000) + 1, 10)
    
        if(xp == null){
            createCookie("xp",0,10000);
            credits = Number(xp) + Number(amount);
            createCookie("xp",credits, 10000);
          
        } else {
            xp = Number(xp) + amount;
            createCookie("xp",xp, 10000);
         
            var newLvl = parseInt(Math.floor(xp / 1000) + 1, 10)
            // Added xp, check for lvl up:
            //if(oldXP.floor)
            if(newLvl > oldLvl){
                // User has leveled up!
                // Play level up sound effect
                var levelupSound = new Audio("/sound/notu_lvlup_v2.wav");
                levelupSound.volume = 0.3;
                levelupSound.play();
                addCrates(1);
                
            }
        }
      getXP();
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
        if (window.location.href.indexOf("index") != -1){
        showCratesOnIndex();
        }
        getCrates();
}

function getCrates(){
    var crates = readCookie("crates");
    if(crates == null){
        crates = 0;
        createCookie("crates",0,10000);
    }
    if (window.location.href.indexOf("crate") != -1){
    if(crates == 1){
        document.getElementById("numCrates").innerHTML = crates + " crate";
    } else {
        document.getElementById("numCrates").innerHTML = crates + " crates";
        }
    }
}

function getCredits(){
    var credits = readCookie("credits");
    if(credits == null){
        credits = 0;
        createCookie("credits",0,10000);
    }
    document.getElementById("numCreditsCratePage").innerHTML = credits;
    return credits;
    
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
 








