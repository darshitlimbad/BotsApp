<?php
    $host = "localhost";
    $unm = "root";
    $pass = "";
    $db = "Botsapp";

    $GLOBALS['conn'] = new mysqli( $host , $unm , $pass , $db );

    if($GLOBALS['conn'] -> connect_error) {
        die("Database Connection failed: " . $GLOBALS['conn']->connect_error);
    } 

    function fetch_columns($where , $value , ...$columns){
        $query = "SELECT ". implode(',' , $columns) ." FROM `users` WHERE `$where` = ?";
        $stmt  = $GLOBALS['conn'] -> prepare($query);
        $stmt->bind_param('s' , $value);
        $sqlfire = $stmt->execute();

        if($sqlfire){
            return $stmt->get_result();
        }else {
            return '400';
        }
    }
?>