
// Socket.io & chat functions
var socket = io.connect("http://213.66.254.63:25565");
var playStatus = "Super Sorter";


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


function refreshProfile(){
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
 

/*
 END OF ONLINESTATUS
*/

// Setup canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var stop = false;

// Old colors, not used for new 100% random color method.
//const colors = ["0, 169, 255", "250, 0, 255", "255, 0, 0", "255, 204, 0", "0, 255, 29"];
//var color = colors[Math.floor(Math.random()*colors.length)];

var color;
betterColors();
function betterColors(){
    
    var colorArr = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
    
    var brighten = false;
    for(var i = 0; i < colorArr.length; i++){
        if(colorArr[i] < 200){
            brighten = true;
        }
    }
    if(brighten){
        console.log("color adjusted");
        console.log(colorArr);
        colorArr[Math.floor(Math.random()*colorArr.length)] = Math.floor(Math.random()*55) + 200;
        console.log(colorArr);
    }
    
    color = colorArr[0] + "," + colorArr[1] + "," + colorArr[2];
    
    
}


function sort(){
    
    var type = document.getElementById("sortType").value;
    if(type == "bogo"){
        initateSort();
    }
    if(type == "bubble"){
        bubbleSort();
    }
    
}


// Generate random numbers (prep)
function generate(){
  numbers = [];
  var amount = document.getElementById("amount").value;
    createCookie("ss_amount", amount, 10000);
  for(var i = 0; i < amount; i++){
    numbers.push(i+1);
  }
    numbers = shuffle(numbers);
    printNumbers();
}

// Print out numbers to the document.
function printNumbers(){
    // Print arr numbers
    var rows = Math.ceil(numbers.length / 10);
    if(rows == 0){
        rows = 1;
    }
    canvas.width = numbers.length*50;
    if(canvas.width > 500){
        canvas.width = 500;
    }
    canvas.height = 50 * rows;
    
    
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0, canvas.width, canvas.height);
  
    var row = 1;
    for(var i = 0; i < numbers.length; i++){

        ctx.fillStyle = "rgba(" + color +  "," + (numbers[i]/(numbers.length)) +")";
        ctx.fillRect(i*50 - (Math.floor(i / 10) * 500), Math.floor(i/10)*50, 50, 50);
  }   
  //document.getElementById("numbers").innerHTML = numbers;
}

// Main loop run on "Sort numbers"
var sorted;
var startTime;
var runs;

reqeustScoreboard();

function reqeustScoreboard(){
    socket.emit("get_ss_scoreboard");
}

var username = readCookie("username");
socket.on("scoreboard", function loadScoreBoard(data){
    var brightness = 1;
    for(var i = 0; i < 10; i++){
        
        
        
        var object = data[i];

        var time = millisToTime(object.time);
        
        var insertGlow = "";
        if(username == object.name){
            insertGlow = 'style="text-shadow: 0px 0px 1px white"';
        }
        
        
        document.getElementById("scoreboard").innerHTML += '<div id="score" style="border-color: rgba(' + color + ',' + brightness + ');"> <span class="name" title="Username" ' + insertGlow + '> ' + (i+1) + ". " + object.name +'</span> <span class="items" title="Items sorted">' + object.items + '</span> <span class="time" title="Time taken">' + time.hours + 'h ' + time.minutes + 'm ' + time.seconds + 's</span> </div>';
        //document.getElementById("score").style.borderColor = "rgb(" + color + ")";
        brightness -= 0.1;
    }
});



window.onload = new function(){
    var amount = readCookie("ss_amount");
    if(amount == null){
        document.getElementById("amount").value = 10;
    } else {
        document.getElementById("amount").value = amount;
    }
    generate();
}

var sent;
var estimatedLast;
var estimatedTime = "";
// Start storting
function initateSort(){
    sent = false;
  estimatedLast = Date.now();
  estimatedTime = estimateTime(amount.value, 200);
  stop = false;
  runs = -1;
  sorted = false;
  startTime = Date.now();
  playStatus = "Sorting " + numbers.length + " items.";
  refreshProfile();
  runsort();
}

