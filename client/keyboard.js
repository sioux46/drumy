// keyboard.js

var TOUCH_END_MIN_INTERVAL = 350; // intervalle de rejet du relevé
var FORGET_SLIDE_KEY = 1000;  // intervalle d'oubli du slide une fois sur la key 2

var SUCCESS_SUC_TAP = 600000; // 4000 seuil ouverture sig, memory etc.
var SPEECH_TIMEOUT = 4000;  // seuil affichage mot pour dictation
var GREEN_WORD_TIME = 1000; // durée affichage mot vert

var SIMUL_MAX_TIME = 250; // 250 seuil validation simultap
var flagSimul = false;  // false si slide ou appui hors délai
var simulLocked = false; // bonne config au bout de SIMUL_MAX_TIME
var simulTimeout = 0; // abandon du simultap. si = 0, pas en cours
var simulUpTimeout; // abandon du simultap pour relevé d'un doigt
var firstTouchFlag = true; // vrai si clavier vide avant touches actuels

var keyboardType; // 'si', 'su',
var levelName;  // 'sign1' etc.
var levelType; // 'sign'
var levelId; // exemple: 'dom1-r'
var handName; // 'left' ou 'right'
var levelData = []; // memo des données pendant un cycle
var trialStartTime;  // presentation stimulus
var trialStartTimeTouch; // premier toucher
var flagOneDigit;  // true si glissé

var speechUtterance; // speakText(text)
var dejaNoSpeech = false; // flag message erreur pas de synthèse
var speechTimeout; // affichage différé mot
var finCycleTimeout; // attente mot vert avant affichage dialog fin de cycle
var speechVoices;
var speechInterval;
var flagInitSpeak = true;
var flagSpeakSign = true;

var keyboardReady = false;

var maxCycleSigns;  // nombre max de chars à présenter dans un cycle
var okPrevTrial; // flag char précédent dans mot ok ou pas
var wordList = [];  // tableau des mots pour le cycle courant
var wordIndex = 0; // index pour l'acces à la liste de mots
var charWordIndex = 0; // index du char courant dans le mot courant
var newWord = true; // flag changement de mot
var newWordToBase = true; // flag nouveau mot pour database
var indexList = []; // tableau des index à écrire dans trialIndex ( = indexList[trialNumberDone])
var trialIndex = 0;  // index pour l'acces aux successitapConfigs
// comptage à l'intérieur d'un cycle de NB_SIGNS tous vus
var trialNumberDone = 0; // compte les essais succes jusqu'a NB_SIGNS
var trialNumber = 0; // compte les essais succes et erreur ( >= NB_SIGNS )

var greenWordTimeout; // affichage mot vert


var clavWidth;
var keys = []; // état du clavier (keys.ident: identifier, keys.touch: 0 = absent, 1 = présent)
var enterKeys = []; // memo de l'ordre des identifiers (garde tout)
var enterKeysTrans = []; // identifiers mis à jour (garde PAS tout)
var waitingKeys = []; // memo du contenu des frappes dans l'ordre des relevés (touchend)
var slideOrg = {}; // key et ident à l'origine du dernier slide;
var firstSlideOrg = {}; // origine du dernier touchstart

var goodKeys = [];   // réponse
var transitRep = []; // réponse instantanée
var goodConfig = []; // chalenge successitap
var goodConfigSim = []; // chalenge simultap
var cycleType; // cycleType de départ
var tempoSlide = 0;  // tempo oubli slide
var repVal = false;  // valeur de la reponse courante

//var firstTouchTime, lastTouchTime; // encadrement fenêtre simultap

// init waitingCycles défini dans utilLevel.js
//if ( !sessionStorage.waitingCycles ) waitingCycles = [];
//else waitingCycles = JSON.parse(sessionStorage.waitingCycles);



// ************************************************************************
// ************************************************************************
// ***************************************************  F U N C T I O N S

// --------------------------------------------------
function initKeys () {
  var marge = 2; // compense le cadrillage blanc
  for (var i = 0; i < 6; i++) {
    keys[i] = {};
    keys[i].x1 = $("#key-" + i).offset().left - marge;
    keys[i].y1 = $("#key-" + i).offset().top - marge;
    keys[i].x2 = keys[i].x1 + $("#key-" + i).width() + marge + marge;
    keys[i].y2 = keys[i].y1 + $("#key-" + i).height()+ marge + marge;

    keys[i].touch = 0; // 0 = touche libre, 1 = touche occupée
    keys[i].ident = -1; // touche.identifier
  //  keys[i].time = -1;
  }

}
// -------------------------------------------------
function showKeys () {  // debug
  for (i=0; i<6; i++) {
    $("#c" + i).text(Number(keys[i].ident + 1));
  }
}
// -------------------------------------------------
function pointInRect(p, r) {
    return p.x > r.x1 && p.x < r.x2 && p.y > r.y1 && p.y < r.y2;
}
//  point = {x: 1, y: 2};
//  rectangle = {x1: 0, x2: 10, y1: 1, y2: 7};
//  pointInRect(point, rectangle);
// --------------------------------------------------
function keyForPoint (point) {
  for (var i = 0; i < 6; i++) {
    if (pointInRect(point, {x1: keys[i].x1, x2: keys[i].x2, y1: keys[i].y1, y2: keys[i].y2}))
      return i;
  }
  return -1;
}
// --------------------------------------------------
function keyForIdent (ident) {
  for (var i = 0; i < 6; i++) {
    if (keys[i].ident === ident) return i;
  }
  return -1; // key not found
}
// --------------------------------------------------
//***************************************************

