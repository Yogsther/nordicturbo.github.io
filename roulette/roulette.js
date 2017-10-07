// Global variables
// Time to count
var countDownTime = 10;
var rolls = 10;

// First log message
log("<br>Welcome to Nuto.co Roulette! Bet using your NotuCoins. If you're lucky.. you may profit.<br>");


var time = countDownTime;
var rollNumber;
var currentRolls = rolls;
var rollColor;
var redBet = 0;
var blackBet = 0;
var greenBet = 0;
var rollColorName;

var credits = readCookie("credits");
var currentlyRolling = false;


// Startup function(s)

roll();
insertCredits();
addCredits(0);
checkNewUser();



function insertCredits(){
    
    credits = readCookie("credits");
    document.getElementById("numCredits").innerHTML = credits;
    
}

function checkNewUser(){
    var newUserStatus = readCookie("rouletteNew");
    if(newUserStatus != "false"){
        document.getElementById("insert_pst").innerHTML = '<img src="pst_tab_500.png" id="pst_tab" onclick="runPst()">';
    }
}

function runPst(){
    createCookie("rouletteNew", false, 30);
    addCredits(500);
    location.reload();
    
}



function roll(){
    
    if(time > 0){
        time = time - 0.1;
        time = Math.round(time * 100) / 100;
        time = time.toFixed(1);
        
        

        setTimeout('roll();', 100);
        insertCountdown("countdown");
        return;
    }
    if(time == 0){
        rolling();
    }
    
}


function rolling(){
        console.log("Rolling");
        insertCountdown("rolling");
        
        // Rolling
        
        if(currentRolls > 0){
            currentlyRolling = true;
            rollNumber = Math.floor(Math.random()*14);
            document.getElementById("roll_number").innerHTML = rollNumber;
            insertRollColor();
            currentRolls = currentRolls - 1;
            console.log(currentRolls);
            setTimeout('rolling();', 300);
            return;
        } 
        currentlyRolling = false;
    
        // Initial roll is over
        console.log("Shit has rolled, Color: " + rollColor + " and roll was: " + rollNumber);
        insertCountdown("over");
        
        
        var totalBet = redBet + greenBet + blackBet;
        var winnerMoney = 0;
    
        if(rollColorName == "Red"){
            // Roulette stayed on Red
            winnerMoney = redBet * 2;
        }
    
        if(rollColorName == "Black"){
            // Roulette stayed on Black
            winnerMoney = blackBet * 2;
        }
    
        if(rollColorName == "Green"){
            // Roulette stayed on Green
            winnerMoney = greenBet * 14;
            
        }
        // Fund bank
        addCredits(winnerMoney);
        
        // Log message
        log("<span style='color:" + rollColor + ";')>" + rollColorName + "</span> (" + rollNumber + ") Bet: " + totalBet + ". Won: " + winnerMoney + ". Final: " + (winnerMoney - totalBet));    
    
    
        // Post rolling (reset)
        setTimeout('roll();', 1000);
        time = countDownTime;
        currentRolls = rolls; 
    
        redBet = 0;
        blackBet = 0;
        greenBet = 0;
    
        insertBet();
  
}


function insertCountdown(state){
    
    if(state == "countdown"){
    document.getElementById("count_down").innerHTML = "Next roll: " + time + "s";
    }
    if(state == "rolling"){
    document.getElementById("count_down").innerHTML = "<span style='position: relative; left: 25px;'>Rolling!</span>";
    }
    
    if(state == "over"){
    document.getElementById("count_down").innerHTML = "<span style='color: #111111'>-</span>";
    }
    
    
}


