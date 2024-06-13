<?php

include "../functionality/db/_conn.php";
    // $userID = 
    $sqlObj = fetch_columns("groups", ["groupID"], ['Group00000001'], array("groupAdminID","about"));;

    echo $sqlObj->fetch_assoc();
    echo $sqlObj->fetch_column();
?>