//--------------------------------------------- resetDomKey
function resetDomKey (key) {
  if ( goodConfig[0] === key || goodConfig[1] === key )
    $("#dom-" + key).css({"background-color": DRU_DOM_GRAY_ACTIF});
  else
    $("#dom-" + key).css({"background-color": DRU_DOM_GRAY_PASSIF});
}

// -------------------------------------------- bringFirstMovedTouch
function bringLastMovedTouch (touch) {
//  if (enterKeysTrans.length < 2) return;
  removeEnterTouch(touch);
  if ( goodConfig[0] === transitRep[0] /* || transitRep.length > 1 */ ) enterKeysTrans.push(touch);
  else enterKeysTrans.unshift(touch);
  console.log( 'enterKeysTrans: ' + enterKeysTrans );
}

// -------------------------------------------- removeEnterTouch
function removeEnterTouch (touch) {
  enterKeysTrans = enterKeysTrans.filter(function(x) { return x !== touch; });
}

// ---------------------------------------------   buildTransitRep
// calcul vecteur rep si relacher tout maintenant
function buildTransitRep (nbTouches) {

  var tRep = [];
  var lastTi = enterKeysTrans.length - 1;
  var lastT, key;
  for ( var i = 0; i < nbTouches; i++ ) {
    lastT = enterKeysTrans[lastTi--];
    key = keyForIdent(lastT);
    if ( key !== -1 ) tRep.unshift(key);
  }
  return tRep;
}

// -------------------------------------------- justEvelTransitRepSimul
function justEvalTransitRepSimul (tRep) {

  if (!tRep || !tRep.length ) return false; // doigts sortis du clavier

  if ( goodConfigSim.length != tRep.length ) return false;
  for ( var i = 0; i < tRep.length; i++ ) {
    if ( goodConfigSim.indexOf(tRep[i]) === -1 ) return false;
  }
  return true;
}

// ---------------------------------------------   evalTransitRepSimul
function evalTransitRepSimul (tRep) {


  var ok = true; // rep verte
  var tap;

  console.log('+++++++++++++++++++++ goodConfigSim: ' + goodConfigSim + ' tRep: ' + tRep);
  for ( var i = 0; i < tRep.length; i++ ) {
    if ( goodConfigSim.indexOf(tRep[i]) != -1 )
        $("#dom-" + tRep[i]).css({"background-color": DRU_GREEN_DOM});
    else $("#dom-" + tRep[i]).css({"background-color": DRU_ORANGE});
  }

}

// ---------------------------------------------   evalTransitRep
function evalTransitRep (tRep) {

  if (!tRep || !tRep.length ) return false; // doigts sortis du clavier

  if ( flagSimul ) {
    return evalTransitRepSimul(tRep);
  }



  var ok = true; // rep verte
  var flagFirstGood = false;

  // gestion du glissé
  if ( firstSlideOrg && tRep.length === 1 && goodConfig[0] === firstSlideOrg.key && tRep[0] === goodConfig[1]) {
    $("#dom-" + firstSlideOrg.key).css({"background-color": DRU_GREEN_DOM}); // mise en vert de slideOrg.key


    tempoSlide = setTimeout( function () {  // oublie du slide
        tempoSlide = 0; // indique que pas de slide en cours
        if ( firstTouchFlag ) return; // pas de doigt
        if ( transitRep.length === 1 && goodConfig.indexOf(transitRep[0]) === -1 ) return; // doigt sur mauvaise key
        $("#dom-" + firstSlideOrg.key).css({"background-color": DRU_DOM_GRAY_ACTIF}); // reset firstSlideOrg.key
        $("#dom-" + goodConfig[1]).css({"background-color": DRU_ORANGE}); // erreur pour k2

    }, FORGET_SLIDE_KEY );

    $("#dom-" + goodConfig[1]).css({"background-color": DRU_GREEN_DOM}); // mise en vert key actuelle
    return(ok);
  } // fin gestion du glissé


  // bonne rep si relaché (1 doigt) sans glissé
  if ( goodConfig[0] === tRep[0] ) {
    flagFirstGood = true;
    if ( goodConfig.length === 1 && tRep.length === 1 ) {
      $("#dom-" + goodConfig[0]).css({"background-color": DRU_GREEN_DOM});
      return(ok);   // valeur de retour non utilisé !!!
    }
  }

  // bonne rep si relaché (2 doigts)
  if ( goodConfig[0] === tRep[0] && goodConfig[1] === tRep[1] && tRep.length === 2 && goodConfig.length === 2 ) {
    $("#dom-" + goodConfig[0]).css({"background-color": DRU_GREEN_DOM});
    $("#dom-" + goodConfig[1]).css({"background-color": DRU_GREEN_DOM});
    return(ok);
  }

  for ( i = 0; i < tRep.length; i++ ) {
    if ( goodConfig[i] === tRep[i] ) {
      if ( i === 1 && !flagFirstGood ) ok = false; // rep orange
    }
    else ok = false; // rep orange

    if (ok) {
      $("#dom-" + goodConfig[i]).css({"background-color": DRU_GREEN_DOM});
    }
    else $("#dom-" + tRep[i]).css({"background-color": DRU_ORANGE});
  }

  return(ok);
}

