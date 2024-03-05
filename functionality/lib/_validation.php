<?php   

function getDecryptedUserID(){

    $encryptedUserID = base64_decode($_SESSION['userID']);
    $nonce = base64_decode($_SESSION['nonce']);
    $key = base64_decode($_SESSION['key']);

    try{
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
    //echo $result->fetch_assoc()['pass'];
    if($result->num_rows == 1) {
        $pwd = $result->fetch_assoc()['pass'];
        
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

function is_session_valid(){
    $userID = getDecryptedUserID();
    if(is_data_present('users' , 'userID' , $userID) == 0)  {
        session_destroy();
        header('location: /functionality/_log_out.php?key_pass=khulJaSimSim'); 
    }else{
        session_regenerate_id(true);
    }
}
?>