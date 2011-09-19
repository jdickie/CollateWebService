<?php
/*
* Connecting the Collate Web Service with MITHGrid
* Using local Tomcat instance 
*/ 
$ch = curl_init();

$headers = array ("Content-type: application/json;charset=UTF-8;",
		"Accept: application/json");
$content = '{
	"witnesses" : '. stripslashes($_POST['witnesses']) .'
}';


curl_setopt($ch, CURLOPT_URL,"http://107.20.241.32:8080/collatex-web-0.9/api/collate");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $content);

$response = curl_exec ($ch);

header("Content-type: text/plain");
echo $response;

?>