//............................................................ final 0 doigt
//..........................................................................


// ---------------------------------------------   buildRep
// calcul  réponse  finale dans goodKeys
function buildRep () {

  goodKeys = [];
  var now = new Date().getTime();

  var kIdent;
  for ( var j = 0; j < enterKeys.length; j++ ) {
    kIdent = enterKeys[j];
    for (var k = 0; k < waitingKeys.length; k++) {
      if ( waitingKeys[k].ident === kIdent ) {
        if ( now - waitingKeys[k].time < TOUCH_END_MIN_INTERVAL ) {
          if ( goodKeys.indexOf(waitingKeys[k].key) === -1 ) // pas déjà dedans
            goodKeys.push( waitingKeys[k].key );
        }
      }
    }
  }

  console.log('enterKeys: ' + JSON.stringify(enterKeys));
  console.log('waitingKeys: ' + JSON.stringify(waitingKeys));

  // gestion slide
  if ( goodKeys.length === 1 && tempoSlide && goodKeys.indexOf(firstSlideOrg.key) === -1 ) {
    goodKeys.unshift(firstSlideOrg.key);
    flagOneDigit = true;
    console.log('goodKeys oneTrue: ' + goodKeys + ' -------------');
  }
    else {
      flagOneDigit = false;
      console.log('goodKeys oneFalse: ' + goodKeys + ' -------------');
    }
}

// ---------------------------------------------   evalRep
// eval réponse
function evalRep () {

  var ok = true; // rep verte
  var i;

  if ( flagSimul ) {
    if ( goodConfigSim.length !== goodKeys.length ) return false;
    for ( i = 0; i < goodConfigSim.length; i++ ) {
      if ( goodKeys.indexOf(goodConfigSim[i]) === -1 ) return false;
    }
  }
  else {
    if ( goodConfig.length !== goodKeys.length ) return false;
    for ( i = 0; i < goodConfig.length; i++ ) {
      if ( goodConfig[i] !== goodKeys[i] ) {
        return false; // rep orange
      }
    }
  }
  return(ok);
}
//.............................................................. fin final 0 doigt
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

// ----------------------------------------------   buildMaxWordSigns
// calcul le nombre total de chars pour un cycle de mots
function buildMaxWordSigns () {
  var maxW = 0;
  for ( var i = 0; i < wordList.length; i++ ) {
    maxW+= wordList[i].length;
  }
  return maxW;
}

// ----------------------------------------------   wordTrialIndex
// retourne la valeur actuelle de trialIndex (acces successitapConfigs)
function wordTrialIndex () {
  return (wordList[wordIndex]).charCodeAt(charWordIndex) - 97;
}

// ----------------------------------------------   buildGoodConfig
// construction chalenge
function buildGoodConfig () {

  // config successitap
  var configs = successitapConfigs;
  var tap;
  goodConfig = [];

  for ( var i = 0; i < 6; i++ ) {
    tap = configs[trialIndex][i];
    if ( tap == "1" ) goodConfig[0] = i;
    else if ( tap == "2" ) goodConfig[1] = i;
    else if ( tap == "3" ) goodConfig[2] = i; // simultap
  }

  // config simultap
  if ( keyboardType == 'si' ) {
    configs = simultapConfigs;
    goodConfigSim = [];

    var j = 0;
    for ( i = 0; i < 6; i++ ) {
      tap = configs[trialIndex][i];
      if ( tap ) goodConfigSim[j++] = i;
    }
  }
}
// **************************************************************   S P E E C H
// -----------------------------------------------   initSpeech
// SpeechSynthesisUtterance
function initSpeech () {
  if ( window.SpeechSynthesisUtterance  ) {
    speechVoices = window.speechSynthesis.getVoices();
    speechUtterance = new window.SpeechSynthesisUtterance();
  }
  else {
    if (  !dejaNoSpeech  ) {
      modalAlert('Speech synthesis not available', 'Drumy error!');
      dejaNoSpeech = true;
    }
    return;
  }

  speechUtterance.lang = 'fr-BE';
  speechUtterance.rate = 0.9;  // petit = lent

  speechUtterance.onend = function ( event ) {
    afterSpeak(event);
  };
}

