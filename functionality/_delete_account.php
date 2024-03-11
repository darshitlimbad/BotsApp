<?php
session_start();
try{
if(isset($_GET['key_pass']) && $_GET['key_pass'] === "khulJaSimSim") {
    include_once('db/_conn.php');
    include_once('lib/_validation.php');

    if(isset($_SESSION['userID'])) {
        $userID = getDecryptedUserID();

        $delete = deleteData('users',$userID);

        if($delete == 1){
            header('location: /functionality/_log_out.php?key_pass='.$_GET['key_pass'].'&SUCCESS=203');
        }else{
            throw new Exception('Something Went Wrong , pls try again' , 500);
        }

    }else{
        throw new Exception('Pls log-in in your Account to Delete' , 400);
    }
}
else{
    throw new Exception("You can't enter here");
}
}
catch(Exception $error){
    // print_r($error);
    header('location: /?ERROR=400');
}
?>