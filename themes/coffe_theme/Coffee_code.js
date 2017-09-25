function Coffee(){
    
    // Save theme
    createCookie("Coffe", true, 10000);
    
    // Change colors
    // Set Text Color
    document.getElementById("home_page").style.color = "white";
    // Set background color.
    document.getElementById("background_div").style.backgroundColor = "#5b3017";
    
    document.getElementById("header_table").style.backgroundImage = "url(img/coffee_banner.png)";
    
    // Change to theme 
    createCookie("Theme", "Coffe", 10000);
}