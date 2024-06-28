<?php
    if($data = json_decode(file_get_contents('php://input'),true)){
        require_once('../db/_conn.php');
        require_once('../lib/_validation.php');

        switch($data['req']){
            case 'onlineStatusUpdate':
                echo onlineStatusUpdate();
                break;
            case 'checkStatus':
                echo checkStatus();
                break;
            case 'getMsgStatus':
                echo getMsgStatus($data);
                break;
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
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function checkStatus(){
        try{
            session_start();
            require_once('../lib/_fetch_data.php');

            $userID = getDecryptedUserID();
            
            $chatType = strtolower($_COOKIE['chat']);
            switch($chatType){
                case 'personal':
                    $sql= " SELECT i.toID , ud.can_see_online_status as can_see
                            FROM inbox as i 
                            JOIN users_details as ud
                            ON i.fromID = '$userID' 
                            WHERE i.toID = ud.userID  ";

                    break;
                case 'group':
                    $sql= " SELECT i.toID
                            FROM inbox as i 
                            JOIN groups as g
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
            while($row = $chatterIDList->fetch_assoc()){
                $toID=$row['toID'];

                if($chatType == "personal"){
                    if($row['can_see'] == 1){
                        $userOn =null;
                        $lastOnTime =null;
        
                        $userOnTime = fetch_columns("on_status",["userID"],[$toID],['last_on_time'],"status");
        
                        if(gettype($userOnTime) == 'Integer')
                            continue;
                        
                        if($userOnTime->num_rows == 0)
                            $userOn =  false;
                        else{
                            $lastOnTime = $userOnTime->fetch_column();
                            $userOn = $lastOnTime >= time()- REQUEST_TIME;
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

                        $chatterList[$i]['online'] =  $userOn;
                    }else{
                        $chatterList[$i]['can_not_see_online_status'] = 1;
                    }

                    $chatterList[$i]['unm']= _fetch_unm($toID);

                    $newMsgCountQuery ="SELECT count(*) 
                                        FROM `botsapp`.messages as t1 
                                        RIGHT JOIN `botsapp_statusdb`.messages as t2 
                                        on t1.msgID = t2.msgID 
                                        WHERE t1.fromID = '$toID' 
                                        AND t1.toID = '$userID' 
                                        AND t2.status = 'send' 
                                        ORDER BY t2.msgID";

                }else if($chatType == 'group'){
                    $chatterList[$i]['GID']= base64_encode($toID);

                    $newMsgCountQuery ="SELECT t2.seenByIDs 
                                        FROM `botsapp`.messages as t1 
                                        LEFT JOIN `botsapp_statusdb`.messages as t2 
                                        on t1.msgID = t2.msgID 
                                        WHERE t1.toID = '$toID' 
                                        AND t2.status = 'send' 
                                        AND NOT t1.fromID = '$userID' 
                                        ORDER BY t2.msgID";

                }else{
                    throw new Exception("Something went wrong.",400);
                }
                
                $newMsgStmt = $GLOBALS['status']->prepare($newMsgCountQuery);
                $fire = $newMsgStmt->execute();
                if(!$fire)
                    throw new Exception("New Message SQL error.",0);

                $newMsgObj= $newMsgStmt->get_result();
                $newMsgStmt ->close();

                $chatterList[$i]['lastMsgData'] = json_encode(_fetchLastMsg($userID,$toID,$chatType));
                if($chatType === 'personal')
                    $chatterList[$i]['total_new_messages'] = ($newMsgObj->num_rows != 0) ? $newMsgObj->fetch_column() : 0;
                else {
                    $count=0;
                    if($newMsgObj->num_rows != 0){
                        for($j=1;$j<=$newMsgObj->num_rows;$j++){
                            $seenByIDs= $newMsgObj->fetch_column();
                            if($seenByIDs){
                                $seenByIDs=unserialize($seenByIDs);
                                if(in_array($userID,$seenByIDs))
                                    continue;
                                
                            }
                            $count++;
                        }
                    }
                    
                    $chatterList[$i]['total_new_messages']= $count;
                }
                $i++;
            }

            session_abort();
            return json_encode($chatterList);
        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function getMsgStatus($data) {
        try{
            if(!$_COOKIE['chat'])
                throw new Exception('chat section is not opened',0);
            if(!$_COOKIE['currOpenedChat'])
                throw new Exception('Chat is not opened, Please open chat first.',0);

            session_start();
            require_once('../lib/_fetch_data.php');

            $msgIDs= array_filter(array_map(function($id){
                        return base64_decode($id);
                    },$data['msgIDs']));
            if(!count($msgIDs))
                    throw new Exception("No Data found!! ",411);

            $userID = getDecryptedUserID();

            $chatType= strtolower($_COOKIE['chat']);
            
            if($chatType === 'personal'){
                $oppoUserID = _get_userID_by_UNM($_COOKIE['currOpenedChat']);
            }else if($chatType === 'group'){
                if(isset($_COOKIE['currOpenedGID']) && is_data_present('groups',['groupID'], [base64_decode($_COOKIE['currOpenedGID'])],'groupID'))
                    $oppoUserID = base64_decode($_COOKIE['currOpenedGID']);
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
            while($row = $res->fetch_assoc()){
                $row['msgID']= base64_encode($row['msgID']);
                $msgStatus[]=$row;
            }

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

    function updateMsgStatus($chatType,$msgID,$fromID,$toID,$seenID = null) {
        try{
            if(!is_data_present('messages',['msgID'],[$msgID],'msgID'))
                throw new Exception('No data found',411);

            $totMem= ($chatType == 'group') ? fetch_total_group_member_count($toID) : 1;

            $sql =" SELECT ms.status, ms.seenByIDs
                    FROM `botsapp`.messages as m
                    JOIN `botsapp_statusdb`.messages as ms
                    ON m.msgID = ms.msgID
                    WHERE ms.msgID = ?
                    AND m.fromID = ? AND m.toID = ?;";

            $stmt = $GLOBALS['conn']->prepare($sql);
            $stmt->bind_param('sss',$msgID,$fromID,$toID);
            $fire = $stmt->execute();
            if(!$fire)
                throw new Exception("Something went wrong while fetching message status",400);

            $res = $stmt->get_result();
            $stmt->close();
            
            
            if($res->num_rows == 0){
                if($chatType == 'personal')
                    $status = ($seenID) ? 'read' : 'send' ;
                else if($chatType == 'group'){
                    $status = ($totMem >= 2) ? 'send' : 'read' ;
                }else{
                    return 0;
                }

                $seenByIDs= ($seenID) ? serialize([$seenID]) : null;
                $result = insertData('messages', ['msgID','status','seenByIDs'],[$msgID,$status,$seenByIDs],'status');

            }else if($res->num_rows == 1){
                $row = $res->fetch_assoc();

                $updateCol = [];
                $updateVal = [];
                
                if($row['status'] != 'read'){
                
                    if($chatType == 'personal'){
                    
                        $updateCol= ['status','seenByIDs'];
                        $updateVal= ['read',serialize([$seenID])];
                    
                    }else if($chatType == 'group'){

                        $seenByIDs = ($row['seenByIDs'] != null) ? unserialize($row['seenByIDs']) : [] ;

                        $updateCol=[];
                        $updateVal=[];

                        if(!in_array($seenID,$seenByIDs)){
                            $updateCol[]='seenByIDs';
                            $seenByIDs[]=$seenID;
                            $updateVal[]= serialize($seenByIDs);
                        }
                        //-1 for the user who send the messages
                        if(count($seenByIDs) == $totMem-1){
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