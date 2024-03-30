<?php

if($data = json_decode( file_get_contents("php://input") , true)){
    session_start();
    if(isset($_SESSION['userID'])){
        include_once('../db/_conn.php');
        include_once('../lib/_validation.php');
        include_once('../lib/_fetch_data.php');
        
        if($data['req'] == "getChatList"){
                echo getChatList();
        }
    }
}

function getChatList(){
    try{
        $userID = getDecryptedUserID();
        $dataFromInbox = fetch_columns('inbox', 'fromID', $userID, "toID" , "last_msg");

        $i=0;
        if($dataFromInbox -> num_rows != 0 ){
            while( $row = $dataFromInbox->fetch_assoc() ){
                $chatList[$i]['dp'] = json_decode(get_dp($row['toID']) , true);
                $chatList[$i]['unm'] = ($userID != $row['toID'] ) ? _fetch_unm($row['toID']) : "You";
                $chatList[$i]['last_msg']= $row['last_msg'];
                $i++;
            }
        
            return json_encode($chatList);
        }else{
            return 0;
        }        
    }catch(Exception){
        return 400;
    }
}


?>