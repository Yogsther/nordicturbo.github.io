
// Socket.io & chat functions
var socket = io.connect("http://213.66.254.63:25565");
var playStatus = "L.it Engine 🔥";

const documentation = [{
    code: "draw(int x, int y, String value);",
    comment: 'This method is the standard draw method to draw a white pixel. (Note: "value" should only be one character.)',
    category: "Draw"
},{
    code: "drawColor(int x, int y, String value, int color);",
    comment: 'This method is the standard draw method to draw a colored pixel. (Color table can be accessed here: <a href="colortable.txt">Color Table</a>)',
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
    code: "clear(String type);",
    comment: '// Clear everything. "type" is the the render type: "border" - Draws a border around the screen. "clear" - Draws nothing, no border. "plot" - Draws out coordinates to make it easy to develop.',
    category: "Draw"
},{
    code: "clearNoRender(String type);",
    comment: '// Clear everything but dont render, very usefull when you want to animate something without flickering. . "type" is the the render type: "border" - Draws a border around the screen. "clear" - Draws nothing, no border. Plot is not supported for this Method.',
    category: "Draw"
}, {
    code: "drawNoRender(int x, int y, String value);", 
    comment: "Normal Draw method, but without rendering. Usefull when you draw something big and you want it all to appear at the time.",
    category: "Draw"
}, {
    code: "drawRaw(int pos, String value);",
    comment: "Draw at position in the render array.",
    category: "Draw"
}, {
    code: "drawRawNoRender(int pos, String value);",
    comment: "Normal drawRaw method, but without rendering. Usefull when you draw something big and you want it all to appear at the time.",
    category: "Draw"
}, {
    code: "checkKey(int KeyCode);",
    comment: 'Check if a key is pressed down.',
    category: "Input"  
},{
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
    
}, {
    code: "render();",
    comment: "Render, call it to render a new frame.",
    category: "System"
    
},{
    code: "getPos(int x, int y);",
    comment: "Returns position from coordinates, in render array.",
    category: "System"
},{
    code: "debugDisableSplash();",
    comment: "Disable splash screen on launch, for debugging.",
    category: "Debug"  
},{
    code: "debugShowPressedKeys();",
    comment: "This prints out current keys pressed. Usefull for finding a KeyCode for a specific key.",
    category: "Debug"  
},{
    code: "Change Icon",
    comment: "Change the icon.png file in src to desired image. Recommended size 128x128px",
    category: "Other"  
}];


const colors = [{
    value: 0,
    color: "White"
}, {
    value: 1,
    color: "Red"
}, {
    value: 2,
    color: "Blue"
}, {
    value: 3,
    color: "Green"
}, {
    value: 4,
    color: "Yellow"
},{
    value: 5,
    color: "Grey"
}, {
    value: 6,
    color: "Purple"
}, {
    value: 7,
    color: "Orange"
}, {
    value: 10,
    color: "Black"
}];


var initate = true;

var inputWidth;
var inputHeight;

var canvas;
var ctx;

var mosuedown = false;
var mousePos;


var renderArray = [];

if (window.location.href.indexOf("documentation") != -1){
    loadDocumentation();
    playStatus = "L.it Engine 🔥 // Documentation";
}

if (window.location.href.indexOf("plotter") != -1){
    initatePlotter();
    setupPlotter();
    playStatus = "L.it Engine 🔥 // Plotter";
}


var mouseOn = false;
var selectedColor = 0;

function mouseStatus(status){
    mouseOn = status;
}


function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
  }



function initatePlotter(){
    
    
    
    for(var i = 0; i < colors.length; i++){
        var color = colors[i].color;
        if(color == "White"){
            color = "Black"
        }
        document.getElementById("color_select").innerHTML += '<option value="' + colors[i].value + '" style="color:' + color + ';">' + colors[i].color + '</option>';
    }
}

function colorChange(){
    selectedColor = document.getElementById("color_select").value;
    var color = colors[selectedColor].color;
    if(color == "White"){
        color = "black";
    }
    document.getElementById("color_select").style.color = color;
}


