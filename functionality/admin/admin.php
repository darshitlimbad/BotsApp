<?php
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
                else if($data['req'] === "deleteUser")
                    echo deleteUser( _get_userID_by_UNM( base64_decode($data['unm']) ) );
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
                    FROM `users` WHERE userID != (SELECT adminID FROM admins) ORDER BY id ASC";

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

    function deleteUser($userID){
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
?>