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

// Quickdraw
var startRating = 4000;
var searching = [];
var game = [];


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

            // Check if user has joined Quick Draw
            var quickdrawRank = null;
            var quickdrawProfile = null;
            try{
                var quickdrawProfile = fs.readFileSync("quickdraw/" + newUser.persID + ".txt", "utf8");
                if(quickdrawProfile != null){
                        quickdrawProfile = quickdrawProfile.split("|");
                        quickdrawRank = quickdrawProfile[0];
            } else {
                quickdrawRank = null;
                quickdrawProfile = null;
            }
            } catch(e){
                quickdrawRank = null;
                quickdrawProfile = null;
            }
            
                
            var sendToClients = {
                username: newUser.username,
                profilepic: newUser.profilepic,
                xp: newUser.xp,
                status: newUser.status,
                verified: verified,
                quickdraw: quickdrawRank
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
    if(data.username.length > 12){
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
    if(userinfo.username.length > 12){
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
                
            // Check if user has joined Quick Draw
            var quickdrawRank = null;
            var quickdrawProfile = null;
            try{
                var quickdrawProfile = fs.readFileSync("quickdraw/" + newUser.persID + ".txt", "utf8");
                if(quickdrawProfile != null){
                        quickdrawProfile = quickdrawProfile.split("|");
                        quickdrawRank = quickdrawProfile[0];
            } else {
                quickdrawRank = null;
                quickdrawProfile = null;
            }
            } catch(e){
                quickdrawRank = null;
                quickdrawProfile = null;
            }

            var sendToClients = {
                username: newUser.username,
                profilepic: newUser.profilepic,
                xp: newUser.xp,
                status: newUser.status,
                verified: verified,
                quickdraw: quickdrawRank
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
    
    socket.on("pageReqSrc", function(name){
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

    



                        io.sockets.connected[socket.id].emit("pageSentSrc", {
                            html: html,
                            css: css,
                            javascript: javascript
                        });

                        }catch(e){

                        }
        
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



















/*
    // OLD Quickdraw

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

*/

// (New) Quickdraw


    
socket.on("validate", function(id){
    try{
        fs.readFileSync("quickdraw/" + id + ".txt");
        io.sockets.connected[socket.id].emit("validate_callback", "valid");
    } catch(e){
        io.sockets.connected[socket.id].emit("validate_callback", "failed");
    }
})
    

socket.on("quickdraw_join", function(id){
    
    //Set up save file
    var savefile = startRating + "|" + 0;
    fs.writeFileSync("quickdraw/" + id + ".txt", savefile);
    io.sockets.connected[socket.id].emit("validate_callback", "valid");
    
    
});


socket.on("getProfile_quickdraw", function(id){
   
    var profile = getQuickdrawProfile(id);
    if(profile == "error"){
        return;
    }
    io.sockets.connected[socket.id].emit("profile_callback", profile);
    
});



function getQuickdrawProfile(id){
    try{
    var profile = fs.readFileSync("quickdraw/" + id + ".txt", "utf8");
    var profile = profile.split("|");
    return profile;
    } catch(e){
        console.log("Error login in.");
        return "error";
    }
}

// All items
var items = [{
    name: "Hat 01",
    src: "hat01",
    cost: 20,
    type: "hat"
},{
    name: "Wizard 01",
    src: "wizard01",
    cost: 50,
    type: "hat"
}, {
    name: "Top Hat",
    src: "tophat",
    cost: 25,
    type: "hat"
}, {
    name: "Pumpkin",
    src: "pumpkin",
    cost: 50,
    type: "hat"
}, {
    name: "Shyguy",
    src: "shyguy",
    cost: 70,
    type: "hat"
}, {
    name: "Pepe",
    src: "frog",
    cost: 70,
    type: "hat"
}, {
    name: "Interstellar",
    src: "interstellar",
    cost: 100,
    type: "hat"
}, {
    name: "Ghost",
    src: "ghost",
    cost: 60,
    type: "hat"
}];

    
    
    
socket.on("qd_item", function(data){
   
    var profile = getQuickdrawProfile(data.id);
    var profileBank = profile[1];
    var itemPos = items.findIndex(i => i.src === data.src);
    var itemCost = items[itemPos].cost;
    
    if(profileBank >= itemCost){
        // Clear to buy
        // Ajust balance after purchase
        profile[1] = profile[1] - itemCost;
        // Add new item to profile
        profile.push(data.src);
        // Save profile
        saveQuickdrawProfile(data.id, profile);
    } else {
        // Can't buy
        return;
    }
    
});

    
socket.on("qd_search", function(data){
    var sendMe = {
        id: data.id,
        socket: socket.id,
        skin: data.skin,
        hat: data.hat,
        name: data.name
    };
    
    var searchPos = searching.findIndex(i => i.id === data.id);
    if(searchPos != -1){
        return;
    }
    searching.push(sendMe);
    matchMake();    
})

socket.on("qd_stopsearch", function(id){
    var searchPos = searching.findIndex(i => i.id === id);
    if(searchPos == -1){
        
        return;
    }
    searching.splice(searchPos, 1);
    matchMake();    
})

function matchMake(){
    if(searching.length > 1){
        // Multible people are searching.
        newQDGame(searching[0], searching[1]);
        searching.splice(searching[0], 1);
        searching.splice(searching[1], 1);
        matchMake();
    }
}
    
function newQDGame(p1, p2){
    
    // Generate random number between 1 - 15 (timer)
    var playTime = Math.floor(Math.random() * 20) + 1;
    var gameID  = Math.floor(Math.random() * 1000000000000) + 1;
    
    var maps = ["sand_village", "night_village"];
    var map = maps[Math.floor(Math.random() * maps.length)];
    
    try{    
    io.sockets.connected[p1.socket].emit("newGame", {
        playTime: playTime,
        gameID: gameID,
        p2hat: p2.hat,
        p2name: p2.name,
        map: map
    });
    
    io.sockets.connected[p2.socket].emit("newGame", {
        playTime: playTime,
        gameID: gameID,
        p2hat: p1.hat,
        p2name: p1.name,
        map: map
    });
    
    game.push({
        gameID: gameID,
        p1time: 0,
        p2time: 0,
        p1ID: p1.id,
        p2ID: p2.id,
        p1Socket: p1.socket,
        p2Socket: p2.socket
        
    });
    setTimeout(function(){ 
        endGame(gameID);
    }, (playTime * 1000) + 4000);
        
   
    }catch(e){
    console.log("Error with Quickdraw Mathmaking: " + e);
    }
}
// game id, socke.on(gamefinnished)
    
    
socket.on("game_results", function(data){
    try{
    var gameIndex = game.findIndex((obj => obj.gameID == data.gameID));
    var p1ID = game[gameIndex].p1ID;
    var p2ID = game[gameIndex].p2ID;
    
    if(data.id == p1ID){
        game[gameIndex].p1time = data.time;
    } else if(data.id == p2ID){
        game[gameIndex].p2time = data.time;
    }
        }catch(e){
            console.log("Problem with game results - " + e);
        }
});
    
function endGame(gameID){
    var gameIndex = game.findIndex((obj => obj.gameID == gameID));
    var gameData = game[gameIndex];
    
    if(gameData.p1time < 1){
        gameData.p1time = 1000;
    }
    if(gameData.p2time < 1){
        gameData.p2time = 1000;
    }
    
    if(gameData.p1time < gameData.p2time){
        //P1 won
        var user = getQuickdrawProfile(gameData.p1ID);
        user[1] = Number(user[1]) + 10;
        saveQuickdrawProfile(gameData.p1ID, user);
        
        
        // P1 CR 
        var p1User = getQuickdrawProfile(gameData.p1ID);
        p1User[0] = Number(p1User[0]) + 50;
        saveQuickdrawProfile(gameData.p1ID, p1User);
        // P2 CR
        var p2User = getQuickdrawProfile(gameData.p2ID);
        if(p2User[0] < 50){
            p2User[0] = 0;
        } else {
            p2User[0] = Number(p2User[0]) - 50;
        }
        saveQuickdrawProfile(gameData.p2ID, p2User);
        
        
        try{
        io.sockets.connected[gameData.p1Socket].emit("game_over", {
            status: "won",
            optime: gameData.p2time
        });
        } catch(e){
            
        }
        try{
        io.sockets.connected[gameData.p2Socket].emit("game_over", {
            status: "lost",
            optime: gameData.p1time
        });
        }catch(e){
            
        }
        
    } else if (gameData.p2time < gameData.p1time){
        //P2 won
        
        var user = getQuickdrawProfile(gameData.p2ID);
        user[1] = Number(user[1]) + 10;
        saveQuickdrawProfile(gameData.p2ID, user);
        
        // P2 CR 
        var p2User = getQuickdrawProfile(gameData.p2ID);
        p2User[0] = Number(p2User[0]) + 50;
        saveQuickdrawProfile(gameData.p2ID, p2User);
        // P1 CR
        var p1User = getQuickdrawProfile(gameData.p1ID);
        if(p1User[0] < 50){
            p1User[0] = 0;
        } else {
            p1User[0] = Number(p1User[0]) - 50;
        }
        saveQuickdrawProfile(gameData.p1ID, p1User);
        
        
        try{
        io.sockets.connected[gameData.p1Socket].emit("game_over", {
            status: "lost",
            optime: gameData.p2time
        });
        } catch(e){
                
        }
        try{
        io.sockets.connected[gameData.p2Socket].emit("game_over", {
            status: "won",
            optime: gameData.p1time
        });
        } catch(e){
                    
        }
        
    } else {
        try{
        // Tied TODO
        io.sockets.connected[gameData.p2Socket].emit("game_over", {
            status: "lost",
            optime: gameData.p1time
        });
        io.sockets.connected[gameData.p1Socket].emit("game_over", {
            status: "lost",
            optime: gameData.p2time
        });
        } catch(e){
            
        }
    }
    
    
    // Remove game from arr
    game.splice(gameIndex, 1);
}
    
function saveQuickdrawProfile(id, profile){
    profile = profile.join("|");
    fs.writeFileSync("quickdraw/" + id + ".txt", profile);
}




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
  try{
    var docs = [];

    fs.readdirSync("docs").forEach(file => {
        file = file.toString().substr(0, file.length - 4);
        docs.push(file);

    })

    io.sockets.connected[socket.id].emit("docs_index", {
        docs: docs
    });
  } catch(e){
    console.log("DOCS Error: " + e);
  }



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