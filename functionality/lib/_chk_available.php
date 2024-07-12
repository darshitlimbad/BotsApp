<?php
    if(isset($_GET['passkey']) && $_GET['passkey'] == "khuljasimsim") {
        include '../db/_conn.php';
        include '_validation.php';
        
        if(isset($_GET['UNM'])){
            $point = 'unm';
            $point_val = base64_decode($_GET['UNM']);
        }else if(isset($_GET['EMAIL'])){
            $point = 'email';
            $point_val = base64_decode($_GET['EMAIL']);
        }

        echo !is_data_present('users' , [$point] ,[$point_val] );
    }
?>