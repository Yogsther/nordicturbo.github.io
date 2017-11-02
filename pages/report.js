var socket = io.connect("http://213.66.254.63:25565");

// Load custom page
getCustomPage();
var pageName;
var displayName;

function getCustomPage(){
    
    var url = window.location.href;
    var questionPos = url.indexOf("?");
    pageName = url.substr(questionPos + 1);
    console.log(pageName);
    
    displayName = pageName.replace("%20", " ")
    document.title = displayName;
    
    // Send request to server for the page info.
    
    socket.emit("pageReqSrc", pageName);
    
}



// Insert custom page
socket.on("pageSentSrc", function(data){
        
    var html = "<xmp>" + data.html + "</xmp>"
    var css = "<xmp>" + data.css + "</xmp>"
    var javascript = "<xmp>" + data.javascript + "</xmp>"
    
    document.getElementById("source_title").innerHTML = "Source of " + displayName;
    document.getElementById("source_html").innerHTML = html;
    document.getElementById("source_css").innerHTML = css;
    document.getElementById("source_javascript").innerHTML = javascript;
    
});

function addView(){
    
    var viewer = readCookie("username");
    
    
    var lastViewd = readCookie("94BL38383AGW47238226453" + pageName);
    if(lastViewd != "true"){
    
    createCookie("94BL38383AGW47238226453"+pageName, "true", 0.9); 
    
    socket.emit("addView", {
        viewer: viewer,
        pageName: pageName
    });
    console.log("Added view :)");
        
    }
}




var playStatus = "Pages";


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