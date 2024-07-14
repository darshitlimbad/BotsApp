<?php
    require_once('_validation.php');
    if($data = json_decode( file_get_contents("php://input") , true)){
        if(!session_id()){
            session_start();

            if(isset($_SESSION['userID'])){

                include_once("../db/_conn.php");
                require_once('./_fetch_data.php');
                require_once('./_notification.php');

                if($data['req'] === 'createNewGroup'){
                    echo createNewGroup($data);
                }else if(($data['req'] === 'addMemberInGroup') && isset($data['unmList']) ){

                    $unmList= json_decode($data['unmList']);
                    if(count($unmList)){
                        $memberIDs = array_filter(array_map(function ($unm){
                                        $id= _get_userID_by_UNM(base64_decode($unm));
                                        if($id)
                                            return $id;
                                    },$unmList));
                        
                        if(count($memberIDs))   
                            echo addMemberInGroup(null,$memberIDs);
                    }
                }else if($data['req'] === "add_emoji"){
                    echo add_emoji($data);
                }else{
                    return 0;
                }
            }

            session_abort();
        }
    }


// create users param string of columns with ',' seprater , string of column values , img type , img data in binary 
function createUser($columns , $values , $avatar ) {
    try{
        $fleg = 0;

        $userID = gen_new_id("user"); 
        $unm=NULL;

        $columns[]='userID';
        $values[]=$userID;
        
        $main_table = "users";
        
        $res1 = insertData($main_table, $columns , $values);
        if($res1 == 1) {

            for($i = 0 ; $i<count($columns) ; $i++) {
                if(trim($columns[$i]) == "unm"){
                    $unm = trim($values[$i]);
                }
            }

            $res2 = insertData('users_account' , ["userID" , "unm"] , [$userID , $unm]);

            if($res2 === 1) {
                $res3 = insertData('users_details' , ["userID"] , [$userID]);

                if($res3 === 1){

                    $res4 = uploadImg( $userID , $avatar );
                    if($res4 === 1){
                        return 1;
                    }else{
                        $fleg = 1;
                    }

                }else{
                    $fleg = 1;
                }
                
            }else{
                $fleg = 1;
            }

        }else   {
            $fleg = 1;
        } 

    if($fleg == 1) {
            // deleteData($main_table,$userID);
            throw new Exception( "something went wrong", 400);
    }
    
    }catch (Exception $e){
        return 0;
    }
}

// for uploading img it takes user id ,img type and img tmp name
function uploadImg($userID , $imgObj ){
    try{
        $imgObj = compressImg($imgObj,100,['width'=>200,'height'=>200]);
        if(gettype($imgObj)=="integer")
            throw new Exception("Something Went wrong",$imgObj);//this will return error code

        $table = 'avatar';
        $type = $imgObj['type'];

        $img_data = base64_encode(file_get_contents($imgObj['tmp_name']));

        if(is_data_present($table , ['ID'] , [$userID] , "imgData")){
            $query = "UPDATE `$table` SET `type` = ? , `imgData` = ?  WHERE `ID` = ? ";
            $stmt = $GLOBALS['conn']->prepare($query);
            $stmt->bind_param('sss' , $type , $img_data ,  $userID);
        }else{
            $query = "INSERT INTO `$table` (`ID` , `type` , `imgData`) VALUES (?,?,?)";
            $stmt = $GLOBALS['conn']->prepare($query);
            $stmt->bind_param('sss' , $userID , $type , $img_data );
        } 
        // move_uploaded_file($imgObj['tmp_name',]);
            $sqlfire = $stmt->execute();
            $stmt ->close();
            return ($sqlfire)?1:0;
    }catch(Exception $e) {
        return $e->getCode();
    }
}

