function Superbright(){
    
    // Save theme
    createCookie("Superbright", true, 10000);
    
    // Change colors
    
    // Set Text Color
    document.getElementById("home_page").style.color = "black";
    // Set background color.
    document.getElementById("background_div").style.backgroundColor = "#f7f7f7";
    // Set color of header.
    document.getElementById("header_table").style.backgroundColor = "#dadada";
    
    // Set background banner. (! un-comment the line below if you want a banner !) Make sure you have img/ before!
    // document.getElementById("header_table").style.backgroundImage = "url(img/banner_THEME-NAME.gif)";
    
    // Change to theme 
    createCookie("Theme", "Superbright", 10000);
}