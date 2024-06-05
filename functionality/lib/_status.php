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
                echo getMsgStatus($data);
                break;
            case 'updateMsgStatus':
                echo updateMsgStatus($data);
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
            
            $chatType = strtolower($_COOKIE['chat']);
            switch($chatType){
                case 'personal':
                    $sql= " SELECT i.toID
                            FROM inbox as i JOIN users_details as ud
                            ON i.fromID = '$userID' 
                            WHERE i.toID = ud.userID 
                            AND ud.can_see_online_status = '1' ";

                    break;
                case 'group':
                    $sql= " SELECT i.toID
                            FROM inbox as i JOIN groups as g
                            ON i.fromID = '$userID' 
                            WHERE i.toID = g.groupID ";
                    
                    break;
                default:
                    throw new Exception("Select Chat Type first.",0);
            }

            $stmt = $GLOBALS['conn']->prepare($sql);
            $fire=$stmt->execute();
                if(!$fire)
                    throw new Exception("MySQL DB Error",0);

            $chatterIDList = $stmt->get_result();
            $stmt->close();

            if(gettype($chatterIDList) == "integer")//error code return by fetch_column
                throw new Exception("Something want wrong during fatching Chatter List please try again",$chatterIDList);
            
            if($chatterIDList->num_rows === 0)  return 0;

            $chatterList;
            $i=0;
            while($toID = $chatterIDList->fetch_column()){
                if($chatType == "personal"){
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

                    $chatterList[$i]['unm']= _fetch_unm($toID);
                    $chatterList[$i]['online'] =  $userOn;

                    $newMsgQuery = "SELECT count(*) 
                                    FROM `botsapp`.messages as t1 
                                    RIGHT JOIN `botsapp_statusdb`.messages as t2 
                                    on t1.msgID = t2.msgID 
                                    WHERE t1.fromID = '$toID' 
                                    AND t1.toID = '$userID' 
                                    AND t2.status = 'send' 
                                    ORDER BY t2.msgID";

                }else if($chatType == 'group'){
                    $chatterList[$i]['GID']= base64_encode($toID);

                    $newMsgQuery = "SELECT count(*) 
                                    FROM `botsapp`.messages as t1 
                                    RIGHT JOIN `botsapp_statusdb`.messages as t2 
                                    on t1.msgID = t2.msgID 
                                    WHERE NOT t1.fromID = '$userID' 
                                    AND t1.toID = '$toID' 
                                    AND t2.status = 'send' 
                                    ORDER BY t2.msgID";

                }else{
                    throw new Exception("Something went wrong.",400);
                }
                
                

                $newMsgStmt = $GLOBALS['status']->prepare($newMsgQuery);
                $fire = $newMsgStmt->execute();
                if(!$fire)
                    throw new Exception("New Message SQL error.",0);

                $newMsgObj= $newMsgStmt->get_result();
                $newMsgStmt ->close();

                $chatterList[$i]['last_msg'] = _fetchLastMsg($userID,$toID,$chatType);
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

    function getMsgStatus($data) {
        try{
            if(!isset($data['msgIDs'])) throw new Exception("No Msg ID has been provided",0);
            if(!$_COOKIE['currOpenedChat']) throw new Exception("Chat is not Opened",0);

            session_start();
            include_once('../lib/_fetch_data.php');

            $msgIDs = $data['msgIDs'];
            $userID = getDecryptedUserID();

            $chatType= strtolower($_COOKIE['chat']);
            
            if($chatType === 'personal'){
                $oppoUserID = _get_userID_by_UNM($_COOKIE['currOpenedChat']);
            }else if($chatType === 'group'){
                if(isset($data['toGID']) && is_data_present('groups','groupID', base64_decode($data['toGID']),'groupID'))
                    $oppoUserID = base64_decode($data['toGID']);
                else
                    throw new Exception("GID not detected",0);
            }else{
                throw new Exception("Something Went wrong.",400);
            }

            if(!$oppoUserID)  throw new Exception("Something Went Wrong",400);

            $bindParamQ = str_repeat("?,",count($msgIDs)-1).'?';
            $bindParamS = str_repeat("s",count($msgIDs));

            if($chatType === 'personal'){

                $sql =" SELECT t2.msgID ,t2.status 
                        FROM `botsapp`.messages as t1
                        RIGHT JOIN `botsapp_statusdb`.messages as t2
                        on t1.msgID = t2.msgID
                        WHERE ((t1.fromID = '$userID' AND t1.toID = '$oppoUserID')
                        OR (t1.fromID = '$oppoUserID' AND t1.toID = '$userID'))
                        AND t2.msgID IN ($bindParamQ) ";

                $msgStatusStmt = $GLOBALS['status']->prepare($sql);
                $msgStatusStmt->bind_param($bindParamS,...$msgIDs);

            }else{
                
                $sql =" SELECT t2.msgID ,t2.status 
                        FROM `botsapp`.messages as t1
                        RIGHT JOIN `botsapp_statusdb`.messages as t2
                        on t1.msgID = t2.msgID
                        WHERE t1.toID = '$oppoUserID'
                        AND t2.msgID IN ($bindParamQ) ";

                $msgStatusStmt = $GLOBALS['status']->prepare($sql);
                $msgStatusStmt->bind_param($bindParamS,...$msgIDs);
            }
            
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
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function updateMsgStatus($data) {
        try{
            $msgID = $data['msgID'];
            $chatType=strtolower($_COOKIE['chat']);
            
            if($chatType === 'group' && !is_data_present('groups','groupID', base64_decode($data['toGID']),'groupID'))
                throw new Exception("GID is not Valid, please do not touch user IDs.",0);

            switch($data['status']){
                case 0: $status = 'uploading'; break;
                case 1: $status = 'send'; break;
                case 2: $status = 'read'; break;
                default: throw new Exception("status code is wrong",0);
            }

            session_start();
            $userID = getDecryptedUserID();

            $msgUserID = ($chatType === 'personal') ? $userID : base64_decode($data['toGID']);

            $sql = "SELECT ms.status, ms.seenByIDs
                    FROM `botsapp`.messages as m
                    JOIN `botsapp_statusdb`.messages as ms
                    ON m.msgID = ms.msgID
                    WHERE ms.msgID = ?
                    AND (m.fromID = ? OR m.toID = ?);";

            $stmt = $GLOBALS['conn']->prepare($sql);
            $stmt->bind_param('sss',$msgID,$msgUserID,$msgUserID);
            $fire = $stmt->execute();
            if(!$fire)
                throw new Exception("Something went wrong while fetching message status",400);

            $res = $stmt->get_result();
            $stmt->close();
            
            
            if($res->num_rows == 0)
                $result = insertData('messages', ['msgID','status','seenByIDs'],[$msgID,$status,$userID],'status');
            else if($res->num_rows == 1){
                $row = $res->fetch_assoc();

                $updateCol = [];
                $updateVal = [];
                
                if($row['status'] != 'read'){
                
                    if($chatType == 'personal'){
                    
                        $updateCol= ['status','seenByIDs'];
                        $updateVal= ['read',serialize([$userID])];
                    
                    }else if($chatType == 'group'){
                    
                        $sql = "SELECT count(*) 
                                FROM inbox 
                                WHERE toID = (SELECT toID FROM messages WHERE msgID = ?);";

                        $stmt = $GLOBALS['conn']->prepare($sql);
                        $stmt->bind_param('s',$msgID);
                        $fire = $stmt->execute();

                        if(!$fire)
                            throw new Exception("Sql for fetching Data of Group Member has occured error.",0);

                        $res = $stmt->get_result();
                        $stmt->close();

                        if($res->num_rows != 1)
                            throw new Exception("Something Went Wrong.",400);

                        $seenByIDs = ($row['seenByIDs'] != null) ? unserialize($row['seenByIDs']) : [] ;
                        $memCount = $res->fetch_column();//it will fetch memberes count from groups
   
                            if($memCount == 0){
                                //do delte operation
                            }

                        $updateCol=[];
                        $updateVal=[];
                        
                        if(!in_array($userID,$seenByIDs)){
                            $updateCol[]='seenByIDs';
                            $updateVal[]= serialize($seenByIDs[]=$userID);
                        }
                        //-1 for the user who send the messages
                        if(count($seenByIDs) == $memCount-1){
                            $updateCol[]= 'status';
                            $updateVal[]= 'read';
                        }

                    }else
                        throw new Exception("Something Went Wrong",400);
                } 

                $result = ($updateCol && $updateVal) ? updateData('messages',$updateCol,$updateVal,'msgID',$msgID,'status') : 1 ;
            }else
                throw new Exception("More then one records for same msg status",0);

            return json_encode($result);
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