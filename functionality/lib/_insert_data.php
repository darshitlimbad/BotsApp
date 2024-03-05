<?php
    include '_validation.php';

// create users param string of columns with ',' seprater , string of column values , img type , img data in binary 
function createUser($column_str , $values_str , $avatar ) {
    $main_table = "usres";
    $res1 = insertData($main_table, $column_str , $values_str);
    if($res1 == 1) {
        $columns = explode(',' , $column_str) ;
        $values = explode(',' , $values_str);

        for($i = 0 ; $i<count($columns) ; $i++) {
            // $arr[trim($columns[$i])] = trim($values[$i]);
            if($columns[$i] == "userID"){
                $userID = trim($values[$i]);
            }
            if($columns[$i] == "unm"){
                $unm = trim($values[$i]);
            }
            
        }

        // $userID = $arr['userID'];
        // $unm = $arr['unm'];

        $res2 = insertData('users_account' , "userID , unm" , "$userID , $unm");

        if($res2 === 1) {
            $res3 = insertData('users_details' , "userID" , "$userID");

            if($res3 === 1){

                $res4 = uploadImg( $userID , $avatar );
                if($res4 === 1){
                    return 1;
                }else{
                    deleteData($main_table,$userID);
                    sleep(1);
                    throw new Exception( "something went wrong", 400);
                }

            }else{
                deleteData($main_table,$userID);
                sleep(1);
                throw new Exception( "something went wrong", 400);
            }
            
        }else{
            deleteData($main_table,$userID);
            sleep(1);
            throw new Exception( "something went wrong", 400);
        }

    }else   {
        throw new Exception( "something went wrong", 400);
    }
}

// for uploading img it takes user id img type and img tmp name
function uploadImg($userID , $img ){

    $table = 'users_avatar';
    $img_data = file_get_contents($img['tmp_name']);
    $type = $img['type'];
    
    if( $img['size'] < 1000000 ) {
        $compressedImgData = "1";
    }else{
        $compressedImg = compressImg($img);
        $compressedImgData = file_get_contents($compressedImg['tmp_name']);
    }

    if(is_data_present($table , 'userID' , $userID)){

        $query = "UPDATE `$table` SET `type` = ? , `imgData` = ? , `compressedImgData` = ? WHERE `userID` = ? ";
        $stmt = $GLOBALS['conn']->prepare($query);
        $stmt->bind_param('sss' , $type , $img_data , $compressedImgData ,  $userID);

    }else{
        $query = "INSERT INTO `$table`(`userID`,`type`,`imgData` , `compressedImgData` ) VALUES (?,?,?)";
        $stmt = $GLOBALS['conn']->prepare($query);
        $stmt->bind_param('sss' , $userID , $type , $img_data , $compressedImgData );
    }

        $sqlfire = $stmt->execute();
        $stmt ->close();

        if($sqlfire) {
            return 1;
        }else {
            return 0;
        }
}

function compressImg($img) {
    

    return $img;
}
?>