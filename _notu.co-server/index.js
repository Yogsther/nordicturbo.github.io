var express = require("express");

var socket = require("socket.io");

var app = express();

var server = app.listen(25565, function(){
  console.log("Listening to requests on port 25565");
});


var admins = ["Agman", "🅱man", "Olle", "DigitalMole", "Pop", "Popkrull", "Hivod", "Olof"];

// Static files

app.use(express.static("public"))

// Socket setup

var io = socket(server);



io.on("connection", function(socket){
  
  console.log("User has connected");
  
socket.on('disconnect', function(){
    console.log('User has disconected');
  });

  socket.on("chat", function(data){
    io.sockets.emit("chat", data);
    console.log(data);
  });
});
