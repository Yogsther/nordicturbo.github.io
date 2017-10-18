// Global variables
// Time to count
var countDownTime = 10;
var rolls = 10;




var time = countDownTime;
var rollNumber;
var currentRolls = rolls;
var rollColor;
var redBet = 0;
var blackBet = 0;
var greenBet = 0;
var rollColorName;
var countdown = 5;
var credits = readCookie("credits");
var currentlyRolling = false;


// Startup function(s)
startUpFunction();




function startUpFunction(){
    if (window.location.href.indexOf("crash") != -1){
        // Startup function for crash
        insertCredits();
        addCredits(0);
        resetCrash();
        // Startup message on Crash
        log("<br>Welcome to the brand new Crash site. Test it out :)<br>");
    } else {
        // Startup function for Roulette
        roll();
        insertCredits();
        addCredits(0);
        checkNewUser();
        
        // Startup message on Roulette
        log("<br>Welcome to Nuto.co Roulette! Bet using your NotuCoins. If you're lucky.. you may profit.<br>");

    }
}



function back(){
    window.location.href = "/browse.html";
}

function gotoRoulette(){
    window.location.href = "index.html";
}

function gotoCrash(){
    window.location.href = "crash.html";
}

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

var crashStatus = 1;
var crashed = false;
var crashInProgress = false;
var randomCrashVar;
var crashMultiplier;
var crashBet = 0;
var hasBet = false;
var canCashOut = false;


// Crash functions

function runCrash(){
    crashStatus = 1;
    crashed = false;
    crashMultiplier = 0;
    crashInProgress = true;
    hasBet = false;
    crash();
    document.getElementById("crash_lock_button").innerHTML = "Cash out";
}

var crashWoah = new Audio('crash.mp3');

function betOnCrash(){
    
    var credits = Number(readCookie("credits"));
    
    
    
    
    if(crashInProgress == true){
        
        if(canCashOut == true){
        // CASH OUT FEATURE
        var winMoney = Math.round(crashMultiplier * crashBet);
        var profitMoney = winMoney - crashBet;
        
        var xpReward = Math.round(profitMoney * 0.2);
        if(xpReward > 1000){
            xpReward = 1000;
        }
          
        
        
        log("Cashed out at " + crashMultiplier + " Won: " + winMoney + "<span style='color: #5ce24e;'> Profit: " + profitMoney + "</span>");
        if(xpReward > 0){
            log("XP Reward: " + xpReward);
            addXP(xpReward); 
        }
            
            
        addCredits(winMoney);    
        crashWoah.play();
        canCashOut = false;
        return;
        }
    }
    
    
    
    if(hasBet == false && crashInProgress == true){
        error("Can't cash out.");
        return;
    }
    
     if(crashInProgress == true){
        error("You can't bet while Crash is in progress.");
        return;
    }
    if(hasBet != true){
        crashBet = document.getElementById("crash_amount").value;
    }
    
    
    if(isFinite(crashBet) != true){
        error("Bet amount must be a number!");
        return;
    }
    
    if(crashBet < 1){
        error("Minimum bet amount is 1");
        return;
    }
    
    if(crashBet % 1 != 0){
        error("Bet amount must be a whole number.");
        return;
    }
    
    if(credits < crashBet){
        error("You don't have enough credits to bet " + crashBet);
        return;
    }
    
    if(hasBet != true){
    // Bet
    var deleteAmount = crashBet * -1;
    
        
    addCredits(deleteAmount);
    log("<i>Bet placed: " + crashBet + "</i>");
    
    canCashOut = true;
    hasBet = true;
    
    return;
    }
    
    
}

var crashSpeed;
var crashChance;

function crash(){
    
    if(crashed == false){
        
        
        if(crashStatus < 2){
            randomCrashVar = Math.floor(Math.random()*100);
            crashChance = "1%";
            }
        
        if(crashStatus > 2){
            crashChance = "0.5%";
            randomCrashVar = Math.floor(Math.random()*200);   
            }
        if(crashStatus > 3){
            crashChance = "0.33%";
            randomCrashVar = Math.floor(Math.random()*300);  
            }
        if(crashStatus > 4){
            crashChance = "0.25%";
            randomCrashVar = Math.floor(Math.random()*400); 
            }
        if(crashStatus > 10){
            crashChance = "0.01%";
            randomCrashVar = Math.floor(Math.random()*1000);    
            
        }

        crashSpeed = Number(crashSpeed).toFixed(5);
        console.log("Crash status: " + crashStatus.toFixed(3) + ". Crash speed: " + crashSpeed + "ms" + " Crash chance: " + crashChance);
        
        
        if(randomCrashVar == 0){
            crashed = true;
            crashInProgress = false;
            // Crashed
            countdown = 5;
            crash();
            return;
        }
        // Not crashed
        crashStatus = crashStatus + 0.01;
        crashMultiplier = crashStatus.toFixed(2);
        insertCrashStatus();
        

        crashSpeed = 110 / crashMultiplier;
                
        setTimeout('crash();', crashSpeed);
        return;
    }
    // Crashed
    if(canCashOut == true){
    log("Crashed at <span style='color: red;'>" + crashMultiplier + " Final: -" + crashBet);
    }
    
    if(canCashOut != true){
    log("Crashed at <span style='color: red;'>" + crashMultiplier);
    }
    
    canCashOut = false;
    hasBet = false;
    setTimeout('resetCrash();', 1500);
    insertCrashStatus();
    console.log("CRASHED @ " + crashMultiplier);
    document.getElementById("crash_lock_button").innerHTML = "Bet";
    crashBet = 0;
    
    
}

