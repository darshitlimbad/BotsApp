<?php
    session_start();
    include 'db/_conn.php';
    $data = json_decode(file_get_contents("php://input") , true);

    $table = $data['table'];
    $edit_column = $data['edit_column'];

    if($edit_column == 'user-name'){
        $full_name = explode(" " , $data['data']);
        if(count($full_name) == 1){
            $surname = "";
            $name = $full_name[0];
        }else if(count($full_name) > 1){
            $surname = $full_name[0];
            $name = $full_name[1];
            for($i = 2 ; $i < count($full_name) ; $i++){
                $name.=" " . $full_name[$i];
            }
        }else{
            echo "hi";
            exit();
        }
    }

    $edit_req = updateData($table , ( $edit_column == "user-name") ? "surname,name" :  "$edit_column"  , ( $edit_column == "user-name") ? "$surname,$name" : $data['data'] , "userID" , $_SESSION['userID']);
    
    echo $edit_req;
?>