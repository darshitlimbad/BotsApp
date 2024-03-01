<?php

    function get_dp($userID) {
        $fetch_img = fetch_columns( 'users_avatar' , "userID" , $userID , "type" , "img" );

        if($fetch_img != '400' && $fetch_img->num_rows == 1){
            $img=$fetch_img->fetch_assoc();
            $type = $img['type'];
            $data = base64_encode($img['img']);

            return "data:$type;base64,$data";
        }else{
            return 0;
        }  
    }

    function get_user_full_name($userID){
        $fetch_name = fetch_columns('users' , 'userID' , $userID , 'surname' , 'name');

        if($fetch_name != '400' && $fetch_name->num_rows == 1){
            $name = $fetch_name->fetch_assoc();
            $full_name = $name['surname']." ".$name['name'];
            return $full_name; 
        }else {
            return '';
        }
    }

    function fetch_data_from_users_details($userID , $column){
        $data = fetch_columns('users_details' , 'userID' , $userID , $column);

        if($data != '400' && $data->num_rows == 1){
            $data = $data->fetch_assoc()[$column];
            return $data; 
        }else {
            return '';
        }
    }

    function fetch_data_from_users($userID , $column){
        $data = fetch_columns('users' , 'userID' , $userID , $column);

        if($data != '400' && $data->num_rows == 1){
            $data = $data->fetch_assoc()[$column];
            return $data; 
        }else {
            return '';
        }
    }

    function getPassKey($userID) {
        $result = fetch_columns( "users" ,'userID' , $userID , 'pass_key');
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
?>