function git(){
    window.location.href = "git.html";
}
function home(){
    window.location.href = "index.html"
}







 // Ajax function to replace url
function processAjaxData(response, urlPath){
     document.getElementById("content").innerHTML = response.html;
     document.title = response.pageTitle;
     window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
 }