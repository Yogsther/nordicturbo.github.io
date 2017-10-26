var express = require("express");

var socket = require("socket.io");

var app = express();

var fs = require("fs");

var path = require('path');

var errorToken = fs.readFileSync("error.txt");

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
                
                initPos++;
            } else if(onlineUsers[initPos].id === socket.id){
                console.log("User disconnected.");
                onlineUsers.splice(initPos,1);
                found = true;
            }
            if(initPos > onlineUsers.length){
               
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
            
            
        var verified = false;
        var verifiedUsers = fs.readFileSync("verified.txt");
        verifiedUsers = verifiedUsers.toString().split(",");
            
        if(verifiedUsers.indexOf(newUser.persID) != -1){
            verified = true; 
        }
            
            
            var sendToClients = {
                username: newUser.username,
                profilepic: newUser.profilepic,
                xp: newUser.xp,
                status: newUser.status,
                verified: verified
            };
                
            
            
        io.sockets.emit("onlinepush", sendToClients);
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
        
        var bannedList = fs.readFileSync("banned.txt","utf8");
        if(bannedList.indexOf(data.persID) != -1){
        console.log("Banned user tried to chat: " + data.username + " - " + data.persID);
        io.sockets.connected[socket.id].emit("yourBanned", "chat");
        return;
        }
      
        
        
        if(data.message.length > 2000){
        console.log("Chat: To long of a message (over 2000)");
        return;
        }
        
        if(data.message.indexOf("<") != -1){
        console.log("Chat: Someone tried to enter code in the chat")
        return;
        }
    }
    // Check for too long usernames (hacked!)
    if(data.username.length > 20){
        console.log("Chat: too long username: " + data.username);
        return;
    }  
    if(data.username.indexOf("<") != -1){
        console.log("Error, code in username");
        return;
    }
    
    var isVerified = false;
    var verifiedUsers = fs.readFileSync("verified.txt");
        verifiedUsers = verifiedUsers.toString().split(",");
            
        if(verifiedUsers.indexOf(data.persID) != -1){
            isVerified = true;
        }
    
    var clientData = {
        message: data.message,
        username: data.username,
        profile: data.profile,
        time: data.time,
        xp: data.xp,
        verified: isVerified
    };
    
    
    // Save message to cache
    cache.push(clientData);
    // Send out message to every client.
    io.sockets.emit("chat", clientData);
    
    
    
    
    console.log(clientData);
    
    // Log message in console.
    console.log("Chat: Message > " + data.username + ": " + data.message);
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
    
       
        var verifiedUsers = fs.readFileSync("verified.txt");
        verifiedUsers = verifiedUsers.toString().split(",");
            
        if(verifiedUsers.indexOf(userinfo.persID) != -1){
            io.sockets.connected[socket.id].emit("verified", true);
        }
    
    
    if(userinfo.username.indexOf("<") != -1 || userinfo.username.indexOf(">") != -1){
        console.log("Username: Someone tried to enter code");
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
    if(userinfo.xp < 1){
        userinfo.xp = 1;
    }
 
    if(isNaN(userinfo.xp)){
    console.log("Error: Username on login");
    return;
        
    }
        
    if(userinfo.profile != null || userinfo.profile != undefined){
    if(userinfo.profile.indexOf("livingforit.xyz/img/profiles") == -1){
        console.log("On login: Bad profile picture");
        return;
        }
    }
    
    var bannedList = fs.readFileSync("banned.txt","utf8");
    if(bannedList.indexOf(userinfo.persID) != -1){
        console.log("Banned user tried to connect: " + userinfo.username + " - " + userinfo.persID);
        io.sockets.connected[socket.id].emit("yourBanned", "login");
        return;
    }
        
        
    io.sockets.emit("listreset"); 

    console.log("User connected: " + userinfo.username + " - persID: " + userinfo.persID);
    
    
    // Log new user in log file
    var log = fs.readFileSync("userlog.txt","utf8");
  
    log = log.toString();
    
    if(log.indexOf(userinfo.username) == -1 || log.indexOf(userinfo.persID) == -1){
        log = log + "\r\n" + userinfo.username + " : " + userinfo.persID;
        fs.writeFileSync("userlog.txt", log);
    }
    
    
    
    
    var newUser = true;
    var initPos = 0;
        
    while(initPos < onlineUsers.length){
        if(onlineUsers[initPos] == undefined || onlineUsers[initPos] == null){
            
            initPos++;
            
        } else if (onlineUsers[initPos].persID === userinfo.persID){
            
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
            
            onlineUsers[pushPos] = userinfo;
            namePushed = true;
        } 
        if(onlineUsers[pushPos] != undefined && onlineUsers[pushPos] != null){
            pushPos++; 
          
        }
    }
} 
  
        var userPos = 0; 
    
        // Send all online users

        while(userPos <= supportedAmount){
            
        if(onlineUsers[userPos] == undefined){
            userPos++;
        }
        if(onlineUsers[userPos] != undefined){
            var newUser = onlineUsers[userPos];
            
            var verified = false;
            var verifiedUsers = fs.readFileSync("verified.txt");
            verifiedUsers = verifiedUsers.toString().split(",");
            
            if(verifiedUsers.indexOf(newUser.persID) != -1){
               verified = true; 
            }
            
            
            var sendToClients = {
                username: newUser.username,
                profilepic: newUser.profilepic,
                xp: newUser.xp,
                status: newUser.status,
                verified: verified
            };
            
            
            io.sockets.emit("onlinepush", sendToClients);
            userPos++;
        }
        
    }
        
        
});
    
    
    // Pages
    
    // Login
    
    socket.on("loginReqPage", function(recInfo){
        
        var users = getPageUsers();
        var i = 0;
        
        while(users.length > i){
            
            
            if(users[i] != null && users[i] != "" && users[i] != errorToken){
            
            var storedUserRaw = users[i];
            var storedUser = JSON.parse(storedUserRaw);
            
            
            if(storedUser != null){
               if(storedUser.username == recInfo.username){
                  
                   // Found matching username
                   if(storedUser.password == recInfo.password){
                    // Password is correct
                        
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
        
            if(recInfo.username.indexOf("?") != -1){
                io.sockets.connected[socket.id].emit("callback_fail", "Question marks are not allowed in your Title / Username.");
                failed = true;
            }    
        
            if(recInfo.username.indexOf("<") != -1 || recInfo.password.indexOf("<") != -1 || recInfo.persID.indexOf("<") != -1){
                io.sockets.connected[socket.id].emit("callback_fail", "No HTML tags allowed in Username or Password.");
                console.log("Pages: Bad username tried to signup. (HTML Tag in name)");
                failed = true;
            }
            if(recInfo.username.indexOf("#") != -1 || recInfo.password.indexOf("#") != -1 || recInfo.persID.indexOf("#") != -1){
                io.sockets.connected[socket.id].emit("callback_fail", "No hashtags allowed in Username or Password.");
                console.log("Pages: Bad username tried to signup. (# in username)");
                failed = true;
            }
                
            if(failed == true){
                return;  
            }
        
            var users = getPageUsers();
            var i = 0;
        
        
        
            while(users.length > i){
       
            if(users[i] != null && users[i] != "" && users[i] != errorToken){
                // Parse String to Object
                var storedUserRaw = users[i];
                var storedUser = JSON.parse(storedUserRaw);
                
                
                if(storedUser.username == recInfo.username){
                    io.sockets.connected[socket.id].emit("callback_fail", "This username already exisit.");
                    console.log("Pages: Username already exist");
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
        console.log("Registered New User: " + recInfo.username);
        
        var userFormat = '#{"username": "'+recInfo.username+'","password":"'+recInfo.password+'","persID":"'+recInfo.persID+'", "views":"0"}';
        users.push(userFormat);
        users = users.join("#");
        fs.writeFileSync("page_users.txt", users);
        var filePath = "pages/" + recInfo.username + ".txt";
        var demoFile = fs.readFileSync("demo.txt");
        fs.writeFileSync(filePath, demoFile);
        
      
        // Send message to client, success message
        io.sockets.connected[socket.id].emit("pages_signup_success");
        
    });
    
    
    
    socket.on("indexRequest", function(){
        
       
        var featuredUsers = ["Agman", "hehe lmao", "Benchmark"];
        var pinnedPages = ["Demo"]
        var users = getPageUsersB();
        var usersArr = [];
        var i = 0;
        
        while(users.length > i){
        
                usersArr.push({
                username: users[i].username,
                views: users[i].views
                });
                i++;
            }
            i++;
       
            
            
        
        io.sockets.connected[socket.id].emit("featuredUsers", featuredUsers);
        io.sockets.connected[socket.id].emit("pinnedPages", pinnedPages);
        io.sockets.connected[socket.id].emit("indexRequest", usersArr);
    });
    
    socket.on("pageReq", function(name){
       
        
                        try{
                            
                            if(name.indexOf("%20") != -1){
                                // Name contains spaces
                                name = name.replace("%20",' ');
                            }
            
                        var fileLocation = "pages/" + name + ".txt";
                        var userPage = fs.readFileSync(fileLocation);
                        var userPageParts = userPage.toString().split("½");
                        
                        var html = userPageParts[0];
                        var css = userPageParts[1];
                        var javascript = userPageParts[2];
        
                        var body = html + "<style>" + css + "</style>"
                        
                        
                        
                        io.sockets.connected[socket.id].emit("pageSent", {
                            body: body,
                            javascript: javascript
                        });
        
                        }catch(e){
                            
                        }
        
    });
    
    
    socket.on("banpage", function(data){
       
        var adminToken = fs.readFileSync("admin_token.txt", "utf8");
        
        if(data.token === adminToken){
            
            var users = getPageUsersB();
            var objIndex = users.findIndex((obj => obj.username == data.page));
            if(objIndex == -1){
                return;
            }
            users.splice(objIndex,1);
            savePageUsers(users);
            console.log("Banned user: " + data.page);
        }
        
        
        
        
    });
    
    

    socket.on("addView", function(data){
        //TODO more sequre view feature
        if(data.viewer == null){
            return;
        }
            
            if(data.viewer.indexOf("#") != -1){
                //Viewer has a deafult name, don't count the view.
                return;
            }
                    var allUsers = getPageUsersB();
                   
                    if(data.pageName.indexOf("%20") != -1){
                        // Name contains spaces
                        data.pageName = data.pageName.replace("%20",' ');
                    }
        
                    var objIndex = allUsers.findIndex((obj => obj.username == data.pageName));
                    if(objIndex == -1){
                        return;
                    }
                    var currentViews = allUsers[objIndex].views;
                    if(isNaN(currentViews)){
                        currentViews = 0;
                    }
                    currentViews = Number(currentViews) + 1;
                    
                    allUsers[objIndex].views = currentViews;
                    
               
                    savePageUsers(allUsers);
                    return;        
    });
    
    
    socket.on("save", function(recInfo){
        
            var users = getPageUsers();
            var i = 0;
            
        while(users.length > i){
            if(users[i] != null && users[i] != "" && users[i] != errorToken){
            var storedUserRaw = users[i];
            var storedUser = JSON.parse(storedUserRaw);
            
                
                
                
            if(storedUser != null){
               if(storedUser.username == recInfo.username){
                   
                   // Found matching username
                   if(storedUser.password == recInfo.password){
                    // Password is correct
                        console.log("Pages: " + recInfo.username + " saved a page.");
                        
                       
                        
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
       
            if(users[i] != null && users[i] != "" && users[i] != errorToken){
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
        
        
        var userFormat = '#{"username": "'+recInfo.username+'","password":"'+recInfo.password+'","persID":"'+recInfo.persID+'"}';
        users.push(userFormat);
        users = users.join("#");
        fs.writeFileSync("users.txt", users);
        
        // Send message to client, success message
        io.sockets.connected[socket.id].emit("signup_success");
        
    });
    
    
    
    
    
    
// Admin tools

socket.on("verify", function(data){
    
    try{
        
    var token = fs.readFileSync("admin_token.txt", "utf8");
    if(data.token === token){
        
    var verfiedList = fs.readFileSync("verified.txt", "utf8");
    verfiedList = verfiedList.toString().split(",");
    // verifiedList is now an array of every verfied ID
        
    
    
    
    
        
    if(verfiedList.indexOf(data.id) != -1){
        io.sockets.connected[socket.id].emit("message_admin", "ID is already verified!");
        return;
    }
    if(isNaN(data.id)){
        io.sockets.connected[socket.id].emit("message_admin", "ID is not a number (invalid ID)");
        return;
    }
    verfiedList.push(data.id);
    //verfiedList = verfiedList.join("#");
    fs.writeFileSync("verified.txt", verfiedList);
                    
    console.log("ID was verified! " + data.id);   
    io.sockets.connected[socket.id].emit("message_admin", "ID has been verified!");
        return;
        // End
        }
        io.sockets.connected[socket.id].emit("message_admin", "Wrong Admin Token");
    }catch(e){
        io.sockets.connected[socket.id].emit("message_admin", "Error " + e);
        console.log("Verified user error. " + e);
    }
});

socket.on("unverify", function(data){
    
    try{
     
    var token = fs.readFileSync("admin_token.txt", "utf8");
    if(data.token === token){
        
    var verfiedList = fs.readFileSync("verified.txt", "utf8");
    verfiedList = verfiedList.toString().split(",");
    // verifiedList is now an array of every verfied ID
    
        
    if(verfiedList.indexOf(data.id) == -1){
        io.sockets.connected[socket.id].emit("message_admin", "This ID is not verified.");
        return;
    }
    if(isNaN(data.id)){
        io.sockets.connected[socket.id].emit("message_admin", "ID is not a number. (invalid ID)");
        return;
    }
   
    // Remove from verified
    var index = verfiedList.indexOf(data.id);
    verfiedList.splice(index, 1);
        
        
    fs.writeFileSync("verified.txt", verfiedList);
    io.sockets.connected[socket.id].emit("message_admin", "ID has been unverified!");
    console.log("ID was unverified! " + data.id);   
    return;
        
        // End
        }
        
        io.sockets.connected[socket.id].emit("message_admin", "Wrong Admin Token");
        
    }catch(e){
        io.sockets.connected[socket.id].emit("message_admin", "Error " + e);
        console.log("Verified user error. " + e);
    }
});
    
 // Ban and Pardon
    
    
        
// Admin tools

socket.on("ban", function(data){
    
    try{
        
    var token = fs.readFileSync("admin_token.txt", "utf8");
    if(data.token === token){
        
    var banList = fs.readFileSync("banned.txt", "utf8");
    banList = banList.toString().split(",");
    // verifiedList is now an array of every verfied ID
        
    
    
    
    
        
    if(banList.indexOf(data.id) != -1){
        io.sockets.connected[socket.id].emit("message_admin", "ID is already banned!");
        return;
    }
    if(isNaN(data.id)){
        io.sockets.connected[socket.id].emit("message_admin", "ID is not a number (invalid ID)");
        return;
    }
    banList.push(data.id);
    //verfiedList = verfiedList.join("#");
    fs.writeFileSync("banned.txt", banList);
                    
    console.log("ID was banList! " + data.id);   
    io.sockets.connected[socket.id].emit("message_admin", "ID has been banned!");
        return;
        // End
        }
        io.sockets.connected[socket.id].emit("message_admin", "Wrong Admin Token");
    }catch(e){
        io.sockets.connected[socket.id].emit("message_admin", "Error " + e);
        console.log("banned user error. " + e);
    }
});

socket.on("pardon", function(data){
    
    try{
     
    var token = fs.readFileSync("admin_token.txt", "utf8");
    if(data.token === token){
        
    var banList = fs.readFileSync("banned.txt", "utf8");
    banList = banList.toString().split(",");
    // verifiedList is now an array of every verfied ID
    
        
    if(banList.indexOf(data.id) == -1){
        io.sockets.connected[socket.id].emit("message_admin", "This ID is not banned.");
        return;
    }
    if(isNaN(data.id)){
        io.sockets.connected[socket.id].emit("message_admin", "ID is not a number. (invalid ID)");
        return;
    }
   
    // Remove from verified
    var index = banList.indexOf(data.id);
    banList.splice(index, 1);
        
        
    fs.writeFileSync("banned.txt", banList);
    io.sockets.connected[socket.id].emit("message_admin", "ID has been unbanned!");
    console.log("ID was unbanned! " + data.id);   
    return;
        
        // End
        }
        
        io.sockets.connected[socket.id].emit("message_admin", "Wrong Admin Token");
        
    }catch(e){
        io.sockets.connected[socket.id].emit("message_admin", "Error " + e);
        console.log("Banned error. " + e);
    }
});
    
    
socket.on("userlog", function(data){
    try{
    var token = fs.readFileSync("admin_token.txt", "utf8");
    if(data.token === token){
      
        var log = fs.readFileSync("userlog.txt", "utf8");
        log = log.toString();
        io.sockets.connected[socket.id].emit("userlog", log);
        
        }     
    }catch(e){
        
    }
    
    
});
    
    
socket.on("docReg", function(data){
    try{
        
        var token = fs.readFileSync("admin_token.txt", "utf8");
        if(data.token === token){
            
            // Token correct, clear to write.
            var newFile = data.title + "½" + data.desciption + "½" + data.author + "½" + data.id;
            // Create file
            fs.writeFileSync("docs/" + data.title + ".txt", newFile);
            
            
            
            console.log("DOCS: New doc was made - " + data.title + " : " + data.id);
            io.sockets.connected[socket.id].emit("docs_error", "Success! Doc is live!");
            return;
            
        //verfiedList = verfiedList.toString().split(","); TODO
        }else{
            console.log("DOCS: Incorect token");
            io.sockets.connected[socket.id].emit("docs_error", "Incorect token!");
            return;
        }
    } catch(e){
        console.log("DOCS error: " + e);
        
            io.sockets.connected[socket.id].emit("docs_error", "Failed.");
            return;
    }
});

    
socket.on("docs_index_req", function(b){
  
    var docs = [];
    
    fs.readdirSync("docs").forEach(file => {
        file = file.toString().substr(0, file.length - 4);
        docs.push(file);
        
    })
   
    io.sockets.connected[socket.id].emit("docs_index", {
        docs: docs
    });
    
    
    
    
});    

socket.on("doc_req", function(name){
    
    while(name.indexOf("%20") != -1){
        name = name.replace("%20", " ");
    }
    
    var fileLocation = "docs/" + name + ".txt";
    var docFile = fs.readFileSync(fileLocation);
        docFile = docFile.toString().split("½");
    console.log(docFile);
    
    io.sockets.connected[socket.id].emit("doc_req_sent", {
        title: docFile[0],
        description: docFile[1],
        author: docFile[2]
    });
    
});
    
 
    
});


function getPageUsersB(){
    
    var usersRaw = fs.readFileSync("page_users.txt");
    var users = usersRaw.toString().split("#");
    var i = 0;
    var userArray = [];
    while(users.length > i){
        try{
            var storedUser = JSON.parse(users[i]);
            userArray.push(storedUser)
            i++;
        }catch(e){
            i++;
            
        }
    }
    return userArray;
}


function savePageUsers(allUsers){
    
        var i = 0;
        var stringUsers = [];
                    
        while(allUsers.length > i){
            var newUser = JSON.stringify(allUsers[i]);
           
            stringUsers.push(newUser);
            i++;
                        }
        var stringUsers = stringUsers.join("#");
        fs.writeFileSync("page_users.txt", stringUsers);
}


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
















































