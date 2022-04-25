var imena=[];
var pokusaji=[];
var scoreovi=[];
var niz=[];

var igraci=[];

window.onload=function(){
  document.getElementById("tablica").innerHTML="";

  document.addEventListener("deviceready",ucitajSaServera);
  document.getElementById("btnNatrag").addEventListener("click", igrajPonovo);
  ucitajSaServera();
}

function igrajPonovo(){
  window.location="igra.html";
}

function ucitajSaServera(){
  novizahtjev = new XMLHttpRequest();
  novizahtjev.open("GET", "http://192.168.203.135:4000/ucitaj", true);
  novizahtjev.onreadystatechange=primizahtjev;
  novizahtjev.send();
}

function primizahtjev(){
  if(novizahtjev.readyState == 4 && novizahtjev.status == 200){
    var odgovor=novizahtjev.responseText;
    var objekt=odgovor.split("@");

    for(i=0;i<objekt.length;i++){
      niz=objekt[i].split(";");
      imena[i]=niz[0];
      pokusaji[i]=niz[1];
      scoreovi[i]=niz[2];
    }

    for(i=0;i<objekt.length;i++){
      igraci.push({ ime: imena[i], pokusaj: pokusaji[i], score: scoreovi[i] });
    }

    igraci.sort(function(a,b){
      var score1 = parseInt(a.score);
      var score2 = parseInt(b.score);
      var pokusaj1 = parseInt(a.pokusaj);
      var pokusaj2 = parseInt(b.pokusaj);

      if(score1 > score2) return -1;
      if(score1 < score2) return 1;
      if(pokusaj1 > pokusaj2) return -1;
      if(pokusaj1 < pokusaj2) return 1;
      return 0;
    });

    }
    document.getElementById("tablica").innerHTML="<tr><th>#</th><th>Ime</th><th>Pokušaji</th><th>Score</th></tr>";
    for(i=0;i<igraci.length-1;i++){
      document.getElementById("tablica").innerHTML+="<tr><td>"+(i+1)+".</td><td>"+igraci[i].ime+"</td><td>"+igraci[i].pokusaj+"</td><td>"+igraci[i].score+"</td></tr>";
  }
}
