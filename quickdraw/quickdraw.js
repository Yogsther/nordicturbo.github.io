var socket = io.connect("http://213.66.254.63:25565");


/*

Old signup, not used.

// Signup funcitons
var errorMessage;
onOpenSignup();

function onOpenSignup(){
    var persID = readCookie("persID");
    var persIDplusText = "Personal ID - " + persID;
    document.getElementById("persIDSignup").value = persIDplusText;
}

// Signup regex check
function regexSignupCheck(){
    console.log("!");
    var text = document.getElementById("username").value;
    var edit = text.replace(/[^A-Za-z0-9]/g, "");
    document.getElementById("username").value = edit;
}

// Send signup request
function checkInputs(){

    // Get varibales from form
    var persID = readCookie("persID");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confPassword = document.getElementById("password_confirmed").value;

    // Check for problems in input values

    if(document.getElementById("checkbox_warning").checked == false){
        showError("You have to agree to the EULA to sign up!");
        return;
    }

    if(persID == null){
        showError("No personal ID, please go back to Notu.co and then try again.");
        return;
    }

    if(username == "" || password == "" || confPassword == ""){
        showError("Missing informations, all slots need to be filled.");
        return;
    }
    if(username.indexOf("<") != -1){
        showError("HTML tags are not allowed in username.");
    }
    if(password !== confPassword){
        showError("Passwords need to match");
        return;
    }
    if(username.length > 20 || password.length > 20){
        showError("Your password is too long.");
        return;
    }
    if(username.length < 3){
        showError("Username must be at least 3 characters.");
        return;
    }
    if(password.length < 3){
        showError("Password must be at least 3 characters.");
        return;
    }

    // Everything checks out, proceed to register user.
    showError("clear");


    // Send over data to the server with a request to register new user

    socket.emit("signupReq", {

        username: username,
        password: password,
        persID: persID

    });



}

socket.on("signup_success", function(){
    showError("clear");
    document.getElementById("success_msg").innerHTML = "Success! You are now signed up to Quick Draw. The game is not ready yet, but check back soon to play it!";

});

socket.on("callback_fail", function(err){

    console.log(err);
    showError(err);

});

function showError(errMsg){
    if(errMsg == "clear"){
        document.getElementById("error_msg").innerHTML = "";
        return;
    }
    document.getElementById("error_msg").innerHTML = "Error: " + errMsg;
}

*/

// Declare all skins sources

// Decalare skins
var skin01 = new Image();
    skin01.src = "skins/skin01.png"
    
var skin_won = new Image();
    skin_won.src = "skins/skin_victory.png"
    
var skin_lost = new Image();
    skin_lost.src = "skins/skin_fallen.png"


// All items
var items = [{
    name: "Hat 01",
    src: "hat01",
    cost: 20,
    type: "hat"
},{
    name: "Wizard 01",
    src: "wizard01",
    cost: 50,
    type: "hat"
}, {
    name: "Top Hat",
    src: "tophat",
    cost: 25,
    type: "hat"
}, {
    name: "Pumpkin",
    src: "pumpkin",
    cost: 50,
    type: "hat"
}, {
    name: "Shyguy",
    src: "shyguy",
    cost: 70,
    type: "hat"
}, {
    name: "Pepe",
    src: "frog",
    cost: 70,
    type: "hat"
}, {
    name: "Interstellar",
    src: "interstellar",
    cost: 100,
    type: "hat"
}, {
    name: "Ghost",
    src: "ghost",
    cost: 60,
    type: "hat"
}, {
    name: "Toad",
    src: "toad",
    cost: 100,
    type: "hat"
}, {
    name: "Cappy",
    src: "cappy",
    cost: 65,
    type: "hat"
}, {
    name: "Crone's Dome",
    src: "crones_dome",
    cost: 100,
    type: "hat"
}, {
    name: "Rainbow Dash",
    src: "rainbowdash",
    cost: 100,
    type: "hat"
}];

// All maps
var maps = ["sand_village", "night_village", "moon", "desert"];

// Declare hat sources and variables