function setupPlotter(){
    // Render plotter
    
    if(initate == true){
        document.getElementById("x").value = 90;
        document.getElementById("y").value = 20;
        document.getElementById("value").value = "*";
        initate = false;
    }
    
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    
    
    inputWidth = document.getElementById("x").value;
    inputHeight = document.getElementById("y").value;

    
    
    canvas.width = inputWidth*10;
    canvas.height = inputHeight*10*2;
    
    // Draw background
    ctx.fillStyle = "black";
    
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    
    
    
    
    // Draw saved pixels
    
    if(renderArray != ""){
    ctx.fillStyle = "white";
    ctx.font = "17px Arial";
    var i = 0;
    while(i < renderArray.length){
        ctx.fillStyle = colors[renderArray[i].color].color;
        ctx.fillText(renderArray[i].value, (renderArray[i].x * 10), (renderArray[i].y * 10)+17);
        i++;
        }
    }
    
    
    
    //Draw grid
    ctx.fillStyle = "#111";
    
    
    var i = 0;
    while(i <= inputHeight){
        ctx.fillRect(0, i*10*2, canvas.width, 1);
        i++;
    }
    
    var i = 0;
    while(i <= inputWidth){
        ctx.fillRect(i*10, 0, 1, canvas.height);
        i++;
    }
    
    
}


function copyJava(){
    
    var value = document.getElementById("value").value;
    
    
    var copyString = "public static void DOODLE_NAME(int x, int y){\n/* Generated with LitEngine Plotter */\n";
    var i = 0;
    while(i < renderArray.length){
        var addString = "LitEngine.drawNoRenderColor(" + renderArray[i].x + " + x, " + (renderArray[i].y / 2) + " + y, " + '"' + renderArray[i].value + '"' + "," + renderArray[i].color + ");\n";
        copyString = copyString + addString;
        i++;
    }
    copyString = copyString + "//LitEngine.render();\n}";
    copyToClipboard(copyString);
}

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text); 

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}




canvas.addEventListener('mousemove', function(evt) {

    mousePos = getMousePos(canvas, evt);
    
    var value = document.getElementById("value").value;
    
    var mouseX = mousePos.x -1;
    var mouseY = mousePos.y -1;


    mouseX = Math.floor(mouseX / 10);
    mouseY = Math.floor(mouseY / 10);
    
    if(mouseY % 2 != 0){
        mouseY = mouseY - 1;
    }
    
    
    setupPlotter();
    ctx.fillStyle = "white";
    ctx.font = "17px Arial";
    ctx.fillText(value, mouseX * 10, (mouseY * 10)+17);
    
    
    // Insert info text
    document.getElementById("info").innerHTML = "X: " + mouseX + " Y: " + (mouseY/2) + " <br>Saved Pixels: " + renderArray.length;
    
}, false);

document.addEventListener('keydown', function(evt) {

    
    if(!mouseOn){return;};
    
    var mouseX = mousePos.x -1;
    var mouseY = mousePos.y -1;
    
    var color = selectedColor;
    
    var value = document.getElementById("value").value;


    mouseX = Math.floor(mouseX / 10);
    mouseY = Math.floor(mouseY / 10);
    
    if(mouseY % 2 != 0){
        mouseY = mouseY - 1;
    }

    var find = renderArray.findIndex(x => x.x == mouseX && x.y == mouseY);

    if(find == -1){
        if(mouseX == -1 || mouseY == -1){
            setupPlotter();
            return;
        }
        renderArray.push({
            x: mouseX,
            y: mouseY,
            value: value,
            color: color
        });
    }
    
    setupPlotter();
   
}, false);



canvas.addEventListener('click', function(evt) {

    mousePos = getMousePos(canvas, evt);
    var value = document.getElementById("value").value;
    var mouseX = mousePos.x -1;
    var mouseY = mousePos.y -1;


    mouseX = Math.floor(mouseX / 10);
    mouseY = Math.floor(mouseY / 10);
    
    if(mouseY % 2 != 0){
        mouseY = mouseY - 1;
    }
    
    // Save pixel
    
    var find = renderArray.findIndex(x => x.x == mouseX && x.y == mouseY);
    

    if(find != -1){
        renderArray.splice(find, 1);
        setupPlotter();
        return;
    }
    
    if(mouseX == -1 || mouseY == -1){
            setupPlotter();
            return;
    }
    

    var color = selectedColor;
    
    setupPlotter();
    renderArray.push({
            x: mouseX,
            y: mouseY,
            value: value,
            color: color
    });
}, false);


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
 