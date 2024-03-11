
<?php
session_start();
include_once('../functionality/db/_conn.php');
include_once('../functionality/lib/_validation.php');
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

function add_new_noti($unm , $action = "newMessage") {
    try{
        $newNotiID = gen_new_notification_id();
        $fromID = "User00000001";
        $toID ="";
        $res = fetch_columns( 'users_account' , "unm" , $unm , "userID" );
        if( $res->num_rows == 1 ){
            $toID = $res->fetch_column();
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


function getNewUserReq(){
    try{
        $userID = getDecryptedUserID();
        $action = "addUserReq";
        
        $query  = "SELECT `notificationID` as `notiID` , `fromID` FROM `notification` WHERE `ToID` = '$userID' AND `action` = '$action'";
        $res = $GLOBALS['status']-> query($query);

        $i=0;
        while($row = $res->fetch_assoc()){
            echo $row['fromID'];
            // $unmQuery = fetch_columns("users_account" , "userID" ,  , "unm");
            //     if( $unmQuery != 0 || $unmQuery->num_rows != 1){
            //         $row['unm'] = $unmQuery->fetch_column();
            //     }else{
            //         throw new Exception();
            //     }
                
            // $rows[$i]['notiID'] = $row['notiID'];
            // $rows[$i]['FromID'] = $row['FromID'];
            // $rows[$i]['unm'] = $row['unm'];
            // $i++;
        }

        // return $rows;
    }catch(Exception){
        return 0;
    }
    
    }

// $unm ="scott@234";
echo getNewUserReq();
?>