var itempos = 0;
while(itempos < items.length){
    
    eval("var " + items[itempos].src + " = new Image();");
    eval(items[itempos].src + ".src = 'hats/" + items[itempos].src + ".png';");
    itempos++;
}

 function itemSort(a,b) {
        if (a.cost < b.cost)
            return -1;
        if (a.cost > b.cost)
            return 1;
            return 0;
        }  
    
    items.sort(itemSort);

var unlockedItems = ["hat01"];
var inGame = false;

// Item loader
function loadItems(){
    
    document.getElementById("items_select").innerHTML = "";
    var i = 0;
    while(i < items.length){
        if(unlockedItems.indexOf(items[i].src) != -1){
            // Item is unlocked
        document.getElementById("items_select").innerHTML += '<div id="' + items[i].src + '" class="item" onclick="itemAction(this.id)" title="' + items[i].name + '"><img src="hats/' + items[i].src + '.png" class="item_img"> <img src="skins/skin01.png" class="bg_skin"> </div>';
            i++;    
        } else {
            i++; 
        }
        
    }
          
    i = 0;
    while(i < items.length){
        if(unlockedItems.indexOf(items[i].src) == -1){
        // Item is locked
        document.getElementById("items_select").innerHTML += '<div id="' + items[i].src + '" class="item_locked" onclick="itemAction(this.id)" title="' + items[i].name + '"> <span class="item_cost"> ' + items[i].cost +'</span> <img src="hats/' + items[i].src + '.png" class="item_img_locked"><img src="skins/skin01.png" class="bg_skin_locked"> </div>';
           i++;
        } else{
           i++;  
        } 
    }
}

var skin;
var hat;
var cr_rank = "farmer";

var gold;
var cr;
var id = readCookie("persID");

function reloadStats(){
    socket.emit("getProfile_quickdraw", id);
}

socket.on("qd_leaderboard", function(board){
    
    console.log("boi");
    var i = 0;
    document.getElementById("leaderboard").innerHTML = "";
    while(i < board.length){

        if(board[i].name == undefined){
            var name = "?";
        } else {
            var name = board[i].name;
        }
        document.getElementById("leaderboard").innerHTML += '<div id="leaderboard_table"> <span id="leaderboard_name">' + name + '</span> <span id="leaderboard_time">' + board[i].time + 'ms</span> </div>';
        i++;
    }
});


function loadProfile(profile){
    cr = profile[0];
    gold = profile[1];
    
    skin = readCookie("qd_skin");
    hat = readCookie("qd_hat");
    
    
    // insert gold and cr
    document.getElementById("insert_rank").innerHTML = cr;
    document.getElementById("insert_gold").innerHTML = gold;
    
    document.getElementById("skin_preview").src = eval(skin).src;
    document.getElementById("hat_preview").src = eval(hat).src;
    
    var i = 2;
    unlockedItems = ["hat01"];
    while(profile[i] != null){
        unlockedItems.push(profile[i]);
        i++;
    }
    
    if(cr < 2500){
        cr_rank = "farmer"
        document.getElementById("cr_rank").title = "Farmer";
        document.getElementById("cr_rank").src = "ranks/farmer.png"; 
    }
    
    if(cr >= 2500){
        cr_rank = "cowboy"
        document.getElementById("cr_rank").title = "Cowboy";
        document.getElementById("cr_rank").src = "ranks/cowboy.png";
    }
    if(cr >= 5000){
        cr_rank = "Sheriff"
        document.getElementById("cr_rank").title = "Sheriff";
        document.getElementById("cr_rank").src = "ranks/sheriff.png";
    }
    if(cr >= 7500){
        cr_rank = "Marshal"
        document.getElementById("cr_rank").title = "Marshal";
        document.getElementById("cr_rank").src = "ranks/marhsal-grey.gif";
    }
}