var then = Date.now();
var runsOnRecord = 0;
var avrageSpeed = [];

function goodSort(){
    stop = true;
    numbers.sort(function(a, b) {
        return a - b;
    });
}



async function bubbleSort(){
    sorted = checkSorted();
    
    while(!sorted){
        
        // Sort
        for(var i = 0; i < numbers.length; i++){
            // Import old array into new array.
            var newArray = numbers.slice();
            
            if(numbers[i] > numbers[i+1]){
                
                newArray[i+1] = numbers[i];
                newArray[i] = numbers[i+1];

                //Save changes
                printNumbers();
                numbers = newArray;
            }
            await sleep(0.1);
            sorted = checkSorted();
        }
        
    }
    printNumbers();
}



var avrageSpeedInt = 0;

// Sorting loop
async function runsort(){
    
    if(stop){
        return;
    }
    
    
    var amount = document.getElementById("amount").value;
    var now = Date.now();
    if((now - then) > 100){
        
        then = now;
        runsPerSecond = runsOnRecord;
        avrageSpeed.push(runsPerSecond);
        
        var totalAvrage = 0;
        for(var i = 0; i < avrageSpeed.length; i++){
            totalAvrage += avrageSpeed[i];
        } 
        
 
        avrageSpeedInt = Math.round((totalAvrage / avrageSpeed.length)*10);
        runsOnRecord = 0;

        
        if(avrageSpeed.length > 100){
            // Reset avragespeed
            var oldAvrageSpeed = avrageSpeed;
            avrageSpeed = [];
            for(var i = 0; i < 10; i++){
                avrageSpeed.push(oldAvrageSpeed[oldAvrageSpeed.length - i - 1]);
            }
        }
    } 
  
  
    
    if((Date.now() - estimatedLast) > 5000){
        // Do this every second
        estimatedTime = estimateTime(amount, (avrageSpeedInt));
        estimatedLast = Date.now();
        
        playStatus = "Sorting " + amount + " items at " + avrageSpeedInt + " S/s";
        refreshProfile();
    }
    
  var estimatedTimeLeft = millisToTime((startTime + estimatedTime) - Date.now());
    
  document.getElementById("status").innerHTML = "<span title='S/s = Sorts per Second'>Speed: " + runsPerSecond*10 + " S/s Avrage speed: " + avrageSpeedInt + " S/s</span> Tried sorting " + runs + " times. Estimated time left: " + estimatedTimeLeft.days + "d " + estimatedTimeLeft.hours + "h " + estimatedTimeLeft.minutes + "m " + estimatedTimeLeft.seconds + "s.";
  runs++;
  runsOnRecord++;
  if(!sorted){
    numbers = shuffle(numbers); // Shuffle
    printNumbers(); // Print Numbers
    sorted = checkSorted(); // Check if numbers are sorted.
    await sleep(1);
    runsort();
  } else {
    // Numbers are sorted
    if(numbers.length >= 10){
        unlockProfile("sort");
    }
    var now = Date.now();
    var time = millisToTime(now - startTime);

    document.getElementById("status").innerHTML = "Sorted! 👍 Took " + runs + " tries in " + time.hours + "h " + time.minutes + "m " + time.seconds + "s.";
    playStatus = "Sorted " + numbers.length + " items in " + time.hours + "h " + time.minutes + "m " + time.seconds + "s.";
    refreshProfile();
    
    // Send new record to server
    if(!sent){
        sent = true;
    socket.emit("ss_record", {
        name: readCookie("username"),
        items: numbers.length,
        time: (now-startTime)
    });
        
    }
  }
}


function estimateTime(amount, speed){
    var firstCalc = (1 / factorial[amount-1]) * speed;
    var millis = (1 /  firstCalc) * 1000;
    return millis;
}


