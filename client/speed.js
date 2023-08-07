// index.js

var SUCCESS_SPEED = 2;  // 30 seuil ouverture dom1

var SPEED_BOTTOM = CLAVIER_BOTTOM + CLAVIER_HEIGHT + 1; //"12rem";
var PAUSE_TIME = 1;  // temps de pause -> ready
var NSEC_PAUSE_TIME = 4; // période des moyennes
var MIN_INTERVAL = 50;

var nbChar = 0;

var time0; // time0 = heure deb
var timeLast;  // timeLast = heure dernière essai
var time, motsMinute, minutes; // time = heure actuelle
var intervPauseTime, intervNsec;
var nbCharDebNsec, nbCharSec, nbWordMin, maxNbWordMin, theMean;

// ***************************************************  F U N C T I O N S

// touchstart
function handleStart(event) {
event.preventDefault();
}

// touchend
function handleMove(event) {
event.preventDefault();
}

                                          // touchend
function handleEnd(event) {
  event.preventDefault();
  if (event.targetTouches.length > 0) return;

  clearTimeout(intervPauseTime);
  intervPauseTime = setTimeout( function () {  // pause > PAUSE_TIME *****
    clearInterval(intervNsec); // stop nSecDisplay
    nbChar = 0;
    time0 = new Date().getTime();
    timeLast = time0;
    $("#ready h1").text("Ready");
    if ( maxNbWordMin ) updateUserData(); // ouvrir niveau suivant
  }, PAUSE_TIME * 1000);

  if (nbChar === 0) {
    intervNsec = setInterval( function () {   // cal. moyenne nSec *******
      nbCharSec = (nbChar - nbCharDebNsec) / NSEC_PAUSE_TIME;
      nbWordMin = nbCharSec * 60 / CHAR_BY_WORD;
      if (maxNbWordMin < nbWordMin) maxNbWordMin = nbWordMin;
  //    if (nbWordMin > 0) $("#nsec-speed-mean span").text(Math.round(nbWordMin));
      if (maxNbWordMin > 0) $("#nsec-speed-max span").text(Math.round(maxNbWordMin));
      nbCharDebNsec = nbChar;
      // updateUserData(); // ouvrir niveau suivant
    }, NSEC_PAUSE_TIME * 1000);

    $("#speed-mean span").text("----");
    $("#ready h1").text(""); // Go!
    $("#nsec-speed-mean span").text("----");
    $("#nsec-speed-max span").text("----");
    time0 = new Date().getTime();
    timeLast = time0;
    maxNbWordMin = 0;
    nbChar = nbCharDebNsec = 1;
    return;
  }

//  for ( var i = 0; i < event.changedTouches.length; i++ ) { // inutile (même timestamp)
    time = new Date().getTime();
    if (time - timeLast < MIN_INTERVAL) return; // filtre simultap

    if (nbChar > 0) {
      minutes = (time - time0) * 0.001 / 60;
      motsMinute = nbChar / CHAR_BY_WORD / minutes;

      theMean = Math.round(motsMinute);
      $("#speed-mean span").text(theMean);
      if ( theMean > maxNbWordMin ) {
        maxNbWordMin = theMean;
        $("#nsec-speed-max span").text(Math.round(maxNbWordMin));
      }

      timeLast = time;
    }
    nbChar++;
//  }
  initPauseHome(); // init retour maison
}
                                            // fin touchend


