var express = require("express");

var socket = require("socket.io");

var app = express();

app.get('/', function(req, res){
res.sendFile(__dirname + '/public/index.html');
});


var server = app.listen(50, function(){
  console.log("Listening to requests on port 50");
});

app.use(express.static("public"))

// Socket setup

var io = socket(server);





io.on("connection", function(socket){
    
    
   console.log("User connected");
    


    
socket.on('disconnect', function(){
    
    
    console.log("User disconnected");
    
    
    
  });

});


