<?php
    $host = "localhost";
    $unm = "root";
    $pass = "";
    $db = "Botsapp";

    $GLOBALS['conn'] = new mysqli( $host , $unm , $pass , $db );

    if($GLOBALS['conn'] -> connect_error) {
        die("Database Connection failed: " . $GLOBALS['conn']->connect_error);
    } 
?>