function itemAction(name){
    var itemUnlockedPos = unlockedItems.indexOf(name);
    var itemPos = items.findIndex(i => i.src === name);
    var type = items[itemPos].type;
    
    if(type == "hat"){
        // Item is of type Hat
    if(itemUnlockedPos != -1){
        // Item is unlocked, and will be choosed.
        createCookie("qd_hat", name, 10000);
        console.log("Selected skin/hat " + name);
        reloadStats();
        }
    if(itemUnlockedPos == -1){
        // Item is not unlocked, and will try to purchase through server.
        // Check if user can buy it (client side) this is also done serverside for extra security.
        if(gold >= items[itemPos].cost){
        // Confirm that you want to buy it (missclick)
        if(confirm("Are you sure you want to purchase " + items[itemPos].name + " for " + items[itemPos].cost + " gold?")){
            socket.emit("qd_item", {
                src: items[itemPos].src,
                id: id
            });
            //window.location.reload(false);
            reloadStats();
        } else {
            // User decliened purchase.
            return;
                }
            }console.log("Not enough funds.");
        } 
    }
}

//Check if user is new, if so register user.
validate();

function validate(){
    var id = readCookie("persID");
    socket.emit("validate", id);
}

function join(){
    // Register function for quickdraw
    var id = readCookie("persID");
    socket.emit("quickdraw_join", id);
    reloadPage();
    
}

function reloadPage(){
    window.location.reload(false); 
}

socket.on("validate_callback", function(call){
    var id = readCookie("persID");
    if(call == "failed"){
        
       document.body.innerHTML = '<img src="src/quickdraw_logo.png" id="header_logo"> <div id="signup_div"> Welcome to Quick Draw, looks like you are new! <br><br>  Quick Draw is a competitive standoff game for the whole family. <h3>How to play</h3> Search for a game, and you will be matched against another player over the internet. You will hear a gunshot after a little while, thats the signal - and now you are ready to shoot. The first one to shoot after the gunshot effect wins. (You shoot by pressing any key on your keyboard.) Shooting too early and you will lose, so make sure you shoot after the gunshot. <button id="join_button" onclick="join()">Join!</button> <script src="quickdraw.js"></script> </div>';
        console.log("Not found");
    }
    if(call == "valid"){
        //TODO Insert body on load
        socket.emit("getProfile_quickdraw", id);
        var selectedSkin = readCookie("qd_skin");
        var selectedHat = readCookie("qd_hat");
        if(selectedHat == null || selectedSkin == null){
            createCookie("qd_skin", "skin01", 10000);
            createCookie("qd_hat", "hat01", 10000);
        }
       
    }
});

socket.on("profile_callback", function(profile){
    loadProfile(profile);
    loadItems();
});

function manualLoad(){
    socket.emit("getProfile_quickdraw", id);
}


    // Quickdraw game

    // Preload audio
    var theme = new Audio();
        theme.src = "sound/theme.mp3";
    var gun = new Audio();
        gun.src = "sound/gun.mp3";
    var victory = new Audio();
        victory.src = "sound/win_theme.mp3";
    var fail = new Audio();
        fail.src = "sound/fail.mp3";

theme.volume = 0.5;
gun.volume = 0.5;
victory.volume = 0.5;
fail.volume = 0.5;


// Setup canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// Remove pixelation.
ctx.imageSmoothingEnabled = false;



// Declare image sources
var gameBG = new Image();
    gameBG.src = "maps/" + maps[Math.floor(Math.random() * maps.length)] + ".png";

var menuLogo = new Image();
    menuLogo.src = "src/quickdraw_logo_big.png"


var player1 = {
    skin: "skin01",
    hat: "hat01"
}

var player2 = {
    skin: "skin01",
    hat: "hat01"
}

var player1Pos = {
    x: 80,
    y: 180
}
    
var player2Pos = {
    x: 470,
    y: 180
}

var draw = "menu";
// states, menu - game - ?


