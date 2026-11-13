<?php
define("ROOT",dirname(__DIR__));


define("IS_LOCALHOST", in_array($_SERVER['HTTP_HOST'], ['localhost', '127.0.0.1']));
define("SSL", !IS_LOCALHOST);
define("DOMAIN", $_SERVER['HTTP_HOST']);
define("FILE_NAME", IS_LOCALHOST ? "mohamedamineelhadani" : "");


define("DEBUG", true);
ini_set("display_errors", DEBUG ? 1 : 0);
error_reporting(DEBUG ? E_ALL : 0);



$protocol = SSL ? "https" : "http";
$basePath = FILE_NAME ? "/" . FILE_NAME : "";
define("BASE_URL", "$protocol://" . DOMAIN . $basePath . "/");


define("ADMIN_NAME", "Mohamed Amine El Hadani");
define("ADMIN_EMAIL", "elhadanimohamedamine@gmail.com");

// ---------- Security ----------
define('SECRET_KEY', '@@@9090');

?>
