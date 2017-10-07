// Global variables
// Time to count
var countDownTime = 5;
var rolls = 10;


var time = countDownTime;
var rollNumber;
var currentRolls = rolls;
var rollColor;
var redBet = 0;
var blackBet = 0;
var greenBet = 0;

var credits = readCookie("credits");


// Startup function(s)

//roll();
insertCredits();
addCredits(0);
log("Welcome!");


function insertCredits(){
    
    credits = readCookie("credits");
    document.getElementById("numCredits").innerHTML = credits;
    
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
            rollNumber = Math.floor(Math.random()*14);
            document.getElementById("roll_number").innerHTML = rollNumber;
            insertRollColor();
            currentRolls = currentRolls - 1;
            console.log(currentRolls);
            setTimeout('rolling();', 300);
            return;
        } 
    
        // Initial roll is over
        console.log("Shit has rolled, Color: " + rollColor + " and roll was: " + rollNumber);
        insertCountdown("over");
    
        
    
        
        // Post rolling (reset)
        setTimeout('roll();', 5000);
        time = countDownTime;
        currentRolls = rolls; 
    
        redBet = 0;
        blackBet = 0;
        greenBet = 0;
    
    
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
        document.getElementById("roll_div").style.backgroundColor = rollColor;
        return;
    }
    
    if(rollNumber > 7){
        // Color is BLACK
        rollColor = "#3f3f3f"
        document.getElementById("roll_div").style.backgroundColor = rollColor;
        return;
    }
    
    if(rollNumber < 8){
        // Color is RED
        rollColor = "#d13838"
        document.getElementById("roll_div").style.backgroundColor = rollColor;
        return;
    }   
}


function addRed(){
    
    
    var betAmount = Number(document.getElementById("bet_input").value);
                           
    
    
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

}

function log(message){
    

    
    document.getElementById("log_box").innerHTML += message +'<br>';
}

function error(message){

    
    document.getElementById("log_box").innerHTML += '<span style="color: red">' + message +'<br>';
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
 
























