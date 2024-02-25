<!-- test get_dp() here -->
<?php
    // include 'functionality/lib/_fetch_data.php';
    // $userID = "User0002";
    // $res= fetch_columns('users' , 'userID' , $userID , 'name' , 'surname')->fetch_assoc();
    // echo $res['surname'].$res['name'];

    // echo fetch_data_from_users_details($userID , 'can_see_online_status');
    echo password_verify("Kali@123" , "$2y$10$ybLXZJqNlaARY8SFl0TqROcnSjZYnEI0oKncXnqtnt7rFNuNf7tOK") ? : "null";
?>
