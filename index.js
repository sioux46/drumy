// index.js

drumyVersion = '123';

// **********************************************************************
// ***************************************************  F U N C T I O N S

//*************************************************** connection
function connection () {

  if ( !localStorage.userName ) askUserName();
  else {
    var userName;
    if ( localStorage.userName ) userName = localStorage.userName;
    else userName = '';
    $.ajax({
      url: 'connection_count.php',
      type:'post',
      data: { 'identifier': sessionStorage.identifier,
              'userName': userName,
              'userAgent': window.navigator.userAgent.substr(12),
              'drumyVersion': drumyVersion,
              'language': window.navigator.language,
              'platform': window.navigator.platform,
              'innerWidth': window.innerWidth,
              'innerHeight': window.innerHeight,
              'outerHeight':window.outerHeight
      },
      complete: function(xhr, result) {
        // alert('complete');
        if (result != 'success') {
          localStorage.userName = '';
          modalAlert ( 'Network failure. Close app and try again.', 'Drumy error!' );
        }
        else {
          sessionStorage.connectionIndex = xhr.responseText;
          initLevels();
        }
      }
    });
  }
}

//------------------------------------------------ toLevel
function toLevel (event, fileName) {

  if ( JSON.parse(localStorage.drumy).levels[$(event.target).attr("id")] == 'closed') return;

  sessionStorage.levelId = event.target.id;

  if ( localStorage.app == 'realApp'  &&  sessionStorage.os == 'android' ) {
    $.ajax({
      'url': 'inc/connectMySqlW.php',
      'type': 'post',
      'complete': function(xhr, result) {
        if (result != 'success') {
          modalAlert('Network failure', 'Drumy error!');
        }
        else {
          $(event.target).children("div").animate({"width":"4rem"}, 400,
            function () {
              $("body").animate({"opacity":0}, 400, function () {
                window.location = "client/" + fileName + ".php";
              });
            }
          );
        }
      }
    });
  }
  else {
    $(event.target).children("div").animate({"width":"4rem"}, 400,
      function () {
        $("body").animate({"opacity":0}, 400, function () {
          window.location = "client/" + fileName + ".php";
        });
      }
    );
  }

}

//------------------------------------------------- addLevelEvent
function addLevelEvent (levelName, fileName) {
   $("#" + levelName + "-l, #" + levelName + "-r").on("touchstart", function (event) { toLevel(event, fileName); });

  // $("#" + levelName + "-l, #" + levelName + "-r").on("click", function (event) { toLevel(event, fileName); });
}

//------------------------------------------------- initLevels
function initLevels () {
  // affichage ouverture des niveaux

  var userData = JSON.parse(localStorage.drumy);
  var color;
  var state;
  var levelName;
  for ( var levelId in userData.levels ) {
    state = userData.levels[levelId];
    levelName = levelId.substr(0, levelId.length - 2);

    if ( state == "success" ) color = DRU_GREEN;
    else if ( state == "open" || state == "alpha") color = DRU_ORANGE;

    if ( state != "closed" ) {
      $("#" + levelName).css({"opacity":"1"});
      $("#" + levelId + " div").css({"background-color": color});
      addLevelEvent (levelName, userData.files[levelName]);
    }
  }
}

