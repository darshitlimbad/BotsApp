<?php
    include 'db/_conn.php';
    include 'lib/_fetch_data.php';
    include 'lib/_validation.php';

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
        
            $res = metchEncryptedPasswords($Pass , $userID);
            if($res === 1) {
                session_start();
                $_SESSION['userID'] = $userID;
            }
        }
    
        
    }
    catch(Exception $error) {
        echo '['.$error->getCode().']' .":". $error->getMessage();
        header('location: /user');
    }
}

?>