//--------------------------------------------- updateUserData
function updateUserData () {
  // mise à jour localStorage, alert fin de cycle

    var moy = Math.round(maxNbWordMin);

    var userData = JSON.parse(localStorage.drumy);
    var score = userData.score[sessionStorage.levelId];

    var oldMoyText = '';
    var newMoy, secMoy;
    var bestMoy;

      if ( !score.moyCycle ) score.moyCycle = 0.0001;
      if ( score.moyCycle == 0.0001 ) newMoy = true;
      else newMoy = false;

      if ( moy >= score.moyCycle ) bestMoy = moy;
      else bestMoy = score.moyCycle;

      secMoy = moy;

      var secOld = score.moyCycle ;

  //.................................................................

      // niv suivant PAS déjà ouvert ET moy SUFFISANTE
      if ( userLevelState() != 'success' &&  moy >= SUCCESS_SPEED ) {
        modalAlert('Next level is now open', 'Great!');
        sessionStorage.flagOpenNextLevel = 'ok';
        score.moyCycle = bestMoy; // update best moyenne

        userData.score[sessionStorage.levelId] = score;
        localStorage.drumy = JSON.stringify(userData);

                setTimeout( function () {
                  $("#back-home2").click();
                }, 2500);


        return;
      }

      // niv suivant PAS déjà ouvert ET moy PAS SUFFISANTE
      if ( userLevelState() != 'success' ) {
        if ( !newMoy ) {
          oldMoyText = ' (Best mean = ' + secOld + 'sec.)';
          modalAlert(secMoy + 'wpm ' + oldMoyText, 'You Means');
        }
        else modalAlert(secMoy + 'wpm ',  'You Mean');
        score.moyCycle = bestMoy; // update best moyenne

        userData.score[sessionStorage.levelId] = score;
        localStorage.drumy = JSON.stringify(userData);
        return;
      }

      // niv suivant délà ouvert ET nouvelle best moyenne
      if ( userLevelState() == 'success' && moy >= score.moyCycle ) {
        if ( !newMoy ) {
          oldMoyText = ' (Best mean = ' + secOld + ')';
          modalAlert('Old = ' + secOld + 'wpm  New = '  + secMoy + 'wpm ', 'Best Mean!');
        }
        score.moyCycle = bestMoy; // update best moyenne

        userData.score[sessionStorage.levelId] = score;
        localStorage.drumy = JSON.stringify(userData);
        return;
      }

      // niv suivant délà ouvert ET PAS nouvelle best moyenne
      else {
        if ( !newMoy ) oldMoyText = ' (Best mean = ' + secOld + ')';
        modalAlert(secMoy + 'wpm ' + oldMoyText, 'You Means');
        score.moyCycle = bestMoy; // update best moyenne

        userData.score[sessionStorage.levelId] = score;
        localStorage.drumy = JSON.stringify(userData);
        return;
      }
}

// -----------------------------------------------------  fin fonctions

// *************************************************************
// *************************************************************
// *************************************************************
// ----------------------------------------------  R E A D Y
$(document).ready(function () {

  $("body").on("touchmove", function (event) {
    event.stopPropagation();
    event.preventDefault();
    return false;
  });

  $("#clavier").get(0).addEventListener("touchstart", handleStart, false);
  $("#clavier").get(0).addEventListener("touchmove", handleMove, false);
  $("#clavier").get(0).addEventListener("touchend", handleEnd, false);

  $("#clavier").css({
                "position":"fixed",
                "width": CLAVIER_WIDTH + "rem",
                "height": CLAVIER_HEIGHT + "rem",
                "bottom": CLAVIER_BOTTOM + "rem"
//                "border": "1px solid black"
  }).addClass("background-clavier");
  var clavWidth = $("#clavier").width();
  $("#clavier").css({"left": (window.innerWidth - clavWidth) /2 });
// -------
  $("#ready").css({
                "display": "inline-block",
                "position":"fixed",
                "bottom": "5rem",
                "pointer-events": "none"
  }).addClass("dru-center");
  $("#ready h1").css({"color": "white"}).text("Ready");
  var readyWidth = $("#ready").width();
  $("#ready").css({"left": (window.innerWidth - readyWidth) /2 });
// ------
  $("#speed-mean, #nsec-speed-max, #nsec-speed-mean").css({
                "display": "inline-block",
                "width": "3rem",
                "height": "2rem"
  });
//
$("#nsec-speed-mean").css({"display": "none"}); // suppression dernière moyenne
//

  //$("#speedLabel").css({""})
  $("#max, #mean").css({"position": "relative"});
  $("#max").css({"left": "0.3rem"});
  $("#mean").css({"left": "-0.3rem"});

  $("#speed span").css({
                "display": "inline-block",
                "position": "relative",
                "top" :"0.3rem"
  });
  $("#speed").css({
                "position":"fixed",
                "bottom": SPEED_BOTTOM + "rem"
  }).addClass("dru-center");
  var speedWidth = $("#speed").width();
  $("#speed").css({"left": (window.innerWidth - speedWidth) /2 });


keyboardReady = true;


//---------------  test

$("#dru-test1").on("touchstart", function () {
  NSEC_PAUSE_TIME = 1; $("#sec").text("=" + NSEC_PAUSE_TIME);
});
$("#dru-test2").on("touchstart", function () {
  NSEC_PAUSE_TIME = 2; $("#sec").text("=" + NSEC_PAUSE_TIME);
});
$("#dru-test3").on("touchstart", function () {
  NSEC_PAUSE_TIME = 3; $("#sec").text("=" + NSEC_PAUSE_TIME);
});
$("#dru-test4").on("touchstart", function () {
  NSEC_PAUSE_TIME = 4; $("#sec").text("=" + NSEC_PAUSE_TIME);
});



}); // ------------------------------------------------------  fin ready
