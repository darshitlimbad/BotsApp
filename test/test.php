<?php
session_start();

include_once('../functionality/db/_conn.php');
// include_once('../functionality/lib/_notification.php');
// include_once('../functionality/lib/_validation.php');
// include_once('../functionality/lib/_insert_data.php');
// include_once('../functionality/lib/_fetch_data.php');
// include_once('../functionality/lib/_data_delete.php');

//     // $result=search_columns("users_account" , "unm" , "dar" , "unm");
    // $res;
    // $i=10;
    
    // $data=[
    //     'name'=>'fdd',
    //     'memberList'=>json_encode(['scott@123','darshitlimbad','user123','darshi123']),
    // ];

    // $groupID= 'Group00000003';
    // $groupMembers= fetch_all_group_members($groupID,true);
    // $gName= _fetch_group_nm($groupID);
    // foreach($groupMembers as $memberID){
    //     $data=[
    //         "action" => "groupRemovedMember",
    //         "toID" => $memberID,
    //         'msg' => ['gName'=>$gName]
    //     ];
    //     add_new_noti($data);
    // }

    // echo removeMember("darshitlimbad");

    // $unmList= ['darshitlimbad','darshi123','hello'];
    //             if(count($unmList)){

    //                 $memberIDs = array_filter(array_map(function ($unm,$unmList){
    //                     print_r($unmList);
    //                                 $id= _get_userID_by_UNM($unm);
    //                                 if($id)
    //                                     return $id;
    //                             },$unmList));
    //                 print_r($memberIDs);
    //             }

    // $test="INSERT INTO `inbox` (`id`, `chatType`, `fromID`, `toID`) VALUES (NULL, 'personal', 'User00000001', 'User00000001')";
    // $res= $GLOBALS['conn']->query($test);
    // echo $res;

    // echo fetch_total_group_member_count("Group00000010");

    // echo PHP_EXTENSION_DIR;
    // PHP
//    echo !(-1    );
    // print_r($result->fetch_all(true));
// print_r($res->fetch_assoc()) ;

// echo _fetch_gender();
// $userID=getDecryptedUserID();
// $fetchedDataObj= fetch_columns('blocked',['fromID'],[$userID],array('toID'),'status');

// // print_r( array $fetchedDataObj->fetch_all());

// $blockedChatterList= array_map(function (array $memberID){
//                                     return _fetch_unm($memberID[0]);
//                                 },$fetchedDataObj->fetch_all());

// print_r($blockedChatterList);
// echo is_admin();
// echo create_admin("scott@123");
// $startID=34;
// $SQL= "SELECT id,CONCAT(surname,' ',name) AS full_name,unm,email FROM `users` WHERE id > ? ORDER BY id ASC LIMIT 25";
// $STMT= $GLOBALS['conn']->prepare($SQL); 
// $STMT->bind_param("s",$startID);
// $sqlFire=$STMT->execute();

// if(!$sqlFire)
//     throw new Exception("Something Went wrong",400);

// $result=$STMT->get_result();
// $STMT->close();

// return json_encode($result->fetch_all());

// echo "sdsds" && echo "hello";

echo 0 ?? "hhi";
?>

<!-- 
<script>
    function at(){
        return (`
            <nav>
                <div>hello world</div>
            </nav>`
        );
    }

    // adocument.appendchild(at());
    at();
</script> -->