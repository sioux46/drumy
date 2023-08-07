<!DOCTYPE html>
<html manifest="offlineIndex.appcache">
  <head>
    <!-- Required meta tags always come first -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,  initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <link rel="icon" href="img/favicon.ico">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="index.css">

    <!-- jQuery & Bootstrap & .js -->
    <script src="lib/jquery/jquery-2.1.4.min.js"></script>
    <script src="lib/bootstrap/js/tether.min.js"></script>
    <script src="lib/bootstrap/js/bootstrap.min.js"></script>

    <script src="client/util.js"></script>
    <script src="index.js"></script>


<script>
    // disable back button
    history.pushState(null, null, 'index.php');
    window.addEventListener('popstate', function(event) {
      history.pushState(null, null, 'index.php');
    });
</script>

<!--
    <script src="client/utilLevel.js"></script>
    <script src="client/resVoice.js"></script>
    <script src="client/data/successitapConfig.js"></script>
    <script src="client/keyboard.js"></script>
    <script src="client/speed.js"></script>
    <script src="client/dom36.js"></script>
-->

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
            <p class="dru-text2 dru-alert"></p>
          </div>
        </div><!-- /.modal-content -->
        <div class="moda-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

  <!-- ************************************************* modal confirm  -->
  <div id="modal-confirm"  class="modal fade">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <p></p>
        </div>
        <div class="modal-footer">
          <button data-dru-action="test" type="button" class="btn btn-primary dru-confirm">5</button>

          <button data-dru-action="normal" type="button" class="btn btn-primary dru-confirm">26</button>

          <button data-dru-action="clear" type="button" class="btn btn-primary dru-confirm">CLEAR + 26</button>
          <br /><br />
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->

  <!-- ************************************************* dashboard  -->
  <div id="dashboard-alert"  class="modal fade">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <!--
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          -->
          <h4 class="modal-title"></h4>
        </div>

        <div class="modal-body dru-dashboard"></div>
        <center>
          <button id="clear-user-data" type="button" class="btn btn-warning">Clear User Data</button>
        </center>
        <br />
      </div><!-- /.modal-content -->

      <div class="moda-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>

    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->

  <!-- *********************************************************  -->
  <!--<div  id="dashboard-button"><img src="img/gear-black.png"></div>-->
  <!-- *********************************************************  -->
<div class="container">
  <br />
  <h4>Challenge Level Selection</h4>
  <br />
  <table class="table table-sm">
    <thead>
      <tr>
        <th>Left Hand</th>
        <th>
          <div id="dashboard-button"><img src="img/info-black.png"></div>
        </th>
        <th>Right Hand</th>
      </tr>
    </thead>
    <tbody>
      <tr id="speed">
        <td id="speed-l" data-next="dom1-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Speed Test</span></td>
        <td id="speed-r" data-next="dom1-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>

  <!--   successitap  -->
      <tr id="simul-label" class="dru-label">
        <td></td>
        <td><span>Successitap</span></td>
        <td></td>
      </tr>

      <tr id="dom1">
        <td id="dom1-l" data-next="sig1-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Dominoes</span></td>
        <td id="dom1-r" data-next="sig1-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>

      <tr id="sig1">
        <td id="sig1-l" data-next="memory1-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Letters</span></td>
        <td id="sig1-r" data-next="memory1-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>

      <tr id="memory1">
        <td id="memory1-l" data-next="words1-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Memory</span></td>
        <td id="memory1-r" data-next="words1-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>

      <tr id="words1">
        <td id="words1-l" data-next="dictation1-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Words</span></td>
        <td id="words1-r" data-next="dictation1-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>

      <tr id="dictation1">
        <td id="dictation1-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Dictation</span></td>
        <td id="dictation1-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>


<!--   simultap  -->
      <tr id="simul-label" class="dru-label">
        <td></td>
        <td><span>Simultap</span></td>
        <td></td>
      </tr>

      <tr id="dom2">
        <td id="dom2-l" data-next="sig2-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Dominoes</span></td>
        <td id="dom2-r" data-next="sig2-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>

      <tr id="sig2">
        <td id="sig2-l" data-next="memory2-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Letters</span></td>
        <td id="sig2-r" data-next="memory2-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>

      <tr id="memory2">
        <td id="memory2-l" data-next="words2-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Memory</span></td>
        <td id="memory2-r" data-next="words2-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>

      <tr id="words2">
        <td id="words2-l" data-next="dictation2-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Words</span></td>
        <td id="words2-r" data-next="dictation2-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>

      <tr id="dictation2">
        <td id="dictation2-l" class="dru-level-square">
          <div></div>
        </td>
        <td><span>Dictation</span></td>
        <td id="dictation2-r" class="dru-level-square">
          <div></div>
        </td>
      </tr>
<!-- ...........................................  -->
    </tbody>
  </table>
</div>

<!-- ************************************************* modal userName  -->
<div id="modal-user-name" class="modal fade">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Welcome!</h4>
      </div>
      <div class="modal-body">
        <label>Please enter a user name:</label>
        <input id="user-name" type="text" class="form-control">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Ok</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->





</body>
</html>
