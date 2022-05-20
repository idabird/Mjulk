"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.style = "border:0px solid #7f5539;";
document.body.style.overflow = "hidden";

canvas.height = window.innerHeight * 0.97;
canvas.width = window.innerWidth * 0.98;

ctx.fillStyle = "grey"; // Ger canvasen en bakgrundsfärg.
ctx.fillRect(0, 0, canvas.width, canvas.height); // Fyller canvasen med denna färg.

// Nedanför står koden som hämtar och laddar in bilden. Jag har även lagt till kod
// som ser till att bilden är laddad innan den visas.
let img = new Image();
img.addEventListener("load", onLoad);
img.src = "bowlreal.png";
let loaded = false;

// Arrayen nedan förvarar de olika flingornas koordniater.
let cereal = [
  {
    cx: -195,
    cy: 10,
    ex: -300,
    ey: -85,
  },
  {
    cx: -150,
    cy: -3,
    ex: -240,
    ey: -75,
  },
  {
    cx: -210,
    cy: 25,
    ex: -280,
    ey: -55,
  },
  {
    cx: -160,
    cy: 15,
    ex: -25,
    ey: -65,
  },
  {
    cx: -180,
    cy: -25,
    ex: -230,
    ey: -85,
  },
  {
    cx: -95,
    cy: 45,
    ex: -20,
    ey: -35,
  },
  {
    cx: -100,
    cy: -30,
    ex: -30,
    ey: -110,
  },
  {
    cx: 190,
    cy: 30,
    ex: 150,
    ey: -35,
  },
  {
    cx: 270,
    cy: 1,
    ex: 180,
    ey: -85,
  },
  {
    cx: 180,
    cy: -2,
    ex: 200,
    ey: -50,
  },
  {
    cx: 55,
    cy: 17,
    ex: -100,
    ey: -75,
  },
  {
    cx: 20,
    cy: 55,
    ex: -20,
    ey: -30,
  },
  {
    cx: 90,
    cy: 15,
    ex: 60,
    ey: -65,
  },
  {
    cx: 90,
    cy: 30,
    ex: 10,
    ey: -65,
  },

  {
    cx: 75,
    cy: -30,
    ex: -10,
    ey: -100,
  },
  {
    cx: -140,
    cy: -25,
    ex: -20,
    ey: -100,
  },
  {
    cx: -100,
    cy: 8,
    ex: 10,
    ey: -65,
  },
  {
    cx: -105,
    cy: 5,
    ex: 20,
    ey: -95,
  },
  {
    cx: -30,
    cy: 10,
    ex: 30,
    ey: -65,
  },
  {
    cx: -40,
    cy: 45,
    ex: 10,
    ey: -45,
  },
  {
    cx: -20,
    cy: -20,
    ex: 60,
    ey: -75,
  },
  {
    cx: 45,
    cy: 35,
    ex: 90,
    ey: -65,
  },
  {
    cx: 60,
    cy: -20,
    ex: 80,
    ey: -75,
  },
  {
    cx: 215,
    cy: 5,
    ex: 140,
    ey: -65,
  },
];

// Array med skedens koordinater
let spoon = [
  {
    sp1x: 485,
    sp1y: 68,
    ep1x: 515,
    ep1y: 68,
    sp2x: 587,
    sp2y: -157,
    ep2x: 610,
    ep2y: -143,
    sp3x: 586,
    sp3y: -156,
    cp1x: 593.75,
    cp1y: -160,
    cp2x: 607.5,
    cp2y: -162,
    ep3x: 613,
    ep3y: -143,
    ep4x: 612.5,
    ep4y: -143,
    ep5x: 587,
    ep5y: -156,
  },
];

