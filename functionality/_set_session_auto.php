<?php
    include 'db/_conn.php';

if(isset($_GET['keyPass']) && $_GET['keyPass'] == 'khuljasimsim'){
    try{
        $data = json_decode( file_get_contents("php://input") , true );

        if(isset($data)) {
            $encryptedUserID = base64_decode($data['userID']);
            $user_nonce = base64_decode($data['user_nonce']);
            $user_key = base64_decode($data['user_key']);
        
            $userID = sodium_crypto_secretbox_open($encryptedUserID , $user_nonce , $user_key);
            
            $encryptedPass = base64_decode($data['pass']);
            $pass_nonce = base64_decode($data['pass_nonce']);
            $pass_key = base64_decode(getPassKey($userID));
            $Pass = sodium_crypto_secretbox_open($encryptedPass , $pass_nonce , $pass_key);
        
            metchPasswords($Pass , $userID);
        }
    
        
    }
    catch(Exception $error) {
        echo '['.$error->getCode().']' .":". $error->getMessage();;
    }
}

function getPassKey($userID) {
    $result = fetch_columns('userID' , $userID , 'pass_key');
    if($result != '400') {
        if($result->num_rows == 1){
            return $result->fetch_assoc()['pass_key'];
        }else{
            throw new Exception("No user Found from Indexed DB storage." , 404);
        }
    }
    else{
        throw new Exception("Can't connect to Database through Indexed DB" , 400);
    }

    return false;
}

function metchPasswords($Pass , $userID){
    $result = fetch_columns('userID' , $userID , 'pass');
    //echo $result->fetch_assoc()['pass'];
    if($result->num_rows == 1) {
        $pwd = $result->fetch_assoc()['pass'];
        if($pwd === $Pass){
            session_start();

            $_SESSION['userID'] = $userID;
            return 1;
        }else {
            throw new Exception("saved Password is wrong try log-in again." , 404);
        }
    }else{
        throw new Exception("No user Found from Indexed DB storage." , 404);
    }
}
?>