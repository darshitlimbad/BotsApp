<?php
    include '_validation.php';

// create users param string of columns with ',' seprater , string of column values , img type , img data in binary 
function createUser($column_str , $values_str , $img_type , $img_tmp_name ) {
    $table = "users";
    $res1 = insertData($table, $column_str , $values_str);
    if($res1 == 1) {
        $columns = explode(',' , $column_str) ;
        $values = explode(',' , $values_str);

        for($i = 0 ; $i<count($columns) ; $i++) {
            $arr[trim($columns[$i])] = trim($values[$i]);
        }

        $userID = $arr['userID'];
        $unm = $arr['unm'];

        $res2 = insertData('users_account' , "userID , unm" , "$userID , $unm");

        if($res2 === 1) {
            $res3 = insertData('users_details' , "userID" , "$userID");

            if($res3 === 1){

                $res4 = uploadImg( $userID , $img_type , $img_tmp_name );
                if($res4 === 1){
                    return 1;
                }else{
                    deleteData($table,$userID);
                    sleep(1);
                    throw new Exception( "something went wrong", 400);
                }

            }else{
                deleteData($table,$userID);
                sleep(1);
                throw new Exception( "something went wrong", 400);
            }
            
        }else{
            deleteData($table,$userID);
            sleep(1);
            throw new Exception( "something went wrong", 400);
        }

    }else   {
        throw new Exception( "something went wrong", 400);
    }
}

// for uploading img it takes user id img type and img tmp name
function uploadImg($userID , $img_type , $img_tmp_name ){

    $table = 'users_avatar';
    $img_data = file_get_contents($img_tmp_name);


    if(is_data_present($table , 'userID' , $userID)){
        $query = "UPDATE `$table` SET `type` = ? , `img` = ? WHERE `userID` = ? ";
        $stmt = $GLOBALS['conn']->prepare($query);
        $stmt->bind_param('sss' , $img_type , $img_data , $userID);
    }else{
        $query = "INSERT INTO `$table`(`userID`,`type`,`img`) VALUES (?,?,?)";
        $stmt = $GLOBALS['conn']->prepare($query);
        $stmt->bind_param('sss' , $userID , $img_type , $img_data );
    }
    
        
        $sqlfire = $stmt->execute();
        $stmt ->close();
        
        if($sqlfire) {
            return 1;
        }else {
            return 0;
        }
}
?>