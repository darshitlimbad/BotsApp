<?php

use Random\RandomException;

    if($data = json_decode( file_get_contents("php://input") , true)){
        session_start();
        if(isset($_SESSION['userID'])){
            require_once('../db/_conn.php');
            require_once("../lib/_fetch_data.php");
            require_once('../lib/_validation.php');

            if(is_admin()){
                if($data['req'] === "getUsersList")
                    echo getUsersList();
                else if($data['req'] === "getGroupsList")
                    echo getGroupsList();
                else if($data['req'] === "getReportsList")
                    echo getReportsList();
                else if($data['req'] === "deleteUser")
                    echo deleteUser( _get_userID_by_UNM( base64_decode($data['unm']) ) );
                else if($data['req'] === "warnUser")
                    echo warnUser( _get_userID_by_UNM( base64_decode($data['unm']) ));
                else if($data['req'] === "rejectReport")
                    echo rejectReport( _get_userID_by_UNM( base64_decode($data['unm']) ));
                else if($data['req'] === "deleteGroup")
                    echo deleteGroup( base64_decode($data['GID']) );
                else if($data['req'] === "getServerEmojis")
                    echo getServerEmojis();
                else if($data['req'] === "getPendingEmojisList")
                    echo getPendingEmojisList();
                else if($data['req'] === "deleteEmoji")
                    echo deleteEmoji(base64_decode($data['emojiID']));
                else if($data['req'] === "acceptEmojiAsPublic")
                    echo acceptEmojiAsPublic(base64_decode($data['emojiID']));

                
            }
        }else{
            session_abort();
            header('Location: /');
        }
        session_abort();
    }else{
        header('Location: /');
    }

    function getUsersList(){
        try{
            $SQL= " SELECT id,CONCAT(surname,' ',name) AS full_name,unm,email 
                    FROM `users` WHERE userID not in (SELECT adminID FROM admins) ORDER BY id ASC";

            $STMT= $GLOBALS['conn']->prepare($SQL); 
            $sqlFire=$STMT->execute();

            if(!$sqlFire)
                throw new Exception("Something Went wrong",400);

            $result=$STMT->get_result();
            $STMT->close();

            $usersList=[];
            
            for($i=0; $i < $result->num_rows ; $i++)
                $usersList[$i]=$result->fetch_assoc();

            // while($usersList[]=$result->fetch_assoc());

            return json_encode($usersList);
        }catch(Exception $e){
            print_r($e);
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }
    
    function getGroupsList(){
        try{
            $SQL= " SELECT id, name, groupID, adminID 
                    FROM `groups` ORDER BY id ASC";

            $STMT= $GLOBALS['conn']->prepare($SQL); 
            $sqlFire=$STMT->execute();

            if(!$sqlFire)
                throw new Exception("Something Went wrong",400);

            $result=$STMT->get_result();
            $STMT->close();

            $usersList=[];
            
            for($i=0; $i < $result->num_rows ; $i++){
                $row=$result->fetch_assoc();

                $usersList[$i]['id']=$row['id'];
                $usersList[$i]['name']=$row['name'];
                $usersList[$i]['GID']=base64_encode($row['groupID']);
                $usersList[$i]['adminUNM']= _fetch_unm($row['adminID']);
            }

            return json_encode($usersList);
        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function getReportsList(){
        try{
            $SQL= " SELECT *
                    FROM `reports` ORDER BY id ASC";

            $result= $GLOBALS['status']->query($SQL) ?? null; 

            if(!$result)
                throw new Exception("Something Went wrong",400);

            $usersList=[];
            $num_rows= $result->num_rows;
            for($i=0; $i < $num_rows ; $i++){
                $row=$result->fetch_assoc();

                $usersList[$i]['id']=$row['id'];
                $usersList[$i]['reportedBy']= _fetch_unm($row['fromID']);
                $usersList[$i]['reportedTo']= _fetch_unm($row['toID']);
                $usersList[$i]['reason']= $row['reason'];
            }

            return json_encode($usersList);
        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function deleteUser($userID=null){
        try{
            if(!$userID)
                throw new Exception("User Not Found",411);
            
            $fetchJoinedGroups= fetch_columns('inbox',['fromID','chatType'],[$userID,'group'],['toID']);
            $deleteInbox = "DELETE FROM `inbox` WHERE (`fromID`= '$userID' OR toID = '$userID');";
            $GLOBALS['conn']->query($deleteInbox);

            if($fetchJoinedGroups->num_rows != 0){
                while($GID = $fetchJoinedGroups->fetch_column())
                    if(is_group_admin($userID,$GID)){
                        deleteData("groups",$GID,"groupID");
                        deleteData('inbox',$GID,"toID");
                    }
            }

            return deleteData('users',$userID);            

        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }
    
    function warnUser($userID=null){
        try{
            if(!$userID)
                throw new Exception("User Not Found",411);

            require_once("../lib/_notification.php");

            
            
            if(deleteData('reports',$userID,'toID','status')){
                $data=[
                    'action'=>'warning',
                    'toID'=>$userID,
                ];
                add_new_noti($data);

                return 1;
            }else
                throw new Exception("Something went wrong",400);
            

        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }
    
    function rejectReport($userID=null){
        try{
            if(!$userID)
                throw new Exception("User Not Found",411);

            return deleteData('reports',$userID,'toID','status');            

        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function deleteGroup($GID=null){
        try{
            if(!$GID || !is_data_present("groups",["groupID"],[$GID],"id"))
                throw new Exception("Group Not Found",411);
            $res=0;
            $res= deleteData("groups",$GID,"groupID");
            if($res)
                $res= deleteData('inbox',$GID,"toID");

            return $res;            

        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }


    function getServerEmojis(){
        try{            
            $list=[];
            $i=0;
            
            $SQL= " SELECT *
                    FROM `emojis` ORDER BY id ASC";

            $result= $GLOBALS['conn']->query($SQL) ?? null; 

            if(!$result || !$result->num_rows)
                throw new Exception("",400);
            
            while($row= $result->fetch_assoc()){
                $list[$i++]=[
                    'id'=> base64_encode($row['id']),
                    'uploaderUNM'=>_fetch_unm($row['uploaderID']),
                    'scope'=>$row['scope'],
                    'name'=>$row['name'],
                    'mime'=>$row['mime'],
                    'blob'=>$row['blob_data'],
                    'status'=>$row['status'],
                ];
            }

            array_multisort( $list, SORT_ASC);
            return json_encode($list);

        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];

            return json_encode($error);
        }
    }

    function getPendingEmojisList(){
        try{            
            $list=[];
            $i=0;
            
            $SQL= " SELECT *
                    FROM `emojis`
                    WHERE status='PENDING' 
                    ORDER BY id ASC
                    ";

            $result= $GLOBALS['conn']->query($SQL) ?? null; 

            if(!$result || !$result->num_rows)
                throw new Exception("",400);
            
            while($row= $result->fetch_assoc()){
                $list[$i++]=[
                    'id'=> base64_encode($row['id']),
                    'uploaderUNM'=>_fetch_unm($row['uploaderID']),
                    'scope'=>$row['scope'],
                    'name'=>$row['name'],
                    'mime'=>$row['mime'],
                    'blob'=>$row['blob_data'],
                    'status'=>$row['status'],
                ];
            }

            array_multisort( $list, SORT_ASC);
            return json_encode($list);

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
            if(!$emojiID || !is_data_present('emojis',['id'],[$emojiID],"id"))
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

    function acceptEmojiAsPublic(string $emojiID=null){
        try{            
            if(!$emojiID || !is_data_present('emojis',['id'],[$emojiID],"id"))
                throw new Exception("No data found",404);
            else if(is_data_present('emojis',['id','scope','status'],[$emojiID,'PUBLIC','UPLOADED'],"id"))
                throw new Exception("Emoji Scope is already Public",400);

            $result= updateData("emojis",['scope','status'],['PUBLIC','UPLOADED'],"id",$emojiID);
            $fetchedData=fetch_columns('emojis',['id'],[$emojiID],['uploaderID','name']);
            
                if($result && $fetchedData){
                    list($uploaderID,$name)= $fetchedData->fetch_row();

                    require_once("../lib/_notification.php");    
                    $data=[
                        'action'=>'info',
                        'msg'=>['msg'=>"Your emoji '$name' has been Accepted for Public use."],
                        'toID'=>$uploaderID,
                    ];
                    add_new_noti($data);
                }

            return $result;
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