
// Socket.io & chat functions

var socket = io.connect("http://213.66.254.63:25565");

// Send message

function sendMessage(){
    
    var messageContent = document.getElementById("chat_message").value;
    var messageUsername = readCookie("username");
    var messageProfile = readCookie("profileLocation");
    
    console.log(messageContent + messageProfile + messageUsername);
    
    socket.emit("chat", {
        message: messageContent,
        username: messageUsername,
        profile: messageProfile
    })
    
}

// Get incoming messages

socket.on("chat", function(data){

    document.getElementById("chat-inner").innerHTML += '<div id="message_blob"><img id="message_profile" src="' + data.profile + '"><span id="message_username">' + data.username + '</span><div id="message_content">' + data.message + '</div></div>';
    // Scroll to bottom on new message
    var chatWindow = document.getElementById("chat-inner");
    chatWindow.scrollTop = chatWindow.scrollHeight;

});