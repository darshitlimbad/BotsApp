<?php

if($data = json_decode( file_get_contents("php://input") , true)){
    session_start();
    include_once('../db/_conn.php');
    include_once('../lib/_validation.php');
    
    if($data['req'] == "addNoti"){
        if(isset($data['action'])){
            echo add_new_noti($data['unm'] , $data['action']);
        }
        else{
            echo add_new_noti($data['unm']);
        }
    }else if($data['req'] == "getNewUserReq"){
        echo getNewUserReq();
    }
}

function add_new_noti($unm , $action = "newMessage") {
    try{
        $newNotiID = gen_new_notification_id();
        $fromID = getDecryptedUserID();
        $toID ="";

        $fetchID = fetch_columns( 'users_account' , "unm" , $unm , "userID" );
        if( $fetchID->num_rows == 1 ){
            $toID = $fetchID->fetch_column();

            if(is_noti_exist($fromID,$toID,$action) != 0)
                return '403';
        }else{
            throw new Exception("No user found!!");
        }

        $res = insertData(
                "notification" , "notificationID , fromID , toID , action" ,
                "$newNotiID , $fromID , $toID , $action" , "status");
        
        return $res;

    }catch(Exception $e){
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

function is_noti_exist($fromID , $toID , $action){
    $query  = "SELECT COUNT(`notificationID`) FROM `notification` WHERE `fromID` = '$fromID' AND `toID` = '$toID' AND `action` = '$action'";
    $res = $GLOBALS['status']-> query($query);
    $res = $res->fetch_column();

    return $res;
}

function getNewUserReq(){
    try{
        $userID = getDecryptedUserID();
        $action = "addUserReq";
        
        $query  = "SELECT `notificationID` as `notiID` , `fromID` FROM `notification` WHERE `ToID` = '$userID' AND `action` = '$action'";
        $res = $GLOBALS['status']-> query($query);

        $i=0;
        while($row = $res->fetch_assoc()){
            $unmQuery = fetch_columns("users_account" , "userID" , $row['fromID'] , "unm");
                if( $unmQuery !== 0 ){
                    if($unmQuery->num_rows == 1){
                        $row['unm'] = $unmQuery->fetch_column();
                    } else {
                        throw new Exception();
                    }
                }else{
                    throw new Exception();
                }
                
            $rows[$i]['notiID'] = $row['notiID'];
            $rows[$i]['unm'] = $row['unm'];
            $i++;
        }

        return json_encode($rows);
    }catch(Exception){
        return 0;
    }
    
    }

?>