// ------------------------------------------------  speakText( text );
function speakText ( text ) {

  if ( localStorage.app == 'realApp'  && sessionStorage.os == 'android'  ) { // exclusion ios
    localStorage.textTS = text;  // TTS
    return;
  }

  if ( !speechUtterance ) initSpeech();
  if ( !speechUtterance ) {
    if ( !dejaNoSpeech ) modalAlert('Speech synthesis not available', 'Drumy error!');
    dejaNoSpeech = true;
    return;
  }

  speechUtterance.text = text;

  // if ( !speechUtterance.voice && speechVoices ) speechUtterance.voice = speechVoices[4]; // 4=fr, 1=en

  speechSynthesis.speak(speechUtterance);
}

// ---------------------------------------------- afterSpeak
function afterSpeak ( event ) {
  localStorage.timeTS = event.elapsedTime *1000; // convertion en millisecondes
  console.log('afterSpeak');
  console.log('end speech: ' + event.elapsedTime);
}

// ---------------------------------------------- buildWordDisplay
function buildWordDisplay ( word ) {
  var html = '';

  for ( var i = 0; i < word.length; i++ ) {
    html = html + '<span id="letter' + i +  '">' + word[i] + '</span>';
  }
  return html;
}

// ------------------------------------------------ speakSign
function speakSign ( sign ) {
  if ( flagSpeakSign ) {
    speakText(sign);  // speak sign
    flagSpeakSign = false;
  }
}

// ----------------------------------------------   showTrialSimul
// afficher domino simultap
function showTrialSimul () {
  var tap;
  if ( levelType == 'sig' || levelType == 'memory' ) {
    $("#signs").css({"border-color": "white"}); // reset couleur cadre lettre
    speakSign( successitapSigns[trialIndex] );
    $("#signs strong").text(successitapSigns[trialIndex]);  // affiche sign
  }

  $(".dom").css({"border-color": "white"});
  for ( var i = 0; i < 6; i++ ) {
    tap = simultapConfigs[trialIndex][i];

    $("#dom-" + i).text(""); // effacer chiffre si présent
    if ( tap ) $("#dom-" + i).css({"background-color": DRU_DOM_GRAY_ACTIF});
    else $("#dom-" + i).css({"background-color": DRU_DOM_GRAY_PASSIF});
  }

  keyboardReady = true;
}

// ----------------------------------------------   showTrialWords
// afficher mot
function showTrialWords () {

  var html, letter0, letter1;
  var wordView = '#words strong';
  var bigSize = '120%';
  var backColor = DRU_DOM_GRAY_PASSIF;
  var greenWordTime = GREEN_WORD_TIME;

  letter1 = '#letter' + Number(charWordIndex);     // span lettre actuelle

  ///////
  if ( newWord ) {            // changement de mot

    if ( trialNumberDone === 0 ) {  // début de cycle
      greenWordTime = 1;
    }
    else {                  // vert pour mot précédent
      $("#words strong").css({"border": "solid green 1px"});
      $(wordView + " span").css({
                            "background-color": "white",
                            "opacity": 1,
                            "color": DRU_GREEN
      });
    }
    clearTimeout(greenWordTimeout);
    setTimeout( function () {                   // tempo pour voir le mot vert
      $("#words strong").css({"border": "solid green 0px"});
      html = buildWordDisplay(wordList[wordIndex]);
      $(wordView).html(html);  // affiche nouveau mot
      if ( levelType == 'dictation' ) {
        $(wordView + " span").css({"opacity": 0});
      }
      else $(wordView + " span").css({"opacity": 1});

      if ( levelType == 'dictation' ) {
        speakText(wordList[wordIndex]);
        clearTimeout(speechTimeout); // reset timeout
        speechTimeout = setTimeout( function () {
          // $(wordView + " span").css({"opacity": 1}); // afficher le MOT si trop long à répondre
          $(letter1).css({"opacity": 1}); // afficher la LETTRE si trop long à répondre
          speakSign($(letter1).text());  // speak lettre si trop long à répondre
        }, SPEECH_TIMEOUT);
      }
      else speakText(wordList[wordIndex]);

      $(letter1).css({"background-color": backColor});
      newWord = false;
      keyboardReady = true;
      trialStartTime = now() - 0; // -2000 durée estimée du son (en attendant mieux)

    }, greenWordTime );
  }

  ///////
  else {    // mot en cours

    letter0 = '#letter' + Number(charWordIndex - 1); // span lettre précédente

    if ( okPrevTrial ) {
      $(letter0).css({"background-color": "white", "color": DRU_GREEN});

      if ( levelType == 'dictation' ) {
        $(letter0).css({"opacity": 1}); // allume dictation lettre ok
        clearTimeout(speechTimeout); // reset timeout
        speechTimeout = setTimeout( function () {
          $(letter1).css({"opacity": 1}); // afficher la LETTRE si trop long à répondre
          speakSign($(letter1).text());  // speak lettre si trop long à répondre
        }, SPEECH_TIMEOUT);

      }
      $(letter1).css({"background-color": backColor});
    }

    else {
      speakSign($(letter1).text());  // speak lettre si erreur
      $(letter1).css({"background-color": backColor, "color": DRU_ORANGE_DARK});
      $(letter1).animate({"font-size": bigSize}, 80, function () {
        $(letter1).css({"font-size": "100%"});
      });
    }
  }
  if ( !newWord ) keyboardReady = true;
}

