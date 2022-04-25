var pokusaji;
var score;
var ime="";

window.onload=function(){
  pokusaji=localStorage.getItem("pokusaji");
  score=localStorage.getItem("score");
  document.getElementById("poruka2").innerHTML="";
  document.getElementById("poruka").innerHTML="Bravo, došao si do kraja!<br>Imao si ukupno "+pokusaji+" pokusaja.<br> Iz vlaka si izašao iz "+score+". puta!<br><br><br>Unesi ime za objavu rezultata";

  document.addEventListener("deviceready",postavi);
  postavi();
}

function postavi() {
  document.getElementById("btnPotvrdi").addEventListener("click", posaljiNaServer);
  document.getElementById("btnNatrag").addEventListener("click", igrajPonovo);
}

function igrajPonovo() {
  window.location="igra.html";
}


function posaljiNaServer() {
  ime=document.getElementById("unosIme").value;
  if(ime==""){
    document.getElementById("poruka2").innerHTML="Ime ne smije biti prazno!";
  }else {
    document.getElementById("poruka2").innerHTML="";
    zahtjevSlanje=new XMLHttpRequest();
    zahtjevSlanje.open("PUT","http://192.168.203.135:4000/spremi?ime="+ime+"&pokusaji="+pokusaji+"&score="+score,true);
    zahtjevSlanje.onreadystatechange=primiZahtjevSlanje;
    zahtjevSlanje.send();
  }
}

function primiZahtjevSlanje(){
  if(zahtjevSlanje.readyState==4 && zahtjevSlanje.status==200){
    window.location="tablica.html";
  }
  else{
	  document.getElementById("poruka2").innerHTML="Server ne radi! Molim pokušajte kasnije.";
  }
}

function nemrdaj() {
  ;
}
