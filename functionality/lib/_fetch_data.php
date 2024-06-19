<?php
    if($data = json_decode(file_get_contents("php://input") , true) ){
        $fleg=0;
        if(!session_id()){
            session_start();
            $fleg=1;
        }
        if(isset($data['req']) && isset($_SESSION['userID'])){
            require_once('../db/_conn.php');
            require_once('./_validation.php');

            if($data['req'] == "get_dp") {
                if(isset($data['unm']))
                    echo get_dp( null,$data['unm']);    
                else if(isset($data['GID'])){
                    echo get_dp( null,null,$data['GID']);
                }
            }else if($data['req'] == "get_unm"){
                    echo search_user($data['from'] , $data['value']);
            
            }else if($data['req'] == "getDocBlob") { 
                    $res = getDocBlob($data);
                    $size = strlen($res);
                    header('Content-Type: application/json');
                    header('Content-Length:'.$size);
                    echo $res;
            
            }else if($data['req'] == "getProfile")   
                echo getProfile();
        }
        if($fleg)
            session_abort();
    }

    function _get_userID_by_UNM(string $unm){
        $fetchUID = fetch_columns('users_account', ["unm"], [$unm], array("userID"));
        return ($fetchUID->num_rows != 0) ? $fetchUID->fetch_column() : 0 ;
    }

    function _fetch_unm($userID=null){
        if($userID == null)
            $userID = getDecryptedUserID();

        $res = fetch_columns("users_account", ["userID"], [$userID], array("unm"));
        
        if($res->num_rows == 1){
            $unm = $res->fetch_column();
            return $unm;
        }else{
            return "USER_NOT_FOUND";
        }
    }
    
    function _fetch_group_nm($groupID=null){
        if($groupID == null) return;

        $res = fetch_columns("groups", ["groupID"], [$groupID], array("groupName"));
        
        if($res->num_rows == 1){
            $nm = $res->fetch_column();
            return $nm;
        }else{
            return 0;
        }
    }

    function _fetch_email($userID = null){
        if($userID == null)
            $userID = getDecryptedUserID();

        $res = fetch_columns("users", ["userID"], [$userID], array("email"));
        
        if($res->num_rows == 1){
            $email = $res->fetch_column();
            return $email;
        }else{
            return "EMAIL_NOT_FOUND";
        }
    }

    // @param $userID ,$unm,$GID any one of them 
    // @return array with two value mime and base64 string
    function get_dp($userID,$unm=null,$GID=null) {
        if($userID || $unm){
            if($userID)
                $ID = $userID;
            else
                $ID = _get_userID_by_UNM($unm);

            $fetch_img = fetch_columns( 'avatar' , ["ID"] , [$ID] , array("type" , "imgData"));
            
        }elseif($GID){
            $ID = base64_decode($GID);
            $fetch_img = fetch_columns( 'groups' , ["groupID"] , [$ID] , array("dp as imgData"));
        }else
            return 0;

        if($fetch_img && $fetch_img->num_rows == 1){
            $img=$fetch_img->fetch_assoc();
            $mime = $img['type'] ?? 'image/webp';
            $data = $img['imgData'];

            $returnData = array( 
                    "mime" => $mime,
                    "data" => $data
                );
            return json_encode($returnData);
        }else{
            return 0;
        }  
    }

    function get_user_full_name($unm,$userID=null){
        try{
            if(!$userID)
                $userID = _get_userID_by_UNM($unm);

            $fetch_name = fetch_columns('users' , ['userID'] , [$userID] , array('surname' , 'name'));

            if($fetch_name != '400' && $fetch_name->num_rows == 1){
                $name = $fetch_name->fetch_assoc();
                $full_name = $name['surname']." ".$name['name'];
                return $full_name; 
            }else {
                return 0;
            }
        }catch(Exception $e){
            return 0;
        }
        
    }

    function fetch_data_from_users_details($userID , $column){
        $data = fetch_columns('users_details' , ['userID'] , [$userID] , array($column));

        if($data != '400' && $data->num_rows == 1){
            $data = $data->fetch_assoc()[$column];
            return $data; 
        }else {
            return '';
        }
    }

    function fetch_data_from_users($userID , $column){
        $data = fetch_columns('users' , ['userID'] , [$userID] , array($column));

        if($data != '400' && $data->num_rows == 1){
            $data = $data->fetch_assoc()[$column];
            return $data; 
        }else {
            return '';
        }
    }

    function search_user($from , $value) {
        try{
            $userID=getDecryptedUserID();

            if($from == "add_new_chat")
                $result = search_columns("users_account" , "unm" , $value , "userID" , "unm");
            else   
                throw new Exception();
    
                if($result !== 0 ){
                    // $rows=0;
                    while($row = $result->fetch_assoc()){
                        if(is_user_blocked($userID,$row['userID']))
                            continue;
                        
                        $rows[]['unm'] = $row['unm'];
                    }
                    // $rows=$result->fetch_all(true);
                    if(!isset($rows))
                        return 0;
                    return json_encode($rows);
                }else{
                    return 0;
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

    function getPassKey($userID) {
        $result = fetch_columns( "users" ,['userID'] , [$userID] , array('pass_key'));
        if($result != '400') {
            if($result && $result->num_rows == 1){
                return $result->fetch_assoc()['pass_key'];
            }else{
                throw new Exception("No user Found from Indexed DB storage." , 404);
            }
        }
        else{
            throw new Exception("Can't connect to Database through Indexed DB" , 400);
        }
        return false;
    }

    function getDocBlob($obj){
        try{
            if(!isset($_COOKIE['chat']))
                throw new Error('chat section is not opened',0);
            if(!isset($_COOKIE['currOpenedChat']))
                throw new Error('Chat is not opened, Please open chat first.',0);

            $msgID = base64_decode($obj['msgID']);

            $chatType = strtolower($_COOKIE['chat']);
            $userID = getDecryptedUserID();
            $table = "messages";
            
            //fetching document data from the column doc as data
            if(isset($_COOKIE['currOpenedGID']) &&$chatType == 'group'){
                $groupID= base64_decode($_COOKIE['currOpenedGID']);
                if(!is_member_of_group($userID,$groupID))
                    throw new Exception("Unauthorised !!",410);
                
                $result = fetch_columns($table, ['msgID', 'toID'], [$msgID, $groupID] ,array('mime','doc as data'));
            
            }else if($chatType == 'personal'){
            
                $oppoUserID = _get_userID_by_UNM($_COOKIE['currOpenedChat']);

                if(!$userID || !$oppoUserID)
                    throw new Exception("Something went wrong",400);

                $sql = "SELECT mime,doc as data
                        FROM $table 
                        WHERE msgID = ?
                        AND ( fromID , toid ) IN ( (? , ?), (? , ?) );";

                $stmt = $GLOBALS['conn'] -> prepare($sql);
                $stmt ->bind_param('sssss' , $msgID, $userID, $oppoUserID , $oppoUserID, $userID);
                $sqlquery= $stmt->execute();

                if(!$sqlquery)
                    throw new Exception("SQL query didn't fire.",400);

                $result = $stmt->get_result();
                $stmt->close();
            
            }else{
                throw new Exception("Something went wrong",400);
            }

            if(gettype($result) == "integer" ) throw new Exception("something went wrong.",$result);
            
            if($result->num_rows == 1){
                $row=$result->fetch_assoc();
                return json_encode($row);
            }else
                throw new Exception("either file has been deleted or some error has ocured",400);
        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    function _fetchLastMsg($userID,$oppoUserID,$chatType='personal'){
        try{
            if($chatType == 'personal'){
                $sql =" SELECT m.msg
                        FROM messages as m
                        RIGHT JOIN `botsapp_statusdb`.`messages` as ms
                        ON m.msgID = ms.msgID
                        WHERE ( m.`fromID` = '$userID' AND m.`toID` = '$oppoUserID') 
                        OR (m.fromID = '$oppoUserID' AND m.toID = '$userID' AND ms.hide = 0)
                        ORDER BY m.time
                        DESC limit 1";
            }else if($chatType == 'group'){
                //here opposite user id will be a group ID.
                $sql =" SELECT m.msg
                        FROM messages as m
                        RIGHT JOIN `botsapp_statusdb`.`messages` as ms
                        ON m.msgID = ms.msgID
                        WHERE m.toID = '$oppoUserID'
                        AND (ms.hide = 0 OR ms.hide_by IS NULL OR LOCATE('$userID',ms.hide_by) = 0)
                        ORDER BY m.time
                        DESC limit 1";
            }else 
                return '';

            $stmt = $GLOBALS['conn']->prepare($sql);
            $fire=$stmt->execute();
            if(!$fire)
                throw new Exception();

            $result = $stmt->get_result();
            $stmt->close();

            $last_msg = $result->fetch_column();
            if(strlen($last_msg) > 40)
                $last_msg= str_split($last_msg,40)[0]."...";
            return ($result->num_rows == 1) ? $last_msg : '' ;
        }catch(Exception $e){
            return '';
        }
    }

    function getProfile(){
        try{
            if(!isset($_COOKIE['chat']))
                throw new Error('chat section is not opened',0);
            if(!isset($_COOKIE['currOpenedChat']))
                throw new Error('Chat is not opened, Please open chat first.',0);

            $chatType= strtolower($_COOKIE['chat']);
            
            $userID=getDecryptedUserID();

            if($chatType == 'personal'){
                $reqUserID= _get_userID_by_UNM($_COOKIE['currOpenedChat']);

                if(!$reqUserID || is_chat_exist($userID,$reqUserID) != 1 )
                    throw new Exception("No data found.",411);

                $sqlObj = fetch_columns("users_details", ["userID"], [$reqUserID], array("about",'can_see_online_status'));
                if(!$sqlObj)
                    throw new Exception('',400);
            
                $responseData = $sqlObj->fetch_assoc();
                $responseData['name']= get_user_full_name('',$reqUserID);
                $responseData['email']= _fetch_email($reqUserID);
            }else if($chatType == 'group'){

                $reqGroupID= base64_decode($_COOKIE['currOpenedGID']);

                if( !is_member_of_group($userID,$reqGroupID)){
                    delete_group_if_empty($reqGroupID);
                    throw new Exception("No data found.",411);
                }

                $sqlObj = fetch_columns("groups", ["groupID"], [$reqGroupID], array("groupAdminID,groupName"));
                if(!$sqlObj)
                    throw new Exception('',400);

                $data=$sqlObj->fetch_assoc();

                $responseData['name']= $data['groupName'];
                $responseData['admin']= _fetch_unm($data['groupAdminID']);
                
                //removing admin from member's list
                $responseData['members']= fetch_all_group_members($reqGroupID);

                $searchedIndex= array_search($responseData['admin'],$responseData['members']);
                if($searchedIndex != '')
                    unset( $responseData['members'][$searchedIndex]);
                $responseData['members']= json_encode(array_values($responseData['members']));

            }else
                throw new Exception('',400);


            return json_encode($responseData);

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