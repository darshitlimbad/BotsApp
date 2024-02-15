<?php
include 'db/_conn.php';

try{
    if( (isset($_POST['submit']))&& (isset($_GET['action'])) )
    {
        $action = $_GET['action'];
        if($action == "sign-in")
        {
            //user uploaded values
            $userId = gen_new_user_id(); 
            $surname = $_POST['surname'];
            $name = $_POST['name'];
            $unm = $_POST['user'];
            $email = $_POST['e-mail'];
            $hashed_pass = convert_pass_to_hash($_POST['pass']);

            $avatar = $_FILES['avatar'];
            $avatar['extention'] = explode('.' , $avatar['name'])[1];
            $avatar['name'] = $userId . "." . $avatar['extention'];
            $avatar['imgdata'] = file_get_contents($avatar['tmp_name']);

            $query = "INSERT INTO `users`(`userID` , `surname` , `name` , `unm` , `email` , `pass`) VALUES (? , ? , ? , ? , ? , ? )";
            $stmt = $GLOBALS['conn']->prepare($query);
            $stmt->bind_param( "ssssss" , $userId , $surname , $name , $unm , $email , $hashed_pass );
            $sqlfire = $stmt -> execute();
            $stmt->close();
            if (!$sqlfire) {
                die('Error: ' . mysqli_error($GLOBALS['conn']));
            }
            if($sqlfire) {
                $query = "INSERT INTO `users_avatar`(`userID` , `name` , `type` , `img`) VALUES (? , ? , ? , ? )";
                $stmt = $GLOBALS['conn']->prepare($query);
                $stmt->bind_param( "ssss" , $userId , $avatar['name'] , $avatar['type'] , $avatar['imgdata'] );
                $sqlfire = $stmt->execute();
                $stmt->close();
        
                header('location: /user');
            }else   {
                throw new Exception( "something went wrong", 400);
            }
            
        }
        else if($action == "log-in")    {

            //User uploaded Values
            $user = $_POST['user'];
            $pass = $_POST['pass'];
            
            $rememberMe = (isset($_POST['rememberMe'])) ? $_POST['rememberMe'] :"null";
            $is_user_username = preg_match('/[@][.]/' , $user );
            
            $query = "SELECT `userID` , `pass` FROM `users` WHERE ".(($is_user_username == 0) ? "`unm`" : "`email`")." = ?";
            $stmt = $GLOBALS['conn']->prepare($query);
            $stmt->bind_param( "s" , $user);
            $sqlfire = $stmt->execute();

            if($sqlfire) {
                $result = $stmt->get_result();
                if($result->num_rows == 0){
                    throw new Exception( "User not Found", 404);
                }else if($result->num_rows == 1){
                    $row = $result->fetch_assoc();
                    if(password_verify($pass , $row['pass']))   {
                        session_start();
                        $_SESSION['userID'] = $row['userID'];
                        if($rememberMe == 'on' ) {
                            $key  = random_bytes(SODIUM_CRYPTO_SECRETBOX_KEYBYTES);
                            $value = $_SESSION['userID'];
                            $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
                           $encryptedUserID = sodium_crypto_secretbox($value , $nonce , $key);
                           
                            echo base64_encode($encryptedUserID);
                            ?>
                            <script>

                            </script>
                            <?php
                        }
            
                       // header('location: /user');
                    }else{
                        throw new Exception ("Password is Wrong" , 404);
                    }
                }
                else{
                    throw new Exception( "Username Conflicts ", 409);
                }
            }else {
                throw new Exception( "something went wrong", 400);
            }
            
            $stmt->close();
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

    if($sqlfire && $sqlfire -> num_rows > 0) {
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