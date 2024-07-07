<?php
    require_once('functionality/db/_conn.php');
    require_once('functionality/_auto_login.php');
    require_once('functionality/lib/_validation.php');

    if( !isset($_SESSION['userID']) ){
        header('location: /user');
        exit();
    }else{
        session_check();
        $isAdmin= is_admin();
        require_once('functionality/lib/_wrappers.php');
        require_once('functionality/lib/_fetch_data.php');
        require_once('functionality/lib/_wrappers.php');
        require_once('functionality/lib/_fetch_data.php');

        $userID = getDecryptedUserID();
        $unm = "@"._fetch_unm();
        $nm  = get_user_full_name(substr($unm , 1)); 
        $gender= _fetch_gender();
        $email = _fetch_email();
        
        setcookie("unm" , substr($unm, 1) , time()+(24*60*60*1000), "/");
    }
?>

<!-- bots app -->
<!DOCTYPE html>
<html lang="en" >
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Style -->  
    <link rel="stylesheet" href="/css/interface.css" type="text/css">
    
    <!-- Script -->
    <script type="text/javascript" src="/js/interface.js"></script>
    <script type="text/javascript" src="/js/lib/_chat.js" ></script>
    <script type="text/javascript" src="/js/lib/_notify.js" ></script>
    <script type="text/javascript" src="/js/_error_handling.js"></script>
    <script type="text/javascript" src="/js/lib/_postReq.js"></script>
    <script type="text/javascript" src="/js/lib/_dataRequests.js"></script>
    <script type="text/javascript" src="/js/lib/_validation.js"></script>
