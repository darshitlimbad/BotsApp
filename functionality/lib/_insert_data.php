<?php
    include_once('_validation.php');

// create users param string of columns with ',' seprater , string of column values , img type , img data in binary 
function createUser($column_str , $values_str , $avatar ) {
    try{
        $fleg = 0;
        $userID=NULL;$unm=NULL;
        $main_table = "users";
        $res1 = insertData($main_table, $column_str , $values_str);
        if($res1 == 1) {
            $columns = explode(',' , $column_str) ;
            $values = explode(',' , $values_str);

            for($i = 0 ; $i<count($columns) ; $i++) {
                if(trim($columns[$i]) == "userID"){
                    $userID = trim($values[$i]);
                }
                if(trim($columns[$i]) == "unm"){
                    $unm = trim($values[$i]);
                }
                
            }

            $res2 = insertData('users_account' , ["userID" , "unm"] , [$userID , $unm]);

            if($res2 === 1) {
                $res3 = insertData('users_details' , ["userID"] , [$userID]);

                if($res3 === 1){

                    $res4 = uploadImg( $userID , $avatar );
                    if($res4 === 1){
                        return 1;
                    }else{
                        $fleg = 1;
                    }

                }else{
                    $fleg = 1;
                }
                
            }else{
                $fleg = 1;
            }

        }else   {
            $fleg = 1;
        } 

    if($fleg == 1) {
            deleteData($main_table,$userID);
            throw new Exception( "something went wrong", 400);
    }
    
    }catch (Exception $e){
        return 0;
    }
}

// for uploading img it takes user id img type and img tmp name
function uploadImg($userID , $imgObj ){
    try{
        $imgObj = compressImg($imgObj);
        if(gettype($imgObj)=="integer")
            throw new Exception("Something Went wrong",$imgObj);//this will return error code

        $table = 'avatar';
        $type = $imgObj['type'];

        $img_data = file_get_contents($imgObj['tmp_name']);

        if(is_data_present($table , 'userID' , $userID , "imgData")){
            $query = "UPDATE `$table` SET `type` = ? , `imgData` = ?  WHERE `userID` = ? ";
            $stmt = $GLOBALS['conn']->prepare($query);
            $stmt->bind_param('sss' , $type , $img_data ,  $userID);
        }else{
            $query = "INSERT INTO `$table` (`userID` , `type` , `imgData`) VALUES (?,?,?)";
            $stmt = $GLOBALS['conn']->prepare($query);
            $stmt->bind_param('sss' , $userID , $type , $img_data );
        } 

            $sqlfire = $stmt->execute();
            $stmt ->close();
            return ($sqlfire)?1:0;
    }catch(Exception $e) {
        return $e->getCode();
    }
}

?>