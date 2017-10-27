
// Socket.io & chat functions
var socket = io.connect("http://213.66.254.63:25565");


var playStatus = "DOCS";

initiate();

function goBack(){
    window.location.href = "index.html";
}

function search(){
    
    var keyWord = document.getElementById("search").value;
    if(keyWord == ""){
        // Reset search on empy search box
        var i = 0;
        document.getElementById("actual_list").innerHTML = "";
        while(i < list.length){
            document.getElementById("actual_list").innerHTML += '<span class="list_item"><a href="index.html?' + list[i] + '">' + list[i] + '</a></span><br>';
            i++;
        }
    }

    if(keyWord != ""){
        // Search function
        
        keyWord = keyWord.toLowerCase();
       
        
         var i = 0;
        document.getElementById("actual_list").innerHTML = "";
        while(i < list.length){
            if(list[i].toLowerCase().indexOf(keyWord) != -1){
            document.getElementById("actual_list").innerHTML += '<span class="list_item"><a href="index.html?' + list[i] + '">' + list[i] + '</a></span><br>';
                }
            i++;
        }
        
        
        
    }
    
    
}

function getEditList(){
    
    edit_select
}



function sendDoc(){
    
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var author = document.getElementById("author").value;
    var token = document.getElementById("token").value;
    var id = readCookie("persID");
    
    socket.emit("docReg", {
        title: title,
        desciption: description,
        author: author,
        token: token,
        id: id
    })
}

function initiate(){

    if (window.location.href.indexOf("index.html?") != -1){
    // Specific doc is requested 
    // Get name of requested doc
    var url = window.location.href;
    var breakPoint = url.indexOf("?");
    var name = url.substr(breakPoint + 1);    
    
    socket.emit("doc_req", name);    
        
        
    
    socket.emit("docs_index_req");    
        
    } else if(window.location.href.indexOf("new") != -1) {
    // New page
    socket.emit("docs_index_req");    
        
        
        
    } else {
    // Index
    socket.emit("docs_index_req");  
    document.getElementById("latest").innerHTML = '<span id="title_latest"><h3>Get started:</h3> Notu.co is a project hosting site. The documentation here is mainly<br> for developers developing projects for notu.co or working on notu.co<br> itself. Feel free to read up on the documentation we have made so far. <h4>Links: </h4> <a href="https://github.com/Yogsther/nordicturbo.github.io">Github</a> - Github<br> <a href="http://livingforit.xyz">Notu.co</a> - Notu.co<br> <a href="https://trello.com/b/NXvKqjrB/notuco-website">Trello</a> - Open trello page<br> <h3>For developers:</h3> If you are going to post here keep this is mind: <br> <ul> <li>Everything document should be written in English</li> <li>If you are writing for a project, title your document <br>"ProjectName: DocName", to keep things sorted.</li> <li>When working on offical Notu.co code, comment your code<br>thoroughly.</li> <li>Publish everything important to Notu.co Docs!</li> </ul> <b>Markdown and code embedding is coming soon!</b></span>';
    }
}

socket.on("doc_req_sent", function(data){
    
    if(window.location.href.indexOf("new") != -1){
      
      
      
      
    }
    
    
    document.getElementById("doc_title").innerHTML = data.title;
    document.getElementById("doc_description").innerHTML = data.description;
    document.getElementById("doc_author").innerHTML = "Author: "+data.author;
    
    
    
});

var list = [];

function getEditDoc(){
    
    var name = document.getElementById("edit_select").value;
    
    
}

socket.on("docs_index", function(data){
   
    if(window.location.href.indexOf("new") != -1){
        // On edit page, get list index
        list = data.docs;
        list.sort();
        var i = 0;
        console.log("TEST");
    while(i < list.length){
        document.getElementById("edit_select").innerHTML += '<option value="'+ list[i] + '">' + list[i] +'</option>';
        i++;
    }
    return;
}
    
    
    
    list = data.docs;
    list.sort();
    var i = 0;
    
    while(i < list.length){
        document.getElementById("actual_list").innerHTML += '<span class="list_item"><a href="index.html?' + list[i] + '">' + list[i] + '</a></span><br>';
        i++;
    }
    
    
    
});











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


// Cookie functions from Overstacked


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
 
