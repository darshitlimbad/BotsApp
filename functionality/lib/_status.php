<?php
    if($data = json_decode(file_get_contents('php://input'),true)){
        include_once('../db/_conn.php');
        include_once('../lib/_validation.php');

        switch($data['req']){
            case 'onlineStatusUpdate':
                echo onlineStatusUpdate();
                break;
            case 'checkChatListStatus':
                echo checkChatListStatus();
                break;
            case 'getMsgStatus':
                echo getMsgStatus($data['msgIDs']);
                break;
            case 'updateMsgStatus':
                echo updateMsgStatus($data['msgID'],$data['status']);
                break;
            default:
                echo json_encode(['code'=>400,'message'=>"BAD REQUEST"]);
        }
    }


    function onlineStatusUpdate(){
        try{
            session_start();
            $userID = getDecryptedUserID();
            $isUserStatusExist = fetch_columns("on_status",["userID"],[$userID],array("count(*) as totalRow"),"status");

            if(gettype($isUserStatusExist) == 'integer')//error code return by the fetch function
                throw new Exception("something went wrong!!",$isUserStatusExist);

            if($isUserStatusExist->fetch_column() == 1)
                $result = updateData("on_status",array("last_on_time"),array(time()),"userID",$userID,"status");
            else
                $result = insertData("on_status", ['userID','last_on_time'], [$userID,time()], 'status');

            session_abort();
            return json_encode($result);
        }catch(Exception $e){
            $error = [
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function checkChatListStatus(){
        try{
            session_start();
            include_once('../lib/_fetch_data.php');

            $userID = getDecryptedUserID();
            
            switch($_COOKIE['chat']){
                case 'Personal':
                    $chatterIDList = fetch_columns("inbox",["fromID"],[$userID],['toID']);
                    break;
                case 'Group':
                    //update this when group chat functionality will be added.
                    return 0;
                    break;
                default:
                    throw new Exception("Select Chat Type first.",0);
            }

            if(gettype($chatterIDList)=="integer")//error code return by fetch_column
                throw new Exception("Something want wrong during fatching Chatter List please try again",$chatterIDList);
            
            if($chatterIDList->num_rows === 0)  return 0;

            $chatterList;
            $i=0;
            while($toID = $chatterIDList->fetch_column()){
                $userOn =null;
                $lastOnTime =null;

                $userOnTime = fetch_columns("on_status",["userID"],[$toID],['last_on_time'],"status");

                if(gettype($userOnTime) == 'Integer')
                    continue;
                if($userOnTime->num_rows == 0)
                    $userOn =  false;
                else{
                    $lastOnTime = $userOnTime->fetch_column();
                    //if you do any changes in requst time then please change here also
                    $userOn = $lastOnTime >= time()-2;
                } 
                
                $chatterList[$i]['unm']= _fetch_unm($toID);
                $chatterList[$i]['online'] =  $userOn;
                if(!$userOn) {
                    if($lastOnTime){
                        if(date('d-m',$lastOnTime) >= date('d-m',time()))
                            $chatterList[$i]['lastOnDay'] = 'Today';
                        else if(date('d-m',$lastOnTime) >= date('d-m',date_create('-1 days')->getTimestamp()))
                            $chatterList[$i]['lastOnDay'] = 'Yesterday';
                        else
                            $chatterList[$i]['lastOnDay'] = date("d-m-Y",$lastOnTime);
                    }else  
                        $chatterList[$i]['lastOnDay'] = "New User";
                }

                $newMsgQuery = "SELECT count(*) 
                                FROM `botsapp`.messages as t1 
                                RIGHT JOIN `botsapp_statusdb`.messages as t2 
                                on t1.msgID = t2.msgID 
                                WHERE t1.fromID = '$toID' 
                                AND t1.toID = '$userID' 
                                AND t2.status = 'send' 
                                ORDER BY t2.msgID";

                $newMsgStmt = $GLOBALS['status']->prepare($newMsgQuery);
                $fire = $newMsgStmt->execute();
                if(!$fire)
                    throw new Exception("New Message SQL error.",0);
                else
                    $newMsgObj= $newMsgStmt->get_result();
                    $newMsgStmt ->close();

                $chatterList[$i]['total_new_messages'] = ($newMsgObj->num_rows != 0) ? $newMsgObj->fetch_column() : 0;

                $i++;
            }

            session_abort();
            return json_encode($chatterList);
        }catch(Exception $e){
            $error = [
                'error'=>1,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function getMsgStatus(array $msgIDs) {
        try{
            if(!$msgIDs) throw new Exception("No Msg ID has been provided",0);
            if(!$_COOKIE['currOpenedChat']) throw new Exception("Chat is not Opened",0);

            session_start();
            include_once('../lib/_fetch_data.php');

            $userID = getDecryptedUserID();
            $oppoUserID = _get_userID_by_UNM($_COOKIE['currOpenedChat']);
                if(!$oppoUserID)  throw new Exception("Something Went Wrong",400);

            $bindParamQ = str_repeat("?,",count($msgIDs)-1).'?';
            $bindParamS = str_repeat("s",count($msgIDs));

            $sql =" SELECT t2.msgID ,t2.status 
                    FROM `botsapp`.messages as t1
                    RIGHT JOIN `botsapp_statusdb`.messages as t2
                    on t1.msgID = t2.msgID
                    WHERE t1.fromID IN ('$userID','$oppoUserID')
                    AND t1.toID IN ('$userID','$oppoUserID' )
                    AND t2.msgID IN ($bindParamQ)";
                    
            $msgStatusStmt = $GLOBALS['status']->prepare($sql);
            $msgStatusStmt->bind_param($bindParamS,...$msgIDs);
            $fire = $msgStatusStmt->execute();

            if(!$fire) throw new Exception("Something went Wrong while fetching Data from DB.",0);

            $res =  $msgStatusStmt ->get_result();
            $msgStatusStmt->close();

            if($res->num_rows == 0) return 0;
            
            // $i=0;
            $msgStatus=[];        
            while($row = $res->fetch_assoc())
                $msgStatus[]=$row;

            session_abort();
            return json_encode($msgStatus) ;
        }catch(Exception $e){
            $error = [
                'error'=>1,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function updateMsgStatus($msgID,$status) {
        try{
            if(!$msgID) throw new Exception("message ID is null",0);

            switch($status){
                case 0: $status = 'uploading'; break;
                case 1: $status = 'send'; break;
                case 2: $status = 'read'; break;
                default: throw new Exception("status code is wrong",0);
            }
    
            $res = fetch_columns("messages", ["msgID"], [$msgID], ["status"], 'status');
            if(gettype($res) == 'integer')
                throw new Exception("Something went wrong Please try again",400);
            
            if($res->num_rows == 0)
                $result = insertData('messages', ['msgID','status'],[$msgID,$status],'status');
            else if($res->num_rows == 1)
                $result = updateData('messages',['status'],[$status],'msgID',$msgID,'status');
            else
                throw new Exception("More then one records for same msg status",0);

            return json_encode($result);
        }catch(Exception $e){
            $error = [
                'error'=>1,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }
?>