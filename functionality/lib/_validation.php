<?php   

function getDecryptedUserID(){
    try{
        if(!isset($_SESSION['userID']))
            throw new Exception();

        $encryptedUserID = base64_decode($_SESSION['userID']);
        $nonce = base64_decode($_SESSION['nonce']);
        $key = base64_decode($_SESSION['key']);

        $res = sodium_crypto_secretbox_open($encryptedUserID , $nonce , $key) ?: 0;
    }catch( Exception $err){
        session_destroy();
    }

    // if the description process completes it will return userid but if it ocures any errors by the wrong value it will return 0.
    return $res;
}

// this function matches the Encrypted passwords with password_hash bcrypt
function metchEncryptedPasswords($Pass , $userID){
    $result = fetch_columns(  "users" , 'userID' , $userID , 'pass');
    if($result->num_rows == 1) {
        $pwd = $result->fetch_column();
        
        if($pwd === $Pass){
            
            return 1;
            
        }else {
            throw new Exception("saved Password is wrong try log-in again." , 404);
        }
    }else{
        throw new Exception("No user Found from Indexed DB storage." , 404);
    }
}

// if there will be data the is_data_present will return 1 
function is_data_present($table , $point , $point_val , $column='userID'){
    $result = fetch_columns($table , $point , $point_val , $column);
    
    if($result->num_rows == 1){
        return 1;
    }else{
        return 0;
    }
}

function session_check(){
    $userID = getDecryptedUserID();
    if(is_data_present('users' , 'userID' , $userID) == 0)  {
        session_abort();
        session_destroy();
        header('location: /functionality/_log_out.php?key_pass=khulJaSimSim'); 
    }else{
        session_regenerate_id(true);
    }
}

function gen_new_id($preFix)  {
    $preFix = ucfirst(strtolower(trim($preFix)));

    switch($preFix){
        case "User":
            $table = "users";
            $clm = "userID";
            break;
        case "Msg":
            $table = "messages";
            $clm = "msgID";
            break;
    }

    $sql = "SELECT `$clm` FROM `$table` ORDER BY `$clm` DESC LIMIT 1";
    $sqlfire = $GLOBALS['conn'] -> query($sql);

    if($sqlfire && ($sqlfire -> num_rows > 0)) {
        $ID = $sqlfire->fetch_column();
        $oldID = (int)preg_replace("/[^0-9]/", "", $ID);
        $newID =  sprintf("%08d" , ++$oldID);    
    }
    else {
        $newID = sprintf("%08d" , 1);
    }

    return $preFix.$newID;
}

function compressImg($imgObj , $quality = 50) {
    try{
        $imgObj['type'] = getimagesize($imgObj['tmp_name'])['mime'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!in_array($imgObj['type'], $allowedTypes)) {
            throw new Exception("Unsupported image type: " . $imgObj['type']);
        }

        $tmp_file = tempnam( sys_get_temp_dir() , "/ima" ); 
        
        $success = false;
        switch ($imgObj['type']) {
            case 'image/jpeg':
                $image = imagecreatefromjpeg($imgObj['tmp_name']);
                break;
            case 'image/png':
                $image   = imagecreatefrompng($imgObj['tmp_name']);
                break;
            case 'image/webp':
                $image = imagecreatefromwebp($imgObj['tmp_name']);
                break;
            default:
                throw new Exception("Unexpected image type: " . $imgObj['type']);
        }
        
        $success = imagewebp($image, $tmp_file, $quality);

        if (!$success) {
            throw new Exception("Failed to compress image");
        }

        unlink($imgObj['tmp_name']);
        $imgObj['tmp_name'] = $tmp_file;
        $imgObj['type'] = getimagesize($imgObj['tmp_name'])['mime'];

        return $imgObj;
    }catch(Exception $e) {
        return 0;
    }
}
?>