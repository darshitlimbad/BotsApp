<?php
    if($data = json_decode(file_get_contents("php://input") , true) ){
        if(!session_id()){
            session_start();
            
            if(isset($data['req']) && isset($_SESSION['userID'])){
                require_once('../db/_conn.php');
                require_once('../lib/_validation.php');

                switch($data['req']){
                    case "get_dp": 
                        if(isset($data['unm']))
                            echo get_dp( null,$data['unm']);    
                        else if(isset($data['GID'])){
                            echo get_dp( null,null,$data['GID']);
                        }
                    break;

                    case "get_unm":
                            echo search_user($data['from'] , $data['value']);
                    break;

                    case "getDocBlob": 
                            $res = getDocBlob($data);
                            $size = strlen($res);
                            header('Content-Type: application/json');
                            header('Content-Length:'.$size);
                            echo $res;
                    break;

                    case "getProfile":
                        echo getProfile();
                    break;

                    case "getBlockedMemberList":
                        echo getBlockedMemberList();
                    break;

                    case "getEmojisDetails":
                        echo getEmojisDetails($data);
                    break;

                    case "searchEmojis":
                        echo search_emojis($data);
                    break;

                    case "fetchEmoji":
                        echo fetch_emoji($data);
                    break;
                }
            }
            session_abort();
        }
    }

    //@param $unm = string unm
    //@return 0 or user ID
    function _get_userID_by_UNM(string $unm=null){
        if(!$unm)   return 0;
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
            return 0;
        }
    }
    
    function _fetch_group_nm($groupID=null){
        if($groupID == null) return;

        $res = fetch_columns("groups", ["groupID"], [$groupID], array("name"));
        
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

    function _fetch_gender($userID= null){
        if($userID== null)
            $userID= getDecryptedUserID();
        
        $res = fetch_columns("users_details", ["userID"], [$userID], array("gender"));
    
        if($res->num_rows == 1){
            $gender = $res->fetch_column();
            return $gender;
        }else{
            return 0;
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
                $result = search_columns("users_account" , "unm" , $value , ["userID" , "unm"],'conn',["ORDER BY unm ASC"]);
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

    function getPassKey($unm) {
        $result = fetch_columns( "users" ,['unm'] , [$unm] , array('pass_key'));
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
            if(!$_COOKIE['chat'])
                throw new Exception('chat section is not opened',0);
            if(!$_COOKIE['currOpenedChat'])
                throw new Exception('Chat is not opened, Please open chat first.',0);

            $msgID = base64_decode($obj['msgID']);

            $chatType = strtolower($_COOKIE['chat']);
            $userID = getDecryptedUserID();
            $table = "messages";
            
            //fetching document data from the column doc as data
            if($_COOKIE['currOpenedGID'] && $chatType == 'group'){
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
                $sql =" SELECT m.msg, m.time
                        FROM messages as m
                        RIGHT JOIN `botsapp_statusdb`.`messages` as ms
                        ON m.msgID = ms.msgID
                        WHERE ( m.`fromID` = '$userID' AND m.`toID` = '$oppoUserID') 
                        OR (m.fromID = '$oppoUserID' AND m.toID = '$userID' AND ms.hide = 0)
                        ORDER BY m.time
                        DESC limit 1";
            }else if($chatType == 'group'){
                //here opposite user id will be a group ID.
                $sql =" SELECT m.msg, m.time
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

            if($result->num_rows == 1){
                $last_msg = $result->fetch_assoc();
                if(strlen((string)$last_msg['msg']) > 40)
                    $last_msg['msg']= str_split($last_msg['msg'],40)[0]."...";
                return $last_msg;
            }else 
                return '';
            
        }catch(Exception $e){
            return '';
        }
    }

    function getProfile(){
        try{
            if(!$_COOKIE['chat'])
                throw new Exception('chat section is not opened',0);
            if(!$_COOKIE['currOpenedChat'])
                throw new Exception('Chat is not opened, Please open chat first.',0);

            $chatType= strtolower($_COOKIE['chat']);
            
            $userID=getDecryptedUserID();

            if($chatType == 'personal'){
                $reqUserID= _get_userID_by_UNM($_COOKIE['currOpenedChat']);

                if(!$reqUserID || is_chat_exist($userID,$reqUserID) != 1 )
                    throw new Exception("No data found.",411);

                $sqlObj = fetch_columns("users_details", ["userID"], [$reqUserID], array("about","gender",'can_see_online_status'));
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

                $sqlObj = fetch_columns("groups", ["groupID"], [$reqGroupID], array("adminID,name"));
                if(!$sqlObj)
                    throw new Exception('',400);

                $data=$sqlObj->fetch_assoc();

                $responseData['name']= $data['name'];
                $responseData['admin']= _fetch_unm($data['adminID']);
                
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

    function getBlockedMemberList(){
        try{
            $userID= getDecryptedUserID();

            $fetchedDataObj= fetch_columns('blocked',['fromID'],[$userID],array('toID'),'status');
            if(!$fetchedDataObj)
                throw new Exception("Something went wrong",400);

            $blockedChatterList= array_map(function (array $memberID){
                return _fetch_unm($memberID[0]);
            },$fetchedDataObj->fetch_all());

            return json_encode($blockedChatterList);
        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }

    // @param $data a array with node from which can have two values 'SELF' OR 'GROUP'
    // @param if the from == 'GROUP' then the $data should have 'GID' node with value converted in binary
    function getEmojisDetails(array $data=[]){
        try{
            if(!$data)
                throw new Exception("No data found!!",411);

            $allowed_from_value=['SELF','GROUP'];
            if(!isset($data['from']) || !in_array($data['from'],$allowed_from_value))
                throw new Exception("",400);

            $userID=getDecryptedUserID();
            
            $list=[];
            $i=0;

            if($data['from'] == "SELF"){
                $points= ['uploaderID'];
                $points_value=[$userID];
                $columns=['id','scope','groupID','name','mime','blob_data','status'];

                $result= fetch_columns("emojis",$points,$points_value,$columns,"conn",["ORDER BY name ASC"]);
                if(!$result || !$result->num_rows)
                    throw new Exception("",400);
                
                while($row= $result->fetch_assoc()){
                    $list[$i]=[
                        'id'=> base64_encode($row['id']),
                        'scope'=>$row['scope'],
                        'name'=>$row['name'],
                        'mime'=>$row['mime'],
                        'blob'=>$row['blob_data'],
                        'status'=>$row['status'],
                    ];
                    if($row['scope'] === "GROUP")
                        $list[$i]['GNM']= _fetch_group_nm($row['groupID']);
                    $i++;
                }

                
            }else{
                if(!isset($data['GID']))
                    throw new Exception("",400);

                $groupID= base64_decode($data['GID']);
                $GNM= _fetch_group_nm($groupID);
                if(!is_member_of_group($userID,$groupID))
                    throw new Exception("User is not a member of this group",410);
                
                $points= ['scope','groupID'];
                $points_value= ['GROUP',$groupID];
                $columns= ['id','uploaderID','scope','name','mime','blob_data','status'];

                $result= fetch_columns("emojis",$points,$points_value,$columns,"conn",["ORDER BY name ASC"]);
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
                        'GNM'=>$GNM,
                    ];
                }
            }

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

    // @param $emojiNm - it's the name to search 
    // @return list of emojis | 0 | error all of them in json encoded
    // ? FORMAT
    /*data=[
        'name'=>':',
        'scope'=>'SELF'| 'SELF&GROUP,
        gid=>'...',
    ];*/
    function search_emojis(array $emojiObj=[]){
        try{
            //? SELF = PUBLIC & PRIVATE | SELF&GROUP = PUBLIC & PRIVATE & SPECIFIC GROUP
            $allowedScopes= ['SELF','SELF&GROUP'];

            //verifying all variables are okay
            if(!isset($emojiObj['name']) || !isset($emojiObj['scope']) || ($emojiObj['scope'] == $allowedScopes[1] && !isset($emojiObj['GID'])))
                throw new Exception("Something went wrong!",400);

            // scope verification
            if(!in_array($emojiObj['scope'],$allowedScopes))
                throw new Exception("Invalid emoji scope: The scope '" . $emojiObj['scope'] . "' is not allowed.",409);

            // fetching user ID
            $userID=getDecryptedUserID();
            
            // creating flags array for searching
            $flags=[];
            
            if($emojiObj['scope'] == $allowedScopes[0]){
                $flags=["AND status = 'UPLOADED' AND ( (scope = 'PRIVATE' AND uploaderID='$userID') OR (scope = 'PUBLIC') )","ORDER BY scope,name ASC"];
            }else {
                // verification of the group if there is any GID
                $groupID= base64_decode($emojiObj['GID']);

                if(!$groupID || !is_member_of_group($userID,$groupID))
                    throw new Exception(" Unauthorised Access Denied !!! ",410);

                $flags=["AND status = 'UPLOADED' AND ( (scope = 'PRIVATE' AND uploaderID='$userID') OR (scope = 'GROUP' AND groupID= '$groupID') OR (scope = 'PUBLIC') )","ORDER BY scope,name ASC"];

            }

            $clms=['id','scope','name','mime','blob_data  AS `blob`'];
            $result= search_columns('emojis','name',$emojiObj['name'],$clms,'conn',$flags);

            if(!$result)
                return 0;

            $list=[];
            $i=0;
            while($row= $result->fetch_assoc()){
                $list[$i++]= $row;
            }

            return json_encode($list);
        }catch(Exception $e){
            $error=[
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];

            return json_encode($error);
        }
    }

    // @param [emojiNm, used By, scope= SELF|GROUP, gid= null|gid ], - emoji name, user name who used the emoji, scope where emoji is used
    // @return list of emojis | 0 | error all of them in json encoded
    // ? FORMAT
    /*emojiObj=[
        'name'=>':',
        'emojiUser'=>'',
        'scope'=>'SELF' | 'SELF&GROUP,
        'GID'=>'',
    ];*/
    function fetch_emoji(array $emojiObj=[]){
        try{
            //? SELF = PUBLIC & PRIVATE | GROUP = PUBLIC & PRIVATE & SPECIFIC GROUP
            $allowedScopes= ['SELF','SELF&GROUP'];
            
            if(!isset($emojiObj['name']) || !isset($emojiObj['emojiUser']) || !isset($emojiObj['scope']) || ( isset($emojiObj['scope']) && (!in_array($emojiObj['scope'],$allowedScopes) || ($emojiObj['scope'] == $allowedScopes[1] && !isset($emojiObj['GID'])) ) ) )
                throw new Exception("Something went wrong!",400);

            $userID=getDecryptedUserID();
            $emoji_user_id= _get_userID_by_UNM($emojiObj['emojiUser']);

            //varifying name 
            if(!preg_match('/:\w+:/',$emojiObj['name']))
                return 0;
            
            //varifying group id if scope is allowedScopes[1]
            $groupID=null;
            if($emojiObj['scope'] == $allowedScopes[1]){
                $groupID= base64_decode($emojiObj['GID']);
                if(!$groupID || !is_member_of_group($userID,$groupID) || !is_member_of_group($emoji_user_id,$groupID))
                    throw new Exception(" Unauthorised Access Denied !!! ",410);
            }
            
            // verification of emoji user id             
            if(!$emoji_user_id || ($emojiObj['scope'] == $allowedScopes[0] && $userID != $emoji_user_id && !is_chat_exist($userID,$emoji_user_id)))
            {
                throw new Exception("User not found!",411);
            }
            

            $flags=[];
            switch($emojiObj['scope']){
                case $allowedScopes[0]:
                    $flags=["AND status='UPLOADED' AND ( (`scope` = 'PRIVATE' AND `uploaderID` = '$emoji_user_id') OR (`scope` = 'PUBLIC') ) "];
                    break;

                case $allowedScopes[1]:
                    $flags=["AND status='UPLOADED' AND ( (`scope` = 'PRIVATE' AND `uploaderID` = '$emoji_user_id') OR (`scope`= 'GROUP' AND `groupID` = '$groupID' ) OR(`scope` = 'PUBLIC') ) "];

                    break;

                default:
                    return 0;
            }

            $fetchedDataObj= fetch_columns("emojis",['name'],[$emojiObj['name']],['id','name','mime','blob_data as `blob`'],'conn',$flags);

            if(!$fetchedDataObj || !$fetchedDataObj->num_rows)
                return 0;
            
            return json_encode($fetchedDataObj->fetch_assoc());

        }catch(Exception $e){
            $error=[
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];

            return json_encode($error);
        }
    }
?>