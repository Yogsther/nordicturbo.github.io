function THEMENAME(){
    
    // Save theme
    createCookie("THEME-NAME", true, 10000);
    
    // Change colors
    
    // Set Text Color
    document.getElementById("home_page").style.color = "white";
    // Set background color.
    document.getElementById("background_div").style.backgroundColor = "#000000";
    // Set color of header.
    document.getElementById("header_table").style.backgroundColor = "#FFFFFF";
    
    // Set background banner. (! un-comment the line below if you want a banner !) Make sure you have img/ before!
    // document.getElementById("header_table").style.backgroundImage = "url(img/banner_THEME-NAME.gif)";
    
    // Change to theme 
    createCookie("Theme", "THEME-NAME", 10000);
}