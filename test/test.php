<?php
 include_once('../functionality/db/_conn.php');

   $res = fetch_columns('users_account', "unm", "darshitlimbad", array("userID"));

   echo $res->num_rows==0;
?>
