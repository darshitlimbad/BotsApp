<?php
    session_start();
    if(isset($_SESSION['userID']) && isset($_GET['key_pass']) && $_GET['key_pass'] === "khulJaSimSim")  {
        include_once('db/_conn.php');
        include_once('lib/_validation.php');
        try{
            $data = json_decode(file_get_contents("php://input") , true);

            $req = $data['req'];
            $table = $data['table'];
            $edit_column = $data['edit_column'];

            // if the profile picture is requested to change
            if($req == 'updateDP') {
                include_once('lib/_insert_data.php');
                $imgObj['img_data'] = base64_decode($data['value']['img_data']);
                $imgObj['size'] = $data['value']['size'];

                $imgObj['tmp_name'] = tempnam(sys_get_temp_dir() , 'upImg');
                file_put_contents($imgObj['tmp_name'] , $imgObj['img_data']);
                $imgObj['img_data']=null;
                echo uploadImg(getDecryptedUserID() , $imgObj);
                exit();
            }

            if($req == 'user-name'){
            // if($edit_column == 'user-name'){
                $full_name = explode(" " , ucwords(trim($data['value'])));
                if(count($full_name) == 1){
                    $surname = null;
                    $name = $full_name[0];
                }else if(count($full_name) > 1){
                    $surname = $full_name[0];
                    $name = $full_name[1];
                    for($i = 2 ; $i < count($full_name) ; $i++){
                        $name.=" " . $full_name[$i];
                    }
                }else{
                    echo 0;
                    exit();
                }

                $edit_column = array("surname","name");
                $value = array($surname , $name);
            }else{
                $edit_column = array($edit_column);
                $value = array($data['value']);
            }

            $edit_req = updateData($table , $edit_column , $value , "userID" , getDecryptedUserID());
            
            echo $edit_req;
        }catch(Exception $e){
            echo 0;
        }
        
    }else{
        echo 0;
    }
?>