function checkSorted(){
  for(var i = 1; i < numbers.length; i++){
    if(numbers[i] >= numbers[i-1]){
      // OK
    } else {
      // Not sorted
      return false;
    }
  }
  return true;
}


/*
  Shuffle function for arrays.
*/
function shuffle(arr){

  // Create index array
  var index = [];
  for(var i = 0; i < arr.length; i++){
    index[i] = i;
  }

  var shuffledArray = [];

  // Shuffle
  var i = 0;
  while(index.length > 0){

    var randomVariable = Math.floor(Math.random()*index.length);
    var nextIndex = index[randomVariable];
      index.splice(randomVariable, 1); // Remove that one from the index.
      shuffledArray[i] = arr[nextIndex];
    i++;
  }
  return shuffledArray;

}




// Millis to h-m-s
function millisToTime(millis){
    
    var days = Math.floor(millis / 1000 / 3600 / 24);
    var hours = Math.floor(millis / 1000 / 3600) - days * 24;
    var minutes = Math.floor((millis / 1000 / 60) - hours * 60 - days * 24 * 60);
    var seconds = Math.floor(millis / 1000) - (hours * 3600 + minutes * 60 + 24 * days * 3600);
    
    return {
        seconds: seconds,
        minutes: minutes,
        hours: hours,
        days: days
    };
}






function unlockProfile(name){
    
    // Read cookie
    var animatedPictures = readCookie("animatedProfiles");
    if(animatedPictures == undefined || animatedPictures == null){
        createCookie("animatedProfiles", "", 10000);
        animatedPictures = readCookie("animatedProfiles");
    }
    animatedPictures = animatedPictures.split("|")
    
    // Modify value
    if(animatedPictures.indexOf(name) == -1){
    animatedPictures.push(name);
    }
    
    // Save cookie
    animatedPictures = animatedPictures.join("|");
    createCookie("animatedProfiles", animatedPictures, 10000);
}


// Stolen from stockoverflow.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Only factorial constant below.


