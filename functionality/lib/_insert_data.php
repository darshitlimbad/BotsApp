<?php
    require_once('_validation.php');
    if($data = json_decode( file_get_contents("php://input") , true)){
        session_start();
        if(isset($_SESSION['userID'])){
            require_once('../db/_conn.php');
            require_once('./_fetch_data.php');

            if($data['req'] === 'createNewGroup')
                echo createNewGroup($data);
            else if(($data['req'] === 'addMemberInGroup') &&
                    isset($data['member']) && 
                    isset($data['groupID']))    {
                $memberID= _get_userID_by_UNM($data['member']);
                if($memberID)
                    echo addMemberInGroup($data['groupID'],$memberID);
            }else{
                return 0;
            }
        }
        session_abort();
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
        $imgObj = compressImg($imgObj);
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

        foreach($memberList as $member){
            if($member === $unm)
                continue;           
            $memberID=_get_userID_by_UNM($member);
            if($memberID)
                $addMemRes= addMemberInGroup(base64_encode($newGroupID), $memberID);
        }

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
function addMemberInGroup(string $groupID=null,string $memberID){
    try{
        $userID= getDecryptedUserID();
        $groupID= base64_decode($groupID);

        if(!$groupID || !$memberID || !$userID)
            throw new Exception("Something went Wrong",400);

        if(!is_member_of_group($userID,$groupID))
            throw new Exception("Unauthorised Access Denied !!! ",410);
        else if(is_member_of_group($memberID,$groupID))
            throw new Exception("Member already exists",412);

        if(is_chat_exist($userID,$memberID) == 1){
            $res= insertData('inbox',['chatType','fromID','toID'],['group',$memberID,$groupID]);
            if(!$res)
                throw new Exception("Something went Wrong",400);
            
            //! add notification for member to notify he has been added in group by this unm
            //! add notification to reload chat if the member is on
            return 1;
        }else{
            return 0;
        }

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