// hDraw game
function drawGame(){
    
    player1.skin = skin;
    player1.hat = hat;
    
    player2.skin = skin;
    player2.hat = gameData.p2hat;
    
    gameBG.src = "maps/" + gameData.map + ".png";
    
    // Draw background image
    ctx.drawImage(gameBG, 0, 0, canvas.width, canvas.height);
    document.getElementById("insert_search").innerHTML = '';
    document.getElementById("opponent_info").innerHTML = "Your playing against " + gameData.p2name + "!<br>Press any key to fire!";
    
    // Player one
    // Draw player one skin
    ctx.drawImage(eval(player1.skin), player1Pos.x, player1Pos.y, 64, 82);
    // Draw player one hat
    ctx.drawImage(eval(player1.hat), (player1Pos.x - 17), (player1Pos.y - 31), 82, 114);
    
    // Player two
    
    // Flip context for reverse sprite
    // Draw player two skin
    ctx.scale(-1, 1);
    ctx.drawImage(eval(player2.skin), -player2Pos.x, player2Pos.y, 64, 82);
    // Draw player two hat
    ctx.drawImage(eval(player2.hat), -(player2Pos.x + 17), (player2Pos.y - 31), 82, 114);
    document.getElementById("search_game").innerHTML = "In Game";
    document.getElementById("search_game").style.background = "black";
    document.getElementById("search_game").disabled = true;
}



function drawGameOver(){


    player1.hat = hat;
    player2.hat = gameData.p2hat;
    
    // Draw background image
    ctx.drawImage(gameBG, 0, 0, canvas.width, canvas.height);
    document.getElementById("insert_search").innerHTML = '';
    if(status == "won"){
        victory.play();
        victory.loop = false;
        document.getElementById("opponent_info").innerHTML = "You won! Your time: " + result + "ms! <br> Opponent time: " + optime + "ms.";
        
        player1.skin = skin_won;
        player2.skin = skin_lost;
        
        
        ctx.drawImage(eval(player1.skin), player1Pos.x, player1Pos.y, 64, 82);
        ctx.drawImage(eval(player1.hat), (player1Pos.x - 17), (player1Pos.y - 31), 82, 114);
        ctx.scale(-1, 1);
        ctx.drawImage(eval(player2.skin), -player2Pos.x, player2Pos.y, 64, 82);
        ctx.drawImage(eval(player2.hat), -(player2Pos.x - 45), (player2Pos.y + 15), 82, 114);
        
        
    }
    if(status == "lost"){
        document.getElementById("opponent_info").innerHTML = "You lost. Your time: " + result + "ms. <br> Opponent time: " + optime + "ms.";
        player1.skin = skin_lost;
        player2.skin = skin_won;
        
        ctx.drawImage(eval(player1.skin), player1Pos.x, player1Pos.y, 64, 82);
        ctx.drawImage(eval(player1.hat), (player1Pos.x + 45), (player1Pos.y + 15), 82, 114);
        ctx.scale(-1, 1);
        ctx.drawImage(eval(player2.skin), -player2Pos.x, player2Pos.y, 64, 82);
        ctx.drawImage(eval(player2.hat), -(player2Pos.x + 17), (player2Pos.y - 31), 82, 114);
    }


    
    
    document.getElementById("search_game").innerHTML = "Leave";
    document.getElementById("search_game").style.background = "#474747";
    document.getElementById("search_game").disabled = false;
    
}


document.body.addEventListener('keydown',function(e) { 
    if(e.code == "Enter"){
        if(inGame == false){
            search();
        }
        if(draw == "over"){
            reloadPage();
        }
    }
    if(inGame == true){
        fire();
    }
    
    
},false);