const factorial = [1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1124000727777607680000, 25852016738884976640000, 620448401733239439360000, 15511210043330985984000000, 403291461126605635584000000, 10888869450418352160768000000, 304888344611713860501504000000, 8841761993739701954543616000000, 265252859812191058636308480000000, 8222838654177922817725562880000000, 263130836933693530167218012160000000, 8683317618811886495518194401280000000, 295232799039604140847618609643520000000, 10333147966386144929666651337523200000000, 371993326789901217467999448150835200000000, 13763753091226345046315979581580902400000000, 523022617466601111760007224100074291200000000, 20397882081197443358640281739902897356800000000, 815915283247897734345611269596115894272000000000, 33452526613163807108170062053440751665152000000000, 1405006117752879898543142606244511569936384000000000, 60415263063373835637355132068513997507264512000000000, 2658271574788448768043625811014615890319638528000000000, 119622220865480194561963161495657715064383733760000000000, 5502622159812088949850305428800254892961651752960000000000, 258623241511168180642964355153611979969197632389120000000000, 12413915592536072670862289047373375038521486354677760000000000, 608281864034267560872252163321295376887552831379210240000000000, 30414093201713378043612608166064768844377641568960512000000000000, 1551118753287382280224243016469303211063259720016986112000000000000, 80658175170943878571660636856403766975289505440883277824000000000000, 4274883284060025564298013753389399649690343788366813724672000000000000, 230843697339241380472092742683027581083278564571807941132288000000000000, 12696403353658275925965100847566516959580321051449436762275840000000000000, 710998587804863451854045647463724949736497978881168458687447040000000000000, 40526919504877216755680601905432322134980384796226602145184481280000000000000, 2350561331282878571829474910515074683828862318181142924420699914240000000000000, 138683118545689835737939019720389406345902876772687432540821294940160000000000000, 8320987112741390144276341183223364380754172606361245952449277696409600000000000000, 507580213877224798800856812176625227226004528988036003099405939480985600000000000000, 31469973260387937525653122354950764088012280797258232192163168247821107200000000000000, 1982608315404440064116146708361898137544773690227268628106279599612729753600000000000000, 126886932185884164103433389335161480802865516174545192198801894375214704230400000000000000, 8247650592082470666723170306785496252186258551345437492922123134388955774976000000000000000, 544344939077443064003729240247842752644293064388798874532860126869671081148416000000000000000, 36471110918188685288249859096605464427167635314049524593701628500267962436943872000000000000000, 2480035542436830599600990418569171581047399201355367672371710738018221445712183296000000000000000, 171122452428141311372468338881272839092270544893520369393648040923257279754140647424000000000000000, 11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000, 850478588567862317521167644239926010288584608120796235886430763388588680378079017697280000000000000000, 61234458376886086861524070385274672740778091784697328983823014963978384987221689274204160000000000000000, 4470115461512684340891257138125051110076800700282905015819080092370422104067183317016903680000000000000000, 330788544151938641225953028221253782145683251820934971170611926835411235700971565459250872320000000000000000, 24809140811395398091946477116594033660926243886570122837795894512655842677572867409443815424000000000000000000, 1885494701666050254987932260861146558230394535379329335672487982961844043495537923117729972224000000000000000000, 145183092028285869634070784086308284983740379224208358846781574688061991349156420080065207861248000000000000000000, 11324281178206297831457521158732046228731749579488251990048962825668835325234200766245086213177344000000000000000000, 894618213078297528685144171539831652069808216779571907213868063227837990693501860533361810841010176000000000000000000, 71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000, 5797126020747367985879734231578109105412357244731625958745865049716390179693892056256184534249745940480000000000000000000, 475364333701284174842138206989404946643813294067993328617160934076743994734899148613007131808479167119360000000000000000000, 39455239697206586511897471180120610571436503407643446275224357528369751562996629334879591940103770870906880000000000000000000, 3314240134565353266999387579130131288000666286242049487118846032383059131291716864129885722968716753156177920000000000000000000, 281710411438055027694947944226061159480056634330574206405101912752560026159795933451040286452340924018275123200000000000000000000, 24227095383672732381765523203441259715284870552429381750838764496720162249742450276789464634901319465571660595200000000000000000000, 2107757298379527717213600518699389595229783738061356212322972511214654115727593174080683423236414793504734471782400000000000000000000, 185482642257398439114796845645546284380220968949399346684421580986889562184028199319100141244804501828416633516851200000000000000000000, 16507955160908461081216919262453619309839666236496541854913520707833171034378509739399912570787600662729080382999756800000000000000000000, 1485715964481761497309522733620825737885569961284688766942216863704985393094065876545992131370884059645617234469978112000000000000000000000, 135200152767840296255166568759495142147586866476906677791741734597153670771559994765685283954750449427751168336768008192000000000000000000000, 12438414054641307255475324325873553077577991715875414356840239582938137710983519518443046123837041347353107486982656753664000000000000000000000, 1156772507081641574759205162306240436214753229576413535186142281213246807121467315215203289516844845303838996289387078090752000000000000000000000, 108736615665674308027365285256786601004186803580182872307497374434045199869417927630229109214583415458560865651202385340530688000000000000000000000, 10329978488239059262599702099394727095397746340117372869212250571234293987594703124871765375385424468563282236864226607350415360000000000000000000000, 991677934870949689209571401541893801158183648651267795444376054838492222809091499987689476037000748982075094738965754305639874560000000000000000000000, 96192759682482119853328425949563698712343813919172976158104477319333745612481875498805879175589072651261284189679678167647067832320000000000000000000000, 9426890448883247745626185743057242473809693764078951663494238777294707070023223798882976159207729119823605850588608460429412647567360000000000000000000000, 933262154439441526816992388562667004907159682643816214685929638952175999932299156089414639761565182862536979208272237582511852109168640000000000000000000000, 93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000
];

