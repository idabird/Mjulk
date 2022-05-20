"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.style = "border:1px solid #0F0000;";

canvas.width = 1000;
canvas.height = 1000;
ctx.fillStyle = "grey"; // Ger canvasen en bakgrundsfärg.
ctx.fillRect(0, 0, canvas.width, canvas.height); // Fyller canvasen med denna färg.

// (?) Nedanför står koden som hämtar och laddar in bilden. Jag har även lagt till kod
// som ser till att bilden är laddad innan den visas.
let img = new Image();
img.addEventListener("load", onLoad);
img.src = "bowlreal.png";
let loaded = false;

// (?) Här är funktionen som kollar om bilden är färdigladdad innan den hämtas och
// visas.
function onLoad() {
  img.removeEventListener("load", onLoad);
  loaded = true;
}

// En eventlyssnare som lyssnar efter om start- och stoppknappen har klickats,
// isåfall kallar den på funktionen "startGame".
document.getElementById("startStop").addEventListener("click", startGame);

// Här deklarerar jag variabler för bildens koordinater samt skapar en
// boolean som sätter "imageShowing" till false.
let bowlX;
let bowlY;
let imageShowing = false;

// Här är själva funktionen som startar och stoppar spelet. Den ändrar texten på knappen
// beroende på om spelet redan är startat eller inte. Sedan bestämmer den bildens koordinater.
// Beroende på om spelet redan är igång eller inte så ritar den antingen ut bilden så att
// den visas genom funktionen "showBowl" eller om spelet ska stoppas så tömmer den canvasen
// och fyller den sedan med den gråa bakgrundsfärgen.
function startGame() {
  if (loaded && !imageShowing) {
    document.getElementById("startStop").innerText = "Stop";
    bowlX = canvas.width / 2 - img.width / 8; // Gissade mig fram tills de blev centrerade, verkar funka oavsett storlek på canvas.
    bowlY = canvas.height / 2 - img.height / 4; // Gissade mig fram tills de blev centrerade, verkar funka oavsett storlek på canvas.
    showBowl(bowlX, bowlY);
  } else {
    document.getElementById("startStop").innerText = "Start";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  imageShowing = !imageShowing; // (?) Hur funkar denna?
}

function showBowl(x, y) {
  //ctx.clearRect(0, 0, canvas.width, canvas.height); // Tog bort denna kod eftersom den gjorde att bakgrundsfärgen försvann :D
  ctx.drawImage(img, x - 50, y - 50, 300, 300);
}