function insertRollColor(){
    
    if(rollNumber == 0){
        // Color is GREEN
        
        rollColor = "#50df5b"
        rollColorName = "Green"
        document.getElementById("roll_div").style.backgroundColor = rollColor;
        return;
    }
    
    if(rollNumber > 7){
        // Color is BLACK
        rollColor = "#3f3f3f"
        rollColorName = "Black"
        document.getElementById("roll_div").style.backgroundColor = rollColor;
        return;
    }
    
    if(rollNumber < 8){
        // Color is RED
        rollColor = "#d13838"
        rollColorName = "Red"
        document.getElementById("roll_div").style.backgroundColor = rollColor;
        return;
    }   
}





function addRed(){
    
    
    var betAmount = Number(document.getElementById("bet_input").value);
         
    if(currentlyRolling == true){
        error("You can't bet while Roulette is rolling.");
        return;
    }
    
    
    if(isFinite(betAmount) != true){
        console.log("Bet amount has to be a number!");
        error("Bet amount must be a number!");
        return;
    }
    if(betAmount < 1){
        console.log("Minimum bet amount is 1");
        error("Minimum bet amount is 1");
        return;
    }
    if(betAmount % 1 != 0){
        error("Bet amount must be a whole number.");
        console.log("Bet amount must be a whole number.");
        return;
    }
    if(credits < betAmount){
        console.log("You don't have enough credits to bet " + betAmount);
        error("You don't have enough credits to bet " + betAmount);
        return;
    }
    
    
    addCredits(Number("-" + betAmount));
    redBet = redBet + betAmount;
    insertBet();

}

function addBlack(){
    
    
    var betAmount = Number(document.getElementById("bet_input").value);
         
    if(currentlyRolling == true){
        error("You can't bet while Roulette is rolling.");
        return;
    }
    
    
    if(isFinite(betAmount) != true){
        console.log("Bet amount has to be a number!");
        error("Bet amount must be a number!");
        return;
    }
    if(betAmount < 1){
        console.log("Minimum bet amount is 1");
        error("Minimum bet amount is 1");
        return;
    }
    if(betAmount % 1 != 0){
        error("Bet amount must be a whole number.");
        console.log("Bet amount must be a whole number.");
        return;
    }
    if(credits < betAmount){
        console.log("You don't have enough credits to bet " + betAmount);
        error("You don't have enough credits to bet " + betAmount);
        return;
    }
    
    
    addCredits(Number("-" + betAmount));
    blackBet = blackBet + betAmount;
    insertBet();

}


function addGreen(){
    
    
    var betAmount = Number(document.getElementById("bet_input").value);
         
    if(currentlyRolling == true){
        error("You can't bet while Roulette is rolling.");
        return;
    }
    
    
    if(isFinite(betAmount) != true){
        console.log("Bet amount has to be a number!");
        error("Bet amount must be a number!");
        return;
    }
    if(betAmount < 1){
        console.log("Minimum bet amount is 1");
        error("Minimum bet amount is 1");
        return;
    }
    if(betAmount % 1 != 0){
        error("Bet amount must be a whole number.");
        console.log("Bet amount must be a whole number.");
        return;
    }
    if(credits < betAmount){
        console.log("You don't have enough credits to bet " + betAmount);
        error("You don't have enough credits to bet " + betAmount);
        return;
    }
    
    
    addCredits(Number("-" + betAmount));
    greenBet = greenBet + betAmount;
    insertBet();

}

function insertBet(){
    document.getElementById("red_bet").innerHTML = redBet;
    document.getElementById("black_bet").innerHTML = blackBet;
    document.getElementById("green_bet").innerHTML = greenBet;
}


function log(message){
    
    document.getElementById("log_box").innerHTML += message +'<br>';
    var objDiv = document.getElementById("log_box");
    objDiv.scrollTop = objDiv.scrollHeight;
    
}

function error(message){

    
    document.getElementById("log_box").innerHTML += '<span style="color: red">' + message +'<br>';
    var objDiv = document.getElementById("log_box");
    objDiv.scrollTop = objDiv.scrollHeight;
}





// Add credits function

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
        insertCredits(); 
}





// Cookie functions


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
 
