function createNewGroup(array $data){
    try{
        if(!isset($data['name']) || !isset($data['memberList']) || 
            $data['name'] == "" || $data['memberList'] == "")
            throw new Exception("Name or member list is empty.",0);

        $userID= getDecryptedUserID();
        $unm=_fetch_unm();
        $gname= $data['name'];
        $memberList= json_decode($data['memberList']);
        if(count($memberList) == 0)
            throw new Exception("Member List is empty.",0);

        $newGroupID= gen_new_id('Group');
        if(gettype($newGroupID) === 'integer')
            throw new Exception("Something went wrong",400);

        $groupCreateRes= insertData('groups',['adminID','groupID','name'],[$userID,$newGroupID,$gname]);
        if(!$groupCreateRes)
            throw new Exception("something went wrong while creating group",400);

        $addAdminRes= insertData('inbox',['chatType','fromID','toID'],['group',$userID,$newGroupID]);
        if(!$addAdminRes){
            deleteData('groups',$newGroupID,'groupID');
            throw new Exception("Something went Wrong",400);
        }

        // foreach($memberList as $member){
        //     if($member === $unm)
        //         continue;           
        //     $memberID=_get_userID_by_UNM($member);
        //     if($memberID)
        //         $addMemRes= addMemberInGroup(base64_encode($newGroupID), $memberID);
        // }

        $memberIDs = array_filter(  array_map(function ($unm){
                                        $id= _get_userID_by_UNM(base64_decode($unm));
                                        if($id)
                                            return $id;
                                    },$memberList));

            if(count($memberIDs))   
                addMemberInGroup(base64_encode($newGroupID),$memberIDs);

        $data=[
            'action'=>'reloadChat',
            'msg'=> ['chat'=>'group'],
            'toID'=>$userID,
        ];
        add_new_noti($data);
        return 1;
        // if(!fetch_total_group_member_count($newGroupID)){
        //     deleteData('groups',$newGroupID,'groupID');
        //     throw new Exception("Gro.",0);
        // }

    }catch(Exception $e){
        print_r($e);
        $error = [
            'error'=>true,
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
}

// @param $groupID --it must be decrypted
// @param $memberNm --name of the member
// @return 1 if member added in the group
function addMemberInGroup(string $groupID=null,array $memberIDs=[]){
    try{
        $userID= getDecryptedUserID();
        $groupID= base64_decode($groupID);

        if(!count($memberIDs) || !$userID)
            throw new Exception("Something went Wrong",400);

        if(!$groupID){
            $chatType= strtolower($_COOKIE['chat']);
            if($chatType != 'group' || !$_COOKIE['currOpenedGID'])
                throw new Exception("Something went Wrong",400);

            $groupID=base64_decode($_COOKIE['currOpenedGID']);
            if(!is_data_present('groups', ['groupID'], [$groupID], 'groupID'))
                throw new Exception(" Unauthorised Access Denied !!!",410);
        }

        //if the the request sender is not a member 
        if(!is_member_of_group($userID,$groupID)){
            throw new Exception("Unauthorised Access Denied !!! ",410);
        //if the the request receiver is already a member
        }else{
            foreach($memberIDs as $memberID){
                if(is_member_of_group($memberID,$groupID))
                    throw new Exception("Member already exists",412);

                if(is_chat_exist($userID,$memberID) == 1){
                    $res= insertData('inbox',['chatType','fromID','toID'],['group',$memberID,$groupID]);
                    if(!$res)
                        throw new Exception("Something went Wrong",400);
                    
                    $gName= _fetch_group_nm($groupID);
                    $data=[
                        "action" => "groupMemberAdded",
                        "toID" => $memberID,
                        'msg' => ['gName'=> $gName]
                    ];
                    add_new_noti($data);

                    if(is_user_on($memberID)){
                        $data=[
                            'action'=>'reloadChat',
                            'msg'=> ['chat'=>'group','gName'=> $gName],
                            'toID'=>$memberID,
                        ];
                        add_new_noti($data);
                    }
                }
            } 
            return 1;
        }

    }catch(Exception $e){
        // print_r($e);
        $error = [
            'error'=>true,
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
}


// @param $emojiObj -- in emojiObj array: name:/[a-z]'_'/ , blob, scope, groupID
// @return 1 if member added in the group
function add_emoji(array $emojiObj=[]){
    try{
        $userID= getDecryptedUserID();
        $groupID=null;

        if(!$emojiObj)
            throw new Exception("No data found.",400);  
        
        //? scope validation
        $scope= $emojiObj['scope'];
        $allowedScopes= ['PUBLIC','PRIVATE','GROUP'];
        if(!in_array($scope,$allowedScopes))
            throw new Exception("Invalid emoji scope: The scope '" . $emojiObj['scope'] . "' is not allowed.",401);
        else if($emojiObj['scope'] == "GROUP"){
            if(!isset($emojiObj['GID']))
                throw new Exception("No GID found",402);

            $groupID=base64_decode($emojiObj['GID']);
            if(!is_member_of_group($userID,$groupID))
                throw new Exception("No GID found",402);
        }

        //? name validation
        $emojiObj['name']= strtolower($emojiObj['name']);
        if(preg_match('/\W+/',$emojiObj['name']))
            throw new Exception("Invalid name: only word allowed.",403);
        else if(strlen($emojiObj['name']) > 15)
            throw new Exception("Name size more thaen 15 is not allowed",404);
        $name= ":"+$emojiObj['name']+":";

        //? blob varification
        if($emojiObj['blob'])
        $blob = explode(',',$emojiObj['blob']);

        if( (explode('/',$blob[0]))[0] != "data:image" )
            throw new Exception("Not an image",405);

        $blob= $blob[1];
        
        $imgObj['tmp_name'] = $_COOKIE['imgDir'].time();
        if(file_put_contents($imgObj['tmp_name'] , base64_decode($blob)) == false)
            throw new Exception("File uploading error",406);
            
        $imgObj=compressImg($imgObj,100,['width'=>150,'height'=>150]);
        if(gettype($imgObj) == "integer")//error code return by compress image
            throw new Exception("something went wrong in compression",407); 
        
        $mime = $imgObj['type'];
        $blob = base64_encode(file_get_contents($imgObj['tmp_name']));

        $status= ($scope == "PUBLIC") ? "PENDING" : "UPLOADED";

            $result= insertData("emojis",['uploaderId','scope','groupID','name','blob_data','mime','status'],[$userID,$scope,$groupID,$name,$blob,$mime,$status]);

            if($result && $status === "PENDING"){
                $data=[
                    'action'=>'info',
                    'msg'=>['msg'=> "Your emoji has been uploaded for public use and is currently pending approval. An admin will review it, and we will notify you once a decision is made."],
                    'toID'=>$userID,
                ];
                add_new_noti($data);
            }
            if(!$result)
                throw new Exception("Something went wrong.");
            
            return $result;
        
    }catch(Exception $e){
        print_r($e);
        $error = [
            'error'=>true,
            'code'=> $e->getCode(),
            'message'=> $e->getMessage(),
        ];
        return json_encode($error);
    }
}
?>