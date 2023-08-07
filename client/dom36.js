// dominoes.js



// **********************************************************************
// ***************************************************  F U N C T I O N S

// -----------------------------------------   touch S T A R T
function handleStart(event) {
  event.preventDefault();
  initPauseHome ();
  if (!keyboardReady) return;
  if ( event.touches.length > 5 ) return;

  clearTimeout(tempoSlide);
  var point;  // point = {};
  var key, i; // transitRep;
  var touches = event.changedTouches;

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Nombre de touchstart: ' + touches.length);

  // slideOrg = {}; // slideOrg à virer
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  for (i=0; i < touches.length; i++) {
    point = {};

    if ( firstTouchFlag ) trialStartTimeTouch = now();

    if ( keyboardType == 'si' ) {
      console.log('********************************** START SIMUL ');
      if ( firstTouchFlag ) { // pose du premier doigt
        firstTouchFlag = false;
        // firstTouchTime = now();
        flagSimul = true;

        // fin délai simultat
        clearTimeout(simulTimeout);
        if ( !simulTimeout ) simulTimeout = setTimeout( function () {
          if ( !justEvalTransitRepSimul(transitRep) ) {
            console.log('*********************************** STOP SIMULTAP 1: ');
            flagSimul = false;
            // affichage domino pour successitap
            if (levelType != 'words' && levelType != 'dictation' ) showTrial();
            evalTransitRep(transitRep);
          }
        }, SIMUL_MAX_TIME );
      }

      else { // pas premier doigt
        if ( flagSimul && now() - trialStartTimeTouch > SIMUL_MAX_TIME ) {
          console.log('*********************************** STOP SIMULTAP 2: ');
          flagSimul = false;
          // affichage domino pour successitap
          if (levelType != 'words' && levelType != 'dictation' ) showTrial();
          evalTransitRep(transitRep);
        }
      }
    } // fin 'si'
    else firstTouchFlag = false;

    point.x = touches[i].clientX;
    point.y = touches[i].clientY;
    key = keyForPoint(point);
    if ( key > -1 ) {
      keys[key].touch = 1;
      keys[key].ident = touches[i].identifier;
//      keys[key].time = new Date().getTime();
      $("#key-" + key).css({"background-color": BACK_CLAVIER_ACTIF});
      // gestion memo nouveau touch
      enterKeys.push(touches[i].identifier);
      enterKeysTrans.push(touches[i].identifier);

      // domino
      firstSlideOrg.key = key;
      firstSlideOrg.ident = keys[key].ident;
      firstSlideOrg.time = new Date().getTime();

      transitRep = buildTransitRep(event.targetTouches.length);

      // re-appui simul good
      if ( justEvalTransitRepSimul(transitRep) ) {
        flagSimul = true;
        console.log('************************ re-appui simul good');
      }


      console.log('enterKeysTrans: ' + enterKeysTrans);
      console.log(goodConfig + ' transitRep touchstart: ' + transitRep);
      evalTransitRep(transitRep);

    }
  }
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}

// ----------------------------------------   touch M O V E
function handleMove(event) {
  event.preventDefault();
  if (!keyboardReady) return;

  var point = {};
  var key, prevKey, i;
  var touches = event.changedTouches;

  for (i=0; i<touches.length; i++) {
    point.x = touches[i].clientX;
    point.y = touches[i].clientY;
    key = keyForPoint(point);
    prevKey = keyForIdent(touches[i].identifier);

    if ( key > -1 ) {
      if (keys[key].ident ===  touches[i].identifier) {
        continue;    // touch in same key
      }
      clearTimeout(simulTimeout); simulTimeout = 0;
      flagSimul = false;  // abandon du simultap ********
      console.log('*********************************** STOP SIMULTAP: ');
      // affichage domino pour successitap
      if (levelType != 'words' && levelType != 'dictation' ) showTrial();
      evalTransitRep(transitRep);

      keys[key].touch = 1;   // doigt change de key
      keys[key].ident = touches[i].identifier; // memo ident
      $("#key-" + key).css({"background-color": BACK_CLAVIER_ACTIF});
    }

    if ( prevKey > -1 ) {        // efface prevKey dans keys
      keys[prevKey].touch = 0;
      keys[prevKey].ident = -1;
      $("#key-" + prevKey).css({"background-color": BACK_CLAVIER});
      resetDomKey(prevKey);
    }

    // domino
    if (tempoSlide) {
      clearTimeout(tempoSlide);
                                            // efface verts qui trainent
      if ( /* !firstTouchFlag && */ levelType != 'words' && levelType != 'dictation' ) showTrial();
    }

    bringLastMovedTouch(touches[i].identifier); // move touch en queue dans enterKeysTrans
    transitRep = buildTransitRep(event.targetTouches.length);

    // re-move simul good
    if ( justEvalTransitRepSimul(transitRep) ) {
      flagSimul = true;
      console.log('************************ re-move simul good');
    }

    console.log('enterKeysTrans: ' + enterKeysTrans);
    console.log(goodConfig + ' transitRep touchmove: ' + transitRep);
    evalTransitRep(transitRep);
  }
}

