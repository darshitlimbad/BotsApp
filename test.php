<!-- test get_dp() here -->
<?php
    include 'functionality/lib/_fetch_data.php';
    $userID = "User0002";
    // $res= fetch_columns('users' , 'userID' , $userID , 'name' , 'surname')->fetch_assoc();
    // echo $res['surname'].$res['name'];

    echo fetch_data_from_users_details($userID , 'can_see_online_status');
?>
