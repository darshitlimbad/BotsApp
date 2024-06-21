<?php

if($data = json_decode( file_get_contents("php://input") , true)){
    session_start();
    if(isset($_SESSION['userID'])){
        require_once('../db/_conn.php');
        require_once('_validation.php');
        require_once('_fetch_data.php');
        require_once('_status.php');
        
        switch($data['req']){
            case "getChatList":
                if(isset($data['chatType']))
                    echo getChatList($data['chatType']);
                else
                    echo getChatList();
                break;
            case "getAllMsgs":
                echo getAllMsgs($data);
                break;
            case "getNewMsgs":
                echo getNewMsgs($data);
                break;
            case "sendMsg":
                echo sendMsg($data);
                break;
            // case "genNewID":
            //     echo json_encode(gen_new_id($data['preFix']));
            //     break;
            case "editGroupDetails":
                if(isset($data['column']) && isset($data['value']))
                    echo editGroupDetails($data['column'],$data['value']);
                else
                    echo '{"error":true,"code":400,"message":""}';
                break;
            default:
                echo '{"error":true,"code":400,"message":""}';
        }
        
    }else{
        header('Location: /');
    }
    session_abort();
}else{
    header('Location: /');
}

function getChatList(string $chatType=null){
    try{

        if($chatType && ($chatType != 'personal') &&  ($chatType != 'group'))
            throw new Error('Invalid Chat Type',0);

        $userID = getDecryptedUserID();
        if(!$chatType)
            $chatType = strtolower($_COOKIE['chat']);
        
        $dataFromInbox = fetch_columns('inbox', ['fromID','chatType'], [$userID,$chatType], array("toID"));
        
        if($dataFromInbox -> num_rows != 0 ){
            $chatList[0]=false;
            
            $i=0;
            while( $toID = $dataFromInbox->fetch_column() ){
                if( $chatType == 'personal' ){
                    if(!is_data_present('users_account', ['userID'], [$toID] ) 
                        || (is_chat_exist($userID, $toID) == -1
                        || (is_user_blocked($userID,$toID)))){
                        $del = "DELETE FROM `inbox` 
                                WHERE (`fromID` , `toID`) IN (('$userID', '$toID'), ('$toID', '$userID'));";
                        $GLOBALS['conn']->query($del);
                        continue;
                    }
                    
                    $chatList[$i]['unm'] = ($userID != $toID ) ? _fetch_unm($toID) : "You";

                }elseif($chatType == 'group'){

                    if(!is_data_present('groups', ['groupID'], [$toID], 'name')){
                        $del = deleteData('inbox',$toID,'toID');
                        continue;
                    }else if(!is_member_of_group($userID,$toID)){
                        $del = "DELETE FROM `inbox` WHERE `fromID` = '$userID' , `toID` = '$toID'";
                        $GLOBALS['conn']->query($del);
                        delete_group_if_empty($toID);
                        continue;
                    }

                    $chatList[$i]['unm'] = _fetch_group_nm($toID);
                    $chatList[$i]['GID'] = base64_encode($toID);
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
        
    }catch(Exception $e){
        return $e;
    }
}

function getAllMsgs($data){
    try{
        if(!isset($_COOKIE['chat']))
            throw new Error('chat section is not opened',0);
        if(!$_COOKIE['currOpenedChat'])
            throw new Error('Chat is not opened, Please open chat first.',0);

        $userUNM = _fetch_unm();
        $userID = getDecryptedUserID();        
        
        $chatType = strtolower($_COOKIE['chat']);
        $oppoUserUNM = $_COOKIE['currOpenedChat'];
        
        if( $chatType == "personal"){
            $oppoUserID = _get_userID_by_UNM($oppoUserUNM);

            if(!$oppoUserID)
                throw new Exception('Something went wrong',400);
            else if(is_chat_exist($userID,$oppoUserID) != 1)
                throw new Exception("There is no Chat.",0);

        }else if( $chatType == "group") {
            $oppoUserID = base64_decode($_COOKIE['currOpenedGID']);

            if(!is_data_present('groups',['groupID'], [$oppoUserID] ,'groupID'))
                throw new Exception("There is no group with the GID.",404);
            else if(!is_member_of_group($userID,$oppoUserID))
                throw new Exception("You are not a member of this group.",410);   
        }else{
            return 0;
        }

        if($chatType == 'personal'){
            $sql =" SELECT m.msgID, m.fromID, m.toID, m.type, m.msg, m.details, m.time, ms.status, ms.hide
                    FROM messages AS m
                    RIGHT JOIN `botsapp_statusdb`.messages AS ms
                    ON m.msgID = ms.msgID
                    WHERE (m.fromID = '$userID' AND m.toID = '$oppoUserID')
                    OR (m.fromID = '$oppoUserID' AND m.toID = '$userID' AND ms.hide = 0)
                    ORDER BY m.time ASC";
        
            $stmt = $GLOBALS['conn'] -> prepare($sql);
            $sqlquery= $stmt->execute();

            if(!$sqlquery)
            throw new Exception('sql not fired',0);

            $result=$stmt->get_result();
            $stmt ->close();

        }else{
            $sql =" SELECT m.msgID, m.fromID,m.`toID`, m.`type`, m.`msg`, m.`details` ,m.`time` , ms.status, ms.seenByIDs, ms.hide, ms.hide_by
                    FROM botsapp.`messages` as m
                    RIGHT JOIN `botsapp_statusdb`.messages as ms
                    ON m.msgID = ms.msgID
                    WHERE m.toID = '$oppoUserID'
                    AND (ms.hide = 0 OR ms.hide_by IS NULL OR LOCATE('$userID',ms.hide_by) = 0)
                    ORDER BY m.time ASC";

            $result= $GLOBALS['conn'] -> query($sql);
        }

        if($result->num_rows == 0)  return 0;

        $msgObjs = null;
        $i=0;
        while($row = $result->fetch_assoc()){

            $msgObjs[$i]['msgID']= base64_encode($row['msgID']);
            $msgObjs[$i]['fromUnm']= _fetch_unm($row['fromID']);
            //if chatType will be a group than always 'toUNM' will be the group name
            $msgObjs[$i]['toUnm']= ($chatType == 'group') ? $oppoUserUNM : (($row['fromID'] == $userID) ? $oppoUserUNM : $userUNM) ;
            $msgObjs[$i][($row['type'] == 'text') ? 'msg' : 'fileName']=$row['msg'];
            $msgObjs[$i]['type']= $row['type'];
            $msgObjs[$i]['details'] = unserialize($row['details']);
            $msgObjs[$i]['time']= $row['time'];
            $i++;


            if($row['status'] !== 'read' && $row['fromID'] !== $userID){
                updateMsgStatus($chatType,$row['msgID'],$row['fromID'],$row['toID'],$userID);
            }
        }

        return ($msgObjs) ? json_encode($msgObjs) : 0 ;

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
function getNewMsgs($data){
    try{
        if(!isset($_COOKIE['chat']))
            throw new Error('chat section is not opened',0);
        if(!$_COOKIE['currOpenedChat'])
            throw new Error('Chat is not opened, Please open chat first.',0);

        $userUNM = _fetch_unm();
        $userID = getDecryptedUserID();

        $oppoUserUNM = $_COOKIE['currOpenedChat'];
        $chatType = strtolower($_COOKIE['chat']);

        if( $chatType == "personal"){
            $oppoUserID = _get_userID_by_UNM($oppoUserUNM);

            if(!$oppoUserID)
                throw new Exception('Something went wrong',400);
            else if(is_chat_exist($userID,$oppoUserID) != 1)
                throw new Exception("There is no Chat.",0);

        }else if( $chatType == "group") {
            $oppoUserID = base64_decode($_COOKIE['currOpenedGID']);

            if(!is_data_present('groups',['groupID'], [$oppoUserID] ,'groupID'))
                throw new Exception("There is no group with the GID.",404);
            else if(!is_member_of_group($userID,$oppoUserID)){
                delete_group_if_empty($oppoUserID);
                throw new Exception("You are not a member of this group.",410);
            }

        }else{
            throw new Exception("please reload this page :(",400);
        }

        if($chatType == 'personal'){
            // t1.fromID = 'the opposite user'
            // t1.toID = 'the user'
            $condition ="   t1.fromID = ? 
                            AND t1.toID = ?     ";
        }else{
            // t1.fromID = 'the User'
            // t1.toID = 'the opposite User'
            $condition = "  t1.toID = ?
                            AND NOT t1.fromID = ? ";
        }

        $sql =" SELECT t1.msgID, t1.fromID,t1.toID,t1.type, t1.msg, t1.details, t1.time, t2.status, t2.seenByIDs
                FROM `botsapp`.messages as t1 
                LEFT JOIN `botsapp_statusdb`.messages as t2
                ON t1.msgID = t2.msgID 
                WHERE $condition
                AND t2.status = 'send' 
                ORDER BY t1.time";

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
            $seenByIDs = ($row['seenByIDs'] != null) ? unserialize($row['seenByIDs']) : [] ;
            if($seenByIDs && in_array($userID,$seenByIDs))
                continue;

            $msgObjs[$i]['msgID']= base64_encode($row['msgID']);
            $msgObjs[$i]['fromUnm']= _fetch_unm($row['fromID']);
            //if chatType will be a group than always 'toUNM' will be the group name
            $msgObjs[$i]['toUnm']= ($chatType == 'group') ? $oppoUserUNM : (($row['fromID'] == $userID) ? $oppoUserUNM : $userUNM) ;
            $msgObjs[$i][($row['type'] == 'text') ? 'msg' : 'fileName']=$row['msg'];
            $msgObjs[$i]['type']= $row['type'];
            $msgObjs[$i]['details'] = unserialize($row['details']);
            $msgObjs[$i]['time']= $row['time'];
            $i++;

            updateMsgStatus($chatType,$row['msgID'],$row['fromID'],$row['toID'],$userID);

        }

        return ($msgObjs) ? json_encode($msgObjs) : 0;

    }catch(Exception $e){
        $error = [
            'error'=>true,
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
}   

function sendMsg(array $data){
    try{
        if(!isset($_COOKIE['chat']))
            throw new Error('chat section is not opened',0);
        if(!$_COOKIE['currOpenedChat'])
            throw new Error('Chat is not opened, Please open chat first.',0);

        $newMsgID = gen_new_id('Msg');
        $fromID = getDecryptedUserID();
        
        switch(strtolower($_COOKIE['chat'])){
            case 'personal':
                $oppoUserID = _get_userID_by_UNM($data['toUnm']);

                if(!$oppoUserID)
                    throw new Exception('Something went wrong',400);
                else if(!is_data_present('users_account',['userID'], [$oppoUserID], 'userID'))
                    return 0;
                else if(is_chat_exist($fromID,$oppoUserID) != 1)
                    throw new Exception("There is no Chat.",0);
                break;
            case 'group' :
                if(isset($_COOKIE['currOpenedGID']) 
                    && is_data_present('groups',['groupID'], [base64_decode($_COOKIE['currOpenedGID'])] ,'groupID') ){
                    $oppoUserID = base64_decode($_COOKIE['currOpenedGID']);

                    if(!is_member_of_group($fromID,$oppoUserID)){
                        delete_group_if_empty($oppoUserID);

                        throw new Exception("You are not a member of this group.",410);
                    }
                }else
                    throw new Exception("No data Found",411);   
                break;
            default:
                return 0;
        }
        
        if(!is_data_present('inbox',['fromID','toID'],[$fromID,$oppoUserID],'id'))
            throw new Exception("Unauthorise Access !!!",410);

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
            $status = ($fromID == $oppoUserID) ? 'read' : 'send' ;
            insertData("messages",["msgID","status"],[$newMsgID,$status],"status");

            if($msgRes)
                $response=[
                    'msgSend'=>1,
                    'msgID'=>base64_encode($newMsgID),
                ];
            else
                $response=['msgSend'=>0];

            return json_encode($response);
        }

        // if anything went wrong and the code has not been return yet it will occure something went wrong error.
        throw new Exception("",0);
    }catch(Exception $e){
        $error = [
            'error'=>true,
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
}

function editGroupDetails($column,$value){
    try{
        if(!$column || !$value)
            throw new Exception("",0);

        switch($column){
            case 'name':
                $column= 'name';break;
            case 'dp':
                $column= 'dp';break;
            default:
                throw new Exception("Invalid Column value",410);
        }

        if(!isset($_COOKIE['chat']))
            throw new Error('chat section is not opened',0);
        if(!isset($_COOKIE['currOpenedGID']))
            throw new Error('Group Chat is not opened, Please open chat first.',0);

        $userID=    getDecryptedUserID();
        $groupID=   base64_decode($_COOKIE['currOpenedGID']);

        if(!is_member_of_group($userID,$groupID))
            throw new Exception("You are not A member of this group!",410);

        if($column === 'dp'){
                $blob = explode(',',$value);

                if( (explode('/',$blob[0]))[0] != "data:image" )
                    throw new Exception("Not an image",415);
                
                $blob = $blob[1];

                $imgObj['tmp_name'] = $_COOKIE['imgDir'].time();
                
                if(file_put_contents($imgObj['tmp_name'] , base64_decode($blob)) == false)
                    throw new Exception("File uploading error",0);
                
                $imgObj=compressImg($imgObj);
                if(gettype($imgObj) == "integer")//error code return by compress image
                    throw new Exception("something went wrong in compression",$imgObj); 

                //fetching compressed blob data 
                $value = base64_encode(file_get_contents($imgObj['tmp_name']));
                unlink($imgObj['tmp_name']);
        }

        $editResult= updateData('groups',[$column],[$value],'groupID',$groupID);

        if($editResult === 1)
            return $editResult;
        else
            throw new Exception("",$editResult);

    }catch(Exception $e){
        $error = [
            'error'=>true,
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
}
?>