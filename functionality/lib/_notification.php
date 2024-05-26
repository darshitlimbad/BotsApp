<?php

if($data = json_decode( file_get_contents("php://input") , true)){
    session_start();
    if(isset($_SESSION['userID'])){
        include_once('../db/_conn.php');
        include_once('../lib/_validation.php');
        
        if($data['req'] == "addNoti"){
                echo add_new_noti($data);
        }else if($data['req'] == "getNewNoti"){
            echo getNewNoti();
        }else if($data['req'] == "acceptChatterReq"){
            echo acceptChatterReq($data);
        }else if($data['req'] == "rejectedChatterReq"){
            echo rejectedChatterReq($data);
        }else if($data['req'] == "deleteThisNoti"){
            echo deleteThisNoti($data['notiID']);
        }
    }
}

function add_new_noti($data) {
    try{
        $newNotiID = gen_new_notification_id();
        $fromID = getDecryptedUserID();
        $unm = (isset($data['unm'])) ? $data['unm'] : "";
        $action = (isset($data['action'])) ? $data['action'] : "newMessage" ;
        $toID = (isset($data['toID'])) ? $data['toID'] : "";

        if($action == "addUserReq" && $toID == ""){
            $fetchID = fetch_columns( 'users_account' , ["unm"] , [$unm] , array("userID") );
            if( $fetchID->num_rows == 1 ){
                $toID = $fetchID->fetch_column();
                    if(is_user_is_alredy_added($fromID , $toID) == 1)
                        return '409';
                    if(is_noti($fromID,$toID,"addUserReq") != 0)
                        return '403';
                    else if(is_noti($toID , $fromID , "chatterReqRejected") != 0)//sending to id as from and from id as to
                        return '499';
            }else{
                throw new Exception("No user found!!");
            }
        }

        $res = insertData(
                "notification" , ["notificationID" , "fromID" , "toID" , "action"] ,
                [$newNotiID , $fromID , $toID , $action] , "status");
        
        return $res;

    }catch(Exception $e){
        // print_r($e);
        return 0;
    }
}

function gen_new_notification_id()  {

    $sql = "SELECT `notificationID`as`notiID` FROM `notification` ORDER BY `notificationID` DESC LIMIT 1";
    $sqlfire = $GLOBALS['status'] -> query($sql);

    if($sqlfire && ($sqlfire -> num_rows > 0)) {
        $row = $sqlfire->fetch_assoc();
        $lastNotiID = explode( 'i' , $row["notiID"]);
        $newNotiID = "Noti".sprintf("%08d" , ++$lastNotiID[1]);    
    }
    else {
        $newNotiID = "Noti".sprintf("%08d" , 1); 
    }
    return $newNotiID;
}

function is_noti($fromID , $toID , $action = null){
    $query = "SELECT COUNT(`notificationID`) FROM `notification` WHERE `fromID` = '$fromID' AND `toID` = '$toID' ";($action==null) ?: $query.="AND `action` = '$action'";
    $res = $GLOBALS['status']-> query($query);
    $res = $res->fetch_column();
    return $res;
}

function is_user_is_alredy_added($fromID , $toID){
    $query = "SELECT count(*) FROM `inbox` WHERE `fromID` = '$fromID' AND `toID` = '$toID'";
    $result = $GLOBALS['conn']->query($query);

    if($result->fetch_column() >= 1){
        return 1;
    }else{
        return 0;
    }
}

function getNewNoti(){
    try{
        $userID = getDecryptedUserID();
        
        $query  = "SELECT `notificationID` as `notiID` , `fromID` , `action` FROM `notification` WHERE `toID` = '$userID' ";
        $res = $GLOBALS['status']-> query($query);
        
        $i = 0;
        while($row = $res->fetch_assoc()){
            $unmQuery = fetch_columns("users_account" , ["userID"] , [$row['fromID']] , array("unm"));
                if( $unmQuery !== 0 ){
                    if($unmQuery->num_rows == 1){
                        $row['unm'] = $unmQuery->fetch_column();
                        
                        $rows[$i]['notiID'] = $row['notiID'];
                        $rows[$i]['fromID'] = $row['fromID'];
                        $rows[$i]['unm'] = $row['unm'];
                        $rows[$i]['action'] = $row['action'];
                        $i++;
                    } else {
                        throw new Exception();
                    }
                }else{
                    throw new Exception();
                }
        }
        if(!isset($rows))
            throw new Exception();
            
        return json_encode($rows);
    }catch(Exception){
        return 0;
    }
    }

function acceptChatterReq($data){
    try{
        $notiID = $data['notiID'];
        
        $feFrmNoti = fetchThisNoti($notiID);
        if($feFrmNoti !== 0){

            $fromID = $feFrmNoti['fromID'];
            $toID = $feFrmNoti['toID']; 
            
            // delete old notification
            $req = deleteThisNoti($notiID);
            if($req){
                // add user both side
                $req = insertData('inbox' , ["fromID" , "toID"] , [$fromID, $toID] );
                if($req){
                    if($fromID != $toID){
                        $req2 = insertData('inbox' , ["fromID" , "toID"] , [$toID, $fromID] );

                        if($req2 == 0){
                            $del =  "DELETE FROM `inbox` WHERE `fromID` = ?";
                            $stmt = $GLOBALS['conn']->prepare($del);
                            $stmt->bind_param('s' , $fromID);
                            $stmt->execute(); $stmt->close();

                            throw new Exception();
                        }
                    }

                    $notiData = array(
                        "toID" => $fromID,
                        "action" => "acceptedChatterReq",
                    );
                    add_new_noti($notiData);
                    
                    return $req;

                }
            }
        }

        // if not returned then it will be some error
        throw new Exception();

    }catch(Exception $e){
        print_r($e);
        return 0;
    }
    
}

function rejectedChatterReq($data){
    try{
        $oldNotiID = $data['notiID'];
        
        $feFrmNoti = fetchThisNoti($oldNotiID);
        if($feFrmNoti !== 0){
            //swap id for request rejecting notification
            $fromID = $feFrmNoti['toID'];
            $toID = $feFrmNoti['fromID']; 
            
            // delete old notification
            $req = deleteThisNoti($oldNotiID);
        
            if($req){
                $newNotiID = gen_new_notification_id();
                $action = "chatterReqRejected";
                $req = insertData('notification' , ["notificationID" , "fromID" , "toID" , "action"] , 
                                                    [$newNotiID    , $fromID, $toID ,$action] , "status" );
                echo $req;
            }else{
                throw new Exception();
            }
        }else{
            throw new Exception();
        } 
    }catch(Exception $e){
        return 0;
    }
    
}

function deleteThisNoti($notiID){
    try{
        $queryDeleteNotiID = "DELETE FROM `notification` WHERE `notificationID` = '$notiID'";
        $req = $GLOBALS['status']->query($queryDeleteNotiID); 
        
            if($req){
                return 1;
            }else{
                return 0;
            }
    }catch(Exception $e){
        return 0;
    }
    
}

function fetchThisNoti($notiID){
    try{
        $queryFetchData = "SELECT * FROM `notification` WHERE `notificationID` = '$notiID'";
        $notiData = $GLOBALS['status']->query($queryFetchData); 
        
            if($notiData && $row = $notiData->fetch_assoc() ){
                return $row;
            }else{
                return 0;
            }
    }catch(Exception $e){
        return 0;
    }
}

?>