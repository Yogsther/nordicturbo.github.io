var socket = io.connect("http://213.66.254.63:25565");

if (window.location.href.indexOf("mypage") != -1){
    isRegistered();
}

function gotoIndex(){
    window.location.href = "index.html";
}

function gotoMyPage(){
    window.location.href = "mypage.html";
}

function isRegistered(){
    var registeredStatus = readCookie("pageRestigered");
    if(registeredStatus == "true"){
        
        var username = readCookie("pageUsername");
        var password = readCookie("pagePassword");
        
        socket.emit("loginReqPage", {
        username: username,
        password: password
        });
        
    } else {
        showSignup();
    } 
}

function showSignup(){
    document.getElementById("mypage_info").innerHTML = 'You dont have a page. But you can create one here! First you have to signup so only you can edit your page! <br><br> <input type="text" id="username" class="input" placeholder="Choose a Username" maxlength="20"> <input type="password" id="password" class="input" placeholder="Create a Password" maxlength="50"> <input type="password" id="confirm_password" class="input" placeholder="Confirm your Password" maxlength="50"> <div id="eulaagree"> I have read and agree to the <a href="eula.txt">Notu.co Pages EULA</a> <input type="checkbox" id="checkme"> </div> <button class="btn" id="register_button" onclick="register()">Register</button> <div id="fail_display" style="color: #f70e1b;"></div> Already a user? <a href="javascript:showLogin()">Login!</a>';
}


function showLogin(){
    document.getElementById("password").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  
        login();
    }
    });
    document.getElementById("username").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  
        login();
    }
    });
    
    document.getElementById("mypage_info").innerHTML = 'Log in:<br><br> <input type="text" id="username" class="input" placeholder="Username" maxlength="20"> <input type="password" id="password" class="input" placeholder="Password" maxlength="50"> <button class="btn" id="login_button" onclick="login()">Login</button> <br><br> <div id="error_message_login"> </div> <span id="signin_info"> Not a user? <a href="javascript:showSignup()">Sign up here!</a> </span>';
}




function login(){
    
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    socket.emit("loginReqPage", {
        username: username,
        password: password
    });
    
    createCookie("pageUsername",username,10000);
    createCookie("pagePassword",password,10000);
    
    console.log("Sent login request");
}

socket.on("login_success", function(info){
    
    createCookie("pageRestigered", "true", 10000);
    console.log("You are logged in.");
    isRegistered();
    
    
});

socket.on("login_failed", function(err){
   
    document.getElementById("error_message_login").innerHTML = err;
    
});

function register(){
    
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirm_password = document.getElementById("confirm_password").value;
    var checkboxStatus = document.getElementById("checkme").checked;
    var persID = readCookie("persID");
    
    
    if(username.indexOf("<") != -1 || password.indexOf("<") != -1){
        failed("HTML tags are not allowed in usernames.");
        return;
    }
    if(username == "" || password == "" || confirm_password == ""){
        failed("No field can be left empty.");
        return;
    }
    if(username.indexOf("#") != -1 || password.indexOf("#") != -1){
        failed("# are not allowed in Usernames or Passwords.");
        return;
    }
    if(persID == null || isNaN(persID)){
        failed("Bad Personal ID, please reset your cookies.");
        return;
    }
    if(checkboxStatus == false){
        failed("You have to agree to the EULA to use Notu.co Pages.");
        return;
    }
    if(password !== confirm_password){
        failed("Passwords do not match.");
        return;
    }
    
    socket.emit("pageRegister", {
        
        username: username,
        password: password,
        persID: persID
        
        });
    
    // Cleared and ready for registration
    failed("clear");
};

socket.on("callback_fail", function(err){
    failed(err);
});

socket.on("pages_signup_success", function(){
   
    document.getElementById("fail_display").innerHTML = "Success!";
    document.getElementById("fail_display").style.color = "green";
    
    
});


function failed(err){
    if(err == "clear"){
    document.getElementById("fail_display").innerHTML = ""; 
    return;
    }
    document.getElementById("fail_display").innerHTML = err;
    document.getElementById("fail_display").style.color = "red";
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