<?php
session_start();

include_once('../functionality/db/_conn.php');
include_once('../functionality/lib/_notification.php');
include_once('../functionality/lib/_validation.php');
include_once('../functionality/lib/_insert_data.php');
include_once('../functionality/lib/_fetch_data.php');

    // $result=search_columns("users_account" , "unm" , "dar" , "unm");
    // $res;
    // $i=10;
    
    $data=[
        'name'=>'fdd',
        'memberList'=>json_encode(['scott@123','darshitlimbad','user123','darshi123']),
    ];

   echo createNewGroup($data) ;
//    echo !(-1    );
    // print_r($result->fetch_all(true));
// print_r($res->fetch_assoc()) ;
?>