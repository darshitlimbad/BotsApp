<?php

include "../functionality/db/_conn.php";
$GID='R3JvdXAwMDAwMDAwMQ==';
$ID = base64_decode($GID);
            
$fetch_img = fetch_columns( 'groups' , ["groupID"] , [$ID] , array("dp as imgData"));
echo $fetch_img->num_rows;
?>