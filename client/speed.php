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
        history.pushState(null, null, 'speed.php');
        window.addEventListener('popstate', function(event) {
          history.pushState(null, null, 'speed.php');
        });
    </script>


    <script src="util.js"></script>
    <script src="utilLevel.js"></script>
    <script src="speed.js"></script>

    <title>Drumy playgound</title>
  </head>

  <body>
    <?php /////////////////////////////////////////////////////////////////////  P H P
      session_start();
      // session_unset(); // détruit toutes les variables de la session courante
    ?>
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
          </div>
        </div><!-- /.modal-content -->
        <div class="moda-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <!-- *********************************************************  -->


<br />

<div class="container-fluid">
  <h4>Speed Test&nbsp;&nbsp;&nbsp;</h4>
<blockquote>
    <!--  <h5>Speed Potential Evaluation</h5> -->

      Drum with one finger on the area below and test you word per minute speed.

</blockquote>
</div>


<br /><br /><br /><br /><br /><br /><br /><br /><br />
<div id="clavier-bloc">

  <div id="clavier"></div>

  <div id="speed" class="center-block">
  <!--  <div id="speedLavel"><strong>speed</strong></div>  -->
    <span id="mean">mean</span>
    <div id="speed-mean" class="back-dru-blue"><span>----</span></div>
    <div id="nsec-speed-max" class="back-dru-orange"><span>----</span></div>
    <div id="nsec-speed-mean" class="back-dru-green"><span>----</span></div>
    <span id="max">max</span>
  </div>
  <div id="ready"><h1></h1></div>

  <div  id="back-home2"><img src="../img/home-black.png"></div>
  </body>
</html>
