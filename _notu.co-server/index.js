var express = require("express");

var socket = require("socket.io");

var app = express();

var server = app.listen(25565, function(){
  console.log("Listening to requests on port 25565");
});


var admins = ["Agman", "🅱man", "Olle", "DigitalMole", "Pop", "Popkrull", "Hivod", "Olof"];
var clients = [];

// Static files

app.use(express.static("public"))

// Socket setup

var io = socket(server);



io.on("connection", function(socket){
  
    var messages = "test"
    console.log("User has connected: " + socket.id);
    io.sockets.connected[socket.id].emit("cache", messages);

    
socket.on('disconnect', function(){
    console.log('User has disconected');
  });

    
    
    
    
socket.on("chat", function(data){
    
    // Check for too long usernames (hacked!)
    if(data.username.length > 32){
        console.log("failed: too long username: " + data.username);
        return;
    }  
    // Send out message to every client.
    io.sockets.emit("chat", data);
    // Log message in console.
    console.log("Message > " + data.username + ": " + data.message);
  });
});