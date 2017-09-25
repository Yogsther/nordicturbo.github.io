function Halloween(){
    
    // Save theme
    createCookie("Halloween", true, 10000);
    
    // Change colors
    
    // Set Text Color
    document.getElementById("home_page").style.color = "white";
    // Set background color.
    document.getElementById("background_div").style.backgroundColor = "#111111";
    // Set color of header.
    //document.getElementById("header_table").style.backgroundColor = "#FFFFFF";
    
    // Set background banner. (! un-comment the line below if you want a banner !) Make sure you have img/ before!
    document.getElementById("header_table").style.backgroundImage = "url(img/Halloween_banner.gif)";
    
    // Change to theme 
    createCookie("Theme", "Halloween", 10000);
}