// Funktionen nedan hittar vinkeln i den ellipse som varje enskild flinga senare
// ska åka runt i. Varje flinga har en egen ellipsebana och flingornas olika
// ellipsar är olika stora. Därför räknar denna flinga även ut radien för
// både höjden och bredden för varje flingas personliga ellipse. Till sist
// sätter denna funktion värdet på koordinaterna till bezierkurvan som används
// senare när flingorna ska ritas ut.
function findABAndAngle() {
  for (let i = 0; i < cereal.length; i++) {
    cereal[i].angle = Math.atan2(30 * cereal[i].cx, 220 * cereal[i].cy);
    cereal[i].vradius = cereal[i].cy / Math.cos(cereal[i].angle);
    cereal[i].hradius = (220 / 30) * cereal[i].vradius;
    cereal[i].spx = cereal[i].cx - 15;
    cereal[i].spy = cereal[i].cy;
    cereal[i].cp1x = cereal[i].cx - 7.5;
    cereal[i].cp1y = cereal[i].cy + 5;
    cereal[i].cp2x = cereal[i].cx + 7.5;
    cereal[i].cp2y = cereal[i].cy + 5;
    cereal[i].epx = cereal[i].cx + 15;
    cereal[i].epy = cereal[i].cy;
  }
}

findABAndAngle();

// Här är funktionen som kollar om bilden är färdigladdad innan den hämtas och
// visas.
function onLoad() {
  img.removeEventListener("load", onLoad);
  loaded = true;
}

// En eventlyssnare som lyssnar efter om start- och stoppknappen har klickats,
// isåfall kallar den på funktionen "startGame".
document.getElementById("startStop").addEventListener("mousedown", startGame);
document.getElementById("c-button").style.display = "none"; // Gör "stir" knappen
// osynlig.

// Här deklareras variabler för bildens koordinater. Sedan skapas en
// boolean som sätter "imageShowing" till false och till sist sätts
// storleken på själva bilden.
let bowlX;
let bowlY;
let imageShowing = false;
let gameStarted = false;
img.width = 600;
img.height = 300; // Antal pixlar istället för en procentsats för att göra utritandet av mjölken
// och flingorna enklare.

// Här är själva funktionen som startar och stoppar spelet. Den ändrar texten på knappen
// beroende på om spelet redan är startat eller inte. Sedan visas en knapp med texten
// "hold spacebar to stir". Därefter bestämmer den bildens koordinater.
// Beroende på om spelet redan är igång eller inte så ritar den antingen ut bilden så att
// den visas genom funktionen "showBowl" eller om spelet ska stoppas så tömmer den canvasen
// och fyller den sedan med den gråa bakgrundsfärgen. Sedan sätts gameStarted och WillStir till
// true och därefter kallar den på funktionen som hittar flingornas koordinater samt de funktioner
// som ritar ut flingorna, mjölken och skeden.
function startGame() {
  if (loaded && !imageShowing) {
    document.getElementById("startStopLabel").innerText = "STOP";
    bowlX = canvas.width / 2 - img.width / 2;
    bowlY = canvas.height / 1.8 - img.height / 2; // dividerat med 1.8 för att skålen ska hamna
    // lite lägre ner än precis i mitten.
    document.getElementById("c-button").style.display = "unset";
    showBowl(bowlX, bowlY, img.width, img.height);
    gameStarted = true;
    willStir = true;
    findABAndAngle();
    changeMilkColor(0);
    moveCerealandSpoon(0);
    willStir = false;
  } else {
    document.getElementById("c-button").style.display = "none";
    document.getElementById("startStopLabel").innerText = "START";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  imageShowing = !imageShowing;
}

// Funktionen som ritar ut bilden.
function showBowl(x, y, w, h) {
  ctx.drawImage(img, x, y, w, h);
}

// Variabler som sätter mjölkens färg.
let r;
let g;
let b;

let rstart = 255;
let gstart = 255;
let bstart = 255;
let rend = 164;
let gend = 124;
let bend = 91;

let willStir = false;

// En anonym funktion som kollar om mellanslag är nedtryckt, om den är det
// så ändras willStirs värde till true.
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    willStir = true;
  }
});

// En anonym funktion som kollar om mellanslag inte är nedtryckt, om den är det
// så ändras willStirs värde till false.
document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    willStir = false;
  }
});
let fade = 1;

