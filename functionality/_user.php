<?php
include 'db/_conn.php';

try{
    if( (isset($_POST['submit']))&& (isset($_GET['action'])) )
    {
        $action = $_GET['action'];
        if($action == "sign-in")
        {
            //user uploaded values
            $userID = gen_new_user_id(); 
            $surname = $_POST['surname'];
            $name = $_POST['name'];
            $unm = $_POST['user'];
            $email = $_POST['e-mail'];
            $hashed_pass = convert_pass_to_hash($_POST['pass']);
            $pass_key = base64_encode(random_bytes(SODIUM_CRYPTO_SECRETBOX_KEYBYTES));

            $avatar = $_FILES['avatar'];
            $avatar['imgdata'] = file_get_contents($avatar['tmp_name']);

            $query[0] = "INSERT INTO `users`(`userID` , `surname` , `name` , `unm` , `email` , `pass` , `pass_key`) VALUES (? , ? , ? , ? , ? , ? , ?)";
            $query[1] = "INSERT INTO `users_account`(`userID` , `unm` ) VALUES(? , ?)"; 
            $query[2] = "INSERT INTO `users_details`(`userID`) VALUES (?)";

            $stmt[0] = $GLOBALS['conn']->prepare($query[0]);
            $stmt[1] = $GLOBALS['conn']->prepare($query[1]);
            $stmt[2] = $GLOBALS['conn']->prepare($query[2]);
            
            $stmt[0]->bind_param( "sssssss" , $userID , $surname , $name , $unm , $email , $hashed_pass , $pass_key);
            $stmt[1]->bind_param( "ss" , $userID , $unm );
            $stmt[2]->bind_param("s" , $userID );

            $sqlfire[0] = $stmt[0] -> execute();
            $sqlfire[1] = $stmt[1] -> execute();
            $sqlfire[2] = $stmt[2] -> execute();

            $stmt[0]->close();
            $stmt[1]->close();
            $stmt[2]->close();

            if($sqlfire[0] && $sqlfire[1] && $sqlfire[2]) {
                $query = "INSERT INTO `users_avatar`(`userID` , `type` , `img`) VALUES (? , ? , ? )";
                $stmt = $GLOBALS['conn']->prepare($query);
                $stmt->bind_param( "sss" , $userID , $avatar['type'] , $avatar['imgdata'] );
                $sqlfire = $stmt->execute();
                $stmt->close();
                
                if($sqlfire)
                    header('location: /user/?SUCCESS=201&USER='.$unm);
            }else   {
                throw new Exception( "something went wrong", 400);
            }
            
        }
        else if($action == "log-in")    {

            //User uploaded Values
            $user = $_POST['user'];
            $pass = $_POST['pass'];
            
            $rememberMe = (isset($_POST['rememberMe'])) ? $_POST['rememberMe'] : "null" ;
            $is_user_username = (str_contains($user, '@') && str_contains($user , '.')) ? '1' : '0';
            
            $result = fetch_columns( "users" , (($is_user_username == 0) ? "unm" : "email") , $user , 'userID' , 'pass' , 'pass_key');

            if($result->num_rows == 0){
                throw new Exception( "User not Found", 404);
            }else if($result->num_rows == 1){
                $row = $result->fetch_assoc();
                
                if(password_verify($pass , $row['pass']))   {
                    session_start();
                    
                    $_SESSION['userID'] = $row['userID'];

                    if($rememberMe == 'on' ) {
                        
                        $userID = $_SESSION['userID'];
                        $user_key  = random_bytes(SODIUM_CRYPTO_SECRETBOX_KEYBYTES);
                        $user_nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);                            
                        $encryptedUserID = sodium_crypto_secretbox($userID , $user_nonce , $user_key);
                        
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

                                objectStore.createIndex("id" , "id" , { unique: true });
                            };

                            request.onsuccess = (event) => {
                                var db = event.target.result;
                                
                                var transaction = db.transaction("session" , "readonly");
                                var objectStore = transaction.objectStore("session");
                                var count = objectStore.count();

                                transaction.oncomplete = (() => {
                                    count = count.result;
                                    transaction = db.transaction("session" , "readwrite");
                                    objectStore = transaction.objectStore("session");
                                    if(count > 0) {
                                        objectStore.clear();
                                    }

                                    objectStore.add({id: "1" , userID : "<?php echo base64_encode($encryptedUserID);?>" , user_key : "<?php echo base64_encode($user_key);?>" , user_nonce : "<?php echo base64_encode($user_nonce);?>" , pass : "<?php echo base64_encode($encryptedPass)?>" , pass_nonce: "<?php echo base64_encode($pass_nonce)?>"});
                                    
                                    window.location.assign('/');

                                });
                                transaction.close;
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
            
        }
    }
} catch (Exception $error) {
    //print_r($error);     
    header("location: /user/?ACTION=$action&ERROR=".$error->getCode().(($error->getMessage() == "Password is Wrong" ) ? "&USER=$user" : ""));
    die();
}

function gen_new_user_id()  {

    $sql = "SELECT `userID` FROM `users` ORDER BY `userID` DESC";
    $sqlfire = $GLOBALS['conn'] -> query($sql);

    if($sqlfire && ($sqlfire -> num_rows > 0)) {
        $row = $sqlfire->fetch_assoc();
        $lastUserID = explode( 'r' , $row["userID"]);
        $newUserID = sprintf("%04d" , $lastUserID[1]+1);
    }
    else {
        $newUserID = "0001";
    }

    return "User" . $newUserID;
}

function convert_pass_to_hash($pass) {
    return password_hash($pass , PASSWORD_BCRYPT);
}

?>