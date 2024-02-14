<?php
session_start();

if(isset($_SESSION['userID'])) {
    //echo "hello world";
}else{
    //echo "<script>alert('hi')</script>";
}
?>