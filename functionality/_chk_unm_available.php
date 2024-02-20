<?php
    if(isset($_GET['UNM'])) {
    include 'db/_conn.php';

    $unm = $_GET['UNM'];

    $result = fetch_columns("users" , "unm" , $unm , "unm");
    if($result->num_rows == 0){
        echo 1;
    }else{
        echo 0;
    }
}
?>