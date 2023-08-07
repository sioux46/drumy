<!DOCTYPE html>
<html manifest="../offlineIndex.appcache">
  <head>
    <!-- Required meta tags always come first -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,  initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <link rel="icon" href="../img/favicon.ico">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="../lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="../index.css">

    <!-- jQuery & Bootstrap & .js -->
    <script src="../lib/jquery/jquery-2.1.4.min.js"></script>
    <script src="../lib/bootstrap/js/tether.min.js"></script>
    <script src="../lib/bootstrap/js/bootstrap.min.js"></script>

    <script>
        // disable back button
        history.pushState(null, null, 'dom36.php');
        window.addEventListener('popstate', function(event) {
          history.pushState(null, null, 'dom36.php');
        });
    </script>


    <!--<script src='https://code.responsivevoice.org/responsivevoice.js'></script> -->
  <!--  <script src="resVoice.js"></script> -->
    <script src="data/successitapConfig.js"></script>
    <script src="util.js"></script>
    <script src="utilLevel.js"></script>
    <script src="keyboard.js"></script>
    <script src="dom36.js"></script>

    <title>Drumy playgound</title>
  </head>

  <body>
    <?php ///////////////////////////////////////////////////////////////  P H P
      session_start();
      // session_unset(); // détruit toutes les variables de la session courante
    ?>

    <!-- ************************************************* modal options  -->
    <!-- DESACTIVE -->
    <div id="modal-options"  class="modal fade">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <!--
          <div class="modal-header">
            <h5 style="text-align:center;">Options</h5>
          </div>
          -->
          <div class="modal-body">
            <!-- taille domino
            <div class="btn-group" data-toggle="buttons">
              <strong>Domino size</strong><br />
              <label class="btn btn-primary active">
                <input type="radio" name="domSize" id="domSize1" autocomplete="off" checked> Radio 1
              </label>
              <label class="btn btn-primary">
                <input type="radio" name="domSize" id="domSize2" autocomplete="off"> Radio 2
              </label>
            </div>
            -->
            <!-- taille clavier -->
            <div class="btn-group" data-toggle="buttons">
              <strong>Keyboard size</strong><br /><br />

              <label class="btn btn-primary" id="labSize1" >
                <input type="radio" name="options" checked>regular
              </label>
              <label class="btn btn-primary"  id="labSize2">
                <input type="radio" name="options">enlarged
              </label>
          </div>
          </div> <!-- fin modal-body -->
          <!--
          <div class="moda-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        -->
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->


    <!-- ************************************************* modal alert  -->
    <div id="modal-alert"  class="modal fade">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <!--
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            -->
            <h4 class="modal-title dru-text-title"></h4>
          </div>
          <div class="modal-body">
            <p class="dru-text dru-alert"></p>
            <p class="dru-text2 dru-alert"></p>
          </div>
        </div><!-- /.modal-content -->
        <div class="moda-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <!-- *********************************************************  -->


    <div  id="options-button"><img src="../img/gear-black.png"></div>
    <div  id="back-home2"><img src="../img/home-black.png"></div>

    <div  id="audio-words"><img src="../img/audio-black.png"></div>
<!--    <div class="container-fluid">  -->
      <blockquote id="titre">
        <h4></h4>
        <h5></h5>
      </blockquote>

<!-- waitingCycles -->

    <div id="waiting-cycles">
      <div id="wc0" class="w-cycle"></div>
      <div id="wc1" class="w-cycle"></div>
      <div id="wc2" class="w-cycle"></div>
      <div id="wc3" class="w-cycle"></div>
      <div id="wc4" class="w-cycle"></div>
    </div>

<!--   domino    -->

    <div id="domino">
    <div id="dom-0" class="dom line1 left"></div>
    <div id="dom-1" class="dom line1 center"></div>
    <div id="dom-2" class="dom line1 right"></div>
    <div id="dom-3" class="dom line2 right"></div>
    <div id="dom-4" class="dom line2 center"></div>
    <div id="dom-5" class="dom line2 left"></div>
    </div>

    <!-- signs  -->
        <div id="signs"></div>
    <!-- words  -->
        <div id="words"></div>

<!--   clavier   -->
    <div id="key-0" class="key line1 left"></div>
    <div id="key-1" class="key line1 center"></div>
    <div id="key-2" class="key line1 right"></div>
    <div id="key-3" class="key line2 right"></div>
    <div id="key-4" class="key line2 center"></div>
    <div id="key-5" class="key line2 left"></div>
    <div id="clavier"></div>

    <div id="ready"><img src="../img/audio-black.png"></div>

  </body>
</html>
