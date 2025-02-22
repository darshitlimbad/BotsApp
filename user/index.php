<?php
if(!extension_loaded("sodium")){
    echo "SODIUM Extention is not loaded.";
    exit();
}

include_once('../functionality/_auto_login.php');

if (isset($_SESSION['userID'])) {
    header('location: /');
    exit();
} else {
    include_once('../functionality/lib/_wrappers.php');
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>User</title>

    <link rel="stylesheet" href="../css/User/index.css" type="text/css">
    <link rel="stylesheet" href="../css/interface.css" type="text/css">
    
    <script type="text/javascript" src="../js/lib/_validation.js"></script>
    <script type="text/javascript" src="../js/_error_handling.js"></script>
    <script type="text/javascript" src="../js/lib/_notify.js"></script>
    <script type="text/javascript" src="../js/User/index.js"></script>
    
    <!-- google Recaptcha -->
    <script src="https://www.google.com/recaptcha/api.js?render=6LdWOSEqAAAAAIO6YwlHIZdbVmFcGotoEredZwHd"></script>
</head>

<body onload="document.forms['form']['user'].focus()" class="User">

    <header style="background-color: rgb(2, 2, 55) ;">
        <?php custom_header(); ?>
    </header>

    <div class="square-container">
        <span class="square"></span>
        <script>
            var sq_con = document.querySelector(".square-container");
            var sq = document.querySelector(".square");
            var sq_row = Math.ceil(screen.height / sq.clientHeight);
            var sq_column = Math.ceil(screen.width / sq.clientWidth);

            for (var i = 1; i <= sq_row / 2; i++)
                for (var j = 1; j <= sq_column; j++)
                    sq_con.innerHTML += `<span class="square"></span>`;
        </script>
    </div>
    <div class="center">
        <div class="box">
            <div class="heading">
                <h1 class="fadeout">Log-in</h1>
            </div>

            <form action="/functionality/_user.php?passkey=khuljasimsim&action=log-in" method="post" id="form" name="log-in" enctype="multipart/form-data">

                <!-- avatar -->
                <div class="input_field validation fadeout toggle_field hide" name="avatar_field">
                    <div class="input-img avatar_block">
                        <img src="../img/default_dp.png" alt="" class="avatar avatar_preview">
                        <input type="file" name="avatar" id="avatar" accept=".jpg, .jpeg, .png, .webp">
                    </div>
                    <span id="avatar_span"></span>
                </div>

                <!-- user -->
                <div class="input_field validation fadeout" name="user_field">
                    <div class="input">
                        <input type="text" id="user" name="user" placeholder=" " autocomplete="off" />
                        <label for="user">Username / E-mail</label>
                    </div>
                    <span id="user_span"></span>
                </div>

                <!-- Name -->
                <div class="input_field fadeout name_field toggle_field hide" name="name_field">
                    <div class="input">
                        <input type="text" id="surname" name="surname" placeholder=" " autocomplete="off" />
                        <label for="surname">Surname</label>
                    </div>
                    <div class="input">
                        <input type="text" id="name" name="name" placeholder=" " autocomplete="off" />
                        <label for="name">Name</label>
                    </div>
                </div>

                <!-- e-mail -->
                <div class="input_field validation fadeout toggle_field hide" name="e-mail_field">
                    <div class="input">
                        <input type="text" id="e-mail" name="e-mail" placeholder=" " autocomplete="off" />
                        <label for="e-mail">E-mail</label>
                    </div>
                    <span id="e-mail_span"></span>
                </div>

                <!-- password -->
                <div class="input_field validation fadeout" name="pass_field">
                    <div class="input">
                        <img src="/img/icons/form/eye.png" name="eye" height="20px" width="20px" style="cursor:pointer" onclick="toggle_pass_box(this)">
                        <input type="password" id="pass" name="pass" placeholder=" " autocomplete="off" />
                        <label for="pass">Password</label>
                    </div>

                    <div id="pass_rules">
                        <p>Password Rules :</p>
                        <span name="1">1: password can't be emety.</span>
                        <span name="2">2: password should have min 8 charecters</span>
                        <span name="3">3: all cherecters of password can't be same.</span>
                        <span name="4">4: password should have uper &lower case cherecters,<br>symbols( @#$% ) , digit(0-9).</span>
                    </div>
                </div>

                <!-- con_pass -->
                <div class="input_field validation fadeout toggle_field hide" name="con_pass_field">
                    <div class="input">
                        <img src="/img/icons/form/eye.png" name="eye" class="con_eye" height="20px" width="20px" style="cursor:pointer" onclick="toggle_pass_box(this)">
                        <input type="password" id="con_pass" name="con_pass" placeholder=" " autocomplete="off" />
                        <label for="con_pass">Confirm Password</label>
                    </div>
                    <span id="con_pass_span"></span>
                </div>

                <!-- Remember me -->
                <div class="rememberMe_div fadeout" name="rememberMe_div">
                    <input type="checkbox" id="rememberMe" name="rememberMe">
                    <label for="rememberMe">Remember me</label>
                </div>

                <!-- buttons -->
                <div class="input_field fadeout" name="button_field">
                    <div class="button-div submit fadeout">
                        <input type="submit" name="submit_btn" value="Log in" class="button" />
                    </div>

                    <div class="button-div change fadeout">
                        <input type="button" name="change" value="Register" class="button" disabled />
                    </div>
                </div>

            </form>

            <footer>
                <?php custom_footer(); ?>
            </footer>

        </div>
    </div>
</body>

</html>