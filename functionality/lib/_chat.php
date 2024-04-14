<?php

if($data = json_decode( file_get_contents("php://input") , true)){
    session_start();
    if(isset($_SESSION['userID'])){
        include_once('../db/_conn.php');
        include_once('../lib/_validation.php');
        include_once('../lib/_fetch_data.php');
        
        if($data['req'] == "getChatList"){
            echo getChatList($data['chatType']);
        }else if($data['req'] == "getMsgs"){
            echo getMsgs($data['unm']);
        }
    }
}

function getChatList($chatType){
    try{
        $userID = getDecryptedUserID();
        if($chatType === "personal")
            $dataFromInbox = fetch_columns('inbox', 'fromID', $userID, "toID" , "last_msg");
        else if($chatType === "group")
            return 0;
        
        $i=0;
        if($dataFromInbox -> num_rows != 0 ){
            $chatList[0]=false;

            while( $row = $dataFromInbox->fetch_assoc() ){
                if(!is_data_present('users_account', 'userID', $row['toID'])){
                    $toID=$row['toID'];
                    $del = "DELETE FROM `inbox` WHERE  `fromID` = '$userID' AND `toID` = '$toID' "; 
                    $GLOBALS['conn']->query($del);
                    continue;
                }

                $chatList[$i]['dp'] = json_decode(get_dp($row['toID']) , true);
                $chatList[$i]['unm'] = ($userID != $row['toID'] ) ? _fetch_unm($row['toID']) : "You";
                $chatList[$i]['last_msg']= $row['last_msg'];
                $i++;
            }
            if(!$chatList[0])
                return 0;

            return json_encode($chatList);
        }else{
            return 0;        
        }
        
    }catch(Exception){
        return 400;
    }
}

function getMsgs($toUnm){
    try{
        $fromUnm = _fetch_unm();
        $fromID = getDecryptedUserID();
        $toID = _get_userID_by_UNM($toUnm);
        $fromData = fetch_columns("messages", "fromID, toID", "$fromID, $toID" , "msgID", "type", "msg", "doc", "time");
        $msgs = null;
        if($fromData->num_rows != 0){
            while( $row = $fromData->fetch_assoc()){
                $row['unm']= $fromUnm;
                $msgs[] = $row;
            }
        }
        if($fromUnm != $toUnm){
            $toData = fetch_columns("messages", "fromID, toID", "$toID, $fromID" , "msgID", "type", "msg", "doc", "time" );
            if($toData->num_rows != 0){
                while( $row= $toData->fetch_assoc()){
                    $row['unm']= $toUnm;
                    $msgs[]= $row;
                }
            } 
        }

        if($msgs != null){            
            function usortFunc($a,$b){
                if($a['time'] == $b['time'])
                    return 0;

                return ($a['time'] < $b['time']) ? -1 : 1;
            }
            usort($msgs , 'usortFunc');
            return json_encode($msgs);
        }

        return 0;
    }catch(Exception $e){
        print_r($e);
        return 0;
    }
}

?>