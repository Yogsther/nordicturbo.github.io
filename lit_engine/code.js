
// Socket.io & chat functions
var socket = io.connect("http://213.66.254.63:25565");

const documentation = [{
    code: "draw(int x, int y, String value);",
    comment: 'This method is the standard draw method to draw a pixel. (Note: "value" should only be one character.)',
    category: "Draw"
}, {
    code: "print(int x, int y, String value);",
    comment: 'Print text',
    category: "Draw"
}, {
    code: 'printAnimated(int x, int y, String value, int speed);',
    comment: 'Animate printed text (speed is how fast it prints out.)',
    category: "Draw"
}, {
    code: 'drawRect(int x, int y, int width, int height, String value);',
    comment: 'Draw rectangle (value should only be one character)',
    category: "Draw"
}, {
    code: 'drawRectAnimated(int x, int y, int width, int height, String value, int speed);',
    comment: "Normal draw rectangle, but the drawing will be animated. Speed is the speed of the drawing.",
    category: "Draw"
}, {
    code: 'drawCircle(int x, int y, int radius, String value);',
    comment: 'Draw circle (value should only be one character) x and y are the center coordinates of your circle.',
    category: "Draw"
}, {
    code: "clear(String type)",
    comment: '// Clear everything. "type" is the the render type: "border" - Draws a border around the screen. "clear" - Draws nothing, no border. "plot" - Draws out coordinates to make it easy to develop.',
    category: "Draw"
}, {
    code: "inputString();",
    comment: 'Get a string (with spaces) from the user. Example: <code>String string = LitEngine.inputString();</code>',
    category: "Input"  
}, {
    code: "inputInt();",
    comment: "Get an int from the user. Example: <code>int num = LitEngine.inputInt();</code>",
    category: "Input"
    
}, {
    code: "start(String type);",
    comment:'Start up the old rusty engine. This should be done first thing (after setting other system prefrenceses). "type" can be any of the ' + 
    'init types. (border, clear or plot) see more on clear(type);',
    category: "System"
    
}, {
    code: "setRes(int x, int y);",
    comment: "Set the resolution of your application. (Make sure you do this before calling start();!)",
    category: "System"
    
},{
    code: "debugDisableSplash();",
    comment: "Disable splash screen on launch, for debugging.",
    category: "Debug"  
}];



if (window.location.href.indexOf("documentation") != -1){
    loadDocumentation();
}


// Documentation reader
function loadDocumentation(){

    var i = 0;
    while(i < documentation.length){
        document.getElementById("documentation_div").innerHTML += '<div class="documentation_insert"> <span class="category" title="Category"> ' + documentation[i].category + ' </span> <span class="code"><code> ' + documentation[i].code + '</code> </span> <span class="comment"> ' + documentation[i].comment + '</span> </div>';
        i++;
    }
}



function search(){
    
    const noSearch = ["Nothing matches your searchwords, try something else.", "Could not find shit.", "Nothing to see here...", "Boi!" , "¯\\_(ツ)_/¯", "🔎 Sorry, can't find anything here.. ", "Nothing found.. ? hmm... ", "HELLO!", "THIS SHIT'S EMPTY! YEEEEEEEET"];
    
    var searchTag = document.getElementById("search").value;
        searchTag = searchTag.toLowerCase();
    
    document.getElementById("documentation_div").innerHTML = "";

    var added = 0;
    var i = 0;
    while(i < documentation.length){
        if(documentation[i].code.toLowerCase().indexOf(searchTag) != -1 || documentation[i].category.toLowerCase().indexOf(searchTag) != -1){
            document.getElementById("documentation_div").innerHTML += '<div class="documentation_insert"> <span class="category" title="Category"> ' + documentation[i].category + ' </span> <span class="code"><code> ' + documentation[i].code + '</code> </span> <span class="comment"> ' + documentation[i].comment + '</span> </div>';
            added++;
        }
        i++; 
        
        
    }

    if(searchTag.length > 20){
        document.getElementById("documentation_div").innerHTML = "Hey, that's a pretty long search there, " + searchTag.length + " characters to be exact. Or you could say " + (Math.sqrt(searchTag.length)).toFixed(3)+ "² .. ";
        return;
    }
    
    if(added < 1){
        document.getElementById("documentation_div").innerHTML = noSearch[Math.floor(Math.random() * noSearch.length)];
    }
}










































var playStatus = "L.it Engine 🔥";

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
 