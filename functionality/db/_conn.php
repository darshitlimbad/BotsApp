<?php
    // php.ini changes
        define("MAX_DOC_SIZE" , 16777200);
        define("REQUEST_TIME",2);
    // 

    $host = "localhost";
    $unm = "root";
    $pass = "";
    $db = "botsapp";

    try{
    $GLOBALS['conn'] = new mysqli( $host , $unm , $pass , $db );
    $GLOBALS['status'] = new mysqli( $host , $unm , $pass , "botsapp_statusDB" );

    if($GLOBALS['conn'] -> connect_error)
        die("Database Connection failed: " . $GLOBALS['conn']->connect_error);
    if($GLOBALS['status'] -> connect_error)
        die("Online real time status database Connection failed: " . $GLOBALS['status']->connect_error);

    }catch(Exception $e){
        echo "Database is offline.";
        die();
    }
    $imgDir = sys_get_temp_dir()."/images/";
    if(!file_exists($imgDir))
        mkdir($imgDir, 0777, true);
    setcookie("imgDir", $imgDir, time()+86400,"/");

    function insertData(string $table, array $columns , array $values , $db = "conn")   {
        try{
            foreach($columns as $key => $val){
                $columns[$key] = trim($val);
            }
            foreach($values as $key => $val){
                $values[$key] = trim($val);
            }

            if(sizeof($columns) != sizeof($values))
                throw new Exception( "Columns size is not equal to values size", 400);
    
            $paramtypes =  str_repeat('s' , count($values));
            $column_str =  implode(',' , $columns);
            $values_str =  implode( ',' , array_fill(0 , count($values) , '?') );
    

            $query = "INSERT INTO `$table`($column_str) VALUES ($values_str)";
            $stmt = $GLOBALS[$db]->prepare($query);
            $stmt->bind_param($paramtypes , ...$values);
            $sqlfire = $stmt->execute();
            $stmt ->close();

            if($sqlfire) {
                return 1;
            }else {
                return 0;
            }
        }catch(Exception $e) {
            return 0;
        }
    }

    // fetch data by table name , column for where point , point value , parameter of columns you want to fetch
    function fetch_columns( $table , array $points , array $point_values , array $columns, $db="conn"){
        try{
            foreach($columns as $key => $val){
                $columns[$key] = trim($val);
            }
            foreach($points as $key => $val){
                $points[$key] = trim($val);
            }
            foreach($point_values as $key => $val){
                $point_values[$key] = trim($val);
            }
            
            if(sizeof($points) != sizeof($point_values))
                throw new Exception( "Point size is not equal to Point Value size", 400);

            $point_str = "";
            $i=0;
            foreach($points as $point){

                $point_str .="`" . $point . "` = ". ' ? ';
                ++$i;
                if(sizeof($points) != $i)
                    $point_str .= ' AND ';
            }

            $bind_param = str_repeat("s" , count($point_values));

            $query = "SELECT ". implode(' , ' , $columns) ." FROM `$table` WHERE $point_str ";
            $stmt  = $GLOBALS[$db] -> prepare($query);
            $stmt->bind_param($bind_param , ...$point_values);
            $sqlfire = $stmt->execute();

            if($sqlfire){
                $result = $stmt->get_result();
                $stmt->close();
                return $result;
            }else {
                return 400;
            }
        }catch(Exception $e){
            return 0;
        }
    }

    function search_columns( $table , $point , $point_value , ...$columns){
        try{
            $point_value = '%'.$point_value.'%';
            $query = "SELECT ". implode(' , ' , $columns) ." from `$table` WHERE `$point` LIKE ?";
            $stmt  = $GLOBALS['conn'] -> prepare($query);
            $stmt->bind_param('s' , $point_value );
            $sqlfire = $stmt->execute();

            if($sqlfire){
                $result = $stmt->get_result();
                $stmt->close();
                if($result -> num_rows > 0)   
                    return $result;
                else
                    return 0;
            }else {
                return 0;
            }
        }catch(Exception $e){
            return 0;
        }
    }

    function updateData($table,array $columns ,array $values , $point, $point_value , $db="conn" )   {
        try{
            foreach($columns as $key => $val){
                $columns[$key] = trim($val);
            }
            foreach($values as $key => $val){
                $values[$key] = trim($val);
            }

            if(sizeof($columns) != sizeof($values))
                throw new Exception( "Columns size is not equal to values size", 400);

            //adding point value in the value variable for using bind_param
            $values[]=$point_value;
            
            $bind_param =  str_repeat('s' , count($values));

            $str="";
            foreach($columns as $column){
                if($str != ""){
                    $str.=",";
                }
                $str .= $column . " = ". ' ? ';
            }

            $query = "UPDATE `$table` SET $str WHERE `$point` = ?";
            $stmt = $GLOBALS[$db]->prepare($query);
            $stmt->bind_param($bind_param , ...$values);
            $sqlfire = $stmt->execute();
            $stmt ->close();

            if($sqlfire) {
                return 1;
            }else {
                return 0;
            }
        }catch(Exception $e){
            return 0;
        }
    }

    // delete users table data
    function deleteData($table,$ID ,$where = "userID", $db='conn'){
        try{
            $query = "DELETE FROM `$table` WHERE `$where` = ?";
            $stmt = $GLOBALS[$db]->prepare($query);
            $stmt->bind_param('s' , $ID);
            $sqlfire = $stmt->execute();
            $stmt->close();

        return $sqlfire;

        }catch(Exception $e){
            return 0;
        }
    }

?>