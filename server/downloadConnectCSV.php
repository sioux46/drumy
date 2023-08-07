<?php
// downloadConnectCSV.php
session_start();
require_once("../inc/connectMySqlW.php");
$base=connect();
$requete = "SELECT * FROM connection";
$result = $base->query($requete);
$array = arrayResult($result, 1);
arrayToCsvFile($array, 'drumyConnect.csv');
error_reporting(E_ERROR);
header('Content-Type: application/octet-stream;');
header("Content-Disposition: attachment; filename=drumyConnect" . date('y.m.d-H:i:s') . ".csv;");
header('Content-Length: '.filesize("drumyConnect.csv").';');
readfile("drumyConnect.csv");
//echo json_encode($array);  // debug
//*********************************************************************************************

function arrayResult($result, $colTitles) {
	$nbRows = $result->num_rows;

	$nbCols=$result->field_count;
	if ($colTitles) {
		$titres = $result->fetch_fields();
		for($i = 0; $i < $nbCols; $i++) {
			$tab[0][$i] = $titres[$i]->name;
		}
		$nbRows++;
	}
	$i = ($colTitles)? 1: 0;
	for (; $i < $nbRows; $i++) {
		$row = $result->fetch_array(MYSQLI_NUM);

//echo $i, "  ", "***********************************  ";  // debug

		for ($j = 0; $j < $nbCols; $j++) {
			$donn = preg_replace('/<!--/','<--',$row[$j]);   // virer les comm. html
			$tab[$i][$j] = $donn;   // utf8_encode($donn);

//echo utf8_encode($donn), "  ";  // debug

		}
	}
	return($tab);
}
//*********************************************************************************************
function arrayToCsvFile($tab, $fileName) {
	if ($f = @fopen($fileName, 'w')) {
		flock($f, LOCK_SH);
		for ($i = 0; $i < count($tab); $i++) {
			fputcsv($f, $tab[$i]);
		}
		flock($f, LOCK_UN);
		fclose($f);
	}
	else {
		echo "Impossible d'acc&eacute;der au fichier" . $fileName . ".";
	}
}
?>
