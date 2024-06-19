<?php
    $data = json_decode( file_get_contents("php://input") , true );
    if(isset($data)) {

        require_once('db/_conn.php');
        require_once('lib/_fetch_data.php');
        require_once('lib/_validation.php');
        
    try{
        if(isset($data['keyPass']) && $data['keyPass'] == 'khuljasimsim'){
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
                $_SESSION['userID'] = $data['userID'];
                $_SESSION['nonce'] = $data['user_nonce'];
                $_SESSION['key'] = $data['user_key'];

                $res = json_encode( array(
                    'status'=>'success' 
                ) );
                echo $res;
            }else{
                throw new Exception("saved Password is wrong try log-in again." , 404);
            }
        }else{
            header('Location: /');
        }
    
        
    }
    catch(Exception $error) {
        $err= json_encode(array(
            'status'=>'error',
            'code'=>$error->getCode(),
            'message'=>$error->getMessage()
        ));
        echo $err;;
    }
}else{
    header('Location: /');
}

?>