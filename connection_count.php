<?php
//connection_count.php
session_start();
require_once("inc/connectMySqlW.php");
$base=connect();
//
header("content-type:text/plain; charset=utf-8");
header("Access-Control-Allow-Origin: *");

$date = date('Y-m-d');
$time = date('H:i:s');
$identifier = $_POST["identifier"];
$userName = $_POST["userName"];
$clientIP = $_SERVER["REMOTE_ADDR"];
$drumyVersion = $_POST["drumyVersion"];
$userAgent = $_POST["userAgent"];
$language = $_POST["language"];
$platform = $_POST["platform"];
$innerWidth = $_POST["innerWidth"];
$innerHeight = $_POST["innerHeight"];
$outerHeight = $_POST["outerHeight"];

//echo $version; exit;
//
$query = "INSERT INTO connection (identifier, userName, clientIP, date, time, drumyVersion, userAgent, language, platform, innerWidth, innerHeight, outerHeight) VALUES ('$identifier', '$userName', '$clientIP', '$date', '$time', '$drumyVersion', '$userAgent', '$language', '$platform', $innerWidth, $innerHeight, $outerHeight)";
$result = $base->query($query);
if (!$result) {
  $err = $idcom->error;
  echo $err, " : ";
  echo $query;
}
else echo mysqli_insert_id($base);  # retourne l'index de la connection
?>
