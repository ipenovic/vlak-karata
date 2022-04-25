var spilIDBezAK;
var spilID=localStorage.getItem("spilID");

var niz0=[];
var niz1=[];
var niz2=[];
var niz3=[];
var niz4=[];

var nizVar=[];

var odabir=null;
var korak=0;
var score=1;
var pokusaji=0;

var ime="";




window.onload=function() {
  var mojElement = document.getElementById("aplikacija");
  var mc = new Hammer(mojElement);
  mc.get("pan").set({direction: Hammer.DIRECTION_ALL});
  mc.on("panup pandown", pomak);

  var mc2 = new Hammer.Manager(mojElement);
  mc2.add(new Hammer.Tap({event:"doubletap", taps:2}));
  mc2.on("doubletap", pomak);

  document.addEventListener("deviceready",postavi);//za mobitel
  postavi();//lokalno
}

function pomak(dog) {
  if(dog.type=="panup"){
    odabir="veca";
    izvuciDrugiSpil();
  }else if (dog.type=="pandown") {
    odabir="manja";
    izvuciDrugiSpil();
  }else if (dog.type=="doubletap") {
    odabir="jednak";
    izvuciDrugiSpil();
  }
  console.log(dog.type);
}

function postavi() {
  for(i=0;i<5;i++){
    if(i==korak){
      document.getElementById("pok"+korak).src="img/pokazivac.png";
    }else {
      document.getElementById("pok"+i).src="img/prazno.png";
    }
  }

  spilBezAK();
}







function spilBezAK(){
  if(localStorage.getItem("spilIDBezAK")===null){
    zahtjevBezAK=new XMLHttpRequest();
    zahtjevBezAK.open("GET","https://deckofcardsapi.com/api/deck/new/shuffle/?cards=2S,3S,4S,5S,6S,7S,8S,9S,0S,JS,QS,2D,3D,4D,5D,6D,7D,8D,9D,0D,JD,QD,2C,3C,4C,5C,6C,7C,8C,9C,0C,JC,QC,2H,3H,4H,5H,6H,7H,8H,9H,0H,JH,QH",true);
    zahtjevBezAK.onreadystatechange=primiBezAK;
    zahtjevBezAK.send();
  }else {
    spilIDBezAK=localStorage.getItem("spilIDBezAK");
    prvihPet();
  }
}

function primiBezAK(){
  if (zahtjevBezAK.readyState==4 && zahtjevBezAK.status==200){
    var podaci=jQuery.parseJSON(zahtjevBezAK.responseText);
    spilIDBezAK=podaci.deck_id;
    localStorage.setItem("spilIDBezAK",spilIDBezAK);
    prvihPet();
  }
}

function prvihPet(){
  if(spilIDBezAK===null){
    spilBezAK();
  }else {
    zahtjevPrvihPet=new XMLHttpRequest();
    zahtjevPrvihPet.open("GET","https://deckofcardsapi.com/api/deck/"+spilIDBezAK+"/draw/?count=5",true);
    zahtjevPrvihPet.onreadystatechange=izvuciPrvihPet;
    zahtjevPrvihPet.send();
  }
}

function izvuciPrvihPet() {
  if(zahtjevPrvihPet.readyState==4 && zahtjevPrvihPet.status==200){
    var podaci=jQuery.parseJSON(zahtjevPrvihPet.responseText);
    if(podaci.remaining<5){
      zahtjevMijesaj=new XMLHttpRequest();
      zahtjevMijesaj.open("GET","https://deckofcardsapi.com/api/deck/"+spilIDBezAK+"/shuffle/",true);
      zahtjevMijesaj.onreadystatechange=prvihPet;
      zahtjevMijesaj.send();
    }else {
      for(i=0;i<5;i++){
        var vrijednost;
        var slika=podaci.cards[i].image;
        document.getElementById("slika"+i).src=slika;
        var vrijednost = podaci.cards[i].value;
        punjenjeNizova(i, vrijednost);
      }
    }
    console.log(niz0);
    console.log(niz1);
    console.log(niz2);
    console.log(niz3);
    console.log(niz4);
  }
}








