window.onload=function(){

  document.addEventListener("deviceready",postavi);
  postavi();
}

function postavi() {
  document.getElementById("btnStart").addEventListener("click", pokreniIgru);
}

function pokreniIgru() {
  window.location="igra.html";
}
