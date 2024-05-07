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
            default:
                echo 400;
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

        $data = "SELECT `msgID`,`fromID`, `type`, `msg`, `time` FROM `messages` WHERE $condition ORDER BY `time`";

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
                $msgs[$i]['toUnm']= ($row['fromID'] == $fromID) ? $toUnm : $fromUnm ;
                $msgs[$i]['type']= $row['type'];
                $msgs[$i]['msg']=$row['msg'];
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

function getDoc($msgID) {
    try{
        $docData = fetch_columns("messages", "msgID", "$msgID", "toID","msg","doc");

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
        if($type == "text"){
            $msg_column = "msg";
            $msg_value = $data['msg'];
        }else {
            $fileName = $data['fileName'];
            
            if($type == "img"){
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

                $fileSize = filesize($imgObj['tmp_name']);
                if($fileSize > 16777200 )
                    throw new Exception("Media size is larger then maximum size",413);
                
                $blob = base64_encode(file_get_contents($imgObj['tmp_name']));
            }else{

            }

            $msg_column = "msg,doc";
            $msg_value = "$fileName, $blob";
        }

        if($msg_column && $msg_value){
            $msgRes = insertData('messages' , "msgID, fromID, toID, time, type, $msg_column" ,"$newMsgID ,$fromID ,$toID, $time, $type, $msg_value");
            if($msgRes == 0)
                throw new Exception("error on data insertion",400);

            return $msgRes;
        }

        // if anything went wrong and the code has not been return yet it will occure something went wrong error.
        throw new Exception("",400);
    }catch(Exception $e){
        return $e->getCode();;
    }
}

?>