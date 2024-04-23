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
        }else if($data['req'] == "sendMsg"){
            echo sendMsg($data);
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
        $msgs = null;

        if($fromID == $toID){
            $condition = "(`fromID` , `toid` ) IN ( (? , ?))";
        }
        else{
            $condition = "( `fromID` , `toid` ) IN ( (? , ?), (? , ?) )";
        }

        $data = "SELECT `msgID`,`fromID`, `type`, `msg`, `doc`, `time` FROM `messages` WHERE $condition ORDER BY `time`";

        $stmt = $GLOBALS['conn'] -> prepare($data);
        if($fromID == $toID){
            $stmt ->bind_param("ss" , $fromID , $toID);
        }else{
            $stmt ->bind_param("ssss" , $fromID, $toID, $toID, $fromID);
        }
        $sqlquery= $stmt->execute();

        if($sqlquery){
            $result=$stmt->get_result();

            if($result->num_rows == 0)
                return 0;

            $i=0;
            while($row = $result->fetch_assoc()){
                $msgs[$i]['msgID']=$row['msgID'];
                $msgs[$i]['unm']= ($row['fromID'] == $fromID) ? $fromUnm : $toUnm ;
                $msgs[$i]['type']= $row['type'];
                $msgs[$i]['msg']=$row['msg'];
                $msgs[$i]['doc']=$row['doc'];
                $msgs[$i]['time']=$row['time'];

                $i++;
            }

            return json_encode($msgs);
        }

        return 0;
    }catch(Exception $e){
        // print_r($e);
        return 0;
    }
}

function sendMsg($data){
    try{
        $newMsgID = gen_new_id("Msg");
        $fromID = getDecryptedUserID();
        $toID = _get_userID_by_UNM($data['toUnm']);
        $input = $data['input'];//this is input by user it can be anything
        $type= $data['type'];
        $time = $data['time'];
    
        $msg_column = null;
        $msg_value = null;
        if($type == "text"){
            $msg_column = "msg";
            $msg_value = "$input";

        }else if($type == "img"){
            $imgName = "\Img-".date("d-m-Y").'-'.rand(10,1000).".webp";
            $imgObj['img_data'] = base64_decode($input['img_data']);
            $imgObj['size'] = $input['size'];
            
            $imgObj['tmp_name'] = $_COOKIE['imgDir'].$imgName;
            file_put_contents($imgObj['tmp_name'] , $imgObj['img_data']);
            $imgObj=compressImg($imgObj);
            
            $imgObj['img_data'] = base64_encode(file_get_contents($imgObj['tmp_name']));
            if(!$imgObj)
                throw new Exception('Img could not be compressed',0);

            $msg_column = "";
            $msg_value = "";
        }

        if($msg_column && $msg_value){
            $msgRes = insertData('messages' , "msgID, fromID, toID, time, $msg_column" ,"$newMsgID ,$fromID ,$toID, $time, $msg_value");
            return $msgRes;
        }

        return 0;
    }catch(Exception $e){
        return 0;
    }
}

?>