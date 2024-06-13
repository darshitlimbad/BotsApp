<?php  
function getDecryptedUserID(){
    try{
        if(!isset($_SESSION['userID']))
            throw new Exception("",400);

        $encryptedUserID = base64_decode($_SESSION['userID']);
        $nonce = base64_decode($_SESSION['nonce']);
        $key = base64_decode($_SESSION['key']);

        $res = sodium_crypto_secretbox_open($encryptedUserID , $nonce , $key) ?: 0;

        // if the description process completes it will return userid but if it ocures any errors by the wrong value it will return 0.
        return $res;

    }catch( Exception $err){
        if(isset($_SESSION['userID']))
            session_destroy();
    }

}

// this function matches the Encrypted passwords with password_hash bcrypt
function metchEncryptedPasswords($Pass , $userID){
    $result = fetch_columns(  "users" , ['userID'] , [$userID] , array('pass'));
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
function is_data_present($table , array $point , array $point_val , $column='userID'){
    if(!isset($_SESSION['userID']))
            throw new Exception("",400);

    $result = fetch_columns($table , $point , $point_val , array("$column"));
    if($result->num_rows == 1){
        return 1;
    }else{
        return 0;
    }
}

// @param groupID
// @return total number of group members
function fetch_total_group_member_count(string $groupID){
    if(!isset($_SESSION['userID']))
            throw new Exception("",400);

    if(!is_data_present("groups",['groupID'],[$groupID],'groupID'))
        throw new Exception("GROUP_DOESN'T_EXCIST",411);

    $result = fetch_columns('inbox',['toID','chatType'],[$groupID,'group'],['count(*)']);

    if($result->num_rows == 1){
        return $result->fetch_column();
    }else{
        return 0;
    }
}

// @param groupID
// @return all group members
function fetch_all_group_members(string $groupID){
    if(!isset($_SESSION['userID']))
            throw new Exception("",400);

    if(!is_data_present("groups",['groupID'],[$groupID],'groupID'))
        throw new Exception("GROUP_DOESN'T_EXCIST",411);

    $result = fetch_columns('inbox',['toID','chatType'],[$groupID,'group'],['fromID']);

    if($result->num_rows != 0){
        $members=[];
        while($userID= $result->fetch_column()){
            $members[]=_fetch_unm($userID);
        }
        return $members;
    }else{
        return 0;
    }
}

// @param userID,groupID
// @return user is memeber of group or not
function is_member_of_group(string $userID, string $groupID){
    if(!isset($_SESSION['userID']))
            throw new Exception("",400);

    $result = fetch_columns('inbox',['fromID','toID','chatType'],[$userID,$groupID,'group'],['count(*)']);

    if($result->num_rows == 1){
        return $result->fetch_column();;
    }else{
        return 0;
    }
}

// @param userID,oppoUserID
// @return does chat exists or not
function is_chat_exist(string $userID, string $oppoUserID){
    if(!isset($_SESSION['userID']))
            throw new Exception("",400);
    
    $maxEntry = ($userID === $oppoUserID) ? 1 : 2;
    
    $SQL =" SELECT count(*) FROM inbox 
            WHERE (fromID,toID) IN (('$userID','$oppoUserID'),('$oppoUserID','$userID'));";
    $result=$GLOBALS['conn']->query($SQL);

    if(($result->num_rows == 1) && ($result->fetch_column() == $maxEntry)){
        return 1;
    }else{
        return 0;
    }
}

// @param userID,groupID
// @return user is group Admin or not
function is_group_admin(string $userID, string $groupID){
    if(!isset($_SESSION['userID']))
            throw new Exception("",400);
    
    $SQL =" SELECT count(*) FROM groups 
            WHERE groupAdminID='$userID' 
            AND groupID='$groupID';";

    $result=$GLOBALS['conn']->query($SQL);

    if($result->num_rows == 1){
        return 1;
    }else{
        return 0;
    }
}

function session_check(){
    $userID = getDecryptedUserID();
    if(is_data_present('users' , ['userID'] , [$userID]) == 0)  {
        session_abort();
        session_destroy();
        header('location: /functionality/_log_out.php?key_pass=khulJaSimSim'); 
    }else{
        session_regenerate_id(true);
    }
}

function gen_new_id($preFix)  {
    try{
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
            default:
                throw new Exception("",400);
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
    }catch(Exception $e){
        return $e->getCode();
    }
}

function compressImg($imgObj , $quality = 50) {
    try{
        $imgObj['type'] = getimagesize($imgObj['tmp_name'])['mime'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!in_array($imgObj['type'], $allowedTypes))
            throw new Exception("Unsupported image type: " , 415);

        $success = false;
        switch ($imgObj['type']) {
            case 'image/jpeg':
            case 'image/jpg':
                $image = imagecreatefromjpeg($imgObj['tmp_name']);
                break;
            case 'image/png':
                $image   = imagecreatefrompng($imgObj['tmp_name']);
                imagepalettetotruecolor($image);
                imagealphablending($image,true);
                imagesavealpha($image,true);
                break;
            case 'image/webp':
                $image = imagecreatefromwebp($imgObj['tmp_name']);
                break;
            default:
                throw new Exception("Unexpected image type: ", 415);
        }

        unlink($imgObj['tmp_name']);
        $success = imagewebp($image, $imgObj['tmp_name'], $quality);
        imagedestroy($image);
        
        if (!$success)
            throw new Exception("Failed to compress image",400);
        
        $imgObj['type'] = getimagesize($imgObj['tmp_name'])['mime'];

        return $imgObj;
    }catch(Exception $e) {
        return $e->getCode();
    }
}
?>