// -----------------------------------------   touch E N D
function handleEnd(event) {
  event.preventDefault();
  clearTimeout(simulTimeout); simulTimeout = 0;
  if (!keyboardReady) return;

  clearTimeout(tempoSlide);
  var point = {};
  var key, i;
  var touches = event.changedTouches;



  if ( flagSimul && event.targetTouches.length ) { // pas dernier doigt
    clearTimeout(simulUpTimeout);
    simulUpTimeout = setTimeout( function () {
    //  if ( firstTouchFlag ) return; // pas de doigt
      console.log('*********************************** STOP SIMULTAP: ');
      flagSimul = false;
      firstSlideOrg = {};
      // affichage domino pour successitap
      if ( levelType != 'words' && levelType != 'dictation' ) showTrial();
      evalTransitRep(transitRep);
    }, TOUCH_END_MIN_INTERVAL + 100);
  }


  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  for (i=0; i<touches.length; i++) {

    removeEnterTouch(touches[i].identifier); // rem touch dans enterKeysTrans

    point.x = touches[i].clientX;
    point.y = touches[i].clientY;
    key = keyForPoint(point);
    if ( key > -1 ) {
      keys[key].touch = 0;
      keys[key].ident = -1;
      $("#key-" + key).css({"background-color": BACK_CLAVIER});
      resetDomKey(key);
    }
        // gestion memo keys
    var waitingKey = {};
    waitingKey.key = key;
    waitingKey.time = new Date().getTime();
    waitingKey.ident = touches[i].identifier;
    waitingKeys.unshift( waitingKey );

    // domino
    // transitRep = buildTransitRep(event.targetTouches.length); // ?????
    transitRep = buildTransitRep(event.changedTouches.length);
    console.log('enterKeysTrans: ' + enterKeysTrans);
    console.log(goodConfig + ' transitRep touchend: ' + transitRep);
    evalTransitRep(transitRep);

  }
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  //                 ...............................................
  if ( event.targetTouches.length === 0 ) {  // clavier  V I D E !!!

    clearTimeout(tempoSlide);
    clearTimeout(simulUpTimeout);

    // construction tableau réponse final
    buildRep();

    // bouclage essai suivant
    repVal = evalRep();

    memoTrial(); // ecriture dans levelData de l'essai courant

  //  loopNextTrial( repVal );

    waitingKeys = [];
    enterKeys = [];
    enterKeysTrans = [];

    flagSimul = false;  // init flagSimul pour essai suivant
    firstTouchFlag = true; // init firstTouchFlag pour essai suivant

    loopNextTrial( repVal );

    initPauseHome();
  }
}                                // fin touchend
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------

// *****************************************  F I N    F U N C T I O N S
//**********************************************************************