//-------------------------------------------------- initStorage
function initStorage () {
  if ( localStorage.drumy ) userData = JSON.parse(localStorage.drumy);
  else userData = {};

                                                    // 7 derniers chiffres de now
  if ( !userData.identifier ) userData.identifier = String(now()).substr(-7);
  sessionStorage.identifier = userData.identifier;  // rendre l'identifier accessible à la session

  if ( !userData.levels ) userData.levels = {}; // levels
  if ( !userData.levels['speed-l'] ) userData.levels['speed-l'] = 'open';
  if ( !userData.levels['speed-r'] ) userData.levels['speed-r'] = 'open';

  if ( !userData.levels['dom1-l'] ) userData.levels['dom1-l'] = 'closed';
  if ( !userData.levels['dom1-r'] ) userData.levels['dom1-r'] = 'closed';
  if ( !userData.levels['sig1-l'] ) userData.levels['sig1-l'] = 'closed';
  if ( !userData.levels['sig1-r'] ) userData.levels['sig1-r'] = 'closed';
  if ( !userData.levels['memory1-l'] ) userData.levels['memory1-l'] = 'closed';
  if ( !userData.levels['memory1-r'] ) userData.levels['memory1-r'] = 'closed';
  if ( !userData.levels['words1-l'] ) userData.levels['words1-l'] = 'closed';
  if ( !userData.levels['words1-r'] ) userData.levels['words1-r'] = 'closed';
  if ( !userData.levels['dictation1-l'] ) userData.levels['dictation1-l'] = 'closed';
  if ( !userData.levels['dictation1-r'] ) userData.levels['dictation1-r'] = 'closed';

  if ( !userData.levels['dom2-l'] ) userData.levels['dom2-l'] = 'closed';
  if ( !userData.levels['dom2-r'] ) userData.levels['dom2-r'] = 'closed';
  if ( !userData.levels['sig2-l'] ) userData.levels['sig2-l'] = 'closed';
  if ( !userData.levels['sig2-r'] ) userData.levels['sig2-r'] = 'closed';
  if ( !userData.levels['memory2-l'] ) userData.levels['memory2-l'] = 'closed';
  if ( !userData.levels['memory2-r'] ) userData.levels['memory2-r'] = 'closed';
  if ( !userData.levels['words2-l'] ) userData.levels['words2-l'] = 'closed';
  if ( !userData.levels['words2-r'] ) userData.levels['words2-r'] = 'closed';
  if ( !userData.levels['dictation2-l'] ) userData.levels['dictation2-l'] = 'closed';
  if ( !userData.levels['dictation2-r'] ) userData.levels['dictation2-r'] = 'closed';

  if ( !userData.score ) userData.score = {}; // score
  if ( !userData.score['speed-l'] ) userData.score['speed-l'] = {};
  if ( !userData.score['speed-r'] ) userData.score['speed-r'] = {};

  if ( !userData.score['dom1-l'] ) userData.score['dom1-l'] = {};
  if ( !userData.score['dom1-r'] ) userData.score['dom1-r'] = {};
  if ( !userData.score['sig1-l'] ) userData.score['sig1-l'] = {};
  if ( !userData.score['sig1-r'] ) userData.score['sig1-r'] = {};
  if ( !userData.score['memory1-l'] ) userData.score['memory1-l'] = {};
  if ( !userData.score['memory1-r'] ) userData.score['memory1-r'] = {};
  if ( !userData.score['words1-l'] ) userData.score['words1-l'] = {};
  if ( !userData.score['words1-r'] ) userData.score['words1-r'] = {};
  if ( !userData.score['dictation1-l'] ) userData.score['dictation1-l'] = {};
  if ( !userData.score['dictation1-r'] ) userData.score['dictation1-r'] = {};

  if ( !userData.score['dom2-l'] ) userData.score['dom2-l'] = {};
  if ( !userData.score['dom2-r'] ) userData.score['dom2-r'] = {};
  if ( !userData.score['sig2-l'] ) userData.score['sig2-l'] = {};
  if ( !userData.score['sig2-r'] ) userData.score['sig2-r'] = {};
  if ( !userData.score['memory2-l'] ) userData.score['memory2-l'] = {};
  if ( !userData.score['memory2-r'] ) userData.score['memory2-r'] = {};
  if ( !userData.score['words2-l'] ) userData.score['words2-l'] = {};
  if ( !userData.score['words2-r'] ) userData.score['words2-r'] = {};
  if ( !userData.score['dictation2-l'] ) userData.score['dictation2-l'] = {};
  if ( !userData.score['dictation2-r'] ) userData.score['dictation2-r'] = {};

  if ( !userData.files) userData.files = {};  //  files
  if ( !userData.files.speed ) userData.files.speed = 'speed';

  if ( !userData.files.dom1 ) userData.files.dom1 = 'dom36';
  if ( !userData.files.sig1 ) userData.files.sig1 = 'dom36';
  if ( !userData.files.memory1 ) userData.files.memory1 = 'dom36';
  if ( !userData.files.words1 ) userData.files.words1 = 'dom36';
  if ( !userData.files.dictation1 ) userData.files.dictation1 = 'dom36';

  if ( !userData.files.dom2 ) userData.files.dom2 = 'dom36';
  if ( !userData.files.sig2 ) userData.files.sig2 = 'dom36';
  if ( !userData.files.memory2 ) userData.files.memory2 = 'dom36';
  if ( !userData.files.words2 ) userData.files.words2 = 'dom36';
  if ( !userData.files.dictation2 ) userData.files.dictation2 = 'dom36';

  localStorage.drumy = JSON.stringify(userData);
}


