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
    <link rel="stylesheet" type="text/css" href="css/_admin.css">

    <script type="text/javascript" src="js/admin/_admin.js" ></script>
    <script type="text/javascript" src="js/admin/classes.js" ></script>
    <script type="text/javascript" src="js/admin/_dataRequest.js" ></script>
    <script type="text/javascript" src="js/lib/_classes.js" ></script>
</head>

<body id="admin-page-body">

    <div class="center">
        <!-- admin-panel -->
        <main class="chat-box" name="admin-panel">
        </main>
    </div>  

</body>
</html>

<?php
}
?>