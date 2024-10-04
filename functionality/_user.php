<?php
require_once('db/_conn.php');
require_once('lib/_insert_data.php');
require_once('lib/_validation.php');
try{
    // if( (isset($_GET['action'])) && ( isset($_POST['g-recaptcha-response']) ))
    // {
    //     $recaptchaSecret= RECAPTCHA_SECRET;
    //     $recaptchaClientResponse= $_POST['g-recaptcha-response'];

    //     $response= file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$recaptchaSecret&response=$recaptchaClientResponse");

    //     $serverResponse= json_decode($response,true);
    //     if(!$serverResponse['success'])
    //         throw new Exception("Recaptcha Error! Please Try Again",400);
     
    if( (isset($_GET['action'])) )
    {
        $action = $_GET['action'];
        if($action == "sign-in")
        {
            // user uploaded values
            $surname = $_POST['surname'];
            $name = $_POST['name'];
            $unm = $_POST['user'];
            $email = $_POST['e-mail'];
            $hashed_pass = password_hash($_POST['pass'] , PASSWORD_BCRYPT);
            $pass_key = base64_encode(random_bytes(SODIUM_CRYPTO_SECRETBOX_KEYBYTES));

            $avatar = $_FILES['avatar'];

            // validation
            if(!$surname || !$name || !$unm || !$email || !$hashed_pass || !$pass_key )
                throw new Exception('Something went wrong',400);
            else if(!filter_var( $email , FILTER_VALIDATE_EMAIL ))
                throw new Exception("Email is wrong please Enter valid email",412);
            else if(strpos($unm,'@'))
                throw new Exception("Username is Invalid!!",414);
            else if(is_data_present("users" , ["unm"] , [$unm] , 'unm') || 
                    is_data_present("users" , ["email"] , [$email] , 'email') )
                throw new Exception("Username or Email is already exsits",412);
        
            $user = createUser(["surname" , "name" , "unm" , "email" , "pass" , "pass_key"] ,
                    [ $surname , $name , $unm , $email , $hashed_pass , $pass_key ] , $avatar);
                
            if($user == 1)
                header('location: /user/?SUCCESS=201&USER='.$unm); 
            else if($user == 0){
                header('location: /user/?ERROR=400');
            }
            
        }
        else if($action == "log-in")    {

            //User uploaded Values
            $user = $_POST['user'];
            $pass = $_POST['pass'];
            
            $rememberMe = (isset($_POST['rememberMe'])) ? $_POST['rememberMe'] : null ;
            $is_user_username = (str_contains($user, '@') && str_contains($user , '.')) ? '1' : '0';
            
            $result = fetch_columns( "users" , (($is_user_username == 0) ? ["unm"] : ["email"]) , [$user] , array('userID' ,'unm', 'pass' , 'pass_key'));

            if($result->num_rows == 0){
                throw new Exception( "User not Found", 404);
            }else if($result->num_rows == 1){
                $row = $result->fetch_assoc();
                
                if(password_verify($pass , $row['pass']))   {
                    session_start();
                    
                    $userID = $row['userID'];
                    $unm= $row['unm'];
                    $user_key  = random_bytes(SODIUM_CRYPTO_SECRETBOX_KEYBYTES);
                    $user_nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);      

                    $encryptedUserID = sodium_crypto_secretbox($userID , $user_nonce , $user_key);
                    $encryptedUNM = sodium_crypto_secretbox($unm , $user_nonce , $user_key);
                        
                    $_SESSION['userID']= base64_encode($encryptedUserID);
                    $_SESSION['key']= base64_encode($user_key);
                    $_SESSION['nonce']= base64_encode($user_nonce);

                    ?><script>localStorage.clear();</script><?php
                    if($rememberMe == 'on' ) {

                        $pass = $row['pass'];
                        $pass_nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
                        $pass_key = base64_decode($row['pass_key']);
                        $encryptedPass = sodium_crypto_secretbox($pass , $pass_nonce , $pass_key);

                        ?>
                        <script>
                            var request = indexedDB.open("Botsapp" , 1 );

                            request.onerror = (event) => {
                                console.error("something went wrong");
                            };

                            request.onupgradeneeded = (event) => {
                                var db = event.target.result;
                                var objectStore = db.createObjectStore("session" , { keyPath: "id"});
                                let dataTable= db.createObjectStore("data", { keyPath:'name' } )

                                objectStore.createIndex("id" , "id" , { unique: true });
                                dataTable.createIndex("name", "name", {unique: true} )
                            };

                            request.onsuccess = (event) => {
                                var db = event.target.result;
                                
                                var transaction = db.transaction("session" , "readonly");
                                var objectStore = transaction.objectStore("session");
                                var count = objectStore.count();

                                transaction.oncomplete = (() => {
                                    transaction = db.transaction("session" , "readwrite");
                                    objectStore = transaction.objectStore("session");
                                    if(count.result > 0) {
                                        objectStore.clear();
                                    }

                                    objectStore.add({id: "1" , unm : "<?= base64_encode($encryptedUNM);?>" , 
                                            user_key : "<?= $_SESSION['key'];?>" , user_nonce : "<?= $_SESSION['nonce'];?>" , 
                                            pass : "<?= base64_encode($encryptedPass)?>" , pass_nonce: "<?= base64_encode($pass_nonce)?>" });

                                    transaction.close;
                                    window.location.assign('/');
                                })
                            };
                        </script>
                        <?php
                    }else{
                        header('location: /');
                    }
        
                }else{
                    throw new Exception ("Password is Wrong" , 404);
                }
            }
            else{
                throw new Exception( "Username Conflicts ", 409);
            }
            
        }else{
            header('Location: /');
        }

    }else{
        header('location: /');
    }
} catch (Exception $error) {
    header("location: /user/?ACTION=$action&ERROR=".$error->getCode().(($error->getMessage() == "Password is Wrong" ) ? "&USER=$user" : "&msg=".$error->getMessage()));
    die();
}
?>