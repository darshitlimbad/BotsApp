<?php

// if($data = json_decode( file_get_contents("php://input") , true)){
//     try{
//         session_start();
//         if(isset($_SESSION['userID'])){
//             require_once('db/_conn.php');
//             require_once('lib/_validation.php');
//             require_once('lib/_fetch_data.php');
    
            
    
//             if($data['req'] === "__PROMOT_TO_ADMIN__"){
//                 echo create_admin(base64_decode($data['unm']));
//             } 
//         }
//     }catch(Exception $e){
//         $error = [     
//             'error'=> true,       
//             'code'=> $e->getCode(),
//             'message'=> $e->getMessage(),
//         ];
//         echo json_encode($error);
//     }
    
// }

function create_admin($unm){
    try{
        if(!is_admin())
            return 0;

        $oldUserID= _get_userID_by_UNM($unm);
        if(!$oldUserID || !is_data_present('users_account',['userID'],[$oldUserID]))
            throw new Exception(" No Data Found !! ",411);
        else if(is_admin($oldUserID))
            throw new Exception("User Is already Admin.",412);

        $newAdminID= gen_new_id("admin");

        $sql = "DELIMITER @@
                UPDATE `users` SET `userID`= ? WHERE `userID`= ?; @@
                UPDATE `inbox` SET `fromID`= ? WHERE `fromID`= ?; @@
                UPDATE `inbox` SET `toID`= ? WHERE `toID`=?; @@
                INSERT INTO `admins` (`adminID`) VALUES (?); @@
                DELETE FROM `reports` WHERE `toID`=?; @@
                DELETE FROM `blocked` WHERE `toID`=?; @@
                DELIMITER ; ";
        $STMT= $GLOBALS['conn']->prepare($sql);
        $STMT->bind_param('sssssss',$newAdminID,$oldUserID,$newAdminID,$oldUserID,$newAdminID,$oldUserID,$newAdminID,$oldUserID,$oldUserID);
        $sqlfire = $STMT->execute();
            $STMT->close();

        return $sqlfire;

    }catch(Exception $e){
        $error = [     
            'error'=> true,       
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
}