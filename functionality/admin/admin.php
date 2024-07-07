<?php
    if($data = json_decode( file_get_contents("php://input") , true)){
        session_start();
        if(isset($_SESSION['userID'])){
            require_once('../db/_conn.php');
            require_once('../lib/_validation.php');

            if(is_admin()){
                if($data['req'] === "getUsersList")
                    echo getUsersList($data['id']);
            }
        }else{
            session_abort();
            header('Location: /');
        }
        session_abort();
    }else{
        header('Location: /');
    }

    function getUsersList($startID=0){
        try{
            $SQL= "SELECT id,CONCAT(surname,' ',name) AS full_name,unm,email FROM `users` WHERE id > ? AND userID != 'Admin' ORDER BY id ASC LIMIT 25";
            $STMT= $GLOBALS['conn']->prepare($SQL); 
            $STMT->bind_param("s",$startID);
            $sqlFire=$STMT->execute();

            if(!$sqlFire)
                throw new Exception("Something Went wrong",400);

            $result=$STMT->get_result();
            $STMT->close();

            
            $usersList=[];
            
            for($i=0; $i < $result->num_rows ; $i++)
                $usersList[$i]=$result->fetch_assoc();

            return json_encode($usersList);
        }catch(Exception $e){
            $error = [
                'error'=>true,
                'code'=> $e->getCode(),
                'message'=> $e->getMessage(),
            ];
            return json_encode($error);
        }
    }
?>