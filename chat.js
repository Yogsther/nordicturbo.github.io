
// Socket.io & chat functions

var socket = io.connect("http://213.66.254.63:25565");

// On connection send over Username, ProfileLoc & Lvl
// First time loading page, making sure not to run the chat ping sound when reciving chat cache.
var first = 1;

var failed = false;
var failedMessage;



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
        
        if(messageUsername == null){
        // Generate & save profile name, user has no saved Name.
        var newRandom = Math.floor(Math.random()*8999)+1000;
        var username = "New #" + newRandom;
        createCookie("username", username, 10000);
        createCookie("profileLocation", "http://livingforit.xyz/img/profiles/profile_none.png", 10000)
        messageUsername = username;
        messageProfile = "http://livingforit.xyz/img/profiles/profile_none.png";
        }
        
        var xp = (readCookie("xp") / 1000) + 1;
        xp = Math.floor(xp);
        // Check if everything is valid
        
        if(messageUsername.length > 20){
            failed = true;
            console.log("Error 1");
            failedMessage = "Too long username!";
            getError();
            return;
        }
        if(messageUsername.indexOf("<") != -1){
            failed = true;
            console.log("Error 2");
            failedMessage = "HTML Tag in username!";
            getError();
            return;
        }
        if(messageProfile.toLowerCase().indexOf("livingforit.xyz/img/profiles") == -1){
            failed = true;
            console.log("Error 3");
            failedMessage = "Bad profile picture, make sure your profile picture is hosted on Livingforit.xyz";
            getError();
            return;
        }
        if(isNaN(xp)){
            failed = true;
            console.log("Error 4");
            failedMessage = "Bad XP: Your XP level is not a number.";
            getError();
            return;
        }
        if(xp > 120){
            failed = true;
            console.log("Error 5");
            failedMessage = "Bad XP: Your XP level is over the cap (100). Please don't cheat.";
            getError();
            return;
        }
        
        socket.emit("sentover", {
            username: messageUsername,
            profilepic: messageProfile,
            xp: xp,
            id: socket.id,
            status: "Online",
            persID: personalID
        });
        
        console.log("You have connected to the server, socket.id: " + socket.id);
    }
    
   
    
}); 


function getError(){
    if(failed){
    // Show failed error
    document.getElementById("online_list_inner").innerHTML = "<span id='error-chat'>Error: You can not connect to the online list or use the chat because of an error with the server. <br><br>Error message:<br><b><i>" + failedMessage + "</i></b><br><br>If you don't know how to resolve this, go to Items and reset your stats. If you don't want to reset all the stats and items, delete the cookie that is causing the problem.<img src='https://i.imgur.com/OX5GjP8.png' id='protogent'></span>";
    console.log("TEST");
    }
}

var onlineUsers = 0;

socket.on("listreset", function(profile){
        if(failed){
            return;
        }
        onlineUsers = 0;
        document.getElementById("online_list_inner").innerHTML = "";
})



socket.on("onlinepush", function(profile){
    
    if(failed){
        return;
    }
    
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
        xpColor = "#b9f442";
    }
    if(data.xp >= 60){
        xpColor = "#8fd10c";
    }
    if(data.xp >= 70){
        xpColor = "#01b714";
    }
    if(data.xp >= 80){
        xpColor = "#35dd46";
    }
    if(data.xp >= 90){
        xpColor = "##b546ce";
    }
    if(data.xp >= 100){
        xpColor = "#ffe228";
    }

    
    console.log(xpColor);
    document.getElementById("online_list_inner").innerHTML += '<div id="online_user_div"><img src="' + profile.profilepic + '" id="online_list_user_profile"><span id="online_list_name">' + profile.username + '</span><span id="online_list_status"><span style="color: ' + xpColor + ';">Lvl ' + profile.xp + ' </span>| <span style="color: #1ff226;">' + profile.status + '</span></span></div>';
    
    document.getElementById("online_users_number").innerHTML = onlineUsers;
    
    console.log("ONLINE USERS: " + onlineUsers);
    console.log("USER ID: " + profile.id);
    console.log("Online users: " + profile.username);
    
});


// Listen for enter press to send message
var sendBtn = document.getElementById("chat_message");
sendBtn.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  
        sendMessage();
    }
});



// Send message