// Funktion nedan ändrar mjölkens färg över tid när man snurrar
// runt flingorna. Detta görs genom att variabeln "fade" blir
// mindre och mindre. Fade multipliceras sedan med de olika
// startvariablerna för r, g och b och sedan adderas slutvariablerna
// för r,g, och b och även 1-fade. Resultatet av detta är att mjölken sakta
// ändras från starvariablernas färg, vilket är vit, till slutvariablernas
// färg, vilket är brunt.
function changeMilkColor() {
  let cp1x = canvas.width / 2 - img.width / 2 + 167;
  let cp1y = canvas.height / 1.8 - img.height / 2 + 18;
  let cp2x = canvas.width / 2 - img.width / 2 + 432;
  let cp2y = canvas.height / 1.8 - img.height / 2 + 18;
  let x = canvas.width / 2 - img.width / 2 + 565;
  let y = canvas.height / 1.8 - img.height / 2 + 82.5;

  if (willStir && fade > 0) {
    fade -= 0.0009;
  }
  r = rstart * fade + rend + (1 - fade);
  g = gstart * fade + gend + (1 - fade);
  b = bstart * fade + bend + (1 - fade);
  let rgb = "rgb(" + r + "," + g + "," + b + ")";

  if (willStir && gameStarted) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    showBowl(bowlX, bowlY, img.width, img.height);
    ctx.beginPath();
    ctx.moveTo(
      canvas.width / 2 - img.width / 2 + 35,
      canvas.height / 1.8 - img.height / 2 + 82.5
    );
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    ctx.strokeStyle = rgb;
    ctx.fillStyle = rgb;
    ctx.fill();
    ctx.stroke();

    let newcp1x = canvas.width / 2 - img.width / 2 + 167;
    let newcp1y = canvas.height / 1.8 - img.height / 2 + 142;
    let newcp2x = canvas.width / 2 - img.width / 2 + 432;
    let newcp2y = canvas.height / 1.8 - img.height / 2 + 142;
    let newx = canvas.width / 2 - img.width / 2 + 565;
    let newy = canvas.height / 1.8 - img.height / 2 + 84;
    ctx.beginPath();
    ctx.moveTo(
      canvas.width / 2 - img.width / 2 + 35,
      canvas.height / 1.8 - img.height / 2 + 84
    );
    ctx.bezierCurveTo(newcp1x, newcp1y, newcp2x, newcp2y, newx, newy);
    ctx.strokeStyle = rgb;
    ctx.fillStyle = rgb;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(
      canvas.width / 2 - img.width / 2 + 35,
      canvas.height / 1.8 - img.height / 2 + 82.5
    );
    ctx.lineTo(
      canvas.width / 2 - img.width / 2 + 565,
      canvas.height / 1.8 - img.height / 2 + 82.5
    );
    ctx.strokeStyle = rgb;
    ctx.lineWidth = 5.5;
    ctx.stroke();
  }
}

// Funktionen nedan loopar sig igenom flingornas koordinater och jämför
// de med skedens koordinater. Om flingornas koordingater är högre upp
// än skedens lägsta punkt ska de ritas ut bakom skeden. Så efter att
// funktionen kollat vilka flingor som uppfyller kraven för att hamna
// bakom skeden, kallar den på funktionen som ritar ut de övre/bakre flingorna.
// Sedan kallar den på funktionen som ritar ut skeden och därefter loopar
// den sig igenom alla flingor igen och kollar vilka flingor som är under
// skedens lägsta punkt. Sedan kallar den på funktionen som ritar ut
// de undre/främre flingorna.
function moveCerealandSpoon(t) {
  if (willStir && gameStarted) {
    for (let i = 0; i < cereal.length; i++) {
      if (cereal[i].cy + 15 <= spoon[0].ep1y) {
        drawMovingCereal(i, t);
      }
    }
    drawMovingSpoon(t);

    for (let i = 0; i < cereal.length; i++) {
      if (cereal[i].cy + 15 >= spoon[0].ep1y) {
        drawMovingCereal(i, t);
      }
    }
  }
}

