<?php
    if($data = json_decode( file_get_contents("php://input") , true)){
        session_start();
        require_once("../db/_conn.php");
        require_once("_validation.php");
        require_once("_fetch_data.php");
        require_once('./_notification.php');

        if(isset($_SESSION['userID'])){

            if($data['req'] == 'deleteMsg')
                echo deleteMsg(base64_decode($data['msgID']));
            else if($data['req'] === 'deleteChat')
                echo deleteChat();
            else if($data['req'] === 'blockChat')
                echo blockChat();
            else if($data['req'] === 'reportChat' && isset($data['reportReason']))
                echo reportChat($data['reportReason']);
            else if($data['req'] === 'removeMember' && isset($data['unm']))
                echo removeMember($data['unm']);
            else if($data['req'] === 'unBlockChatter' && isset($data['unm']))
                echo unBlockChatter(base64_decode($data['unm']));
            else if($data['req'] === 'deleteEmoji')
                echo deleteEmoji(base64_decode($data['emojiID']));
            
        }

        session_abort();
    }

    function deleteChat(){
        try{
            if(!$_COOKIE['chat'])
                throw new Exception('chat section is not opened',0);
            if(!$_COOKIE['currOpenedChat'])
                throw new Exception('Chat is not opened, Please open chat first.',0);

            $userID= getDecryptedUserID();
            $chatType= strtolower($_COOKIE['chat']);

            if($chatType === 'personal'){
                $oppoUserID= _get_userID_by_UNM($_COOKIE['currOpenedChat']);

                if(is_chat_exist($userID,$oppoUserID) != 0){
                    // removing chat from Inbox tables
                    $query = "  DELETE FROM `inbox` 
                                WHERE  (`fromID`,`toID`) IN (( ? , ? ),( ? , ? )) ";
                    $stmt = $GLOBALS['conn']->prepare($query);
                    $stmt->bind_param('ssss' , $userID,$oppoUserID,$oppoUserID,$userID);
                    $sqlfire = $stmt->execute();
                    $stmt->close();

                    if(!$sqlfire)
                        throw new Exception("Something went wrong while deleting user",400);
                    else{
                        if(is_user_on($oppoUserID) && $userID != $oppoUserID){
                            $data=[
                                'action'=>'reloadChat',
                                'msg'=> ['chat'=>'personal'],
                                'toID'=>$oppoUserID,
                            ];
                            add_new_noti($data);
                        }

                        return $sqlfire;
                    }
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

                    $groupMembers= fetch_all_group_members($groupID,true);

                    // removing the group from Inbox table
                    if(!deleteData('inbox',$groupID,"toID"))
                        throw new Exception("Something went wrong while deleting user data",400);

                    $gName= _fetch_group_nm($groupID);
                    foreach($groupMembers as $memberID){
                        if( $userID === $memberID)
                            continue;

                        $data=[
                            "action" => "groupRemovedMember",
                            "toID" => $memberID,
                            'msg' => ['gName'=>$gName]
                        ];
                        add_new_noti($data);
                        
                        if(is_user_on($memberID)){
                            $data=[
                                'action'=>'reloadChat',
                                'msg'=> ['chat'=>'group','gName'=>$gName],
                                'toID'=>$memberID,
                            ];
                            add_new_noti($data);
                        }
                    }

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

    function deleteMsg(string $msgID){
        try{
            if(!is_data_present('messages',['msgID'],[$msgID],'msgID'))
                throw new Exception('No data found',411);
            if(!$_COOKIE['chat'])
                throw new Exception('chat section is not opened',0);
            if(!$_COOKIE['currOpenedChat'])
                throw new Exception('Chat is not opened, Please open chat first.',0);

            $chatType= strtolower($_COOKIE['chat']);
            $userID= getDecryptedUserID();
            $oppoUserUNM=$_COOKIE['currOpenedChat'];
            $deleteRes=0;

            if($chatType === 'personal' && is_data_present('users_account',['unm'],[$oppoUserUNM],'unm')){

                $oppoUserID = _get_userID_by_UNM($oppoUserUNM);
                $msgObjSQL  = fetch_columns('messages',['msgID'],[$msgID],['fromID','toID']);
                $ids        = $msgObjSQL->fetch_assoc();

                if($ids['fromID'] === $userID && $ids['toID'] === $oppoUserID){
                    $deleteRes= deleteData('messages',$msgID,'msgID');
                    
                    if($deleteRes && is_user_on($oppoUserID) && $userID != $oppoUserID){
                        $data=[
                            'action'=>'msgDeleted',
                            'msg'=> ['msgID'=>base64_encode($msgID)],
                            'toID'=>$oppoUserID,
                        ];
                        add_new_noti($data);
                    }

                }else if($ids['fromID'] === $oppoUserID && $ids['toID'] === $userID)
                    $deleteRes= updateData('messages',['hide'],[1],'msgID',$msgID,'status');
                else
                    throw new Exception("Unauthorise Access !!!",410);

            }elseif($chatType === 'group'){
                $oppoGroupID = base64_decode($_COOKIE['currOpenedGID']);

                if(!is_data_present('groups',['groupID'], [$oppoGroupID] ,'groupID'))
                    throw new Exception("There is no group with the GID.",404);
                else if(!is_member_of_group($userID,$oppoGroupID))
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
                    throw new Exception("DATABASE is not responding!!",400);
                
                $result=$stmt->get_result();
                $stmt->close();
                $msgObj= $result->fetch_assoc();

                if($msgObj['fromID'] === $userID && $msgObj['toID'] === $oppoGroupID){
                    $deleteRes= deleteData('messages',$msgID,'msgID');

                    if($deleteRes){
                        $members= fetch_all_group_members($oppoGroupID,true);
                        foreach($members as $member){
                            if($member != $userID && is_user_on($member)){
                                $data=[
                                    'action'=>'msgDeleted',
                                    'msg'=> ['msgID'=>base64_encode($msgID)],
                                    'toID'=>$member,
                                ];
                                add_new_noti($data);
                            }
                        }
                        
                    }

                }else if($msgObj['fromID'] !== $userID && $msgObj['toID'] === $oppoGroupID){
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

    function removeMember(string $unm){
        try{
            if(!$_COOKIE['chat'] || strtolower($_COOKIE['chat']) != 'group')
                throw new Exception('group section is not opened',0);
            if(!$_COOKIE['currOpenedGID'] )
                throw new Exception('Chat is not opened, Please open chat first.',0);

            $userID= getDecryptedUserID();
            $groupID = base64_decode($_COOKIE['currOpenedGID']);

            if(!is_group_admin($userID, $groupID))
                throw new Exception(" Unauthorised Access Denied !!! ",410);

            $memberID= _get_userID_by_UNM(base64_decode($unm));
            if(!$memberID || !is_member_of_group($memberID,$groupID))
                throw new Exception(" No DATA FOUND!! ",411);

            // removing the user from group by removing him from Inbox table
            $query = "DELETE FROM `inbox` WHERE `fromID`= ? AND `toID` = ?";
            $stmt = $GLOBALS['conn']->prepare($query);
            $stmt->bind_param('ss' , $memberID,$groupID);
            $sqlfire = $stmt->execute();
            $stmt->close();

            if(!$sqlfire)
                throw new Exception("Something went wrong while Removing user",400);
            else{
                $gName=_fetch_group_nm($groupID);
                $data=[
                    "action" => "groupRemovedMember",
                    "toID" => $memberID,
                    'msg' => ['gName'=> $gName],
                ];
                add_new_noti($data);

                if(is_user_on($memberID)){
                    $data=[
                        'action'=>'reloadChat',
                        'msg'=> ['chat'=> 'group', 'gName'=> $gName],
                        'toID'=>$memberID,
                    ];
                    add_new_noti($data);
                }
                return 1;
            }

        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }


    function blockChat(){
        try{
            if(!$_COOKIE['chat'])
                throw new Exception('chat section is not opened',0);
            if(!$_COOKIE['currOpenedChat'])
                throw new Exception('Chat is not opened, Please open chat first.',0);
                
            $chatType= strtolower($_COOKIE['chat']);
            if($chatType != 'personal')
                throw new Exception('User Chat is not opened, Please open chat first.',0);

            $userID= getDecryptedUserID();
            $oppoUserID= _get_userID_by_UNM($_COOKIE['currOpenedChat']);

            if(is_chat_exist($userID,$oppoUserID) == 1){
                if($userID === $oppoUserID)
                    throw new Exception("User can't block Itself",410);

                if(!is_user_blocked($userID,$oppoUserID)){
                    $res= insertData('blocked',['fromID','toID'],[$userID,$oppoUserID],'status');

                    if($res != 1)
                        throw new Exception("Something went Wrong",400);
                }

                $res=deleteChat();
                if($res != 1)
                    throw new Exception("Something went Wrong",400);
                else
                    return 1;
            }else
                throw new Exception("No chat Exist.",0);
            

        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function reportChat($reason){
        try{
            if(!$_COOKIE['chat'])
                throw new Exception('chat section is not opened',0);
            if(!$_COOKIE['currOpenedChat'])
                throw new Exception('Chat is not opened, Please open chat first.',0);
                
            $chatType= strtolower($_COOKIE['chat']);
            if($chatType != 'personal')
                throw new Exception('User Chat is not opened, Please open chat first.',0);;

            $userID= getDecryptedUserID();
            $oppoUserID= _get_userID_by_UNM($_COOKIE['currOpenedChat']);

            if(is_chat_exist($userID,$oppoUserID) == 1){
                if($userID === $oppoUserID)
                    throw new Exception("User can't report Itself",410);

                if(!is_data_present('reports',['fromID','toID'],[$userID,$oppoUserID],'id','status')){
                    $res= insertData('reports',['fromID','toID','reason'],[$userID,$oppoUserID,$reason],'status');

                    if($res != 1)
                        throw new Exception("Something went Wrong",400);
                }

                $res= blockChat();
                if($res != 1)
                    throw new Exception("Something went Wrong",400);
                else
                    return 1;
            }else
                throw new Exception("No chat Exist.",0);
        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function unBlockChatter($unm){
        try{
            $userID= getDecryptedUserID();
            $userToUnblockID= _get_userID_by_UNM($unm);
            if(!$userToUnblockID)
                throw new Exception("something went wrong",411);

            if(is_user_blocked($userID,$userToUnblockID)){
                // $res= insertData('blocked',['fromID','toID'],[$userID,$userToUnblockID],'status');
                $sql= "DELETE FROM `blocked` WHERE `fromID` = ? AND `toID` = ? ";
                $STMT= $GLOBALS['status']->prepare($sql);
                $STMT->bind_param('ss',$userID,$userToUnblockID);
                $sqlfire = $STMT->execute();
                $STMT->close();

                if(!$sqlfire)
                    throw new Exception("Something went wrong",400);
                
                return $sqlfire;
            }else
                throw new Exception("No Data Found.",411);
        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function deleteEmoji(string $emojiID=null){
        try{
            $userID= getDecryptedUserID();
            
            if(!$emojiID || !is_data_present('emojis',['id','uploaderID'],[$emojiID,$userID],"id"))
                throw new Exception("No data found",404);

            return deleteData('emojis',$emojiID,"id");

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