// ----------------------------------------------   showTrial
// afficher domino ET construction goodConfig[]
function showTrial () {

  if ( levelType == 'words' || levelType == 'dictation' ) {
    showTrialWords();
    return;
  }

  if ( flagSimul ) {
    showTrialSimul();
    return;
  }

  var tap;
  if ( levelType == 'sig' || levelType == 'memory' ) {
    $("#signs").css({"border-color": "white"}); // reset couleur cadre lettre
    speakSign( successitapSigns[trialIndex] );  // dire la lettre
    $("#signs strong").text(successitapSigns[trialIndex]);  // affiche sign
  }

  $(".dom").css({"border-color": "white"});
  for ( var i = 0; i < 6; i++ ) {
    tap = successitapConfigs[trialIndex][i];
    $("#dom-" + i).css({"background-color": DRU_DOM_GRAY_PASSIF});
    if (tap == "0") {
      tap = "";
      // pas d'affichage guide pour memory
      if ( levelType != 'memory' ) $("#dom-" + i).css({"background-color": DRU_DOM_GRAY_PASSIF}).text("");
    }
    else {
      // pas d'affichage guide pour memory
      if ( levelType != 'memory' ) $("#dom-" + i).text(tap);
      if (tap == "1") {
        if ( levelType != 'memory' )
              $("#dom-" + i).css({"background-color": DRU_DOM_GRAY_ACTIF, "color": "white"});
      }
      else {
        if ( levelType != 'memory' )
              $("#dom-" + i).css({"background-color": DRU_DOM_GRAY_ACTIF2, "color": "white"});
      }
    }
  }
  keyboardReady = true;
}

// ----------------------------------------------  loopNextTrial
function loopNextTrial (ok) {
//                              bouclage essai suivant OU fin de cycle

//  var waitErr;
//  if ( ok ) waitErr = 1;// 200;
//  else waitErr = 1; // 500;

    keyboardReady = false;

//  setTimeout( function () {
    trialNumber++;
    if (ok) {
      okPrevTrial = true;
      trialNumberDone++;
      if (cycleType == 'a') trialIndex++;
      else if ( levelType == 'words' || levelType == 'dictation' ) {
        if ( wordList[wordIndex].length === charWordIndex + 1) { // mot suivant
          charWordIndex = 0;
          wordIndex++;
          newWord = true;
          newWordToBase = true;
        }
        else charWordIndex++; // char suivant dans le mot

        if ( wordIndex < wordList.length && charWordIndex < wordList[wordIndex].length ) {
          trialIndex = wordTrialIndex(); // index pour lettre 1 du mot suivant
        }
        else {                // fin de cycle
          wordIndex = 0;
        }
      }
      else if (cycleType == 'r') trialIndex = indexList[trialNumberDone];
    }
    else {
      okPrevTrial = false;
      if (levelType != 'words' && levelType != 'dictation' ) showTrial();
    }

    $(".key").css({"background-color": BACK_CLAVIER});
//.........
    if ( trialNumberDone < maxCycleSigns ) { // continu cycle
      clearTimeout(speechTimeout);
      buildGoodConfig(); // construction chalenge

      flagSpeakSign = true; // ok dire la lettre
      if ( keyboardType == 'si' && !( levelType == 'words' || levelType == 'dictation' ) ) showTrialSimul();
      else showTrial(); // affichage domino ou mot
      trialStartTime = now();
    }

    else {
        // fin de cycle,  affichage ready

      flagSpeakSign = true; // ok dire la lettre après ready

      if ( levelType == 'words' || levelType == 'dictation' ) {
          // affichage mot vert avant dialog fin cycle
        $("#words strong").css({"border": "solid green 1px"});
        $("#words strong span").css({
                              "background-color": "white",
                              "opacity": 1,
                              "color": DRU_GREEN
        });


        clearTimeout(finCycleTimeout);
        finCycleTimeout = setTimeout( function () {
          $("#words").css({"opacity": 0});
          $("#audio-words").css({"opacity": 0});
          clearTimeout(speechTimeout);
          saveCycle(); // ajax du cycle
          updateUserData(); // mise à jour localStorage, alert fin de cycle
          initDoms(); // affichage 'Ready' et attente click pour cycle suivant
        }, GREEN_WORD_TIME);
      }

      else {
        clearTimeout(speechTimeout);
        saveCycle(); // ajax du cycle
        updateUserData(); // mise à jour localStorage, alert fin de cycle
        initDoms(); // affichage 'Ready' et attente click pour cycle suivant
      }
    }
//  }, waitErr);
}

