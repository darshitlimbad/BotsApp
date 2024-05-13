<?php

if($data = json_decode( file_get_contents("php://input") , true)){
    session_start();
    if(isset($_SESSION['userID'])){
        include_once('../db/_conn.php');
        include_once('../lib/_validation.php');
        include_once('../lib/_fetch_data.php');
        
        switch($data['req']){
            case "getChatList":
                echo getChatList($data['chatType']);
                break;
            case "getMsgs":
                echo getMsgs($data['unm']);
                break;
            case "getDoc":
                echo getDoc($data['msgID']);
                break;
            case "sendMsg":
                echo sendMsg($data);
                break;
            case "genNewID":
                echo json_encode(gen_new_id($data['preFix']));
                break;
            case 'getMsgStatus':
                echo getMsgStatus($data['msgID']);
                break;
            default:
                echo 400;
        }
    }
}

function getChatList($chatType){
    try{
        $userID = getDecryptedUserID();
        if($chatType === "personal")
            $dataFromInbox = fetch_columns('inbox', 'fromID', $userID, array("toID", "last_msg"));
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
            $bind_Param_placeholders = "ss";
            $bind_Param = array($fromID,$toID);
        }
        else{
            $condition = "( `fromID` , `toid` ) IN ( (? , ?), (? , ?) )";
            $bind_Param_placeholders = "ssss";
            $bind_Param = array($fromID, $toID, $toID, $fromID);

        }

        $data = "SELECT `msgID`,`fromID`, `type`, `msg`, `details` ,`time` FROM `messages` WHERE $condition ORDER BY `time`";

        $stmt = $GLOBALS['conn'] -> prepare($data);
        $stmt ->bind_param($bind_Param_placeholders , ...$bind_Param);
        $sqlquery= $stmt->execute();

        if($sqlquery){
            $result=$stmt->get_result();

            if($result->num_rows == 0)  return 0;

            $i=0;
            while($row = $result->fetch_assoc()){
                $msgs[$i]['type']= $row['type'];
                
                if($row['type'] == 'text'){
                    $msgColNm = "msg";
                }else{
                    $msgColNm = "fileName";
                    $msgs[$i]['details'] = unserialize($row['details']);
                }

                $msgs[$i][$msgColNm]=$row['msg'];
                $msgs[$i]['msgID']= $row['msgID'];
                $msgs[$i]['toUnm']= ($row['fromID'] == $fromID) ? $toUnm : $fromUnm ;
                $msgs[$i]['time']= $row['time'];
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

function getDoc($msgID) {
    // RIP this fucking thing and remaster it
    try{
        $docData = fetch_columns("messages", "msgID", "$msgID", array("toID","msg","doc"));

        if(!$docData || $docData->num_rows != 1)
            throw new Exception("Data not found",400);
        
        $docObj=$docData->fetch_assoc();
        
        if($_COOKIE['currOpenedChat'] == null  || (_get_userID_by_UNM($_COOKIE['currOpenedChat']) != $docObj['toID']) )
            throw new Exception("UNAUTHORIZED", 401);

        if(file_put_contents($_COOKIE['imgDir'].$docObj['msg'] ,$docObj['doc']) != false)
            return 1;
    
        throw new Exception("file uploading went wrong",0);
    
    }catch(Exception $e){
        return $e->getCode();
    }
}

function sendMsg($data){
    try{
        $newMsgID = $data['msgID'];
        $fromID = getDecryptedUserID();
        $toID = _get_userID_by_UNM($data['toUnm']);
        $type= $data['type'];
        $time = $data['time'];
    
        $msg_column = null;
        $msg_value = null;
        if($type === "text"){
            $msg_column = "msg";
            $msg_value = $data['msg'];
        }else {
            $fileName = $data['fileName'];
            
            if($type === "img"){
                $blob = explode(',',$data['blob']);

                if( (explode('/',$blob[0]))[0] != "data:image" )
                    throw new Exception("Not an image",415);
                
                $blob = $blob[1];

                $imgObj['tmp_name'] = $_COOKIE['imgDir'].$fileName;
                
                if(file_put_contents($imgObj['tmp_name'] , base64_decode($blob)) == false)
                    throw new Exception("File uploading error",0);
                    
                $imgObj=compressImg($imgObj);
                if(gettype($imgObj) == "integer")//error code return by compress image
                    throw new Exception("something went wrong in compression",$imgObj); 

                $data['details']['size'] = filesize($imgObj['tmp_name']);
                $mime = $imgObj['type'];
                $blob = base64_encode(file_get_contents($imgObj['tmp_name']));
                unlink($imgObj['tmp_name']);
            }else{
                $blob = explode(',',$data['blob'])[1];
                $mime= $data['mime'];
            }

            if($data['details']['size'] > MAX_DOC_SIZE )
                throw new Exception("Media size is larger then maximum size",413);

            convert_bytes($data['details']['size']);
            $details = serialize($data['details']);
            $msg_column = "mime, msg, doc, details";
            $msg_value = "$mime, $fileName, $blob, $details";
        }

        if($msg_column && $msg_value){
            $msgRes = insertData('messages' , "msgID, fromID, toID, time, type, $msg_column" ,"$newMsgID ,$fromID ,$toID, $time, $type, $msg_value");
                if($msgRes == 0)    throw new Exception("error on data insertion",400);
                // updating status of message
            insertData("messages","msgID,status","$newMsgID,send","status");
            return $msgRes;
        }

        // if anything went wrong and the code has not been return yet it will occure something went wrong error.
        throw new Exception("",400);
    }catch(Exception $e){
        return json_encode($e->getCode());
    }
}

function convert_bytes(&$size){
    if ($size === null) {
        return;
    }

    $count = 0; 
    while( $size >= 1024){
        $size /= 1024;
        $count++;
    }

    $size = number_format($size, 2, '.', ',');
    switch($count){
        case 1:
            $size .= " KB";
            break;
        case 2:
            $size .= " MB";
            break;
        case 3:
            $size .= " GB";
            break;  
    }

    return $size;
}

function getMsgStatus($msgID) {
    if(!$msgID) return 0;

    $res = fetch_columns("messages", "msgID", $msgID, array("status"), 'status');
    
    if(gettype($res)=='integer') return 0;

    return ($res->num_rows== 1) ? json_encode($res->fetch_column()) : 0 ;
}
?>