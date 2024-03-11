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

            $res2 = insertData('users_account' , "userID , unm" , "$userID , $unm");

            if($res2 === 1) {
                $res3 = insertData('users_details' , "userID" , "$userID");

                if($res3 === 1){

                    $res4 = uploadImg( $userID , $avatar );
                    if($res4 === 1){
                        return 1;
                    }else{
                        deleteData($main_table,$userID);
                        $fleg = 1;
                    }

                }else{
                    deleteData($main_table,$userID);
                    $fleg = 1;
                }
                
            }else{
                deleteData($main_table,$userID);
                $fleg = 1;
            }

        }else   {
            deleteData($main_table,$userID);
            $fleg = 1;
        } 

    if($fleg == 1) {
        throw new Exception( "something went wrong", 400);
    }
    
    }catch (Exception $e){
        return 0;
    }
}

// for uploading img it takes user id img type and img tmp name
function uploadImg($userID , $img ){
    try{
        $img = compressImg($img);
        if($img == 0)
            throw new Exception("something went wrong with Compression");

        $table = 'users_avatar';
        $type = $img['type'];

        $img_data = file_get_contents($img['tmp_name']);

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

            if($sqlfire) {
                return 1;
            }else {
                return 0;
            }
            
    }catch(Exception $e) {
        return 0;
    }
}

function compressImg($img , $quality = 50) {
    try{
        $img['type'] = getimagesize($img['tmp_name'])['mime'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!in_array($img['type'], $allowedTypes)) {
            throw new Exception("Unsupported image type: " . $img['type']);
        }

        $tmp_file = tempnam( sys_get_temp_dir() , "_compressed_img_" ); 
        
        $success = false;
        switch ($img['type']) {
            case 'image/jpeg':
                $image = imagecreatefromjpeg($img['tmp_name']);
                break;
            case 'image/png':
                $image   = imagecreatefrompng($img['tmp_name']);
                break;
            case 'image/webp':
                $image = imagecreatefromwebp($img['tmp_name']);
                break;
            default:
                throw new Exception("Unexpected image type: " . $img['type']);
        }

        $success = imagewebp($image, $tmp_file, $quality);

        if (!$success) {
            throw new Exception("Failed to compress image");
        }

        unlink($img['tmp_name']);
        $img['tmp_name'] = $tmp_file;
        $img['type'] = getimagesize($img['tmp_name'])['mime'];
    }catch(Exception $e) {
        return 0;
    }

    return $img;
}

?>