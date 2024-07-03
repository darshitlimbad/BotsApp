<?php
    include_once("interface.php");
    define('IS_ADMIN',is_admin());
    if(!IS_ADMIN)
        echo "<script>window.location.assign('/');</script>";
    else{
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ADMIN -- BOTSAPP</title>
    <link rel="stylesheet" type="text/css" href="css/index.css">

    <script>
        document.querySelector(`div.options[data-action="admin-panel"]`)?.classList.add("selected")
    </script>
</head>
<body>

    <div class="center">
        <!-- chat-box -->
        <div class="chat-box">
            
        </div>
    </div>  
</body>
</html>

<?php
}
?>