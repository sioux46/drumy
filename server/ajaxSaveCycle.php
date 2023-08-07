<?php
// ajaxSaveCycle.php
session_start();
require_once("../inc/connectMySqlW.php");
$base=connect();
//
header("content-type:text/plain; charset=utf-8");
header("Access-Control-Allow-Origin: *");

$base->autocommit(FALSE); // section critique

$leveldata = json_decode($_POST['data'], true);

for ( $i = 0; $i < count($leveldata); $i++ ) {
//  $leveldata[$i] = json_decode($leveldataOrg[$i], true);

  $query = "INSERT INTO `leveldata` SET `connectionIndex` = '" . $leveldata[$i]['connectionIndex'] . "' ";

//  $datum = $leveldata[$i]['identifier'];
//  $query = $query . ", `identifier` = '$datum'";
  $query = $query . ", `identifier` = '" . $leveldata[$i]['identifier'] . "'";

  $query = $query . ", `chalenge` = '" . $leveldata[$i]['chalenge'] . "'";

  $query = $query . ", `targetChar` = '" . $leveldata[$i]['targetChar'] . "'";

  $query = $query . ", `reponse` = '" . $leveldata[$i]['reponse'] . "'";

  $query = $query . ", `duration0` = '" . $leveldata[$i]['duration0'] . "'";

  $query = $query . ", `duration` = '" . $leveldata[$i]['duration'] . "'";

  $query = $query . ", `timestamp` = '" . $leveldata[$i]['timestamp'] . "'";

  $query = $query . ", `date` = '" . $leveldata[$i]['date'] . "'";

  $query = $query . ", `time` = '" . $leveldata[$i]['time'] . "'";

  $query = $query . ", `cycleIndex` = '" . $leveldata[$i]['cycleIndex'] . "'";

  $query = $query . ", `cycleType` = '" . $leveldata[$i]['cycleType'] . "'";

  $query = $query . ", `keyboardType` = '" . $leveldata[$i]['keyboardType'] . "'";

  $query = $query . ", `chaKeys` = '" . $leveldata[$i]['chaKeys'] . "'";

  $query = $query . ", `chaKey1` = '" . $leveldata[$i]['chaKey1'] . "'";

  $query = $query . ", `chaKey2` = '" . $leveldata[$i]['chaKey2'] . "'";

  $query = $query . ", `chaKey3` = '" . $leveldata[$i]['chaKey3'] . "'";

  $query = $query . ", `repDigits` = '" . $leveldata[$i]['repDigits'] . "'";

  $query = $query . ", `repKey1` = '" . $leveldata[$i]['repKey1'] . "'";

  $query = $query . ", `repKey2` = '" . $leveldata[$i]['repKey2'] . "'";

  $query = $query . ", `repKey3` = '" . $leveldata[$i]['repKey3'] . "'";

  $query = $query . ", `repVal` = '" . $leveldata[$i]['repVal'] . "'";

  $query = $query . ", `keyboardChoise` = '" . $leveldata[$i]['keyboardChoise'] . "'";

  $query = $query . ", `newWord` = '" . $leveldata[$i]['newWord'] . "'";

  $query = $query . ", `level` = '" . $leveldata[$i]['level'] . "'";

  $query = $query . ", `hand` = '" . $leveldata[$i]['hand'] . "'";

  $result = $base->query($query);

  if ( $base->errno == 0 ) $reponse = "ok";
  else {

    $base->rollback(); // annulation écriture

    $reponse = $base->errno . ' '. $base->error . ' erreur!!! ' . $query;
    echo 'rep: ' . $reponse . ' query: ' . $query . ' IIIII ';
    exit(1);
  }
}
echo 'rep: ' . $reponse . ' query: ' . $query . ' IIIII ';
$base->commit(); // fin section critique
?>