// Funktionen nedan ritar ut skeden som ska snurra runt. Detta sker
// genom att skedens koordinater följer en ellipsebana anpassad efter
// mjökskålens storlek och skeden rör sig runt denna bana.
function drawMovingSpoon(t) {
  t += 2000;
  for (let i = 0; i < cereal.length; i++) {
    let coordsx = canvas.width / 2 - img.width / 2;
    let coordsy = canvas.height / 1.8 - img.height / 2 + 20;
    let x = 210 * Math.sin(t / 1300) + coordsx - 205;
    let y = 25 * Math.cos(t / 1300) + coordsy - 10;

    if (willStir && gameStarted) {
      ctx.beginPath();
      ctx.moveTo(x + spoon[0].sp1x, y + spoon[0].sp1y);
      ctx.lineTo(x + spoon[0].ep1x, y + spoon[0].ep1y);
      ctx.lineTo(x + spoon[0].ep4x, y + spoon[0].ep4y);
      ctx.lineTo(x + spoon[0].ep5x, y + spoon[0].ep5y);
      ctx.lineTo(x + spoon[0].sp1x, y + spoon[0].sp1y);
      ctx.strokeStyle = "#C0C0C0";
      ctx.fillStyle = "#C0C0C0";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x + spoon[0].sp3x, y + spoon[0].sp3y);
      ctx.bezierCurveTo(
        x + spoon[0].cp1x,
        y + spoon[0].cp1y,
        x + spoon[0].cp2x,
        y + spoon[0].cp2y,
        x + spoon[0].ep3x,
        y + spoon[0].ep3y
      );
      ctx.strokeStyle = "#C0C0C0";
      ctx.fillStyle = "#C0C0C0";
      ctx.fill();
      ctx.stroke();
    }
  }
}

// Funktionen nedan får flingorna att snurra runt i skålen.
// Detta sker på samma sätt som i funktionen ovanför.
// Flingornas koordinater följer en ellipsebana och varje
// enskild flinga rör sig längs denna bana. Skillnaden med denna
// funktion i jämförelse med den som rör runt skeden är att flingorna
// är itne bara en utan flera och varje flinga har därför en egen, unik
// storlek på sin ellipsebana.
function drawMovingCereal(i, t) {
  let coordsx = canvas.width / 2 - cereal[i].ex; // Tidigare var - img.width / 2 med,
  // men då blev det jättekonstig centrering för när flingorna rörde sig.
  let coordsy = canvas.height / 1.8 - img.height / 2 - cereal[i].ey;
  let x =
    (cereal[i].hradius / 2) * Math.sin(t / 1200 + cereal[i].angle) + coordsx; // Dividera hradius med 2 då radien blev alldeles för bred
  let y =
    (cereal[i].vradius / 2) * Math.cos(t / 1200 + cereal[i].angle) + coordsy; // Dividera vradius med 2 då radien blev alldeles för hög

  ctx.beginPath();
  ctx.arc(x + cereal[i].cx, y + cereal[i].cy, 15, Math.PI, Math.PI * 2);
  ctx.fillStyle = "#7f5539";
  ctx.strokeStyle = "#7f5539";
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + cereal[i].spx, y + cereal[i].spy);
  ctx.bezierCurveTo(
    x + cereal[i].cp1x,
    y + cereal[i].cp1y,
    x + cereal[i].cp2x,
    y + cereal[i].cp2y,
    x + cereal[i].epx,
    y + cereal[i].epy
  );

  ctx.fillStyle = "#7f5539";
  ctx.strokeStyle = "#7f5539";
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + cereal[i].spx, y + cereal[i].spy);
  ctx.lineTo(x + cereal[i].epx, y + cereal[i].epy);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#7f5539";
  ctx.stroke();
}

let tReal = 0;
let tStart = 0;

// Main-funktionen.
function main(t) {
  let tLoop = t - tStart;
  tStart = t;
  if (willStir) {
    tReal += tLoop; // Dessa ser till så att tiden inte går under tiden då man inte håller
    // ned mellanslag.
  }

  changeMilkColor();

  moveCerealandSpoon(tReal);
  requestAnimationFrame(main);
}

main();