var countdown = 5;


function resetCrash(){
    crashInProgress = false;
    crashStatus = 1;
    crashed = false;
    crashMultiplier = 0;
    document.getElementById("crash_lock_button").innerHTML = "Bet";
    
    if(countdown > 0.1){

        countdown = countdown - 0.1;
        document.getElementById("crash_main_text").innerHTML = "<span style='font-size: 40px; color: grey; position: relative; top: -25px;'>Starting in " + countdown.toFixed(1) + "</span>";
        setTimeout('resetCrash();', 100);
        
        return;
    }
    
    runCrash();
    
  
    
}




function insertCrashStatus(){
    
    if(crashed == true){
        document.getElementById("crash_main_text").innerHTML = '<span style=" position: relative; top: -45px; color: red; font-size: 50px;">Crashed<br></span><span style="color: red; font-size: 50px; position: relative; top: -105px;">at ' + crashStatus.toFixed(2) + 'x</span>';
        return;
    }
    if(crashed != true){
        document.getElementById("crash_main_text").innerHTML = crashStatus.toFixed(2) + 'x';
    }
    
    
    
    
}



















function addAmount(betValue){
    betValue = Number(betValue);
    var betValueBar = Number(document.getElementById("bet_input").value);
    betValueBar = betValueBar + betValue;
    document.getElementById("bet_input").value =  betValueBar;
}

function addx2(){
    var betValueBar = Number(document.getElementById("bet_input").value);
    betValueBar = betValueBar * 2;
    document.getElementById("bet_input").value =  betValueBar;
}

function addAll(){
    var betValueBar = Number(document.getElementById("bet_input").value);
    betValueBar = credits;
    document.getElementById("bet_input").value =  betValueBar;
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
        
        insertCountdown("rolling");
        
        // Rolling
        
        if(currentRolls > 0){
            currentlyRolling = true;
            rollNumber = Math.floor(Math.random()*15);
            document.getElementById("roll_number").innerHTML = rollNumber;
            insertRollColor();
            currentRolls = currentRolls - 1;
           
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
        // Xp reward
        var xpReward = Math.round((winnerMoney - totalBet) * 0.2);
        
        if(xpReward > 1000){
            xpReward = 1000;
            console.log(xpReward)
        }
    
        
    
    
        // Fund bank
        addCredits(winnerMoney);
        
        // Log message
        log("<span style='color:" + rollColor + ";')>" + rollColorName + "</span> (" + rollNumber + ") Bet: " + totalBet + ". Won: " + winnerMoney + ". Final: " + (winnerMoney - totalBet));
    
        if (xpReward > 0){
            log("XP Reward: " + xpReward);
            addXP(xpReward);
        }
        
    
    
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
    
    var credits = readCookie("credits");
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
    
    var credits = readCookie("credits");
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
    
    var credits = readCookie("credits");
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


// XP Function

function addXP(amount){
    var xp = Number(readCookie("xp"));
    var oldLvl = parseInt(Math.floor(xp / 1000) + 1, 10)
        
        if(xp == null){
            createCookie("xp",0,10000);
            credits = Number(xp) + Number(amount);
            createCookie("xp",credits, 10000);
            console.log("You gained " + amount + "xp.");
        } else {
            xp = Number(xp) + amount;
            createCookie("xp",xp, 10000);
            console.log("You gained " + amount + "xp.");
            
            var newLvl = parseInt(Math.floor(xp / 1000) + 1, 10)
            // Added xp, check for lvl up:
            //if(oldXP.floor)
            if(newLvl > oldLvl){
                // User has leveled up!
                // Play level up sound effect
                var levelupSound = new Audio("/sound/notu_lvlup_v2.wav");
                levelupSound.volume = 0.3;
                levelupSound.play();
                
                var crates = readCookie("crates");
                crates = Number(crates) + 1;
                createCookie("crates", crates, 10000)
                
            }
        }
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
 
























