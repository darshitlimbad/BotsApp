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

    <script src="js/_admin.js" type="text/javascript"></script>
</head>
<body>

    <div class="center">
        <!-- admin-panel -->
        <main class="chat-box" name="admin-panel">
            <section class="category" name="account-section">
                <h1 class="category-title">Accounts Section :</h1>
                
                <div class="card-body">
                    <div class="card">
                        <img src="/img/icons/settings/account-64.png" alt="" class="icon">
                        <h3 class="card-title">Users Management</h3>
                    </div>
                </div>
                
            </section>
        </main>
    </div>  
</body>
</html>

<?php
}
?>