</head>
<body class="main">
    <header>
            <?php custom_header($isAdmin);?>
        <span class="status red">
            <span class="status-icon"></span>
        </span>
    </header>
    <div class="side-bar">
        <div class="top">
            <!-- Personal -->
            <div class="options" title="Personal" data-action="personal">
                <div class="img ">
                    <img src="/img/icons/options/chat-30.png" alt="Personal-Chat-Img" >
                </div>
                
            </div>
            
            <!-- group -->
            <div class="options" title="Group" data-action="group"> 
                <div class="img">
                    <img src="/img/icons/options/group_chat.svg" alt="Group-Chat-Img">
                </div>
            </div>

            <?php
            if($isAdmin){
            ?>
                <!-- group -->
                <div class="options" title="Admin Panel" data-action="admin-panel"> 
                    <div class="img">
                        <img src="/img/icons/options/admin-icon.svg" alt="admin-panel-Img">
                    </div>
                </div>
            <?php
            }
            ?>
        </div>
        
        <div class="bottom">

            <!-- Add New Chat -->
            <div class="options" title="addNewChat" data-action="add-new-chat" accesskey="a">
                <div class="img">
                    <div style="font-size: 20px;"><b>+</b></div> 
                </div>
            </div>

            <!-- Notifications -->
            <div class="options" title="Noti" data-action="noti" accesskey="n">
                <div class="img">
                    <img src="/img/icons/options/noti.png" alt="New-notification-img"> 
                </div>
            </div>

            <!-- settings -->
            <div class="options" title="Settings" data-action="settings" accesskey="s">
                <div class="img">
                    <img src="/img/icons/options/setting-24.png" alt="settings-img"> 
                </div>
            </div>

            <!-- profile -->
            <div class="options profile"  title="Profile" data-action="settings" accesskey="p">
                <div class="img">
                    <img src="/img/dp-moon.png" class="avatar" title="<?= $unm?>" />
                </div>
            </div>

        </div>
    </div>
    
    <!-- Notification-box -->
    <div class="noti-box noti-box_hide">
        <div class="title"> Notification</div>
        <div class="conteiner">  
        </div>
    </div>

    <!-- settings-box -->
    <div class="settings-box settings-box_hide">
        <ul>
            <li class="" name="general">
                <div>
                    <img src="/img/icons/settings/general-64.png" height="20px" width="20px" alt="settings-general-img" >
                </div>    
                <p>General</p>
            </li>
            <li class="" name="account">
                <div>
                    <img src="/img/icons/settings/account-64.png" height="20px" width="20px" alt="settings-account-img" >
                </div>    
                <p>Account</p>
            </li>
            <li class="" name="chat">
                <div>
                    <img src="/img/icons/settings/chat-64.png" height="20px" width="20px" alt="settings-chat-img" >
                </div>    
                <p>Chat</p>
            </li>
            <li class="" name="help">
                <div>
                    <img src="/img/icons/settings/help-64.png" height="20px" width="20px" alt="settings-help-img" >
                </div>    
                <p>Help</p>
            </li>
            <li class="" name="profile">
                <div>
                    <img src="/img/icons/settings/profile.svg" height="20px" width="20px" alt="settings-profile-icon" >
                </div>    
                <p>Profile</p>
            </li>
        </ul>

        <div class="settings-container">

            <div class="body" name="general-body"  style="display: none;">
                <div class="heading">General</div>
                <!-- log-out -->
                <h4 class="danger   ">Blocked Accounts</h4>
                
                <p>The accounts you Blocked can be seen here.</p>
                <p style="font-size:12px;"> <span class="red"> Note: </span> Please do remember that chatters block by you or them will not be able to direct contect you or message you but if you are in a group with him/her/them than they can message you from the same groups, so leave the groups immediately.</p>

                <button class="danger-button button" name="blocked-list-open-btn" style="font-size:10px;">Check Blocked List</button>
            </div>
        
            <div class="body" name="account-body" style="display: none;">
                <div class="heading">Account</div>
                <h4>Privacy</h4>
                <div class="checkbox" name="edit-can_see_online_status">
                    <input type="checkbox" name="can_see_online_status" id="can_see_online_status" onclick="_togle_user_data(this);" <?php if(fetch_data_from_users_details($userID , 'can_see_online_status') == '1') { echo 'checked';} ?>>
                    <label for="can_see_online_status">Everyone can see online status </label>
                </div>

                <!-- log-out -->
                <h4 class="danger">Log Out</h4>
                        <p>Log out from your account</p>
                <button class="danger-button button " name="log-out">Log Out</button>

                <!-- Delete Account -->
                <h4 class="danger">Delete Account</h4>
                    <p>Delete your account, Which means your all data in Botsapp will be no longer available , your all chats will be deleted.</p>
                <button class="danger-button button" name="Delete-Account">Delete Account</button>
            </div>

            <!-- Chat-body -->
            <div class="body" name="chat-body" style="display: none;">
                <div class="heading">Chat</div>

                <h4>Theme</h4>
                
                <div class="swipe-btn">
                    <label for="theme">Dark</label>
                    <input type="checkbox" name="theme" id="theme" onclick="_togle_user_data(this);">
                    <label for="theme">Light</label>
                </div>

                <h4>Chat Wallpaper</h4>

                <a href="wallpaper.php?type=add_new" class="link">Change Wallpaper</a>

                <br><br>

                <a href="wallpaper.php?type=set_default" class="link">Set Default BotsApp Wallpaper</a>
                
                <br><br>

                <a href="wallpaper.php?type=remove" class="link">Remove Wallpaper</a>

            </div>

            <!-- Help-body -->
            <div class="body" name="help-body" style="display: none;">

                <div class="heading">New Chatter ?</div>
                <p>Are you new user? Don't know what do ?</p>
                <p>Don't worry just visit our information page  </p>
                <a href="/help/info.php" class="link">More Info</a>
            
                <br><br>

                <div class="heading">Feedback</div>
                <p>So how is your experience using BotsApp web-app?</p>
                <p>Better then our competitor right?</p>
                <p>share your thoughts...</p>  
                <a href="/help/ux.php?form=feedback" class="link">Feedback Here</a>
            
                <br><br>

                <div class="heading">Found any bugs?</div>
                <p>If you recently noticed any bug or mistacks by me please share it here,</p>
                <p>It will be very helpfull for me</p>
                <a href="/help/ux.php?form=bugs" class="link">Bugs Report</a>
            </div>

            <!-- Profile Body -->
            <div class="body" name="profile-body" style="display: none;">
                <div class="heading">Profile</div>
                <div class="profile-dp">
                    <img src="/img/dp-moon.png" onerror="defaultDp(this);" title="<?= $nm?>" class="avatar">
                </div>
                    <img src="/img/icons/settings/profile/edit_img.png" class="edit_img ele" title="Edit Profile Picture" onclick="toggle_img_upload_form('upload_new_dp')"/>
                <br>
                
                <div class="text"><?= $unm?></div>

                <p class="margin-dead">Name:</p>
                <div class="grid edit_box" name="edit-user-name">
                <input type="text" name="user-name" class="text" style="font-size: 15px;" placeholder="Enter User Name" minlength="5" maxlength="30" onkeydown="_submit_data(event)" value="<?= $nm; ?>" readonly /> 
                    <img name="edit-icon" class="edit-icon ele" src="/img/icons/settings/profile/edit.png" title="edit"/>  
                </div>
                
                <p class="margin-dead">About:</p>
                <div class="grid edit_box" name="edit-about" style="margin:30px 0">
                    <textarea name="about" class="text" maxlength="100" onkeydown="_submit_data(event)" placeholder="Enter About Yourself" data-oldValue='<?= fetch_data_from_users_details($userID , 'about');?>' readonly><?= fetch_data_from_users_details($userID , 'about');?></textarea>
                    <img name="edit-icon" class="edit-icon ele" src="/img/icons/settings/profile/edit.png" title="edit" /> 
                </div>

                <p class="margin-dead">Gender:</p>
                <div class="grid edit_box" name="edit-gender">
                <input type="text" name="gender" class="text" style="font-size: 15px;text-transofrm:capitalize;" placeholder="Enter Your Gender" maxlength="30" onkeydown="_submit_data(event)" value="<?= $gender; ?>" readonly /> 
                    <img name="edit-icon" class="edit-icon ele" src="/img/icons/settings/profile/edit.png" title="edit"/>  
                </div>

                <p class="margin-dead">E-mail:</p>
                <div class="text"><?= $email?></div>
            </div>
        </div>
    </div>

</body>

<?php require_once('functionality/lib/_features.php'); ?>
</html>
