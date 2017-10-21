var socket = io.connect("http://213.66.254.63:25565");



// Signup funcitons
var errorMessage;
onOpenSignup();

function onOpenSignup(){
    var persID = readCookie("persID");
    var persIDplusText = "Personal ID - " + persID; 
    document.getElementById("persIDSignup").value = persIDplusText;
}

// Send signup request
function checkInputs(){
    
    // Get varibales from form
    var persID = readCookie("persID");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confPassword = document.getElementById("password_confirmed").value;
    
    // Check for problems in input values
    
    if(document.getElementById("checkbox_warning").checked == false){
        showError("You have to agree to the EULA to sign up!");
        return;
    }
    
    if(persID == null){
        showError("No personal ID, please go back to Notu.co and then try again.");
        return;
    }
    
    if(username == "" || password == "" || confPassword == ""){
        showError("Missing informations, all slots need to be filled.");
        return;
    }
    if(username.indexOf("<") != -1){
        showError("HTML tags are not allowed in username.");
    }
    if(password !== confPassword){
        showError("Passwords need to match");
        return;
    }
    if(username.length > 20 || password.length > 20){
        showError("Your password is too long.");
        return;
    }
    if(username.length < 3){
        showError("Username must be at least 3 characters.");
        return;
    }
    if(password.length < 3){
        showError("Password must be at least 3 characters.");
        return;
    }
    
    // Everything checks out, proceed to register user.
    showError("clear");

    
    // Send over data to the server with a request to register new user

    socket.emit("signupReq", {
        
        username: username,
        password: password,
        persID: persID
        
    });
    
    
    
}

socket.on("signup_success", function(){
    showError("clear");
    document.getElementById("success_msg").innerHTML = "Success! You are now signed up to Quick Draw. The game is not ready yet, but check back soon to play it!";
    
});

socket.on("callback_fail", function(err){
   
    console.log(err);
    showError(err);
    
});

function showError(errMsg){
    if(errMsg == "clear"){
        document.getElementById("error_msg").innerHTML = "";
        return;
    }
    document.getElementById("error_msg").innerHTML = "Error: " + errMsg; 
}















var playStatus = "Quickdraw";


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