//------------------------------------------------- dashboardAlert
function dashboardAlert () {

  var userData = JSON.parse(localStorage.drumy);
  var text = '<center style="position:relative;top:-1rem;">' + localStorage.userName + ' (id: ' + sessionStorage.identifier + ')</center>';
  var ident = '<center><strong>Your Best Means</strong></center>';
  text = text + ident + '<tbody></th></tr></thead><table class="table table-sm"><tbody>';
  var moy, moy0;
  for ( var level in userData.score ) {
    moy = userData.score[level].moyCycle;
    moy0 = userData.score[level].moyCycle0;
    if ( moy ) {
      if ( level != 'speed-l' && level != 'speed-r' ) {
        if ( moy && moy != 999999 ) {
          moy = moy / 1000; // secondes par char
          moy = moy * CHAR_BY_WORD; // secondes par mot
          moy = ( 60 / moy  ).toFixed(0); // wpm

          moy0 = moy0 / 1000; // secondes par char
          moy0 = moy0 * CHAR_BY_WORD; // secondes par mot
          moy0 = ( 60 / moy0  ).toFixed(0); // wpm
        }
        text = text + '<tr><td>' + level + '</td><td>' + moy0 + ' wpm</td><td>(' + moy + ' wpm)</td></tr>';
      }
      else text = text + '<tr><td>' + level + '</td><td>' + moy + ' wpm</td></tr>';
    }
  }
  text = text + '</tbody></table>';

  $('#dashboard-alert').modal('show');
  $("#dashboard-alert .modal-body.dru-dashboard").html(text);
  $("#dashboard-alert .modal-title").text('Dashboard');
}

//*************************************************** askUserName
  function askUserName () {
    $('#modal-user-name').modal('show');
    $("#user-name").val('');
  }

//*************************************************** fin functions
//******************************************************************



// -------------------------------------------------- R E A D Y

