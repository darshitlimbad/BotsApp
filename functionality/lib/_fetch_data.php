<?php
    if($data = json_decode(file_get_contents("php://input") , true) ){
        if(isset($data['req'])){
            include_once('../db/_conn.php');
            include_once('./_validation.php');
            if($data['req'] == "get_dp") {
                if(isset($data['unm']))
                    echo get_dp( null,$data['unm']);    
                else if(isset($data['GID']))
                    echo get_dp( null,null,$data['GID']);
            } 
            if($data['req'] == "get_unm")   echo search_user($data['from'] , $data['value']);
            if($data['req'] == "getDocBlob") { 
                    $res = getDocBlob($data);
                    $size = strlen($res);
                    header('Content-Type: application/json');
                    header('Content-Length:'.$size);
                    echo $res;
                }

        }
    }

    function _get_userID_by_UNM($unm){
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

    function get_dp($userID,$unm=null,$GID=null) {
        if($userID)
            $ID = $userID;
        else if(!$userID && $unm)
            $ID = _get_userID_by_UNM($unm);
        elseif($GID)
            $ID = base64_decode($GID);
        else
            return 0;

        
        $fetch_img = fetch_columns( 'avatar' , ["ID"] , [$ID] , array("type" , "imgData"));

        if($fetch_img->num_rows == 1){
            $img=$fetch_img->fetch_assoc();
            $type = $img['type'];
            $data = base64_encode($img['imgData']);

            $returnData = array( 
                    "type" => $type,
                    "data" => $data
                );
            return json_encode($returnData);
        }else{
            return 0;
        }  
    }

    function get_user_full_name($unm){
        try{
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
            if($from == "add_new_chat")
                $result = search_columns("users_account" , "unm" , $value , "userID" , "unm");
            else   
                throw new Exception();
    
                if($result !== 0 ){
                    while($row = $result->fetch_assoc()){
                        $rows[]['unm'] = $row['unm'];
                    }
                    
                    return json_encode($rows);
                }else{
                    throw new Exception();
                }
    
        }catch(Exception $e){
            return 0;
        }
    }

    function getPassKey($userID) {
        $result = fetch_columns( "users" ,['userID'] , [$userID] , array('pass_key'));
        if($result != '400') {
            if($result->num_rows == 1){
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

            $msgID = $obj['msgID'];
            session_start();

            $chatType = strtolower($_COOKIE['chat']);
            $table = "messages";
            
            //fetching document data from the column doc as data
            if(isset($obj['toGID']) && $chatType == 'group'){

                $result = fetch_columns($table, ['msgID', 'toID'], [$msgID, base64_decode($obj['toGID'])] ,array('mime','doc as data'));
            
            }else if($chatType == 'personal'){
            
                $userID = getDecryptedUserID();
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
                session_abort();
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
                $sql =" SELECT msg
                        FROM messages
                        WHERE (fromID = '$userID' AND toID = '$oppoUserID')
                        OR (fromID = '$oppoUserID' AND toID = '$userID')
                        ORDER BY msgID
                        DESC
                        limit 1";
            }else if($chatType == 'group'){
                //here opposite user id will be a group ID.
                $sql =" SELECT msg
                        FROM messages
                        WHERE toID = '$oppoUserID'
                        ORDER BY msgID
                        DESC
                        limit 1";
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
?>