//--------------------------------------------- updateUserData
function updateUserData () {
  // mise à jour localStorage, alerts fin de cycle

  if ( cycleType == 'r' ) {
    var userData = JSON.parse(localStorage.drumy);
    var score = userData.score[sessionStorage.levelId];

    var oldMoyText = '';

      var newMoy; // flag
      var sum = 0, moy;
      var sum0 = 0, moy0;

      // moyenne score du cycle

      if ( !score.moyCycle ) score.moyCycle = score.moyCycle0 = 999999;
      if ( score.moyCycle == 999999 ) newMoy = true;
      else newMoy = false;

      var nbGoodTrialNotNewWord = 0;
      for ( var i = 0; i < levelData.length; i++ ) {
        if ( levelData[i].repVal == 'ok' && levelData[i].newWord != 'y' ) nbGoodTrialNotNewWord++;
        if ( levelData[i].newWord != 'y' ) {
          sum+= levelData[i].duration;
          sum0+= levelData[i].duration0;
        }
      }
      moy = Math.round(sum / nbGoodTrialNotNewWord);
      moy0 = Math.round(sum0 / nbGoodTrialNotNewWord);

      var bestMoy;
      var bestMoy0;
      if ( moy < score.moyCycle ) bestMoy = moy;
      else bestMoy = score.moyCycle;
      if ( moy0 < score.moyCycle0 ) bestMoy0 = moy0;
      else bestMoy0 = score.moyCycle0;

      var secMoy = (moy / 1000);  //.toFixed(1);
      var secOld = (score.moyCycle / 1000);  //.toFixed(1);
      var secMoy0 = (moy0 / 1000);  //.toFixed(1);
      var secOld0 = (score.moyCycle0 / 1000);  //.toFixed(1);

      score.moyCycle = bestMoy; // update best moyenne
      score.moyCycle0 = bestMoy0; // update best moyenne0
      // sauvegarde score
      userData.score[sessionStorage.levelId] = score;
      localStorage.drumy = JSON.stringify(userData);

  //. . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

      // niv suivant PAS déjà ouvert ET moy SUFFISANTE
      if ( userLevelState() != 'success' &&  moy < SUCCESS_SUC_TAP ) {
        modalAlert('Next level is now open', 'Great!');
        sessionStorage.flagOpenNextLevel = 'ok';
        updateUserLevels('success');

        // retour accueil
        setTimeout( function () {
          $("#back-home2").click();
        }, 1800);
        return;
      }

      // niv suivant PAS déjà ouvert ET moy PAS SUFFISANTE
      if ( userLevelState() != 'success' ) {
        if ( !newMoy ) {
          oldMoyText = ' Best mean = ' + convertWPM(secOld0) + ' (' + convertWPM(secOld) + ') wpm';
          modalAlert(convertWPM(secMoy0) + ' (' + convertWPM(secMoy) + ') wpm ', 'Your Means', oldMoyText);
        }
        else modalAlert(convertWPM(secMoy0) + ' (' + convertWPM(secMoy) + ') wpm ',  'Your Mean');
        return;
      }

      // niv suivant délà ouvert ET nouvelle best moyenne
      if ( userLevelState() == 'success' && moy == bestMoy ) {
        if ( !newMoy ) {
          oldMoyText = ' Previous best = ' + convertWPM(secOld0) + ' (' + convertWPM(secOld) + ') wpm';
          modalAlert(convertWPM(secMoy0) + ' ('  + convertWPM(secMoy) + ') wpm ', 'Best Mean!', oldMoyText);
        }
        return;
      }

      // niv suivant délà ouvert ET PAS nouvelle best moyenne
      else {
        if ( !newMoy ) oldMoyText = ' Best mean = ' + convertWPM(secOld0) + ' (' + convertWPM(secOld) + ') wpm';
        modalAlert(convertWPM(secMoy0) + ' (' + convertWPM(secMoy) + ') wpm ', 'Your Means', oldMoyText);
        return;
      }
  }
  else {  // fin cycle alpha
    sessionStorage.flagOpenNextLevel = 'alpha';
    updateUserLevels('alpha');
  }
}

//--------------------------------------------- convertWPM
function convertWPM ( m ) {
  // convertion nb sec. par char -> wpm
  var moy = m;
  //moy = moy / 1000; // secondes par char
  moy = moy * CHAR_BY_WORD; // secondes par mot
  moy = ( 60 / moy  ).toFixed(0); // wpm  toFixed(1);
  return moy;
}

