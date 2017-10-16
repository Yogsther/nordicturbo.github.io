var express = require("express");

var socket = require("socket.io");

var app = express();

var server = app.listen(25565, function() {

    console.log("Listening to requests on port 25565");
});


// var admins = ["Agman", "🅱man", "Olle", "DigitalMole", "Pop", "Popkrull", "Hivod", "Olof"];

var onlineUsers = [];
var cache = [];

// Static files

app.use(express.static("public"))

// Socket setup

var io = socket(server);




io.on("connection", function(socket) {


    console.log("User connected");



    // Request user info on connection
    io.sockets.connected[socket.id].emit("login", "loginInfo");

    // Get the 10 latest messages
    // timeback is how many messages will get loaded for new users.
    var timeBack = 10;

    var cacheMessage;
    var lastMessagePos = cache.length;
    var firstMessagePush = lastMessagePos - timeBack;

    if (lastMessagePos > 0) {

        var i = 0;
        while (i < 10) {


            if (firstMessagePush < 0) {
                firstMessagePush++;
            }

            if (firstMessagePush >= 0) {

                cacheMessage = cache[firstMessagePush];
                if (cacheMessage != null) {

                    io.sockets.connected[socket.id].emit("chat", cacheMessage);
                    firstMessagePush++;
                }
                i++;
            }
        }

    }




    socket.on('disconnect', function() {


        console.log("User disconected");
        // Delete user from online list on disconnect
        io.sockets.emit("listreset");

        var pos = onlineUsers.findIndex(i => i.id === socket.id);
        onlineUsers.splice(pos, 1);

        var userPos = 0;

        // Send all online users

        while (userPos >= 50) {

            if(onlineUsers[userPos] !== undefined) {
                var newUser = onlineUsers[userPos];
                io.sockets.emit("onlinepush", newUser);
                userPos++;
            }
            if(onlineUsers[userPos] === undefined){
               
            }
            

        }



    });




    socket.on("chat", function(data) {

        if (data.username == null) {
            console.error("Error: Null username");
            return;
        }
        // Check for too long usernames (hacked!)
        if (data.username.length > 32) {
            console.error("failed: too long username: " + data.username);
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
    socket.on("sentover", function(userinfo) {

        // NOTE! This system only supports 50 users online at a time. That can be changed, but will slow down performance.
        // If desired, change here:
        var pushPos = 0;
        var namePushed = false;
        var supportedAmount = 50;
        io.sockets.emit("listreset");

        if (onlineUsers.findIndex(x => x.username == userinfo.username) != -1) {
            var pushPos = onlineUsers.findIndex(x => x.username == userinfo.username);
            onlineUsers[pushPos] = userinfo;
        }

        if (onlineUsers.findIndex(x => x.username == userinfo.username) == -1) {

            namePushed = false;
            pushPos = 0;
            // Custom push feature for pushing client userstats - Prevents overwriting, happened when using .push    
            while (namePushed == false) {

                if (onlineUsers[pushPos] === undefined) {

                    onlineUsers[pushPos] = userinfo;
                    namePushed = true;


                } else if (onlineUsers[pushPos] !== undefined) {
                    pushPos++;
                }
            }
        }

        /*
            
            console.log("-------------------");
        for(i = 0; i < 6; i++){
            console.log("NUMBER: " + i + " >>> "+onlineUsers[i]);
            if(onlineUsers[i] == undefined){
                console.log(" == UNDEFINED");
            } else {   
            console.log("Defined.")
            console.log("Username: " + onlineUsers[i].username);
            console.log("ID: " + onlineUsers[i].id);
            }
            console.log("..............");
        }
    
        */

        // onlineUsers.push(userinfo);
        var userPos = 0;

        // Send all online users

        while (userPos <= supportedAmount) {

            if (onlineUsers[userPos] == undefined) {
                userPos++;
            }
            if (onlineUsers[userPos] != undefined) {
                var newUser = onlineUsers[userPos];
                io.sockets.emit("onlinepush", newUser);
                userPos++;
            }
            /* Causes error!
            if(onlineUsers[userPos] == null){
                userPos = -1;
                console.log("User pos: " + userPos);
                console.log("Online users: " + onlineUsers.length);
                return;
            }
            */
        }


    });

});