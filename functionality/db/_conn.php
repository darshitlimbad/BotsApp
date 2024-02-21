<?php
    $host = "localhost";
    $unm = "root";
    $pass = "";
    $db = "Botsapp";

    $GLOBALS['conn'] = new mysqli( $host , $unm , $pass , $db );

    if($GLOBALS['conn'] -> connect_error) {
        die("Database Connection failed: " . $GLOBALS['conn']->connect_error);
    } 

    function fetch_columns( $table , $condition , $condition_value , ...$columns){
        
        $query = "SELECT ". implode(' , ' , $columns) ." FROM `$table` WHERE `$condition` = ?";
        $stmt  = $GLOBALS['conn'] -> prepare($query);
        $stmt->bind_param('s' , $condition_value);
        $sqlfire = $stmt->execute();

        if($sqlfire){
            $result = $stmt->get_result();
            $stmt->close();
            return $result;
        }else {
            return 400;
        }
    }
?>