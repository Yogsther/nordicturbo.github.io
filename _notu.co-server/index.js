var express = require("express");

var socket = require("socket.io");

var app = express();

var server = app.listen(25565, function(){
    
  console.log("Listening to requests on port 25565");
});


var admins = ["Agman", "🅱man", "Olle", "DigitalMole", "Pop", "Popkrull", "Hivod", "Olof"];

var onlineUsers = [];
var cache = [];

// Static files

app.use(express.static("public"))

// Socket setup

var io = socket(server);





io.on("connection", function(socket){
  
 
    // Request user info on connection
    io.sockets.connected[socket.id].emit("login", "loginInfo");
    
    
       
    // Get the 10 latest messages
    // timeback is how many messages will get loaded for new users.
    var timeBack = 10;
    
    var cacheMessage;
    var lastMessagePos = cache.length;
    var firstMessagePush = lastMessagePos - timeBack;

    if(lastMessagePos > 0){
    
    var i = 0;
    while(i < 10){
        
                
        if(firstMessagePush < 0){
            firstMessagePush++;
        }
        
        if(firstMessagePush >= 0){
            
        cacheMessage = cache[firstMessagePush];
        if(cacheMessage != null){
            
        io.sockets.connected[socket.id].emit("chat", cacheMessage);

        console.log(cacheMessage.username);
            
        firstMessagePush++;
            }
            i++;
        }
    }
    
}
    
    console.log("User has connected: " + socket.id);


    
socket.on('disconnect', function(){
    
    
    console.log('User has disconected: ' + socket.id);
    // Delete user from online list on disconnect
    io.sockets.emit("listreset");
    
    var pos = onlineUsers.findIndex(i => i.id === socket.id);
    onlineUsers.splice(pos,1);
    
     var userPos = 0;    
    
    // Send all online users

    while(userPos >= 0){

        if(onlineUsers[userPos] == null){
            userPos = -1;
            console.log("Online users: " + onlineUsers.length);
            return;
        }
        var newUser = onlineUsers[userPos];
        io.sockets.emit("onlinepush", newUser);
        userPos++;
    }
    
  });
    
    
    
    
socket.on("chat", function(data){
    
    // Check for too long usernames (hacked!)
    if(data.username.length > 32){
        console.log("failed: too long username: " + data.username);
        return;
    }  
    
    // Save message to cache
    cache.push(data);
    // Send out message to every client.
    io.sockets.emit("chat", data);
    // Log message in console.
    console.log("Message > " + data.username + ": " + data.message);
  });
    
    
    
    // Emit users
    socket.on("sentover", function(userinfo){
    // Reset list
    io.sockets.emit("listreset");
        
    // Save user to client array
    onlineUsers.push(userinfo);
    var userPos = 0;    
    
    // Send all online users

    while(userPos >= 0){

        if(onlineUsers[userPos] == null){
            userPos = -1;
            console.log("Online users: " + onlineUsers.length);
            return;
        }
        var newUser = onlineUsers[userPos];
        io.sockets.emit("onlinepush", newUser);
        userPos++;
    }
});
    
    
});