$(document).ready(function () {


  var test;
  if ( localStorage.test ) test = 'true';
  else test = 'false';

  if ( !localStorage.userKeyboardSize ) localStorage.userKeyboardSize = 'regular';

  if ( !sessionStorage.waitingCycles ) sessionStorage.waitingCycles = JSON.stringify([]);
  if ( !sessionStorage.flagWaitingWrite ) sessionStorage.flagWaitingWrite = 'yes';

  if ( navigator.userAgent.indexOf('Android') != -1 ) sessionStorage.os = 'android';
  else sessionStorage.os = 'ios';

//  user name
  $('#modal-user-name').on( 'hidden.bs.modal', function (e) {
    var trimedName = $.trim($("#user-name").val());
    if ( !trimedName ) trimedName = 'Anonymous';
		if ( trimedName.match(/^[a-zA-Z](\w|_|-)+$/) ) {
      localStorage.userName = trimedName;
      connection();
      initLevels();
      modalAlert('Hello ' + trimedName + '!', '');
    }
    else askUserName();
  });

  $('#modal-user-name').on('shown.bs.modal', function (e) {
    $('#user-name').focus();
    //$('#user-name').val('Anonymous');
    //$('#user-name').select();
  });

  // dashboard
  $("#dashboard-button").on('touchstart', function () {
    dashboardAlert();
  });

  $("#clear-user-data").on('click', function () {
    $('#modal-confirm').modal('hide');
    localStorage.clear();
    sessionStorage.clear();
    setTimeout( function () {
      window.location = "index.php";
    },400);
  });


  // affichage version Drumy
  $("body").append("<code id='version-num'><small></small></code>");  // version
  $("#version-num").css({"position": "fixed", "bottom": "0rem", "left": "0.1rem"});
  $("#version-num small").text(drumyVersion);

  $("#version-num").on("click", function (event) {  // param test
    modalConfirmTest();
  });


  $("body").addClass("no-selmenu"); // stop menu copier/coller
//  $("body").css({"overflow-y": "hidden"}); // stop pull-down-to-refresh

  $("tr, th, td, h4").addClass("dru-center");

  $("td span").css({
                    "position": "relative",
                    "top": "0.3rem",
                    "font-size": "1.1rem"
  });

  $(".dru-level-square div").css({  // td col. 1 et 3
                    "position": "relative",
//                    "top": "0.5rem",
                    "width": "2rem",
                    "height": "2rem",
                    "background-color": DRU_DOM_GRAY_PASSIF,
                    "pointer-events": "none"
  }).addClass("center-block");

  $(".dru-label span").css({
                  "font-size": "1.2rem",
                  "font-weight": "bold",
            //      "background-color": DRU_BLUE,
                  "pointer-events": "none"
  });

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                                          // modal-confirm TEST ( retour )
  $('#modal-confirm button').on('touchstart', function (e) {
    // test action
    if ( $( e.target ).attr("data-dru-action") == 'test') {
      localStorage.test = 'true';
    }
    else if ( $( e.target ).attr("data-dru-action") == 'normal' ) {
      localStorage.test = 'false';
    }
    else if ( $( e.target ).attr("data-dru-action") == 'clear' ) {
      localStorage.clear();
      sessionStorage.clear();
    }
    $('#modal-confirm').modal('hide');
    setTimeout( function () {
      window.location = "index.php";
    },400);
  });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++   start

  initStorage();
  if ( !sessionStorage.connectionIndex ) connection();
  else initLevels();

// +++++++++++++++++++++++++++++++++++++++++++++++++++

  //  gestion du retour d'un niveau
  if ( sessionStorage.backLevel ) {
    sessionStorage.backLevel = '';
    var OpenNextLevelTime;
    var nextLevelId;
    var sessionStorageLevelId =  sessionStorage.levelId;
    var sessionStorageFlagOpenNextLevel = sessionStorage.flagOpenNextLevel;
    if ( sessionStorageFlagOpenNextLevel == 'ok' || sessionStorageFlagOpenNextLevel == 'alpha' ) {
      OpenNextLevelTime = 0;

      // ouverture simultap
      if ( sessionStorage.levelId == 'speed-l' ) updateUserLevels('open', 'dom2-l');
      if ( sessionStorage.levelId == 'speed-r' ) updateUserLevels('open', 'dom2-r');

      if ( sessionStorageFlagOpenNextLevel == 'ok') {
        updateUserLevels('success'); // update localStorage niveau courant
        nextLevelId = $("#" + sessionStorage.levelId).attr("data-next"); // niveau suivant à ouvrir
        updateUserLevels('open', nextLevelId); // update localStorage niveau suivant
        initLevels();
        $("#" + nextLevelId + " div").css({"height": "6rem"});
      }
      else updateUserLevels('alpha');
    }
    else OpenNextLevelTime = 600;

    if ( sessionStorageFlagOpenNextLevel != 'ok' ) $("#" + sessionStorageLevelId).children("div").css({"width": "4rem"});
    $("#" + sessionStorageLevelId).children("div").animate({"width": "2rem"}, OpenNextLevelTime, function () {
      if ( sessionStorageFlagOpenNextLevel == 'ok' ) {
        $("#" + nextLevelId + " div").animate({"height": "2rem"}, 600);
      }
    });
    sessionStorage.flagOpenNextLevel = '';
  }

}); // ------------------------------------------------------  fin ready