function izvuciDrugiSpil() {
  if(localStorage.getItem("spilID")===null){
    zahtjevSpil=new XMLHttpRequest();
    zahtjevSpil.open("GET","https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",true);
    zahtjevSpil.onreadystatechange=primiSpil;
    zahtjevSpil.send();
  }else {
    spilID=localStorage.getItem("spilID");
    izvuciKartu();
  }
}

function primiSpil() {
  if (zahtjevSpil.readyState==4 && zahtjevSpil.status==200){
    var podaci=jQuery.parseJSON(zahtjevSpil.responseText);
    spilID=podaci.deck_id;
    localStorage.setItem("spilID",spilID);
    izvuciKartu();
  }
}

function izvuciKartu() {
  if(spilID===null){
    izvuciDrugiSpil();
  }else {
    zahtjevKarta=new XMLHttpRequest();
    zahtjevKarta.open("GET","https://deckofcardsapi.com/api/deck/"+spilID+"/draw/?count=1",true);
    zahtjevKarta.onreadystatechange=prikaziKartu;
    zahtjevKarta.send();
  }
}

function prikaziKartu() {
  if(zahtjevKarta.readyState==4 && zahtjevKarta.status==200){
    var podaci=jQuery.parseJSON(zahtjevKarta.responseText);
    if(podaci.remaining<1){
      zahtjevMijesaj=new XMLHttpRequest();
      zahtjevMijesaj.open("GET","https://deckofcardsapi.com/api/deck/"+spilID+"/shuffle/",true);
      zahtjevMijesaj.onreadystatechange=izvuciKartu;
      zahtjevMijesaj.send();
    }else {
      var slika=podaci.cards[0].image;
      document.getElementById("slika"+korak).src=slika;
      pokusaji++;
      var vrijednost=podaci.cards[0].value;
      punjenjeNizova(korak,vrijednost);
      odgovarajuciNiz(korak);
      var provjera=ManjeVeće(nizVar);
      if(provjera==odabir){
        document.getElementById("pok"+korak).src="img/prazno.png";
        korak++;
        if(korak<5){
          document.getElementById("pok"+korak).src="img/pokazivac.png";
        }
        console.log("Bravo, pogodak");
        if(korak==5){
          console.log("Gotovo! Uspio si iz "+score+". puta!");
          console.log("Broj pokusaja: "+pokusaji);
          localStorage.setItem("pokusaji",pokusaji);
          localStorage.setItem("score",score);
          //posaljiNaServer();
          window.location="rezultat.html";
        }
      }else {
        alert("Pogrešno, idemo iz početka!");
        score++;
        document.getElementById("pok"+korak).src="img/prazno.png";
        korak=0;
        document.getElementById("pok"+korak).src="img/pokazivac.png";
        console.log("Ispočetka");
      }
      console.log(nizVar);
    }
  }
}








function ManjeVeće(nizVar) {
  var duljina=nizVar.length;
  var zadnji=nizVar[duljina-1];
  var predzadnji=nizVar[duljina-2];
  var mvj;
  if(zadnji>predzadnji){
    mvj="veca";
  }else if (zadnji<predzadnji) {
    mvj="manja";
  } else {
    mvj="jednak";
  }
  return mvj;
}

function odgovarajuciNiz(korak){
  switch (korak) {
    case 0:
      nizVar=niz0;
      break;
    case 1:
      nizVar=niz1;
      break;
    case 2:
      nizVar=niz2;
      break;
    case 3:
      nizVar=niz3;
      break;
    case 4:
      nizVar=niz4;
      break;
    default:
      break;
  }
}

function promijenaVrijednosti(vrijednost){
  var broj;
  if(vrijednost=="KING") {
    broj=13;
  }
  else if (vrijednost=="QUEEN") {
    broj=12;
  }
  else if (vrijednost=="JACK") {
    broj=11;
  }
  else if (vrijednost=="ACE") {
    broj=1;
  }
  else {
    broj=parseInt(vrijednost);
  }
  return broj;
}

function punjenjeNizova(i, broj) {
  broj=promijenaVrijednosti(broj);
  switch (i) {
    case 0:
      niz0.push(broj);
      break;
    case 1:
      niz1.push(broj);
      break;
    case 2:
      niz2.push(broj);
      break;
    case 3:
      niz3.push(broj);
      break;
    case 4:
      niz4.push(broj);
      break;
    default:
      break;
  }
}
