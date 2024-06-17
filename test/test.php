<?php
session_start();

include_once('../functionality/db/_conn.php');
include_once('../functionality/lib/_notification.php');
include_once('../functionality/lib/_validation.php');

    echo is_group_admin('User00000002', 'Group00000001');

// print_r($res->fetch_assoc()) ;
?>