function drawWait(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


var logoPos = 200;

function drawMenu(){
    ctx.drawImage(gameBG, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuLogo, 0, logoPos);
    if(logoPos > 0){
        logoPos = logoPos - 15;
    }
    document.getElementById("search_game").innerHTML = "Search Game";
    document.getElementById("search_game").style.background = "#40ef49";
    document.getElementById("search_game").disabled = false;
}

function drawSearching(){
    ctx.drawImage(gameBG, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("insert_search").innerHTML = '<img src="src/loading.gif" id="load_gif"><span id="searching_stats">Searching</span>';
    ctx.drawImage(menuLogo, 0, logoPos);
    if(logoPos < 200){
        logoPos = logoPos - 15;
    }
    document.getElementById("search_game").innerHTML = "Cancel Search";
    document.getElementById("search_game").style.background = "#ed3434";
    document.getElementById("search_game").disabled = false;
}

var searching = false;

function search(){
    var name = readCookie("username");
    if(inGame == true){
        playStatus = "Quick Draw"
        refreshProfile();
        reloadPage();
        return;
    }
    
    if(searching == false){
        playStatus = "Quick Draw: Searching"
        refreshProfile();
        logoPos = 0;
        searching = true;
        socket.emit("qd_search", {
            id: id,
            skin: skin,
            hat: hat,
            name: name
            
        });
        
    } else {
        logoPos = 200;
        searching = false;
        document.getElementById("insert_search").innerHTML = '';
        socket.emit("qd_stopsearch", id);
        playStatus = "Quick Draw"
        refreshProfile();
    }
    
}

window.onbeforeunload = function() {
    socket.emit("qd_stopsearch", id);
}

var gameData;
var shot;
var result;
var userShot;
var then;
var now;
var failed = false;
var optime;
var status;

socket.on("newGame", function(data){
    playStatus = "Quick Draw: In Game"
    refreshProfile();
    setTimeout(shoot,(data.playTime * 1000) + 2000);
    shot = false;
    gameData = data;
    searching = false;
    inGame = true;
    draw = "game";
    theme.play();
});

function shoot(){
    if(userShot == true){
        // User lost, preshot.
        failed = true;
    }
    draw = "wait";
    theme.pause();
    gun.play();
    shot = true;
    result = 1000;
    then = Date.now(); 
    setTimeout(sendResults, 1000);
}


function fire(){
    if(shot != true){
        fail.play();
        theme.pause();
        failed = true;
        return;
    }
    if(failed == true){
        return;
    }
    if(userShot == true){
        return;
    }
    now = Date.now();
    userShot = true;
    result = now - then;

}
var name = readCookie("username");
function sendResults(){
    userShot = true;
    socket.emit("game_results", {
        time: result,
        gameID: gameData.gameID,
        id: id,
        name: name
    })
}



socket.on("game_over", function(data){
    manualLoad();
    draw = "over";
    status = data.status;
    optime = data.optime;
});

render();

function render(){
    
    if(draw == "game"){
        drawGame();
    }
    if(draw == "menu"){
        drawMenu();
    }
    if(searching == true){
        drawSearching();
    }
    if(draw == "wait"){
        drawWait();
    }
    if(draw == "over"){
        drawGameOver();
    }
    
    requestAnimationFrame(render);
}













var playStatus = "Quick Draw";


function refreshProfile(){
    var personalID = readCookie("persID");
        // Generate new personalID for new users.
        if(personalID == null){
            var newID = Math.floor(Math.random() * 999999999) + 1;
            createCookie("persID", newID, 10000);
            personalID = readCookie("persID");
        }

        console.log("Personal ID: " + personalID);


        var messageUsername = readCookie("username");
        var messageProfile = readCookie("profileLocation");
        var xp = (readCookie("xp") / 1000) + 1;
        xp = Math.floor(xp);


         socket.emit("sentover", {
            username: messageUsername,
            profilepic: messageProfile,
            xp: xp,
            id: socket.id,
            status: playStatus,
            persID: personalID
        });

        console.log("Sent over data");
}

// On connection send over Username, ProfileLoc & Lvl

socket.on("login", function(request){

    if(request == "loginInfo"){

        var personalID = readCookie("persID");
        // Generate new personalID for new users.
        if(personalID == null){
            var newID = Math.floor(Math.random() * 999999999) + 1;
            createCookie("persID", newID, 10000);
            personalID = readCookie("persID");
        }

        console.log("Personal ID: " + personalID);


        var messageUsername = readCookie("username");
        var messageProfile = readCookie("profileLocation");
        var xp = (readCookie("xp") / 1000) + 1;
        xp = Math.floor(xp);


         socket.emit("sentover", {
            username: messageUsername,
            profilepic: messageProfile,
            xp: xp,
            id: socket.id,
            status: playStatus,
            persID: personalID
        });

        console.log("Sent over data");
    }
});






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
