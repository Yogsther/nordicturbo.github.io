
// Socket.io & chat functions

var socket = io.connect("http://213.66.254.63:25565");



// Listen for enter press to send message
var sendBtn = document.getElementById("chat_message");
sendBtn.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  
        sendMessage();
    }
});



// Send message

function sendMessage(){
    
    var currentdate = new Date(); 
    
    
    
    
    
    var messageContent = document.getElementById("chat_message").value;
    var messageUsername = readCookie("username");
    var messageProfile = readCookie("profileLocation");
    
    var hours = ("0" + currentdate.getHours()).slice(-2);
    var minutes = ("0" + currentdate.getMinutes()).slice(-2);
    
    var messageTime = hours + ":" + minutes;
    var xp = (readCookie("xp") / 1000) + 1;
        xp = Math.floor(xp);
    
    // Dont send message if message is empty.
    if(messageContent.length < 1){
        return;
    }
    
    console.log(messageContent + messageProfile + messageUsername + messageTime + " ! " +  xp);
    
    document.getElementById("chat_message").value = "";
    
    socket.emit("chat", {
        message: messageContent,
        username: messageUsername,
        profile: messageProfile,
        time: messageTime,
        xp: xp
    })
    
}





// Get incoming messages

socket.on("chat", function(data){
    
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

    document.getElementById("chat-inner").innerHTML += '<div id="message_blob"><img id="message_profile" src="' + data.profile + '"><span id="message_username">' + data.username + ' | <i><span style="color: ' + xpColor +';">' + data.xp + '</span></i></span><div id="message_content">' + data.message + '<div id="sidebar-colored" style="background-color: ' + xpColor + '; "></div><div id="timestamp">' + data.time + '</div></div></div>';
    
    // Scroll to bottom on new message
    var chatWindow = document.getElementById("chat-inner");
    chatWindow.scrollTop = chatWindow.scrollHeight;

});

