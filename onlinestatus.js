
// Socket.io & chat functions
var socket = io.connect("http://213.66.254.63:25565");


var playStatus = "...";

if(window.location.href.indexOf("items") != -1){
    playStatus = "Items"   
}

if(window.location.href.indexOf("crate") != -1){
    playStatus = "Crates"   
}

if(window.location.href.indexOf("roulette") != -1){
    playStatus = "Gambling"   
}

if(window.location.href.indexOf("about") != -1){
    playStatus = "About"   
}

if(window.location.href.indexOf("crate") != -1){
    playStatus = "Crates"   
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



// Admin tools

socket.on("message_admin", function (message){
    document.getElementById("messages_admin").innerHTML = message;
})


function verifyUser(){
    
    var inputID = document.getElementById("inputID").value;
    var inputToken = document.getElementById("inputToken").value;
    
    socket.emit("verify", {
        id: inputID,
        token: inputToken
    });
}


function unverifyUser(){
    
    var inputID = document.getElementById("inputID").value;
    var inputToken = document.getElementById("inputToken").value;
 
    socket.emit("unverify", {
        id: inputID,
        token: inputToken
    });
}


function banUser(){
    
    var inputID = document.getElementById("inputID").value;
    var inputToken = document.getElementById("inputToken").value;
  
    socket.emit("ban", {
        id: inputID,
        token: inputToken
    });
}

function pardonUser(){
    
    var inputID = document.getElementById("inputID").value;
    var inputToken = document.getElementById("inputToken").value;
  
    socket.emit("pardon", {
        id: inputID,
        token: inputToken
    });
}

function showUserLog(){
    
   
    var inputToken = document.getElementById("inputToken").value;
  
    socket.emit("userlog", {
        token: inputToken
    });
}

socket.on("userlog", function(log){
    
    document.getElementById("messages_admin").innerHTML = log;
    console.log(log);
});

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
 



















