// Setup canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var stop = false;


window.onload = new function(){
  document.getElementById("amount").value = 10;
  generate();
}

// Generate random numbers (prep)
function generate(){
  numbers = [];
  var amount = document.getElementById("amount").value;
  for(var i = 0; i < amount; i++){
    numbers.push(i+1);
  }
    numbers = shuffle(numbers);
    printNumbers();
}

// Print out numbers to the document.
function printNumbers(){
  // Print arr numbers
    canvas.width = numbers.length*50;
    
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, canvas.width, canvas.height);
  for(var i = 0; i < numbers.length; i++){
        ctx.fillStyle = "rgba(255, 0, 0, " + (numbers[i]/(numbers.length)) +")";
        ctx.fillRect(i*50, 0, 50, 50);
  }   
  document.getElementById("numbers").innerHTML = numbers;
}

// Main loop run on "Sort numbers"
var sorted;
var startTime;
var runs;

// Start storting
function initateSort(){
  stop = false;
  runs = -1;
  sorted = false;
  startTime = Date.now();
  runsort();

}

function goodSort(){
    stop = true;
    numbers.sort(function(a, b) {
        return a - b;
    });
    printNumbers();
}


// Sorting loop
async function runsort(){
    
    if(stop){
        return;
    }

  document.getElementById("status").innerHTML = " Sorting... (this can take a while...) Tried sorting " + runs + " times.";
  runs++;
  if(!sorted){
    numbers = shuffle(numbers); // Shuffle
    printNumbers(); // Print Numbers
    sorted = checkSorted(); // Check if numbers are sorted.
    await sleep(1);
    runsort();
  } else {
    // Numbers are sorted
    var now = Date.now();
    var timeMinutes = Math.round((now - startTime) / 60000);
    var timeSeconds = ((now - startTime) / 1000) - Math.round((timeMinutes * 60));
    if(timeSeconds < 0){
        timeSeconds *= -1;
    }

    document.getElementById("status").innerHTML = " Sorted! 👍 Took " + runs + " tries in " + timeMinutes.toFixed(0) + " minutes and " + timeSeconds.toFixed(1) + " seconds.";
  }
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


// Stolen from stockoverflow.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
