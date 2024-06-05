<?php
    include "../interface.php";
?>
<!-- <style>
body{
    display: none;
}
</style> -->
<?php
    $data['toGID'] = 'R3JvdXAwMDAwMDAwMQ==';

    echo getNewMsgs($data);
    
    function getNewMsgs($data){
        try{
            if(!isset($_COOKIE['chat']))
                throw new Error('chat section is not opened',0);
            if(!isset($_COOKIE['currOpenedChat']))
                throw new Error('Chat is not opened, Please open chat first.',0);
    
            $userUNM = _fetch_unm();
            $userID = getDecryptedUserID();
    
            $oppoUserUNM = $_COOKIE['currOpenedChat'];
            $chatType = strtolower($_COOKIE['chat']);
    
            if( $chatType == "personal"){
                $oppoUserID = _get_userID_by_UNM($oppoUserUNM);
            }else if( $chatType == "group") {
                $oppoUserID = base64_decode(base64_decode($data['toGID']));
                // $oppoUserID = base64_decode($data['toGID']);
    
                if(!is_data_present('groups','groupID', $oppoUserID ,'groupID')){
                    throw new Exception("There is no group with provided GID.",404);
                }
            }else{
                throw new Exception("please reload this page :(",400);
            }
    
            if(!$oppoUserID)
                throw new Exception('Something went wrong',400);
    
            if($chatType == 'personal'){
                // t1.fromID = 'the opposite user'
                // t1.toID = 'the user'
                $condition ="   t1.fromID = ? 
                                AND t1.toID = ?     ";
            }else{
                // t1.fromID = 'the User'
                // t1.toID = 'the opposite User'
                $condition = "  t1.toID = ?
                                AND NOT t1.fromID = ? ";
            }
    
            $sql =" SELECT t1.msgID, t1.type, t1.msg, t1.details, t1.time, t2.status
                    FROM `botsapp`.messages as t1 
                    LEFT JOIN `botsapp_statusdb`.messages as t2
                    ON t1.msgID = t2.msgID 
                    WHERE $condition
                    AND t2.status = 'send' ";
    
            $stmt = $GLOBALS['conn'] -> prepare($sql);
            $stmt ->bind_param('ss' , $oppoUserID,$userID);        
    
            $sqlquery= $stmt->execute();
    
            if(!$sqlquery)
                throw new Exception("sql not fired.",0);
                
            $result=$stmt->get_result();
            $stmt ->close();
                if($result->num_rows == 0)  return 0;
    
            $msgObjs = null;
            $i=0;
            while($row = $result->fetch_assoc()){
                $msgObjs[$i]['toUnm']= $userUNM ;
                $msgObjs[$i]['msgID']= $row['msgID'];
                $msgObjs[$i]['type']= $row['type'];
                $msgObjs[$i][($row['type'] == 'text') ? 'msg' : 'fileName']=$row['msg'];
                $msgObjs[$i]['details'] = unserialize($row['details']);
                $msgObjs[$i]['time']= $row['time'];
                
                $i++;
            }
    
            return json_encode($msgObjs);
    
        }catch(Exception $e){
            $error = [
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }
   
?>