function sendMessage(){
    
    if(failed){
        return;
    }
    
    
    var currentdate = new Date(); 
    
    var messageContent = document.getElementById("chat_message").value;
    
    var messageUsername = readCookie("username");
    var messageProfile = readCookie("profileLocation");
    
    var hours = ("0" + currentdate.getHours()).slice(-2);
    var minutes = ("0" + currentdate.getMinutes()).slice(-2);
    
    var messageTime = hours + ":" + minutes;
    var xp = (readCookie("xp") / 1000) + 1;
        xp = Math.floor(xp);
    
    document.getElementById("chat_message").value = ""; 
    
    // Dont send message if message is empty.
    if(messageContent.length < 1){
        return;
    }
    
    if(chatEnabled == false){
        // "Disable chat" message
        document.getElementById("chat-inner").innerHTML += '<div id="spam_div"><span id="spam_warning"><i>Chat has been disabled for 5 seconds. <br>Reason: Spam.</i></span></div>';
        
        // Scroll down in chat on error message
        var chatWindow = document.getElementById("chat-inner");
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        return;
    }
    
    
    if(spamStatus >= 4){
        // Disable chat
        // "Disable chat" message
        document.getElementById("chat-inner").innerHTML += '<div id="spam_div"><span id="spam_warning"><i>Chat has been disabled for 5 seconds. <br>Reason: Spam.</i></span></div>';
        
        // Scroll down in chat on error message
        var chatWindow = document.getElementById("chat-inner");
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        chatEnabled = false;
        setTimeout(reviveChat, 5000);
        return;
        
    }
    
    
    // Message is clear to send
    
    spamStatus++;
    
    console.log(messageContent + messageProfile + messageUsername + messageTime + " ! " +  xp);
    
    var personalID = readCookie("persID");
    
    socket.emit("chat", {
        message: messageContent,
        username: messageUsername,
        profile: messageProfile,
        time: messageTime,
        xp: xp,
        persID: personalID
    });
    
}

var chatEnabled = true;
var clearToSend = true;
var spamStatus = 0;

setInterval(spamCheck, 2000);

function spamCheck(){
    
    if(spamStatus >= 1){
        spamStatus = spamStatus - 1;
        return;
    }   
}

function reviveChat(){
    chatEnabled = true;
    spamStatus = 0;
    console.log("Chat revived");
}



var chatFilter = true;
var bannedWords = ["cunt", "nigger", "notch", "minecraft", "fortress", "fuck", "blyat", "whore", "right", "alt", "hate", "tranny", "nigga", "nut", "kys", "kill", "yourself", "h8", "diamond", "free", "tf2", "nibba", "shit", "cock", "pussy", "penis", "vagina", "boobs", "breast", "nude", "porn", "girl", "racist", "faggot", "homophobe", "keemstar", "drama", "religion"];

socket.on("chat", function(data){

    var recivedMessage = data.message;
    
    if(chatFilter){
        
        var wordPos = 0;
        var killSwitch = 0;
        var lastPos = 0;
        
        
        while(wordPos < bannedWords.length){
            
            if(killSwitch > 500){
                console.log("Killed it");
                return;
            }
            
            if(recivedMessage.toLowerCase().indexOf(bannedWords[wordPos], lastPos) != -1){
                var replaceWord = bannedWords[wordPos];
                var lastChar= replaceWord.charAt(replaceWord.length - 1);
                var firstChar = replaceWord.charAt(0);
                var censur = "*".repeat(replaceWord.length - 2);
                var newWord = firstChar + censur + lastChar;
                lastPos = wordPos + 1;
                console.log("Replaced word");
                
                // Replace final string
                recivedMessage = recivedMessage.toLowerCase().replace(replaceWord, newWord);
                killSwitch++;
                wordPos = 0;
            }
            if(bannedWords[wordPos].indexOf(recivedMessage.toLowerCase()) == -1){
                console.log("Skipped word");
                //killSwitch = 50;
                wordPos++;
            }   
        } 
    }
    
      
    
    
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
        xpColor = "#b9f442";
    }
    if(data.xp >= 60){
        xpColor = "#8fd10c";
    }
    if(data.xp >= 70){
        xpColor = "#01b714";
    }
    if(data.xp >= 80){
        xpColor = "#35dd46";
    }
    if(data.xp >= 90){
        xpColor = "##b546ce";
    }
    if(data.xp >= 100){
        xpColor = "#ffe228";
    }

    document.getElementById("chat-inner").innerHTML += '<div id="message_blob"><img id="message_profile" src="' + data.profile + '"><span id="message_username">' + data.username + ' | <i><span style="color: ' + xpColor +';">' + data.xp + '</span></i></span><div id="message_content">' + recivedMessage + '<div id="sidebar-colored" style="background-color: ' + xpColor + '; "></div><div id="timestamp">' + data.time + '</div></div></div>';
    
    var personalID = readCookie("persID");
    
    if(personalID !== data.persID){
    
    if(first > 10){
    var pingSound = new Audio("sound/ping.wav");
    pingSound.volume = 0.4;
    pingSound.play();
        }
    }
    first++;

    
    // Scroll to bottom on new message
    var chatWindow = document.getElementById("chat-inner");
    chatWindow.scrollTop = chatWindow.scrollHeight;

});

