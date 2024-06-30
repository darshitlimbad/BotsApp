<?php
    session_start();
    if(isset($_SESSION['userID']) && isset($_GET['key_pass']) && $_GET['key_pass'] === "khulJaSimSim")  {
        require_once('db/_conn.php');
        require_once('lib/_validation.php');
        try{
            $data = json_decode(file_get_contents("php://input") , true);

            if(isset($data['req'])){
                $req = $data['req'];
                $edit_column = $data['edit_column'];
                // if the profile picture is requested to change
                if($req == 'updateDP') {
                    require_once('lib/_insert_data.php');
                    $imgObj['img_data'] = base64_decode($data['value']['img_data']);
                    $imgObj['size'] = $data['value']['size'];

                    $imgObj['tmp_name'] = tempnam(sys_get_temp_dir() , 'upImg');
                    file_put_contents($imgObj['tmp_name'] , $imgObj['img_data']);
                    $imgObj['img_data']=null;
                    echo uploadImg(getDecryptedUserID() , $imgObj);
                    
                    exit();
                }else if($req == 'user-name'){
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
                        return 0;
                    }

                    $table='users';
                    $edit_column = array("surname","name");
                    $value = array($surname , $name);
                }else{
                    $table='users_details';
                    $edit_column = array($edit_column);
                    $value = array($data['value']);
                }

                $edit_req = updateData($table , $edit_column , $value , 'userID', getDecryptedUserID());
                echo $edit_req;
            }
        }catch(Exception $e){
            return 0;
        }
        
    }else{
        return 0;
    }
    session_abort();
?>