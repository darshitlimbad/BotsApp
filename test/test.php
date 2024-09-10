<!-- <div>
    <input type="radio" value="PRIVATE" name="scope">cs
    <input type="radio" value="PUBLIC" name="scope">
</div> -->
<?php
// session_start();

// include_once('../functionality/db/_conn.php');
// include_once('../functionality/lib/_notification.php');
// include_once('../functionality/lib/_validation.php');
// include_once('../functionality/lib/_insert_data.php');
// include_once('../functionality/lib/_fetch_data.php');
// include_once('../functionality/lib/_data_delete.php');

// if(isset($_POST['sub'])){
//     $imgObj= $_FILES['input'];

//     $tmp_name=$_COOKIE['imgDir'].$imgObj['name'];
//     move_uploaded_file($imgObj['tmp_name'],$tmp_name);
//     $imgObj['tmp_name']=$tmp_name;

//     $updatedImgObj= compressImg($imgObj,$quality=100,['width'=>150,'height'=>150]);
//     // echo $updatedImgObj['tmp_name'];   
//     print_r($updatedImgObj);
// }

// $name='343_dsds4';


// echo preg_match("/\W+/",$name);
// $userID= getDecryptedUserID();
// $data=[
//     'action'=>'info',
//     'msg'=>['msg'=> "Your emoji has been uploaded for public use and is currently pending approval. An admin will review it, and we will notify you once a decision is made."],
//     'toID'=>$userID,
// ];
// add_new_noti($data);

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

// echo 0 ?? "hhi";

// function hehhh(){
//     return 'hello';
// }
// $list=[
//     (1==0) ?: ['msg'=>hehhh()],
// ];

// echo $list['msg'];
// print_r($list);

// $userID="Admin";
// $emojiID="10";
// echo is_data_present('emojis',['id','uploaderID'],[$emojiID,$userID],"id");

// print_r(search_columns("emojis","name",":du",'*')->fetch_all());
// $arr=[
//     'hel'=>"hello world",
// ];
// // $arr=['sdsdsd'];


// print_r(...$arr);

// $result= fetch_columns("emojis",[1],[1],['*'],"conn",['ORDER BY'=>"id ASC"]);

// echo json_encode($result->fetch_all()); 

// $data=['scope'=>"SELF&GROUP",'name'=>':','GID'=>'R3JvdXAwMDAwMDAwMg=='];
// // $data=['scope'=>"SELF",'name'=>':'];

// $emoji_user_id="User00000006";
// $emoji_user_id="Admin";

// $fetchedDataObj= fetch_columns("emojis",['name'],[':hehe:'],['*'],'conn',["AND ( (`scope` = 'PRIVATE' AND `uploaderID` = '$emoji_user_id') OR (`scope` = 'PUBLIC') )"]);

// print_r($fetchedDataObj->fetch_assoc());

// echo gen_new_id("msg");
// $data=[
//     'name'=>":worrymaybe:",
//     'emojiUser'=>"test#321",
//     'scope'=>"SELF",
// ];

// echo fetch_emoji($data);


// echo json_encode($_ENV);

// $array= [[3,43],[4,343],2,3,4,5,6,7,8,9,10];
// $arr2=[];
// foreach($array as $i){
//     if($i % 2 == 0){
//         $arr2[]=$i;
//     }
// }
// function filter($i){
//     if($i % 2 == 0){
//         echo $i."<br>";
//     }
// }

// array_map('filter',$array);

echo !extension_loaded("sodium");
// print_r($arr2);
// echo json_encode($array);
// echo json_encode($arr2);

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


niravthakar@hotmail.com
-> chat applicaiotion software
-> darshitlimbad