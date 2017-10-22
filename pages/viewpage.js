var socket = io.connect("http://213.66.254.63:25565");

// Load custom page
getCustomPage();

var pageName;

function getCustomPage(){
    
    var url = window.location.href;
    var questionPos = url.indexOf("?");
    pageName = url.substr(questionPos + 1);
    console.log(pageName);
    
    // Send request to server for the page info.
    
    socket.emit("pageReq", pageName);
    
}



socket.on("pageSent", function(data){

    
 
    document.write('<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <title>View Page</title> <link href="https://fonts.googleapis.com/css?family=Ubuntu:700" rel="stylesheet"> <link href="https://fonts.googleapis.com/css?family=Dosis" rel="stylesheet"> <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet"> <link rel="shortcut icon" href="img/favicon.ico"> <!-- Socket.io --> <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script> </head> <body>' + data.body + '<script>' +  data.javascript + '</script></body> </html>');
    console.table(data);
    
});




var playStatus = "Pages: " + pageName;


// On connection send over Username, ProfileLoc & Lvl

socket.on("login", function(request){
    
    if(request == "loginInfo"){
        
        var personalID = readCookie("persID");
        // Generate new personalID for new users.
        if(personalID == null){
            var newID = Math.floor(Math.random() * 999999999) + 1;
            createCookie("persID", newID, 10000);
            personalID = readCookie("persID");
        }
        
        console.log("Personal ID: " + personalID);
        
        
        var messageUsername = readCookie("username");
        var messageProfile = readCookie("profileLocation");
        var xp = (readCookie("xp") / 1000) + 1;
        xp = Math.floor(xp);
        
        
         socket.emit("sentover", {
            username: messageUsername,
            profilepic: messageProfile,
            xp: xp,
            id: socket.id,
            status: playStatus,
            persID: personalID
        });
        
        console.log("Sent over data");
    }
}); 






function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}