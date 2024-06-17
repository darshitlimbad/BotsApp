<?php

if($data = json_decode( file_get_contents("php://input") , true)){
    $fleg=0;
    if(!session_id()){
        session_start();
        $fleg=1;
    }
    
    if(isset($_SESSION['userID'])){
        include_once('../db/_conn.php');
        include_once('_fetch_data.php');
        include_once('_validation.php');
        
        if($data['req'] == "addNoti"){
                echo add_new_noti($data);
        }else if($data['req'] == "getNewNoti"){
            echo getNewNoti();
        }else if($data['req'] == "acceptChatterReq"){
            echo acceptChatterReq($data);
        }else if($data['req'] == "rejectedChatterReq"){
            echo rejectedChatterReq($data);
        }else if($data['req'] == "deleteThisNoti"){
            echo deleteThisNoti(base64_decode($data['notiID']));
        }
    }
    if($fleg==1)
        session_abort();
}   

function add_new_noti($data) {
    try{
        $newNotiID = gen_new_notification_id();
        $fromID = getDecryptedUserID();

        $unm= $data['unm']    ?? "";
        $toID= $data['toID']   ?? "";
        $action= $data['action'] ?? "newMessage" ;
        $msg= $data['msg']   ?? null;

        if(!$toID && $unm)
            $toID = _get_userID_by_UNM($unm);

        if( $toID && is_data_present('users_account',['userID'],[$toID])){
            switch($action){
                case "addUserReq":
                    if(is_chat_exist($fromID , $toID) == 1)
                        return '409';
                    else if(is_noti($fromID,$toID,"addUserReq") != 0)
                        return '403';
                    //checking is there any messages with action="chatterReqRejected" from the user our user want to send request
                    else if(is_noti($toID , $fromID , "chatterReqRejected") != 0)
                        return '499';
                break;

                case 'acceptedChatterReq':
                case 'chatterReqRejected':
                case "reloadChat":
                case "msgDeleted":
                break;

                default:
                    return 0;
            }
        }else{
            throw new Exception("No user found!!");
        }

        $res = insertData(
                "notification" , ["notificationID" , "fromID" , "toID" , "action",'msg'] ,
                [$newNotiID , $fromID , $toID , $action ,$msg] , "status");
        
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
    $p = ['fromID','toID'];
    $p_values= [$fromID,$toID];
    
    if($action != null){
        $p[]='action';
        $p_values[]=$action;
    }

    $res = fetch_columns('notification',$p,$p_values,["count(notificationID)"],'status');
    if($res)
        $res = $res->fetch_column();
    
    return $res;
}

// new function created in validation called : is_chat_exist
// function is_user_is_alredy_added($fromID , $toID){
//     $query = "SELECT count(*) FROM `inbox` WHERE `fromID` = '$fromID' AND `toID` = '$toID'";
//     $result = $GLOBALS['conn']->query($query);

//     if($result->fetch_column() >= 1){
//         return 1;
//     }else{
//         return 0;
//     }
// }

function getNewNoti(){
    try{
        $userID = getDecryptedUserID();
        
        $res= fetch_columns('notification',['toID'],[$userID],['notificationID as notiID','fromID','action','msg'],'status');
        
        $i = 0;
        while($row = $res->fetch_assoc()){
            $row['unm'] = _fetch_unm($row['fromID']);
                if( $row['unm'] !== 0 ){
                    $rows[$i]['notiID'] = base64_encode($row['notiID']);
                    $rows[$i]['unm'] = $row['unm'];
                    $rows[$i]['action'] = $row['action'];
                    $rows[$i]['msg']= $row['msg'];
                    $i++;
                }else{
                    throw new Exception();
                }
        }
        if(!isset($rows))
            return 0;
            
        return json_encode($rows);
    }catch(Exception $e){
        $error = [
            'error'=>true,
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
    }

function acceptChatterReq($data){
    try{
        $notiID = base64_decode($data['notiID']);
        
        $feDataFromNoti = fetchThisNoti($notiID);
        if($feDataFromNoti !== 0){

            $fromID =   $feDataFromNoti['fromID']; //the user who send a requst 
            $toID =     $feDataFromNoti['toID'];   //the user who accepted req 
            $action=    $feDataFromNoti['action'];  
            
            if($action === 'addUserReq' && (getDecryptedUserID() === $toID)){
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
                            
                            if(is_user_on($fromID)){
                                $data=[
                                    'action'=>'reloadChat',
                                    'toID'=>$fromID,
                                ];
                                add_new_noti($data);
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
        }

        // if not returned then it will be some error
        throw new Exception();

    }catch(Exception $e){
        $error = [
            'error'=>true,
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
    
}

function rejectedChatterReq($data){
    try{
        $oldNotiID = base64_decode($data['notiID']);
        $feDataFromNoti = fetchThisNoti($oldNotiID);

        if($feDataFromNoti != 0 
            && $feDataFromNoti['action'] === 'addUserReq' 
            && $feDataFromNoti['toID']===getDecryptedUserID()){

            //swap id for request rejecting notification
            $fromID = $feDataFromNoti['toID'];
            $toID = $feDataFromNoti['fromID']; 
            
            // delete old notification
            $req = deleteThisNoti($oldNotiID);
        
            if($req){
                $notiData = array(
                    "toID" => $toID,
                    "action" => "chatterReqRejected",
                );
                add_new_noti($notiData);
                
                echo $req;
            }else{
                throw new Exception('',400);
            }
        }else{
            throw new Exception('No data Found',411);
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

function deleteThisNoti($notiID){
    try{
        if(is_data_present('notification',['notificationID'],[$notiID],'notificationID','status')){
            $res= deleteData('notification',$notiID,'notificationID','status');
        
            if($res){
                return 1;
            }else{
                return 0;
            }
        }else{
            throw new Exception("", 0);
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

function fetchThisNoti($notiID){
    try{
        $res= fetch_columns('notification',['notificationID'],[$notiID],['*'],'status');
        // $queryFetchData = "SELECT * FROM `notification` WHERE `notificationID` = '$notiID'";
        // $notiData = $GLOBALS['status']->query($queryFetchData); 
        
            if($res && $row = $res->fetch_assoc() ){
                return $row;
            }else{
                return 0;
            }
    }catch(Exception $e){
        return 0;
    }
}

?>