<?php
    if($data = json_decode( file_get_contents("php://input") , true)){
        session_start();
        include_once("_validation.php");
        include_once("_fetch_data.php");

        if(isset($_SESSION['userID'])){

            if($data['req'] == 'deleteMsg')
                echo deleteMsg($data['msgID']);
            else if($data['req'] === 'deleteChat')
                echo deleteChat();
            
        }

        session_abort();
    }

    //!remove user blocks and chat from our side
    //!make a function to check a person is online or offline
    //!if he is online use notification to send notification for reloading her chatter list
    function deleteChat(){
        try{
            if(!isset($_COOKIE['chat']))
                throw new Error('chat section is not opened',0);
            if(!isset($_COOKIE['currOpenedChat']))
                throw new Error('Chat is not opened, Please open chat first.',0);

            $userID= getDecryptedUserID();
            $chatType= strtolower($_COOKIE['chat']);

            if($chatType === 'personal'){
                $oppoUserID= _get_userID_by_UNM($_COOKIE['currOpenedChat']);

                if(is_chat_exist($userID,$oppoUserID)){
                    // removing chat from Inbox tables
                    $query = "  DELETE FROM `inbox` 
                                WHERE  (`fromID`,`toID`) IN (( ? , ? ),( ? , ? )) ";
                    $stmt = $GLOBALS['conn']->prepare($query);
                    $stmt->bind_param('ssss' , $userID,$oppoUserID,$oppoUserID,$userID);
                    $sqlfire = $stmt->execute();
                    $stmt->close();

                    if(!$sqlfire)
                        throw new Exception("Something went wrong while deleting user",400);

                    return $sqlfire;
                }else
                    throw new Exception("No User Found",0);
                    
            }else if($chatType === 'group' && isset($_COOKIE['currOpenedGID'])){
                $oppoUserID= base64_decode($_COOKIE['currOpenedGID']);

                if(!is_data_present('groups',['groupID'], [$oppoUserID] ,'groupID'))
                    throw new Exception("NO DATA FOUND!!",411);
                else if(!is_member_of_group($userID,$oppoUserID)){
                    delete_group_if_empty($oppoUserID);
                    throw new Exception(" Unauthorised Access Denied !!!",410);
                }

                return delete_group($oppoUserID);
            }else
                return 0;

        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function delete_group($groupID){

        try{
            $userID=getDecryptedUserID();
            $is_data_present=is_data_present('groups',['groupID'],[$groupID],'groupID');

            if($is_data_present){
                if(is_group_admin($userID, $groupID)){
                    // removing the group from Inbox table
                    if(!deleteData('inbox',$groupID,"toID"))
                        throw new Exception("Something went wrong while deleting user data",400);
                    // removing the group from Groups table
                    if(!deleteData('groups',$groupID,"groupID"))
                        throw new Exception("Something went wrong while deleting user data",400);

                }else if(is_member_of_group($userID,$groupID)){
                    // removing the user from group by removing him from Inbox table
                    $query = "DELETE FROM `inbox` WHERE `fromID`= ? AND `toID` = ?";
                    $stmt = $GLOBALS['conn']->prepare($query);
                    $stmt->bind_param('ss' , $userID,$groupID);
                    $sqlfire = $stmt->execute();
                    $stmt->close();

                    if(!$sqlfire)
                        throw new Exception("Something went wrong while deleting user data",400);

                }else{
                    throw new Exception(" Unauthorised Access Denied !!!",410);
                }
            }else{
                return 0;
            }

            return 1;

        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }
    
    function  delete_group_if_empty($groupID){
        if(!fetch_total_group_member_count($groupID) //==0
            && is_data_present('groups',['groupID'],[$groupID],'groupID')){
                $delGroupRes= deleteData('groups',$groupID,'groupID');
                return $delGroupRes;
            }else{
                return 0;
            }

    }
    
    function delete_chat(){

    }

    function deleteMsg(string $msgID){
        try{
            if(!is_data_present('messages',['msgID'],[$msgID],'msgID'))
                throw new Error('No data found',411);
            if(!isset($_COOKIE['chat']))
                throw new Error('chat section is not opened',0);
            if(!isset($_COOKIE['currOpenedChat']))
                throw new Error('Chat is not opened, Please open chat first.',0);

            $chatType= strtolower($_COOKIE['chat']);
            $userID= getDecryptedUserID();
            $oppoUserUNM=$_COOKIE['currOpenedChat'];
            $deleteRes=0;

            if($chatType === 'personal' && is_data_present('users_account',['unm'],[$oppoUserUNM],'unm')){

                $oppoUserID = _get_userID_by_UNM($oppoUserUNM);
                $msgObjSQL  = fetch_columns('messages',['msgID'],[$msgID],['fromID','toID']);
                $ids        = $msgObjSQL->fetch_assoc();

                if($ids['fromID'] === $userID && $ids['toID'] === $oppoUserID)
                    $deleteRes= deleteData('messages',$msgID,'msgID');
                else if($ids['fromID'] === $oppoUserID && $ids['toID'] === $userID)
                    $deleteRes= updateData('messages',['hide'],[1],'msgID',$msgID,'status');
                else
                    throw new Exception("Unauthorise Access !!!",410);

            }elseif($chatType === 'group'){
                $oppoUserID = base64_decode($_COOKIE['currOpenedGID']);

                if(!is_data_present('groups',['groupID'], [$oppoUserID] ,'groupID'))
                    throw new Exception("There is no group with the GID.",404);
                else if(!is_member_of_group($userID,$oppoUserID))
                    throw new Exception("You are not a member of this group.",410);
                
                $msgObjSQL = "  SELECT m.fromID, m.toID, ms.hide, ms.hide_by
                                FROM messages as m
                                RIGHT JOIN `botsapp_statusdb`.messages as ms
                                ON m.msgID = ms.msgID
                                WHERE m.msgID = ?; ";

                $stmt= $GLOBALS['conn']->prepare($msgObjSQL);
                $stmt->bind_param('s',$msgID);
                $fire= $stmt->execute();
                if(!$fire)
                    throw new Exception("SQL is not responding!!",400);
                
                $result=$stmt->get_result();
                $stmt->close();
                $msgObj= $result->fetch_assoc();

                if($msgObj['fromID'] === $userID && $msgObj['toID'] === $oppoUserID)
                    $deleteRes= deleteData('messages',$msgID,'msgID');
                else if($msgObj['fromID'] !== $userID && $msgObj['toID'] === $oppoUserID){
                    $hide_by = ($msgObj['hide'] == 1) ? unserialize($msgObj['hide_by']) : [];

                    if(in_array($userID,$hide_by))
                        $deleteRes=1;
                    else{
                        $hide_by[]=$userID;
                        $deleteRes= updateData('messages',['hide','hide_by'],[1,serialize($hide_by)],'msgID',$msgID,'status');
                    }
                }else
                    throw new Exception("Unauthorise Access !!!",410);
            }else
                return 0;
            
            return $deleteRes;
            
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