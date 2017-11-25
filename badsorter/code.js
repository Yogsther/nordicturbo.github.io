
// Socket.io & chat functions
var socket = io.connect("http://213.66.254.63:25565");
var playStatus = "Super Sorter";


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
 

/*
 END OF ONLINESTATUS
*/

// Setup canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var stop = false;

const colors = ["0, 169, 255", "250, 0, 255", "255, 0, 0", "255, 204, 0", "0, 255, 29"];

var color = colors[Math.floor(Math.random()*colors.length)];



window.onload = new function(){
  document.getElementById("amount").value = 10;
  generate();
}

// Generate random numbers (prep)
function generate(){
  numbers = [];
  var amount = document.getElementById("amount").value;
  for(var i = 0; i < amount; i++){
    numbers.push(i+1);
  }
    numbers = shuffle(numbers);
    printNumbers();
}

// Print out numbers to the document.
function printNumbers(){
  // Print arr numbers
    canvas.width = numbers.length*50;
    canvas.height = 50;
    
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0, canvas.width, canvas.height);
  for(var i = 0; i < numbers.length; i++){
        ctx.fillStyle = "rgba(" + color +  "," + (numbers[i]/(numbers.length)) +")";
        ctx.fillRect(i*50, 0, 50, 50);
  }   
  document.getElementById("numbers").innerHTML = numbers;
}

// Main loop run on "Sort numbers"
var sorted;
var startTime;
var runs;

reqeustScoreboard();

function reqeustScoreboard(){
    socket.emit("get_ss_scoreboard");
}


socket.on("scoreboard", function loadScoreBoard(data){
    for(var i = 0; i < 10; i++){
        
        var object = data[i];

        
        var timeMinutes = Math.floor(object.time / 60000);
        var timeSeconds = (object.time / 1000) - Math.round((timeMinutes * 60));
        
        if(timeSeconds < 0){
            timeSeconds *= -1;
        }

        
        document.getElementById("scoreboard").innerHTML += '<div id="score" style="border-color: rgb(' + color + ');"> <span class="name" title="Username"> ' + (i+1) + ". " + object.name +'</span> <span class="items" title="Items sorted">' + object.items + '</span> <span class="time" title="Time taken">' + timeMinutes+ ' minutes ' + timeSeconds.toFixed(1) + ' seconds</span> </div>';
        //document.getElementById("score").style.borderColor = "rgb(" + color + ")";
    }
});



// Start storting
function initateSort(){
  stop = false;
  runs = -1;
  sorted = false;
  startTime = Date.now();
  playStatus = "Sorting " + numbers.length + " items.";
  refreshProfile();
  runsort();
}

var then = Date.now();
var runsOnRecord = 0;
var avrageSpeed = [];

function goodSort(){
    stop = true;
    numbers.sort(function(a, b) {
        return a - b;
    });
    printNumbers();
}


var avrageSpeedInt = 0;

// Sorting loop
async function runsort(){
    
    if(stop){
        return;
    }
    
    var now = Date.now();
    if((now - then) > 100){
        then = now;
        runsPerSecond = runsOnRecord;
        avrageSpeed.push(runsPerSecond);
        
        var totalAvrage = 0;
        for(var i = 0; i < avrageSpeed.length; i++){
            totalAvrage += avrageSpeed[i];
        } 
        
        console.log(avrageSpeed.length);
        avrageSpeedInt = Math.round((totalAvrage / avrageSpeed.length)*10);
        runsOnRecord = 0;
        
        console.log(avrageSpeed);
        
        if(avrageSpeed.length > 100){
            // Reset avragespeed
            var oldAvrageSpeed = avrageSpeed;
            avrageSpeed = [];
            for(var i = 0; i < 10; i++){
                avrageSpeed.push(oldAvrageSpeed[oldAvrageSpeed.length - i - 1]);
            }
        }
    } 
  
  var amount = document.getElementById("amount").value;
  document.getElementById("status").innerHTML = "<span title='S/s = Sorts per Second'>Speed: " + runsPerSecond*10 + " S/s Avrage speed: " + avrageSpeedInt + " S/s</span> Tried sorting " + runs + " times.";
  runs++;
  runsOnRecord++;
  if(!sorted){
    numbers = shuffle(numbers); // Shuffle
    printNumbers(); // Print Numbers
    sorted = checkSorted(); // Check if numbers are sorted.
    await sleep(1);
    runsort();
  } else {
    // Numbers are sorted
    if(numbers.length >= 10){
        unlockProfile("sort");
    }
    var now = Date.now();
    var timeMinutes = Math.round((now - startTime) / 60000);
    var timeSeconds = ((now - startTime) / 1000) - Math.round((timeMinutes * 60));
    if(timeSeconds < 0){
        timeSeconds *= -1;
    }

    document.getElementById("status").innerHTML = "Sorted! 👍 Took " + runs + " tries in " + timeMinutes.toFixed(0) + " minutes and " + timeSeconds.toFixed(1) + " seconds.";
    playStatus = "Sorted " + numbers.length + " items in " + timeMinutes.toFixed(0) + " minutes.";
    refreshProfile();
      
    // Send new record to server
    socket.emit("ss_record", {
        name: readCookie("username"),
        items: numbers.length,
        time: (now-startTime)
    });    
  }
}


function checkSorted(){
  for(var i = 1; i < numbers.length; i++){
    if(numbers[i] >= numbers[i-1]){
      // OK
    } else {
      // Not sorted
      return false;
    }
  }
  return true;
}


/*
  Shuffle function for arrays.
*/
function shuffle(arr){

  // Create index array
  var index = [];
  for(var i = 0; i < arr.length; i++){
    index[i] = i;
  }

  var shuffledArray = [];

  // Shuffle
  var i = 0;
  while(index.length > 0){

    var randomVariable = Math.floor(Math.random()*index.length);
    var nextIndex = index[randomVariable];
      index.splice(randomVariable, 1); // Remove that one from the index.
      shuffledArray[i] = arr[nextIndex];
    i++;
  }
  return shuffledArray;

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


// Stolen from stockoverflow.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
