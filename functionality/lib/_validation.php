<?php   
// this function matches the Encrypted passwords with password_hash bcrypt
function metchEncryptedPasswords($Pass , $userID){
    $result = fetch_columns(  "users" , 'userID' , $userID , 'pass');
    //echo $result->fetch_assoc()['pass'];
    if($result->num_rows == 1) {
        $pwd = $result->fetch_assoc()['pass'];
        
        if($pwd === $Pass){
            
            return 1;
            
        }else {
            throw new Exception("saved Password is wrong try log-in again." , 404);
        }
    }else{
        throw new Exception("No user Found from Indexed DB storage." , 404);
    }
}

// if there will be data the is_data_present will return 1 
function is_data_present($table , $point , $point_val , $column='userID'){
    $result = fetch_columns($table , $point , $point_val , $column);
    
    if($result->num_rows == 1){
        return 1;
    }else{
        return 0;
    }
}

function is_session_valid(){
    if(is_data_present('users' , 'userID' , $_SESSION['userID']) == 0)  {
        session_destroy();
        header('location: /user');
    }
}
?>