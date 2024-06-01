<?php

if($data = json_decode( file_get_contents("php://input") , true)){
    session_start();
    if(isset($_SESSION['userID'])){
        include_once('../db/_conn.php');
        include_once('../lib/_validation.php');
        include_once('../lib/_fetch_data.php');
        
        switch($data['req']){
            case "getChatList":
                echo getChatList();
                break;
            case "getAllMsgs":
                echo getAllMsgs($data['ID']);
                break;
            case "getNewMsgs":
                echo getNewMsgs($data['ID']);
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

function getChatList(){
    try{
        $userID = getDecryptedUserID();
        $chatType = strtolower($_COOKIE['chat']);
        
        $dataFromInbox = fetch_columns('inbox', ['fromID','chatType'], [$userID,$chatType], array("toID"));
        
        if($dataFromInbox -> num_rows != 0 ){
            $chatList[0]=false;
            
            $i=0;
            while( $toID = $dataFromInbox->fetch_column() ){
                if( $chatType == 'personal' ){
                    if(!is_data_present('users_account', 'userID', $toID)){
                        $del = "DELETE FROM `messages` 
                                WHERE (`fromID` , `toID`) IN (('$userID', '$toID'), ('$toID', '$userID'));
                                DELETE FROM `inbox` 
                                WHERE  `fromID` = '$userID' 
                                AND `toID` = '$toID';"; 
                        $GLOBALS['conn']->query($del);
                        continue;
                    }
                    
                    $chatList[$i]['unm'] = ($userID != $toID ) ? _fetch_unm($toID) : "You";

                }elseif($chatType == 'group'){

                    if(!is_data_present('groups', 'groupID', $toID, 'groupName')){
                        $del = "DELETE FROM `messages` 
                                WHERE  `fromID` = '$userID' 
                                AND `toID` = '$toID';
                                DELETE FROM `inbox` 
                                WHERE  `fromID` = '$userID' 
                                AND `toID` = '$toID'; "; 

                        $GLOBALS['conn']->query($del);
                        continue;
                    }

                    $chatList[$i]['unm'] = _fetch_group_nm($toID);
                    $chatList[$i]['groupID'] = base64_encode($toID);
                }
                $chatList[$i]['last_msg']= _fetChLastMsg($userID,$toID);

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

function getAllMsgs($groupID){
    try{
        if(!isset($_COOKIE['chat']))
            throw new Error('chat section is not opened',0);
        if(!isset($_COOKIE['currOpenedChat']))
            throw new Error('Chat is not opened, Please open chat first.',0);

        $userUNM = _fetch_unm();
        $userID = getDecryptedUserID();
        
        $chatType = strtolower($_COOKIE['chat']);

        $oppoUserUNM = $_COOKIE['currOpenedChat'];
        
        if( $chatType == "personal"){
            $oppoUserID = _get_userID_by_UNM($oppoUserUNM);
        }else if( $chatType == "group" && $groupID != null) {
            $oppoUserID = base64_decode($groupID);
        }else{
            return 0;
        }

        if(!$oppoUserID)
                throw new Exception('Something went wrong',400);

        if($chatType == 'personal'){
            $sql =" SELECT m.`msgID`,m.`fromID`, m.`type`, m.`msg`, m.`details` ,m.`time` 
                    FROM `messages` as m
                    WHERE ( m.`fromID` , m.`toid` ) IN ( (? , ?), (? , ?) )";
        
            $stmt = $GLOBALS['conn'] -> prepare($sql);
            $stmt ->bind_param('ssss' , $userID, $oppoUserID , $oppoUserID, $userID);
            $sqlquery= $stmt->execute();

            if(!$sqlquery)
            throw new Exception('sql not fired',0);

            $result=$stmt->get_result();
            $stmt ->close();

        }else
            $result = fetch_columns('messages',['toID'],[$oppoUserID],['msgID','fromID','type','msg','details','time']);

        if($result->num_rows == 0)  return 0;

        $msgObjs = null;
        $i=0;
        while($row = $result->fetch_assoc()){
            $msgObjs[$i]['type']= $row['type'];
            
            if($row['type'] == 'text'){
                $msgColNm = "msg";
            }else{
                $msgColNm = "fileName";
            }

            $msgObjs[$i]['details'] = unserialize($row['details']);
            $msgObjs[$i][$msgColNm]=$row['msg'];
            $msgObjs[$i]['msgID']= $row['msgID'];
            $msgObjs[$i]['fromUnm']= _fetch_unm($row['fromID']);
            $msgObjs[$i]['toUnm']= ($row['fromID'] == $userID) ? $oppoUserUNM : $userUNM ;
            $msgObjs[$i]['time']= $row['time'];
            $i++;
        }

        return json_encode($msgObjs);

    }catch(Exception $e){
        $error = [     
            'error'=> true,       
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
}

/*
    this function is used get new msgs from msgID,
    before returning the msgObj it check if given msgID has the matching toID or FromID as the chatter and the opposite chatter.
*/
function getNewMsgs($groupID){
    try{
        if(!isset($_COOKIE['chat']))
            throw new Error('chat section is not opened',0);
        if(!isset($_COOKIE['currOpenedChat']))
            throw new Error('Chat is not opened, Please open chat first.',0);

        $userUNM = _fetch_unm();
        $userID = getDecryptedUserID();

        $oppoUserUNM = $_COOKIE['currOpenedChat'];
        $chatType = strtolower($_COOKIE['chat']);

        $oppoUserUNM = $_COOKIE['currOpenedChat'];
        
        if( $chatType == "personal"){
            $oppoUserID = _get_userID_by_UNM($oppoUserUNM);
        }else if( $chatType == "group" && $groupID != null) {
            $oppoUserID = base64_decode($groupID);
        }else{
            return 0;
        }

        if(!$oppoUserID)
            throw new Exception('Something went wrong',400);

        if($chatType == 'personal'){
            $sql =" SELECT t1.msgID, t1.type, t1.msg, t1.details, t1.time, t2.status
                    FROM `botsapp`.messages as t1 
                    LEFT JOIN `botsapp_statusdb`.messages as t2
                    ON t1.msgID = t2.msgID 
                    WHERE t1.fromID = ? 
                    AND t1.toID = ?
                    AND t2.status = 'send' ";
        }else{
            $sql =" SELECT t1.msgID, t1.type, t1.msg, t1.details, t1.time, t2.status
                    FROM `botsapp`.messages as t1 
                    LEFT JOIN `botsapp_statusdb`.messages as t2
                    ON t1.msgID = t2.msgID 
                    WHERE NOT t1.fromID = ?
                    AND t1.toID = ?
                    AND t2.status = 'send' ";

        }

        $stmt = $GLOBALS['conn'] -> prepare($sql);
        $stmt ->bind_param('ss' , $oppoUserID,$userID);        

        $sqlquery= $stmt->execute();

        if(!$sqlquery)
            throw new Exception("sql not fired.",0);
            
        $result=$stmt->get_result();
        $stmt ->close();
            if($result->num_rows == 0)  return 0;

        $msgObjs = null;
        $i=0;
        while($row = $result->fetch_assoc()){
            $msgObjs[$i]['msgID']= $row['msgID'];
            $msgObjs[$i]['toUnm']= $userUNM ;
            $msgObjs[$i]['type']= $row['type'];
            
            $msgColNm = ($row['type'] == 'text') ? 'msg' : 'fileName';
            $msgObjs[$i][$msgColNm]=$row['msg'];
            
            $msgObjs[$i]['details'] = unserialize($row['details']);
            $msgObjs[$i]['time']= $row['time'];
            
            $i++;
        }

        return json_encode($msgObjs);

    }catch(Exception $e){
        $error = [
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
}

function sendMsg($data){
    try{
        if(!isset($_COOKIE['chat']))
            throw new Error('chat section is not opened',0);
        if(!isset($_COOKIE['currOpenedChat']))
            throw new Error('Chat is not opened, Please open chat first.',0);

        $newMsgID = $data['msgID'];
        $fromID = getDecryptedUserID();
        
        switch(strtolower($_COOKIE['chat'])){
            case 'personal':
                $oppoUserID = _get_userID_by_UNM($data['toUnm']);

                if(!is_data_present('users_account','userID', $oppoUserID, 'userID'))
                    return 0;
                break;
            case 'group' :
                if(isset($data['toGID']) && is_data_present('groups','groupID', base64_decode($data['toGID']),'groupID') )
                    $oppoUserID = base64_decode($data['toGID']);
                else
                    throw new Exception("GID not detected",0);   
                break;
            default:
                return 0;
        }

        $type = $data['type'];
        $time = $data['time'];
    
        $msg_columns = array("msgID", "fromID", "toID", "time", "type");
        $msg_values = array($newMsgID ,$fromID ,$oppoUserID, $time, $type);

        if($type === "text"){
            $msg_columns[] = "msg";
            $msg_values[] = $data['msg'];
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
                $data['details']['ext'] = 'WEBP';
                $mime = $imgObj['type'];
                $blob = base64_encode(file_get_contents($imgObj['tmp_name']));
                unlink($imgObj['tmp_name']);
            }else if($type === 'doc' ){
                $blob = explode(',',$data['blob'])[1];
                $mime= $data['mime'];
            }else{
                return 0;
            }
            
            if($data['details']['size'] > MAX_DOC_SIZE )
                throw new Exception("Media size is larger then maximum size",413);

            $details = serialize($data['details']);

            array_push($msg_columns, "mime", "msg", "doc", "details");
            array_push($msg_values, $mime, $fileName, $blob, $details);
        }

        if($msg_columns && $msg_values){
            $msgRes = insertData('messages' , $msg_columns ,$msg_values);
                if($msgRes == 0)    throw new Exception("error on data insertion",400);
            
            // updating status of message
            insertData("messages",["msgID","status"],[$newMsgID,"send"],"status");
            return $msgRes;
        }

        // if anything went wrong and the code has not been return yet it will occure something went wrong error.
        throw new Exception("",400);
    }catch(Exception $e){
        return json_encode($e->getCode());
    }
}
?>