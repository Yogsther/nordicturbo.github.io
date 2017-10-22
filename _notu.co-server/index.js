var express = require("express");

var socket = require("socket.io");

var app = express();

var fs = require("fs");

var path = require('path');

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
    
    
    // Pages
    
    // Login
    
    socket.on("loginReqPage", function(recInfo){
        
        var users = getPageUsers();
        var i = 0;
        
        while(users.length > i){
            console.log("test");
            if(users[i] != null && users[i] != ""){
            var storedUserRaw = users[i];
            var storedUser = JSON.parse(storedUserRaw);
            
            console.log("test");
            if(storedUser != null){
               if(storedUser.username == recInfo.username){
                   console.log("3");
                   // Found matching username
                   if(storedUser.password == recInfo.password){
                    // Password is correct
                        console.log("Correct login");
                        var fileLocation = "pages/" + recInfo.username + ".txt";
                        var userPage = fs.readFileSync(fileLocation);
                        var userPageParts = userPage.toString().split("½");
                        
                        var html = userPageParts[0];
                        var css = userPageParts[1];
                        var javascript = userPageParts[2];
                       
                       
                        io.sockets.connected[socket.id].emit("login_success", {
                            html: html,
                            css: css,
                            javascript: javascript
                        });
                       
                       
                       
                       
                        return;
                        
                   } else {
                       // Wrong password
                       io.sockets.connected[socket.id].emit("login_failed", "Wrong password.");
                       console.log("Pages: Wrong password!");
                       return;
                   }
               } else {
                   i++;
               }   
            } else {
                i++;
            }
        } else {
            i++;
        }
    }
        
     io.sockets.connected[socket.id].emit("login_failed", "Username does not exist.");   
        
    });
    
    
    
    // Pages register
    
    socket.on("pageRegister", function(recInfo){
        
        
            var failed = false;
        
            if(recInfo.username == "" || recInfo.password == "" || recInfo.persID == ""){
                io.sockets.connected[socket.id].emit("callback_fail", "Failed. (Null username or Password)");
                return;
            }
            
            if(recInfo.username == null || recInfo.password == null || recInfo.persID == null){
                io.sockets.connected[socket.id].emit("callback_fail", "Failed. (Null username or Password)");
                return;
            }
        
        
            if(recInfo.username.indexOf("<") != -1 || recInfo.password.indexOf("<") != -1 || recInfo.persID.indexOf("<") != -1){
                io.sockets.connected[socket.id].emit("callback_fail", "No HTML tags allowed in Username or Password.");
                console.log("Quickdraw: Bad username tried to signup. (HTML Tag in name)");
                failed = true;
            }
            if(recInfo.username.indexOf("#") != -1 || recInfo.password.indexOf("#") != -1 || recInfo.persID.indexOf("#") != -1){
                io.sockets.connected[socket.id].emit("callback_fail", "No hashtags allowed in Username or Password.");
                console.log("Quickdraw: Bad username tried to signup. (# in username)");
                failed = true;
            }
                
            if(failed == true){
                return;  
            }
        
            var users = getPageUsers();
            var i = 0;
        
        
        
            while(users.length > i){
       
            if(users[i] != null && users[i] != ""){
                // Parse String to Object
                var storedUserRaw = users[i];
                var storedUser = JSON.parse(storedUserRaw);
                
                
                if(storedUser.username == recInfo.username){
                    io.sockets.connected[socket.id].emit("callback_fail", "This username already exisit.");
                    console.log("Quickdraw: Username already exist");
                    failed = true;
                }
                if(storedUser.persID == recInfo.persID){
                    io.sockets.connected[socket.id].emit("callback_fail", "User ID is already registered.");
                    console.log("Quickdraw: ID already exist");
                    failed = true;
                }
                if(failed == true){
                    return;   
                } else {
                    i++;
                }
            }
            if(users[i] == null || users[i] == ""){
                i++;
            }   
        }
        
        
       
        // User does not exist, and can get registered.
        console.log("Registered User");
        
        var userFormat = '#{"username": "'+recInfo.username+'","password":"'+recInfo.password+'","persID":"'+recInfo.persID+'"}';
        users.push(userFormat);
        users = users.join("#");
        fs.writeFileSync("page_users.txt", users);
        var filePath = "pages/" + recInfo.username + ".txt";
        fs.writeFileSync(filePath, "test");
        
        /*
        // Add to index
        var index = fs.readFileSync("page_index.txt");
        index = index.toString().split("#");
        var username = recInfo.username;
        
        index.push(username);
        
        index.join("#");
        
        fs.writeFileSync("page_index.txt", index);
       
        console.log(index[0]);
        */
        
        // Send message to client, success message
        io.sockets.connected[socket.id].emit("pages_signup_success");
        
    });
    
    
    
    socket.on("indexRequest", function(){
        
       
        var featuredUsers = ["Olle"];
        var users = getPageUsers();
        
        io.sockets.connected[socket.id].emit("featuredUsers", featuredUsers);
        io.sockets.connected[socket.id].emit("indexRequest", users);
    });
    
    socket.on("pageReq", function(name){
       
                        var fileLocation = "pages/" + name + ".txt";
                        var userPage = fs.readFileSync(fileLocation);
                        var userPageParts = userPage.toString().split("½");
                        
                        var html = userPageParts[0];
                        var css = userPageParts[1];
                        var javascript = userPageParts[2];
        
                        var body = html + "<style>" + css + "</style><script>" + javascript + "</script><script src='viewpage.js'></script>"
                       
                        io.sockets.connected[socket.id].emit("pageSent", body);
        
        
        
    });
    
    
    socket.on("save", function(recInfo){
        
            var users = getPageUsers();
            var i = 0;
            
        while(users.length > i){
            if(users[i] != null && users[i] != ""){
            var storedUserRaw = users[i];
            var storedUser = JSON.parse(storedUserRaw);
            
                console.log(recInfo.username);
                console.log(storedUser.username);
                console.log(recInfo.password);
                console.log(storedUser.password);
                
                
                
                
            if(storedUser != null){
               if(storedUser.username == recInfo.username){
                   
                   // Found matching username
                   if(storedUser.password == recInfo.password){
                    // Password is correct
                        console.log("Correct login");
                        
                       
                        console.log(recInfo.html);
                        var saveFile = recInfo.html + "½" + recInfo.css + "½" + recInfo.javascript;
                        var fileLocation = "pages/" + recInfo.username + ".txt";
                        fs.writeFileSync(fileLocation, saveFile);
                       
                       
                       
                       
                       
                       
                       
                        return;
                        
                   } else {
                       // Wrong password
                       
                       return;
                   }
               } else {
                   i++;
               }   
            } else {
                i++;
            }
        } else {
            i++;
        }
    }
     
        
        
        
    })
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // Quickdraw
    
    // Signup
    
    
    socket.on("signupReq", function(recInfo){
    
        var users = getUsers();
        var i = 0;
        console.log("Sign Req, users.lenght = " +  users.length);
        
        
        if(recInfo.username == null || recInfo.password == null || recInfo.persID == null){
            io.sockets.connected[socket.id].emit("callback_fail", "Failed. (Null username or Password)");
            return;
        }
        
        // Check for invalid username, passwords and IDs
            if(recInfo.username.indexOf("<") != -1 || recInfo.password.indexOf("<") != -1 || recInfo.persID.indexOf("<") != -1){
                io.sockets.connected[socket.id].emit("callback_fail", "No HTML tags allowed in Username or Password.");
                console.log("Quickdraw: Bad username tried to signup. (HTML Tag in name)");
                failed = true;
            }
            if(recInfo.username.indexOf("#") != -1 || recInfo.password.indexOf("#") != -1 || recInfo.persID.indexOf("#") != -1){
                io.sockets.connected[socket.id].emit("callback_fail", "No hashtags allowed in Username or Password.");
                console.log("Quickdraw: Bad username tried to signup. (# in username)");
                failed = true;
            }
                
        if(failed == true){
                return;  
        }
        
        
        
        // Check for already existing username
        while(users.length > i){
        
            var failed = false;
       
            if(users[i] != null && users[i] != ""){
                // Parse String to Object
                var storedUserRaw = users[i];
                var storedUser = JSON.parse(storedUserRaw);
                
                if(recInfo.username.indexOf("<") != -1 || recInfo.password.indexOf("<") != -1 || recInfo.persID.indexOf("<") != -1){
                    io.sockets.connected[socket.id].emit("callback_fail", "No HTML tags allowed in Username or Password.");
                    console.log("Quickdraw: Bad username tried to signup. (HTML Tag in name)");
                    failed = true;
                }
                if(recInfo.username.indexOf("#") != -1 || recInfo.password.indexOf("#") != -1 || recInfo.persID.indexOf("#") != -1){
                    io.sockets.connected[socket.id].emit("callback_fail", "No hashtags allowed in Username or Password.");
                    console.log("Quickdraw: Bad username tried to signup. (# in username)");
                    failed = true;
                }
                
                
                if(storedUser.username == recInfo.username){
                    io.sockets.connected[socket.id].emit("callback_fail", "This username already exisit.");
                    console.log("Quickdraw: Username already exist");
                    failed = true;
                }
                if(storedUser.persID == recInfo.persID){
                    io.sockets.connected[socket.id].emit("callback_fail", "User ID is already registered.");
                    console.log("Quickdraw: ID already exist");
                    failed = true;
                }
                if(failed == true){
                    return;   
                } else {
                    i++;
                }
            }
            if(users[i] == null || users[i] == ""){
                i++;
            }   
        }
        
        
        // User does not exist, and can get registered.
        console.log("Registered User");
        console.log("#" + recInfo);
        
        var userFormat = '#{"username": "'+recInfo.username+'","password":"'+recInfo.password+'","persID":"'+recInfo.persID+'"}';
        users.push(userFormat);
        users = users.join("#");
        fs.writeFileSync("users.txt", users);
        
        // Send message to client, success message
        io.sockets.connected[socket.id].emit("signup_success");
        
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});


// Get users
function getUsers(){
    
    var usersRaw = fs.readFileSync("users.txt");
    var users = usersRaw.toString().split("#");
    return users;
}

function getPageUsers(){
    var usersRaw = fs.readFileSync("page_users.txt");
    var users = usersRaw.toString().split("#");
    return users;
}

function getIndex(){
    var indexRaw = fs.readFileSync("page_index.txt");
    var index = indexRaw.toString().split("#");
    return index;
}




