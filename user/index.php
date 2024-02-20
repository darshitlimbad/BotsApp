<?php
    include '../functionality/_auto_login.php';
    include '../functionality/lib/_features.php';
    
    if(isset($_SESSION['userID'])){
        header('location: /');
        exit();
      }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>User</title>

    <link rel="stylesheet" href="css/index.css" type="text/css">
    <link rel="stylesheet" href="../css/interface.css" type="text/css">
    <script type="text/javascript" src="js/index.js"></script>
    <script type="text/javascript" src="../js/interface.js"></script>
    <script type="text/javascript" src="../js/_error_handling.js"></script>
</head>
<body onload="document.forms['form']['user'].focus()">
    <!-- create a div and size it acording to the display (desktop,mobile) -->
    <header style="background-color: rgb(5, 33, 60) ;">
        <?php custom_header();?>
    </header>

    <div class="square-container"> 
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span>
        <span class="square"></span><span class="square"></span><span class="square"></span>
    </div>

    <div class="box">
        <div class="heading">
            <h1 class="fadeout">Log-in</h1>
        </div>

        <form action="/functionality/_user.php?action=log-in" method="post" id="form" name="log-in" enctype="multipart/form-data" onsubmit="return check_all_fields()">

            <!-- avatar -->
            <div class="input_field validation fadeout toggle_field hide" name="avatar_field">
               <div class="input-img">
                    <lable for="avatar">Profile picture :</lable>
                    <input type="file" name="avatar" id="avatar" accept=".jpg, .jpeg, .png, .webp" onchange="avatar_validation()">
               </div>
               <span id="avatar_span">Only [ .jpg, .jpeg, .png, .webp ] format is allowed</span>
            </div>

            <!-- user -->
            <div class="input_field validation fadeout" name="user_field">
                <div class="input">
                    <input type="text" id="user" name="user" placeholder=" " autocomplete="off"/>
                    <label for="user">Username / E-mail</label>
                </div>  
                <span id="user_span" ></span>
            </div>
            
            <!-- Name -->
            <div class="input_field fadeout name_field toggle_field hide" name="name_field" >
                <div class="input">
                    <input type="text" id="surname" name="surname" placeholder=" " autocomplete="off" />
                    <label for="surname">Surname</label>
                </div>
                <div class="input">
                    <input type="text" id="name" name="name" placeholder=" " autocomplete="off"/>
                    <label for="name">Name</label>
                </div>
            </div>

            <!-- e-mail -->
            <div class="input_field validation fadeout toggle_field hide" name="e-mail_field">
                <div class="input">
                    <input type="text" id="e-mail" name="e-mail" placeholder=" " autocomplete="off" onkeyup="email_validation()"/>
                    <label for="e-mail">E-mail</label>
                </div>
                <span id="e-mail_span" ></span>
            </div>
            
            <!-- password -->
            <div class="input_field validation fadeout" name="pass_field">  
                <div class="input">
                    <div style="height:0px">
                        <img src="/img/icons/form/eye.png" name="eye" height="20px" width="20px" onclick="toggle_pass_box(this)"> 
                    </div>
                    <input type="password" id="pass" name="pass" placeholder=" " autocomplete="off"/>
                    <label for="pass">Password</label>
                </div>
                
                <div id="pass_rules">
                    <p>Password Rules :</p>
                    <span name="1">password can't be emety.</span>
                    <span name="2">password should have min 8 charecters</span>
                    <span name="3">all cherecters of password can't be same.</span>
                    <span name="4">password should have uper &lower case cherecters,<br>symbols( @#$% ) , digit(0-9).</span>
                </div>
            </div>
            
            <!-- con_pass -->
            <div class="input_field validation fadeout toggle_field hide" name="con_pass_field">  
                 <div class="input">
                    <div style="height:0px">
                        <!-- url change when uploading -->
                        <img src="/img/icons/form/eye.png" name="eye" class="con_eye" height="20px" width="20px" onclick="toggle_pass_box(this)"> 
                    </div>
                    <input type="password" id="con_pass" name="con_pass" placeholder=" " autocomplete="off" onkeyup="con_pass_validation()"/>
                    <label for="con_pass">Confirm Password</label>
                </div>
                <span id="con_pass_span"></span>
            </div>
            
            <!-- Save Log-in information -->
            <div class="rememberMe_div fadeout" name="rememberMe_div">
                <input type="checkbox" id="rememberMe" name="rememberMe">
                <label for="rememberMe">Remember me</label>
            </div>

            <!-- buttons -->
            <div class="input_field fadeout" name="button_field">
                <div class="button-div submit fadeout">
                    <input type="submit" name="submit" value="Log in" spellcheck="false" class="button" disabled/>
                </div>
                <div class="button-div change fadeout">
                    <input type="button" name="change" value="Register" onclick="form.reset()" class="button" disabled />        
                </div>
            </div>
            
        </form>
        
        <footer>
            <?php custom_footer();?>
        </footer>
        
    </div>

</body>
</html>