//--------------------------------------------- memoTrial
function memoTrial () { // mise à jour levelData pour 1 essai
  var trial = {};
  var trialDuration, trialDuration0;
  if ( levelType == 'dictation' && newWordToBase && localStorage.timeTS ) {
    trialDuration = String(now() - Number(localStorage.timeTS));
    localStorage.timeTS = '';
  }
  else trialDuration = now() - trialStartTime;

  if ( trialDuration > MAX_TRIAL_DURATION ) return;

  trialDuration0 = now() - trialStartTimeTouch;

  trial.identifier = sessionStorage.identifier;
  trial.connectionIndex = sessionStorage.connectionIndex;
  trial.timestamp = now();
  var datetime = dateTime();
  trial.date = datetime.date;
  trial.time = datetime.time;
  trial.cycleIndex = levelData.length + 1;
  trial.cycleType = cycleType;
  trial.keyboardType = keyboardType;
  trial.duration0 = trialDuration0;
  trial.duration = trialDuration;

  if ( flagSimul ) trial.chalenge = configRecode(goodConfigSim);
  else trial.chalenge = configRecode(goodConfig);

  var druChar = successitapSigns[trialIndex];
  if ( druChar == "'") trial.targetChar = 'sq';
  else if ( druChar == '"') trial.targetChar = 'dq';
  else if ( druChar == '_') trial.targetChar = 'sp';
  else trial.targetChar = druChar;

  if ( flagSimul ) {
    trial.chaKeys = goodConfigSim.length;
    trial.chaKey1 = goodConfigSim[0] + 1;
    if ( trial.chaKeys > 1 )  trial.chaKey2 = goodConfigSim[1] + 1;
    else trial.chaKey2 = 0;
    if ( trial.chaKeys > 2 ) trial.chaKey3 =  goodConfigSim[2] + 1;
    else trial.chaKey3 = 0;
  }
  else {
    trial.chaKeys = goodConfig.length;
    trial.chaKey1 = goodConfig[0] + 1;
    if ( trial.chaKeys > 1 )  trial.chaKey2 = goodConfig[1] + 1;
    else trial.chaKey2 = 0;
    if ( trial.chaKeys > 2 ) trial.chaKey3 =  goodConfig[2] + 1;
    else trial.chaKey3 = 0;
  }

  trial.reponse = configRecode(goodKeys);
  if ( !flagSimul && flagOneDigit ) trial.repDigits = 1;
  else trial.repDigits = goodKeys.length;

  trial.repKey1 = goodKeys[0] + 1;
  if ( goodKeys.length > 1 ) trial.repKey2 = goodKeys[1] + 1;
  else trial.repKey2 = 0;
  if ( goodKeys.length > 2 ) trial.repKey3 = goodKeys[2] + 1;
  else trial.repKey3 = 0;

  if ( repVal ) trial.repVal = 'ok';
  else trial.repVal = 'er';

  if ( trial.repVal == 'er' ) trial.keyboardChoise = 'x';
  else if ( flagSimul ) trial.keyboardChoise = 'i'; // sImultap
  else if ( flagOneDigit && goodKeys.length > 1 ) trial.keyboardChoise = 'l'; // sLide
  else trial.keyboardChoise = 'u'; // sUccessitap

  if ( levelType == 'dictation' || levelType == 'words' ) {
    if ( newWordToBase ) {
      trial.newWord = 'y';
      newWordToBase = false;
    }
    else trial.newWord = 'n';
  }

  trial.level = levelNameTranslate[levelName];
  trial.hand = handName;

  levelData.push(trial);
}

// ---------------------------------------------- configRecode
          // recodage +1 et string pour le tableau des keys
function configRecode(conf) {
  var conf2 = '';
  for (var i = 0; i < conf.length; i++) {
    conf2 = conf2 + String(conf[i] + 1);
  }
  return conf2;
}

// **************************************************************   S A V E    W A I T I N G

// -------------------------------------------- updateWaitingDisplay
function updateWaitingDisplay () {
  // update display
  var waitingCycles = JSON.parse(sessionStorage.waitingCycles);
  for ( i = 0; i < 5; i++ ) {
    if ( i < waitingCycles.length ) $("#wc" + String(i)).css({"opacity": 1});
    else $("#wc" + String(i)).css({"opacity": 0 });
  }
}
// ----------------------------------------------  saveCycle
function saveCycle () {
  // écriture dernier cycle

  sessionStorage.flagWaitingWrite = 'no';
  var waitingCycles = JSON.parse(sessionStorage.waitingCycles);
  waitingCycles.push(JSON.stringify(levelData));
  if ( waitingCycles.length > 5 ) waitingCycles.shift(); // max 5 cycle en attente
  sessionStorage.waitingCycles = JSON.stringify(waitingCycles);
  /*if ( waitingCycles.length > 1 )*/  updateWaitingDisplay();
  sessionStorage.flagWaitingWrite = 'yes';
}

