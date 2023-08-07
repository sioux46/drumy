// utilLevel.js
var bottomBout = '16rem'; // vertical des boutons

var CLAVIER_BOTTOM = 1.5;

var DOM_CLAVIER_WIDTH = 18;
var CLAVIER_WIDTH;
if ( localStorage.userKeyboardSize == 'regular') {
  CLAVIER_WIDTH = DOM_CLAVIER_WIDTH;

}
else CLAVIER_WIDTH = 21;

var DOM_CLAVIER_HEIGHT = 13.5;
var CLAVIER_HEIGHT;
if ( localStorage.userKeyboardSize == 'regular')  CLAVIER_HEIGHT = DOM_CLAVIER_HEIGHT;
else {
  CLAVIER_HEIGHT = 15;
  bottomBout = '16.2rem';
  CLAVIER_BOTTOM = 0; // 0.3
}

var DOM_TOP = 5;
var KEY_SCALE = 0.8; // 0.7
var CORRECT_SMALL_SCREEN = 0.7; //  réduction domino
var flagSmallScreen = false;
var CORRECT_LARGE_SCREEN = 1.3; // agrandissement clavier
var flagLargeScreen = false;
//----------------------
var DOM_KEY_WIDTH = DOM_CLAVIER_WIDTH /3;
var DOM_KEY_HEIGHT = DOM_CLAVIER_HEIGHT /2;
var KEY_WIDTH = CLAVIER_WIDTH /3;
var KEY_HEIGHT = CLAVIER_HEIGHT /2;
var LINE1_BOTTOM = CLAVIER_BOTTOM + CLAVIER_HEIGHT /2;
var LINE2_BOTTOM = CLAVIER_BOTTOM;

var PAUSE_HOME = 600; //  600     10 min. pause retour home

var intervPauseHome = 0;  // clearTimeout(intervPauseHome);

// ***************************************************  F U N C T I O N S

// -------------------------------------------- initPauseHome
function initPauseHome () {

  clearTimeout(intervPauseHome);
  intervPauseHome = setTimeout( function () {  // pause > home *****
    $("#back-home2").click();
  }, PAUSE_HOME * 1000);
}

// *******************************************  F I N    F U N C T I O N S


// ----------------------------------------------  R E A D Y
$( document ).ready(function () {

  // -----------------------------------    BLOQUAGES DIVERS

  $( window ).on("resize", function (event) {  // stop rubberband scroll
    event.stopPropagation();
    event.preventDefault();
    $( document ).width(screen.innerWidth).height(screen.innerHeight);
    return false;
  });

  document.addEventListener('backbutton', function(event) {
    event.stopPropagation();
    event.preventDefault();
    return false;
  }, false);

  $( document ).on('dblclick', function() {
    event.stopPropagation();
    event.preventDefault();
    return false;
  });

  $(".container-fluid").css({"pointer-events": "none"});
  $("body").css({"overflow-y": "hidden"}); // stop pull-down-to-refresh
  $("body").addClass("no-selmenu");

  //screen.lockOrientation('portrait');

  $( window ).on("resize orientationchange", function() {
    event.stopPropagation();
    event.preventDefault();
    return false;
  });

  // -----------------------------------     fin bloquages

  initPauseHome();  // reset temps retour home

  levelId = sessionStorage.levelId;
  if ( !levelId ) window.location = '../index.php';

  sessionStorage.backLevel = true; // flag déjà vu un niveau

  $("h4").addClass("dru-center");

                                    // bouton options
  $("#options-button").css({
                "position":"fixed",
                "width": "2rem",
                "height": "2rem",
                "bottom": bottomBout,
                "right": "0.3rem",
                "color":"hsl( 0, 0%, 0% )"
  });

  $("#options-button").on("click", function () {
    //$("#modal-options").modal('show');
    if ( localStorage.userKeyboardSize == 'regular' ) localStorage.userKeyboardSize = 'enlarged';
    else localStorage.userKeyboardSize = 'regular';

    $("body").animate({"opacity":0}, 400, function () {
      window.location = window.location;
    });
  });

// désactivé
  $('#labSize1').on('touchstart', function () {
    localStorage.userKeyboardSize = 'regular';
    window.location = window.location;
  });
  $('#labSize2').on('touchstart', function () {
    localStorage.userKeyboardSize = 'enlarged';
    window.location = window.location;
  });


                          // bouton back home
  $("#back-home2").css({
                "position":"fixed",
                "width": "2rem",
                "height": "2rem",
                "bottom": bottomBout,
                "left": "1.3rem",
                "color":"hsl( 0, 0%, 0% )"
              });
  $("#back-home2").on("click", function () {
    if ( localStorage.app == 'realApp'  && sessionStorage.os == 'android' ) {
      $.ajax({
        'url': '../inc/connectMySqlW.php',
        'type': 'post',
        'complete': function(xhr, result) {
          if (result != 'success') {
            modalAlert('Network failure', 'Drumy error!');
          }
          else {
            $("#back-home2").animate({"left":0}, 200);
            $("body").animate({"opacity":0}, 400, function () {
              window.location = "../index.php";
            });
          }
        }
      });
    }
    else {
      $("#back-home2").animate({"left":0}, 200);
      $("body").animate({"opacity":0}, 400, function () {
        window.location = "../index.php";
      });
    }
  });


}); // fin ready
