<?php
session_start();
try{
if(isset($_GET['key_pass']) && $_GET['key_pass'] === "khulJaSimSim") {
    include 'db/_conn.php';

    if(isset($_SESSION['userID'])) {
        $userID = $_SESSION['userID'];

        $delete = deleteData('users',$userID);

        if($delete != 1){
            throw new exception('Something Went Wrong , pls try again' , 500);
        }else{
            header('location: /functionality/_log_out.php?key_pass='.$_GET['key_pass'].'&SUCCESS=203');
        }

    }else{
        throw new exception('Pls log-in in your Account to Delete' , 400);
    }
}
else{
    throw new exception("You can't enter here");
}
}
catch(exception $error){
    // print_r($error);
    header('location: /?ERROR=400');
}
?>