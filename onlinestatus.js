
// Socket.io & chat functions

//var socket = io.connect("http://213.66.254.63:25565");
var socket = io.connect("http://213.66.254.63:25565");

var playStatus = "Somewhere";

if(window.location.href.indexOf("items") != -1){
    playStatus = "Items";   
}

if(window.location.href.indexOf("crate") != -1){
    playStatus = "Crates";   
}

if(window.location.href.indexOf("roulette") != -1){
    playStatus = "Gambling";  
}

if(window.location.href.indexOf("about") != -1){
    playStatus = "About";   
}

if(window.location.href.indexOf("crate") != -1){
    playStatus = "Crates";   
}

// On connection send over Username, ProfileLoc & Lvl

socket.on("login", function(request){
    
    if(request == "loginInfo"){
        
        var messageUsername = readCookie("username");
        var messageProfile = readCookie("profileLocation");
        var xp = (readCookie("xp") / 1000) + 1;
        xp = Math.floor(xp);
        
        
         socket.emit("sentover", {
            username: messageUsername,
            profilepic: messageProfile,
            xp: xp,
            id: socket.id,
            status: playStatus
        });
        
        console.log("Sent over data");
    }
}); 


var onlineUsers = 0;

socket.on("listreset", function(profile){
   
        onlineUsers = 0;
        document.getElementById("online_list_inner").innerHTML = "";
})


socket.on("onlinepush", function(profile){
    
   
    
    onlineUsers++;
    
    // Get online users
    
    var data = profile;
    
    var xpColor = "white";
    
    if(data.xp >= 2){
        xpColor = "#7c4fd1";
    }
    if(data.xp >= 3){
        xpColor = "#ba1da7";
    }
    if(data.xp >= 4){
        xpColor = "#a8174c";
    }
    if(data.xp >= 5){
        xpColor = "#ce0c3c";
    }
    if(data.xp >= 6){
        xpColor = "#ff4774";
    }
    if(data.xp >= 7){
        xpColor = "#326617";
    }
    if(data.xp >= 8){
        xpColor = "#5bc425";
    }
    if(data.xp >= 9){
        xpColor = "#75f931";
    }
    if(data.xp >= 10){
        xpColor = "#e0b731";
    }
    if(data.xp >= 15){
        xpColor = "#f24e1d";
    }
    if(data.xp >= 20){
        xpColor = "#f1bc1d";
    }
    if(data.xp >= 30){
        xpColor = "#ff3030";
    }
    if(data.xp >= 40){
        xpColor = "#e0b731";
    }
    if(data.xp >= 50){
        xpColor = "#d7e1f2";
    }
    
    console.log(xpColor);
    document.getElementById("online_list_inner").innerHTML += '<div id="online_user_div"><img src="' + profile.profilepic + '" id="online_list_user_profile"><span id="online_list_name">' + profile.username + '</span><span id="online_list_status"><span style="color: ' + xpColor + ';">Lvl ' + profile.xp + ' </span>| <span style="color: #1ff226;">Online</span></span></div>';
    
    document.getElementById("online_users_number").innerHTML = onlineUsers;
    
    console.log("ONLINE USERS: " + onlineUsers);
    console.log("USER ID: " + profile.id);
    console.log("Online users: " + profile.username);
    
});







