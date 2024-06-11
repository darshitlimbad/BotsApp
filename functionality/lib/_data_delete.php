<?php
    if($data = json_decode( file_get_contents("php://input") , true)){
        session_start();
        include_once("_validation.php");
        include_once("_fetch_data.php");

        if(isset($_SESSION['userID'])){

            if($data['req'] == 'delete_msg')
                echo delete_msg($data['msgID']);
            
        }

        session_abort();
    }

    function delete_group($groupID){
        $delGroupRes= deleteData('groups',$groupID,'groupID');

        return $delGroupRes;
    }
    
    function delete_chat(){

    }

    function delete_msg(string $msgID){
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