// ----------------------------------------------  numAlea
function numAlea (nb) {
  var result = (Math.random() * nb).toFixed(0); // PAS TOUCHE! retourne une string!!!
  if ( result == nb ) result = 0;
  //console.log(result);
  return result;
}

// ----------------------------------------------  initDoms
function initDoms () {
  // affichage ready text et attente click pour cycle suivant

  $("#ready").css({"display": "inline-block"});
  $(".dom").css({"background-color": DRU_DOM_GRAY_PASSIF}).text("");
  $("#signs strong").text("");
}

// ----------------------------------------------   showReady
function showReady ( ready ) {
  // affiche et speak ready text

  $("#ready h2").text(ready);
  var readyWidth = $("#ready").width();
  $("#ready").css({"left": (window.innerWidth - readyWidth) /2 });

//  if ( levelType == 'dictation' || levelType == 'words' ) {
    speakText('');  // init speak
//  }

}

// ---------------------------------------------- buildWordList
function buildWordList ( orgList, foxList ) {
  var orgList2 = orgList;
  var foxList2 = foxList;
  var list = [];
  var wordIndex, word;
  var filter = (function(x) { return x != word; }); // sans remise

  for ( var i = 0; i < NB_WSUB_CYCLES; i++ ) {
    for ( var j =0; j < MINI_WLIST_SIZE; j++ ) {
      wordIndex = numAlea(orgList2.length);
      word = orgList2[wordIndex];
      list.push(word);
      orgList2 = orgList2.filter (filter);
    }
    if ( i === NB_WSUB_CYCLES - 1) return list;
    wordIndex = numAlea(foxList2.length);
    word = foxList2[wordIndex];
    list.push(word);
    foxList2 = foxList2.filter (filter);
  }
  // return list;
}

// ---------------------------------------------- buildSignListIndex
function buildSignListIndex ( nbIndexes ) {

  var orgList = [];
  var list = [];
  var index, val;
  var filter = (function(x) { return x != val; }); // sans remise

  for ( var i = 0; i < nbIndexes; i++ ) orgList.push(i);

  for ( i = 0; i < nbIndexes; i++ ) {
    index = Number(numAlea(orgList.length));
    val = orgList[index];
    list.push(val);
    orgList = orgList.filter (filter);
  }
  return list;
}

// ---------------------------------------------- buildSignList (inutilisé)
function buildSignList ( orgList ) {
  var orgList2 = orgList;
  var list = [];
  var charIndex, char;
  var filter = (function(x) { return x != char; }); // sans remise

  for ( var i = 0; i < NB_SIGNS; i++ ) {
    charIndex = numAlea(orgList2.length);
    char = orgList2[charIndex];
    list.push(char);
    orgList2 = orgList2.filter (filter);
  }
  return list;
}

//*************************************************** fin functions
//*****************************************************************
//*****************************************************************

// -------------------------------------------------- R E A D Y
$(document).ready(function () {
                                          //  events
$("#clavier").get(0).addEventListener("touchstart", handleStart, false);
$("#clavier").get(0).addEventListener("touchend", handleEnd, false);
$("#clavier").get(0).addEventListener("touchmove", handleMove, false);
// $("#clavier").get(0).addEventListener("touchcancel", handleCancel, false);



//                                    V O I C E S

//                                get  voices
if ( window.SpeechSynthesis ) {
  window.SpeechSynthesis.onvoiceschanged = function () {
    speechVoices = window.speechSynthesis.getVoices(); //   voix système
  };
}


//                                     C L A V I E R
$("#clavier").css({
              "position":"fixed",
              "width": CLAVIER_WIDTH + "rem",
              "height": CLAVIER_HEIGHT + "rem",
              "bottom": CLAVIER_BOTTOM + "rem"
              //"border": "1px solid black"
});
clavWidth = $("#clavier").width();
var clavLeft = (window.innerWidth - clavWidth) /2 ;
$("#clavier").css({"left": clavLeft});

// ------
$(".key").css({
              "position":"fixed",
              "z-index": 1,
              "width": KEY_WIDTH + "rem",
              "height": KEY_HEIGHT + "rem",
              "border": "1px solid white",
              "background-color": BACK_CLAVIER,
              "pointer-events": "none"
});
$(".key.line1").css({"bottom": LINE1_BOTTOM + "rem"});
$(".key.line2").css({"bottom": LINE2_BOTTOM + "rem"});
$(".key.left").css({"left": clavLeft});
$(".key.center").css({"left": clavLeft + $("#key-1").width() + 2});
$(".key.right").css({"left": clavLeft + $("#key-1").width() *2 + 4});

initKeys();




});  // ------------------------------------------------------  fin ready
