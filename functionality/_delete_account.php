<?php
try{
if(isset($_GET['key_pass']) && $_GET['key_pass'] === "khulJaSimSim") {
    session_start();

    require_once('db/_conn.php');
    require_once('lib/_validation.php');

    if(isset($_SESSION['userID'])) {
        $userID = getDecryptedUserID();

        $fetchJoinedGroups= fetch_columns('inbox',['fromID','chatType'],[$userID,'group'],['toID']);
        $deleteInbox = "DELETE FROM `inbox` WHERE (`fromID`= '$userID' OR toID = '$userID');";
        $GLOBALS['conn']->query($deleteInbox);

        if($fetchJoinedGroups->num_rows !== 0){
            while($GID = $fetchJoinedGroups->fetch_column()){
                delete_group($GID);
            }
        }

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
    die();
}
?>