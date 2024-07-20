<?php
    // php.ini changes
        define("SYSTEM", "ADMIN00000001");
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
            $columns = array_map('trim', $columns);
            $values = array_map('trim', $values);

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
    // @param $flags can have values like orderby .. and it's value should contain value+ ASC or DESC
    // starting flags are also can be accepted as part of where clouse
    function fetch_columns( $table , array $points , array $point_values , array $columns, $db="conn",array $flags=[]){
        try{
             // Trim columns, points, and point_values
            $columns = array_map('trim', $columns);
            $points = array_map('trim', $points);
            $point_values = array_map('trim', $point_values);
            
            if(sizeof($points) != sizeof($point_values))
                throw new Exception( "Point size is not equal to Point Value size", 400);

            // Construct the WHERE clause
            $point_str = "";
            $i=0;
            if(count($points) == 1 && $points[0] == 1){
                $point_str .= "1 = ?";
            }else{
                foreach($points as $point){
                    $point_str .="`" . $point . "` = ". ' ? ';
                    ++$i;
                    if(sizeof($points) != $i)
                        $point_str .= ' AND ';
                }    
            }
            
            // Construct the flags part of the query
            $flags_str="";
            if(count($flags) > 0){
                foreach($flags as $flag)
                    $flags_str .= trim($flag) . " ";                 
            }

            $bind_param = str_repeat("s" , count($point_values));
            $query = "SELECT ". implode(' , ' , $columns) ." FROM `$table` WHERE $point_str $flags_str";
            $stmt  = $GLOBALS[$db] -> prepare($query);
            $stmt->bind_param($bind_param , ...$point_values);
            $sqlfire = $stmt->execute();

            // echo $query, $flags_str;
            // print_r($point_values);
            // print_r($flags_values);
            if($sqlfire){
                $result = $stmt->get_result();
                $stmt->close();
                return $result;
            }else {
                return 400;
            }
        }catch(Exception $e){
            print_r($e);
            return 0;
        }
    }

    // starting flags are also can be accepted as part of where clouse
    function search_columns( $table , $point , $point_value , array $columns,string $db="conn", array $flags=[]){
        try{
            // Constructing the point value part
            $point_value = '%'.$point_value.'%';

            // Constructing the flags part of the query
            $flags_str="";
            if(count($flags) > 0){
                foreach($flags as $flag)
                    $flags_str .= trim($flag) . " ";                 
            }

            $query = "SELECT ". implode(' , ' , $columns) ." FROM `$table` WHERE `$point` LIKE ? $flags_str";
            $stmt  = $GLOBALS[$db] -> prepare($query);
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
            $columns = array_map('trim', $columns);
            $values = array_map('trim', $values);

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