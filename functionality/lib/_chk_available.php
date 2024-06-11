<?php
    if(isset($_GET['passkey']) && $_GET['passkey'] == "khuljasimsim") {
        include '../db/_conn.php';
        include '_validation.php';

        if(isset($_GET['UNM'])){
            $point = 'unm';
            $point_val = $_GET['UNM'];
        }else if(isset($_GET['EMAIL'])){
            $point = 'email';
            $point_val = $_GET['EMAIL'];
        }

        // if there will be data the is_data_present will return 1 so 1 == 0 : false
        echo (is_data_present('users' , [$point] ,[$point_val] ) == 0);
    }
?>