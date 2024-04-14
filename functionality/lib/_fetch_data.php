<?php
    if($data = json_decode(file_get_contents("php://input") , true) ){
        if(isset($data['action'])){
            include '../db/_conn.php';
            if($data['action'] == "get_dp"){
                echo get_dp( null,$data['unm']);
            }
            if($data['action'] == "get_unm"){
                echo search_user($data['from'] , $data['value']);
            }
        }
    }

    function _get_userID_by_UNM($unm){
        $fetchUID = fetch_columns('users_account', "unm", $unm, "userID");
        return $fetchUID->fetch_column();
    }

    function _fetch_unm($userID=null){
        if($userID == null)
            $userID = getDecryptedUserID();

        $res = fetch_columns("users_account", "userID", $userID, "unm");
        
        if($res->num_rows == 1){
            $unm = $res->fetch_column();
            return $unm;
        }else{
            return "USER_NOT_FOUND";
        }
    }

    function _fetch_email($userID = null){
        if($userID == null)
            $userID = getDecryptedUserID();

        $res = fetch_columns("users", "userID", $userID, "email");
        
        if($res->num_rows == 1){
            $email = $res->fetch_column();
            return $email;
        }else{
            return "EMAIL_NOT_FOUND";
        }
    }

    function get_dp($userID,$unm=null) {
        if($unm){
            $userID = _get_userID_by_UNM($unm);
        }
        
        $fetch_img = fetch_columns( 'users_avatar' , "userID" , $userID , "type" , "imgData" );

        if($fetch_img != '400' && $fetch_img->num_rows == 1){
            $img=$fetch_img->fetch_assoc();
            $type = $img['type'];
            $data = base64_encode($img['imgData']);

            return json_encode("data:$type;base64,$data");
        }else{
            return 0;
        }  
    }

    function get_user_full_name($unm){
        try{
            $userID = _get_userID_by_UNM($unm);

            $fetch_name = fetch_columns('users' , 'userID' , $userID , 'surname' , 'name');

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

    function search_user($from , $value) {
        try{
            if($from == "add_new_chat")
                $result = search_columns("users_account" , "unm" , $value , "userID" , "unm");
            else   
                throw new Exception();
    
                if($result !== 0 ){
                    $i=0;
                    while($row = $result->fetch_assoc()){
                        $row['dp'] = json_decode(get_dp($row['userID']));

                        $rows[$i]['dp'] = $row['dp'];
                        $rows[$i]['unm'] = $row['unm'];

                        $i++;
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