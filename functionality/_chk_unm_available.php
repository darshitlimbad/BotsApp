<?php
    if(isset($_GET['UNM'])) {
    include 'db/_conn.php';
    $unm = $_GET['UNM'];
    $query = "SELECT `unm` FROM `users` WHERE `unm`= ? ";
    $stmt = $GLOBALS['conn']->prepare($query);
    $stmt->bind_param( "s" , $unm );
    $sqlfire = $stmt->execute();

    if($sqlfire) {
        $result = $stmt->get_result();
        if($result->num_rows == 0){
            echo 1;
        }else{
            echo 0;
        }
    }
    
    $stmt->close();

    }
?>