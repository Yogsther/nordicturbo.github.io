var socket = io.connect("http://213.66.254.63:25565");
var playStatus = "Pages";


if (window.location.href.indexOf("mypage") != -1){
    isRegistered();
    playStatus = "Editing page"
}

if (window.location.href.indexOf("index") != -1 || window.location.href == "http://livingforit.xyz/pages/"){
    loadIndex();
}

function gotoIndex(){
    window.location.href = "index.html";
}

function gotoMyPage(){
    window.location.href = "mypage.html";
}

function gotoLink(link){
    window.location.href = link;
}

function isRegistered(){
    var registeredStatus = readCookie("pageRegistered");
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


function logout(){
    eraseCookie("pageRegistered");
    eraseCookie("pageUsername");
    eraseCookie("pagePassword");
    
    showLogin();
    
}

function view(){
    
    save();
    
    var username = readCookie("pageUsername");
    var link = "viewpage.html?" + username;
    gotoLink(link);
    
}


function save(){
    
    var html = document.getElementById("html_code").value;
    var css = document.getElementById("css_code").value;
    var javascript = document.getElementById("javascript_code").value;
    
    var username = readCookie("pageUsername");
    var password = readCookie("pagePassword");
    

    
    socket.emit("save", {
        username: username,
        password: password,
        html: html,
        css: css,
        javascript: javascript
    })
    
    
}

function showEditor(){
    
    var myName = readCookie("pageUsername");
    
    document.getElementById("background_main").innerHTML = '<div id="logout_texs">' + myName + ' <a href="javascript:logout();">Logout</a></div> <button class="btn" id="my_page_button"  onclick="view();">View</button> <button class="btn" id="my_page_button2" onclick="save()">Save</button> <div id="header"> <span id="header_text"><i>&lt;pages&gt;</i></span> <img src="logo.png" id="header_img" onclick="gotoIndex()"> </div> <div id="about_mypage"> Welcome to the Pages editor. Here you can edit and personalize your own page. No need to link the CSS, HTML and Javascript - that is already done. Remember that everyones page is public.</div> <span class="code_title">Edit your HTML body:</span> <textarea class="code" id="html_code" autocomplete="off" autocorrect="off" spellcheck="false"></textarea> <span class="code_title">Edit your CSS:</span> <textarea class="code" id="css_code" autocomplete="off" autocorrect="off" spellcheck="false"></textarea> <span class="code_title">Edit your Javascript:</span> <textarea class="code" id="javascript_code" autocomplete="off" autocorrect="off" spellcheck="false"></textarea>';
    
    
}

function showSignup(){
    document.getElementById("background_main").innerHTML = '<div id="header"> <span id="header_text"><i>&lt;pages&gt;</i></span> <img src="logo.png" id="header_img" onclick="gotoIndex()"> </div> <div id="mypage_info"> You dont have a page. But you can create one here! First you have to signup so only you can edit your page! <br><br> <input type="text" id="username" class="input" placeholder="Choose a Username" maxlength="20"> <input type="password" id="password" class="input" placeholder="Create a Password" maxlength="50"> <input type="password" id="confirm_password" class="input" placeholder="Confirm your Password" maxlength="50"> <div id="eulaagree"> I have read and agree to the <a href="eula.txt">Notu.co Pages EULA</a> <input type="checkbox" id="checkme"> </div> <button class="btn" id="register_button" onclick="register()">Register</button> <div id="fail_display" style="color: #f70e1b;"></div> Already a user? <a href="javascript:showLogin()">Login!</a>';
}




function showLogin(){
    
   
    document.getElementById("background_main").innerHTML = '<div id="header"> <span id="header_text"><i>&lt;pages&gt;</i></span> <img src="logo.png" id="header_img" onclick="gotoIndex()"> </div> <div id="mypage_info"> Log in:<br><br> <input type="text" id="username" class="input" placeholder="Username" maxlength="20"> <input type="password" id="password" class="input" placeholder="Password" maxlength="50"> <button class="btn" id="login_button" onclick="login()">Login</button> <br><br> <div id="error_message_login"> </div> <span id="signin_info"> Not a user? <a href="javascript:showSignup()">Sign up here!</a> </span>';
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
    
    createCookie("pageRegistered", "true", 10000);
    console.log("You are logged in.");
    showEditor();
    console.table(info);
    
    document.getElementById("html_code").innerHTML = info.html;
    document.getElementById("css_code").innerHTML = info.css;
    document.getElementById("javascript_code").innerHTML = info.javascript;
    
    
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


function loadIndex(){
    socket.emit("indexRequest")
    
    
    
    
}
var featuredUsers = [];

socket.on("featuredUsers", function(featured){
    featuredUsers = featured; 
});

socket.on("indexRequest", function(data){
    
    console.log(data);
    var i = 0;
    
    

    while(data.length > i){
        
        if(data[i] != "" && data[i] != null){
            
            var userInfo = JSON.parse(data[i]);
            var user = userInfo.username;
           
            
            if(featuredUsers.indexOf(user) != -1){
                // User is featured
                // onclick="gotoLink('boi')"
                document.getElementById("page_list_featured").innerHTML += '<div id="page_listing" onclick="gotoLink(' + "'viewpage.html?" + user + "'" + ')"> <img src="thumb_default.png" id="thumb"> <span id="pagelisting_title"> ' + user + ' </span> <span id="views">Views: n/a</span> </div>';
                
                
                
                
            }
                document.getElementById("page_list").innerHTML += '<div id="page_listing" onclick="gotoLink(' + "'viewpage.html?" + user + "'" + ')"> <img src="thumb_default.png" id="thumb"> <span id="pagelisting_title"> ' + user + ' </span> <span id="views">Views: n/a</span> </div>';
                
                
            
            
            
            var url = "viewpage.html?" + userInfo.username;
            console.log(url);
            
            }
        i++;
    }
    
});



function failed(err){
    if(err == "clear"){
    document.getElementById("fail_display").innerHTML = ""; 
    return;
    }
    document.getElementById("fail_display").innerHTML = err;
    document.getElementById("fail_display").style.color = "red";
}
















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