//**********************************************************************
//**********************************************************************
// ----------------------------------------------  R E A D Y
$(document).ready(function () {

                    // affichage waitingCycle

  $("#waiting-cycles").css({
                "position": "fixed",
                "left": "1.5rem",
                "top": "2rem"
  });

  $(".w-cycle").css({
                "position": "relative",
                "width": "0.5rem",
                "height": "0.5rem",
                "background-color": "HSLA(35,84%,62%,1)",
                "opacity": 0
  });

  for ( var i = 0; i < 5; i++ ) {
    $("#wc" + String(i)).css({"top": String( i / 4 ) + "rem"});
  }

  // modal-options ( retour boutton close )
  //$('#modal-options button').on('click', function () {
  //});


  //          verif recouvrement domino clavier
  if ( window.innerHeight - $("#key-0").offset().top > window.innerHeight *4 /9 + 20) { // clavier < 5/9eme
    KEY_SCALE *= CORRECT_SMALL_SCREEN;
    flagSmallScreen = true;
    // $("#options-button").css({"display": "none"});  // cacher bouton options
  }

                      // affichage domino
  $(".dom").css({
                "position":"fixed",
                "width": DOM_KEY_WIDTH * KEY_SCALE + "rem",
                "height": DOM_KEY_HEIGHT * KEY_SCALE + "rem",
                "border": "1px solid white",
                "pointer-events": "none",
                "background-color": DRU_DOM_GRAY_PASSIF
  }).addClass("dru-dom-gray-passif");
  var clavLeftDom = ( window.innerWidth - $("#dom-0").width() *3 ) /2 ;

  $(".dom.line1").css({"top": DOM_TOP + "rem"});
  $(".dom.line2").css({"top": DOM_TOP + DOM_CLAVIER_HEIGHT * KEY_SCALE *0.5 + "rem"});
  $(".dom.left").css({"left": clavLeftDom});
  $(".dom.center").css({"left": clavLeftDom + $("#dom-1").width() + 2});
  $(".dom.right").css({"left": clavLeftDom + $("#dom-1").width() *2 + 4});

  var digitSize, digitVertical;
  if ( flagSmallScreen ) {
    digitSize = '2.8rem';
    digitVertical = '20%';
  }
  else {
    digitSize = '3.4rem';
    digitVertical = '0%';
  }
  $(".dom").css({
              "font-size": digitSize,
              "vertical-align": digitVertical,
              "font-weight": "bold",
              "text-align": "center"});



// -------                  affichage ready
  $("#ready").css({
                "display": "inline-block",
                "position":"fixed",
                "bottom": CLAVIER_HEIGHT /3 *2 + "rem",
          //      "bottom": "7rem", // "6.3rem",
                "z-index": 2
  }).addClass("dru-center");
  $("#ready").append("<h2></h2>");
  $("#ready h2").css({"color": "white"});

  $("#ready img").css({"display": "none", "position": "relative", "top": "2rem"});


//................................................................

  if ( levelId.indexOf('dom') != -1 ) {         // D O M
    levelType = 'dom';
    $("#titre h4").text("26 dominoes");

    if ( levelId.indexOf('dom1') != -1 ) {
      levelName = 'dom1';
      keyboardType = 'su';
      $("#titre h5").text("Learning successive taps");
    }
    else {
      levelName = 'dom2';
      keyboardType = 'si';
      $("#titre h5").text("Learning simultaneous taps");
    }
  }


  if ( levelId.indexOf('sig') != -1 ) {       //  S I G
    levelType = 'sig';
    $("#titre h4").text("26 letters");

    if ( levelId.indexOf('sig1') != -1 ) {
      levelName = 'sig1';
      keyboardType = 'su';
      $("#titre h5").text("Learning successive taps");
    }
    else {
      levelName = 'sig2';
      keyboardType = 'si';
      $("#titre h5").text("Learning simultaneous taps");
    }
  }


  if ( levelId.indexOf('memory') != -1 ) {   // M E M O R Y
    levelType = 'memory';
    keyboardType = 'su';
    $("#titre h4").text("Memory");
    $("#titre h5").text("Recall signs");
    DRU_DOM_GRAY_ACTIF = DRU_DOM_GRAY_PASSIF;

    if ( levelId.indexOf('memory1') != -1 ) {
      levelName = 'memory1';
      keyboardType = 'su';
      $("#titre h5").text("Learning successive taps");
    }
    else {
      levelName = 'memory2';
      keyboardType = 'si';
      $("#titre h5").text("Learning simultaneous taps");
    }
  }


  if ( levelId.indexOf('words') != -1 ) {       //  W O R D S

    SUCCESS_SUC_TAP = 10000;  //  seuil ouverture dictation

    levelType = 'words';
    $("#titre h4").text("Words");

    if ( levelId.indexOf('words1') != -1 ) {
      levelName = 'words1';
      keyboardType = 'su';
      $("#titre h5").text("Successive tap training");
    }
    else {
      levelName = 'words2';
      keyboardType = 'si';
      $("#titre h5").text("Simultaneous tap training");
    }
  }

    if ( levelId.indexOf('dictation') != -1 ) {       //  D I C T A T I O N
      levelType = 'dictation';
      $("#titre h4").text("Dictation");
    //  $("#ready img").css({"display": "inline"});

      if ( levelId.indexOf('dictation1') != -1 ) {
        levelName = 'dictation1';
        keyboardType = 'su';
        $("#titre h5").text("Successive tap training");
      }
      else {
        levelName = 'dictation2';
        keyboardType = 'si';
        $("#titre h5").text("Simultaneous tap training");
      }
    }

//................................................................

  if ( levelId.indexOf('-r') != -1 ) handName = 'right';  // H A N D
  else handName = 'left';

//................................................................

  if ( levelType == 'sig' || levelType == 'memory' ) {  // S I G  ou  M E M O R Y
    var signTop, signLeft, signSize;
    if ( flagSmallScreen ) {
      signTop = '-12.5rem';
      signLeft = '-1rem';
      signSize = '9rem';
    }
    else {
      signTop = '-16.5rem';
      signLeft = '-0.7rem';
      signSize = '12rem';
    }
    $("#signs").append("<strong></strong>");
    $("#signs strong").css({
              "position": "relative",
              "top": signTop,
              "left": signLeft
    });
    $("#signs strong").css({"color": DRU_BLUE_DARK}); // black
    $("#signs").css({
        //      "opacity": 0.7,
              "font-size": signSize,  //
              "font-family": '"Courrier", serif', // '"Times New Roman", Times, serif',
              "text-align": "center",
              "border": "3px solid white",
              "pointer-events": "none",
              "position": "fixed",
              "top": $("#dom-5").offset().top + $("#dom-5").height() + $("#dom-5").height() /5,
              "height": $("#dom-5").height(),
              "width": $("#dom-5").width()
    });
    var signsWidth = $("#dom-5").width();
    $("#signs").css({"left": (window.innerWidth - signsWidth) /2 });

  }

  //................................................................

  if ( levelType == 'words' || levelType == 'dictation' ) {  //  W O R D S
    var platformSize;
    if ( (navigator.userAgent.indexOf('iPhone') != -1) ||
          (navigator.userAgent.indexOf('Konnect') != -1)) platformSize = 'small';
    else platformSize = 'large';
    $("#domino").css({"opacity": 0});
    $("#words").append("<strong></strong>");
    $("#words strong").css({"vertical-align": "middle"});
//    $("#words strong").css({"position": "relative", "top": "-0.7rem"});
    $("#words").css({
              "font-size": "2.8rem",
          //    "font-family": '"Times New Roman", Times, serif',
              "font-family": '"Courrier", serif',
              "letter-spacing": "0.1rem",
              "text-align": "center",
              "border": "3px solid white",
              "pointer-events": "none",
              "position": "fixed",
              //"top": $("#dom-5").offset().top + $("#dom-5").height() + $("#dom-5").height() /5,
              "top": (platformSize == 'small') ? "5rem" : "10rem",
            //  "height": $("#dom-5").height(),
              "width": window.innerWidth
    });

  }

  $("#audio-words").css({    // bouton son mot
                  "opacity": 0,
                  "position":"fixed",
                  "width": "2rem",
                  "height": "2rem",
              //    "top": $("#words").offset().top + 100,
                  "top": $("#clavier").offset().top - 71.5,
                  "left":  window.innerWidth /2 - 7,
                  "color":"hsl( 0, 0%, 0% )"
  });
  $("#audio-words").on("click", function () {
    speakText(wordList[wordIndex]);
  });

  showReady('Ready'); // affiche et spick ready text
  updateWaitingDisplay(); // affichage initial waitingCycles

// ----------------------------------------------------------------------
//                                 -----  S T A R T cycle on  READY -----


  $("#ready img, #ready").on("click", function (event) {  // touchstart

    /*if ( levelType == 'dictation' )*/ speakText('');  // init browser tts


    $("#ready").css({"display": "none"});
    setTimeout(function () {

      if ( !cycleType ) { // premier cycle dans le parcours du niveau

        if ( keyboardType == 'si' ) maxCycleSigns = NB_LETTERS;
        else maxCycleSigns = NB_SIGNS;
        if ( userLevelState() == 'success' || userLevelState() == 'alpha' ||  levelType == 'words' || levelType == 'dictation' ) {
          cycleType = 'r';
        }
        else {
          cycleType = 'a';
          trialIndex = 0;
        }
      }  // fin !cycleType

      else cycleType = 'r'; // 2eme cycle et suivants

      // init pour cycle aleatoire
      levelData = [];
      trialNumberDone = 0;
      trialNumber = 0;

      if ( cycleType == 'r') {
        if ( levelType == 'words' || levelType == 'dictation' ) {
            $("#words").css({"opacity": 1});
            if ( levelType == 'dictation') $("#audio-words").css({ "opacity": 1 });
          wordList = buildWordList(shortFrWordList, foxFrWordList); // shortEnWordList, foxEnWordList
          maxCycleSigns = buildMaxWordSigns();
          trialIndex =  wordTrialIndex();
        }
        else {
          indexList = buildSignListIndex(maxCycleSigns);
          trialIndex = indexList[trialNumberDone];  // trialNumberDone == 0 ?
        }
      }

      localStorage.timeTS = '';  // init durée du dernier speak

      buildGoodConfig(); // construction chalenge

      flagSpeakSign = true; // dire la lettre
      if ( keyboardType == 'si' && !( levelType == 'words' || levelType == 'dictation' ) ) showTrialSimul();
      else showTrial(); // affichage domino ou mot
      trialStartTime = now();

    }, 1); // 300
  });


}); // ------------------------------------------------------  fin ready
// ---------------------------------------------------------------------
