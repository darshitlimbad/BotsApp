<?php

use function PHPSTORM_META\type;

    session_start();
    include_once('../functionality/db/_conn.php');
    include_once('../functionality/lib/_validation.php');

    $userID = getDecryptedUserID();

    $query = "SELECT TIME(`last_on_date`) FROM `on_status` WHERE `userID` = 'User00000001'";
    $data = $GLOBALS['status'] -> query($query); 
    $date =  $data->fetch_column();
    $time = "18:23:50";
    echo $time;

?>