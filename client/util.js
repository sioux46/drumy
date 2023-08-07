// util


var DRU_GREEN = "HSLA(121,40%,54%,1)";
var DRU_ORANGE = "HSLA(35,84%,62%,1)";
var DRU_BLUE = "HSLA(194,66%,61%,1)";

var DRU_BLUE_DARK = "HSLA( 194, 100%, 50%, 0.7 )";

var DRU_GREEN_DOM = "HSLA(121,70%,45%,1)"; // pour domino
var DRU_ORANGE_DARK = "HSLA(35,84%,50%,1)"; // pour mots

var BACK_CLAVIER = "HSLA(45, 30%, 60%,1)";
var BACK_CLAVIER_ACTIF = "HSLA(45, 30%, 45%,1)";

var DRU_DOM_GRAY_PASSIF = "HSLA(0,0%,92%,1)";
var DRU_DOM_GRAY_ACTIF = "HSLA(0,0%,25%,1)";
var DRU_DOM_GRAY_ACTIF2 = "HSLA(0,0%,60%,1)";

var DRU_YELLOW = "HSLA(60,100%,50%,1)";

var CHAR_BY_WORD = 6;

var drumyVersion;
var trySaveWaitingInterval = 0; // tempo trySaveWaiting


// ***************************************************  F U N C T I O N S

//***************************************************** modalConfirm
function modalConfirm ( message, action ) {
  $('#modal-confirm').modal('show');
  $('#modal-confirm .dru-confirm').attr('data-dru-action', action);
  $("#modal-confirm .modal-body p").text(message);
}

//***************************************************** modalConfirm
function modalConfirmTest () {
  $('#modal-confirm').modal('show');
  $("#modal-confirm .modal-body p").text('Test, Normal or Clear + Normal');
}

//***************************************************** modalAlert
function modalAlert ( message, titre , message2) {
  $('#modal-alert').modal('show');
  $("#modal-alert .modal-body .dru-text").text(message);
  $("#modal-alert .modal-title").text(titre);
  if ( message2 ) $("#modal-alert .modal-body .dru-text2").text(message2);
}

// ----------------------------------------------  now
function now () {
  return new Date().getTime();
}

function dateTime() {
	var dt = new Date();
	var date = dt.getDate().toString();
	if (date.length == 1) date = '0' + date;
	var month = (dt.getMonth() + 1).toString();
	if (month.length == 1) month = '0' + month;
	var year = dt.getYear() + 1900;

	date = year + '-' + month + '-' + date;
	var time = dt.toTimeString().match(/^(.{8})/)[1];
	return {date:date, time:time};
}

//--------------------------------------------- updateUserScore
function updateUserScore ( item, value, levelId ) {
  // item =
  // value = open, closed, success
  // levelId OPTIONNEL
  var id;
  if ( !levelId ) id = sessionStorage.levelId;
  else id = levelId;

  var userData = JSON.parse(localStorage.drumy);
  var score = userData.score[id];

  score[item] = value;

  userData.score[levelId] = score;
  localStorage.drumy = JSON.stringify(userData);
}

//--------------------------------------------- updateUserLevels
function updateUserLevels ( value, levelId ) {
  //  value = open, closed, success
  // levelId OPTIONNEL
  var id;
  if ( !levelId ) id = sessionStorage.levelId;
  else id = levelId;

  var userData = JSON.parse(localStorage.drumy);
  userData.levels[id] = value;
  localStorage.drumy = JSON.stringify(userData);
}

//-------------------------------------------- userLevels
function userLevelState ( levelId ) {
  // levelId OPTIONNEL
  var id;
  if ( !levelId ) id = sessionStorage.levelId;
  else id = levelId;

  return (JSON.parse(localStorage.drumy)).levels[id];
}

// --------------------------------------------- trySaveWaiting
function trySaveWaiting () {

  if ( sessionStorage.flagWaitingWrite == 'no' ) return; // saveCycle() en cours
  var urlRoot;
  var waitingCycles = JSON.parse(sessionStorage.waitingCycles);

  if ( waitingCycles.length ) {
    if ( window.location.pathname.indexOf('index') != -1 ) urlRoot = '';
    else urlRoot = '../';
    $.ajax({
      'url': urlRoot + 'inc/connectMySqlW.php',
      'type': 'post',
      'complete': function(xhr, result) {
        if (result != 'success') {
        //  modalAlert ( 'Network failure. Waiting cycle not saved.', 'Drumy error!');
        }
        else {
          var reponse = xhr.responseText;
          $.ajax({
            'url': urlRoot + 'server/ajaxSaveCycle.php',
            'type': 'post',
            'data': { data: waitingCycles.shift() },
            'complete': function(xhr, result) {
              if (result != 'success') {
                modalAlert ( 'Network failure. Waiting cycle not saved.', 'Drumy error!');
              }
              else {
                var reponse = xhr.responseText;
                sessionStorage.waitingCycles = JSON.stringify(waitingCycles);
                if ( window.location.pathname.indexOf('dom36') != -1 ) updateWaitingDisplay();
              }
            }
          }); // fin ajax 2

        }
      }
    });// fin ajax 1

  }
}


//*************************************************** fin functions

//**********************************************************************
//**********************************************************************
// ----------------------------------------------  R E A D Y
$(document).ready(function () {

  if ( !trySaveWaitingInterval ) {
    trySaveWaitingInterval = setInterval( function () {
      trySaveWaiting();
    }, 5000);
  }

}); // ------------------------------------------------------  fin ready
// ---------------------------------------------------------------------


/*
//**********************************************************************************************
function carcasseAjax(data, url) {

$.ajax({
  'url': url,
  'data': { 'data':theData, mail: storedMail() },
  'complete': function(xhr, result) {
    //
    if (result != 'success') {
      //
    }
    else {
      var reponse = xhr.responseText;
      if (reponse != 'OK') {
        //
      }
      else {
        //
      }
    }
  }
});

}
*/
