<?php
    //include 'db/_conn.php';

    function get_dp($userID) {
        $table = "users_avatar";
        $condition = "userID";

        $img = fetch_columns( $table , $condition , $userID , "type" , "img" );

        


    // i want to return "data:image/jpeg;base64, php base64_encode(img_data) php_end"
    }
?>