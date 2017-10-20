var express = require("express");

var socket = require("socket.io");

var app = express();

var server = app.listen(25565, function(){
    
  console.log("Listening to requests on port 25565");
});


// var admins = ["Agman", "🅱man", "Olle", "DigitalMole", "Pop", "Popkrull", "Hivod", "Olof"];

var onlineUsers = [];
var cache = [];

// Static files

app.use(express.static("public"))

// Socket setup

var io = socket(server);





io.on("connection", function(socket){
    
    console.log(socket.id);
    
    
    // Request user info on connection
    io.sockets.connected[socket.id].emit("login", "loginInfo");
    
    try{
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

       
            
        firstMessagePush++;
                }
            i++;
        }
        }
    }
}catch(e){
    console.log("Error on connection: " + e);
}

    


    
socket.on('disconnect', function(){
    

    // Delete user from online list on disconnect
    io.sockets.emit("listreset");

    // Find the index of user logged in Onlineusers array
    // var pos = onlineUsers.find(o => o.id === socket.id);
    
    // var pos = onlineUsers.findIndex(x => x.id == socket.id) == -1;

    // Start position to search in array
    var initPos = 0;
    var found = false;
    
    while(found == false){
    
            if(onlineUsers[initPos] == undefined || onlineUsers[initPos] == null){
                console.log(initPos + " = Empty");
                initPos++;
            } else if(onlineUsers[initPos].id === socket.id){
                console.log("FOUND @: " + initPos)
                onlineUsers.splice(initPos,1);
                found = true;
            }
            if(initPos > onlineUsers.length){
                console.log("Spot found");
                found = true;
            } else {
            initPos++;
        }
    
    }
    
    
    
    
    var userPos = 0;    
    
    
    // Send all online users

    while(userPos < 51){

        if(onlineUsers[userPos] == undefined){
            userPos++;
        }
        if(onlineUsers[userPos] != undefined){
        var newUser = onlineUsers[userPos];
        io.sockets.emit("onlinepush", newUser);
        userPos++;
        }
    }
    

  });
    
    
    
    
socket.on("chat", function(data){
    
    if(data.username == null){
        console.error("Error: Null username");
        return;
    }
    
    if(isNaN(data.xp)){
        return;
    }
    if(data.xp > 100){
        data.xp = 100;
    }
    
    if(data.message != null){
        
        if(data.message.length > 2000){
        console.log("To long of a message (over 2000)");
        return;
        }
        
        if(data.message.indexOf("<") != -1){
        console.log("Chat: ERROR: someone tried to enter code in the chat")
        return;
        }
    }
    // Check for too long usernames (hacked!)
    if(data.username.length > 20){
        console.error("failed: too long username: " + data.username);
        return;
    }  
    if(data.username.indexOf("<") != -1){
        console.log("Error, code in username");
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
       
    // NOTE! This system only supports 50 users online at a time. That can be changed, but will slow down performance.
    // If desired, change here:
    var pushPos = 0;
    var namePushed = false;  
    var supportedAmount = 50; 
        
    // Check if user is valid
    
    if(userinfo.username == null){
        return;
    }
    
    if(userinfo.username.indexOf("<") != -1 || userinfo.username.indexOf(">") != -1){
        console.log("!! - Someone tried to enter code");
        return;
    }
    if(userinfo.username.length > 20){
        console.log("Error: Too long of username");
        return;
    }
    
    
    if(isNaN(userinfo.xp)){
        return;
    }
    if(userinfo.xp > 100){
        userinfo.xp = 100;
    }
 
    if(isNaN(userinfo.xp)){
    console.log("!! - Someone tried to enter code");
    return;
        
    }
        
    if(userinfo.profile != null || userinfo.profile != undefined){
    if(userinfo.profile.indexOf("livingforit.xyz/img/profiles") == -1){
        console.log("Bad profile picture");
        return;
        }
    }
        
        
        
    io.sockets.emit("listreset"); 
        
    /*
     while(found == false){
    
            if(onlineUsers[initPos] == undefined || onlineUsers[initPos] == null){
                console.log(initPos + " = Empty");
                initPos++;
            } else if(onlineUsers[initPos].id === socket.id){
                console.log("FOUND @: " + initPos)
                onlineUsers.splice(initPos,1);
                found = true;
            }
            if(initPos > onlineUsers.length){
                console.log("ERROR: user.lenght");
                found = true;
            }
    
    }
    */
        

    var newUser = true;
    var initPos = 0;
        
    while(initPos < onlineUsers.length){
        if(onlineUsers[initPos] == undefined || onlineUsers[initPos] == null){
            console.log(initPos + " = Empty");
            initPos++;
            
        } else if (onlineUsers[initPos].persID === userinfo.persID){
            console.log("USER ALREADY HERE!, wrote in: " + initPos)
            onlineUsers[initPos] = userinfo;
            newUser = false;
            initPos++;
        } else {
            initPos++;
        }
    }    
        
        
    if(newUser){

    // Custom push feature for pushing client userstats - Prevents overwriting, happened when using .push    
    while(namePushed == false){
        
        if(onlineUsers[pushPos] == undefined || onlineUsers[pushPos] == null){
            console.log("Wrote in, on pos: " + pushPos);
            onlineUsers[pushPos] = userinfo;
            namePushed = true;
        } 
        if(onlineUsers[pushPos] != undefined && onlineUsers[pushPos] != null){
            pushPos++; 
            console.log("Skipped one");
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
    } */
         
        // onlineUsers.push(userinfo);
        var userPos = 0; 
    
        // Send all online users

        while(userPos <= supportedAmount){
            
        if(onlineUsers[userPos] == undefined){
            userPos++;
        }
        if(onlineUsers[userPos] != undefined){
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













