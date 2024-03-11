<?php
    include_once('functionality/db/_conn.php');
    include_once('functionality/_auto_login.php');
    include_once('functionality/lib/_validation.php');

    if( !isset($_SESSION['userID']) ){
        header('location: /user');
        exit();
    }else{
        is_session_valid();

        include_once('functionality/lib/_wrappers.php');
        include_once('functionality/lib/_features.php');
        include_once('functionality/lib/_fetch_data.php');
        $userID = getDecryptedUserID();
        $unm = "@".fetch_data_from_users($userID , 'unm' );
        $nm  = get_user_full_name($userID); 
    }
?>

<!-- bots app -->
<!DOCTYPE html>
<html lang="en" >
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Style -->  
    <link rel="stylesheet" href="css/interface.css" type="text/css">
    <link rel="stylesheet" href="css/User/index.css" type="text/css">
    <!-- Script -->
    <script type="text/javascript" src="js/interface.js"></script>
    <script type="text/javascript" src="js/lib/_chat.js" ></script>
    <script type="text/javascript" src="js/_error_handling.js"></script>
    <script type="text/javascript" src="js/lib/_postReq.js"></script>
    <script type="text/javascript" src="js/lib/_validation.js"></script>
</head>
<body>
    <header>
            <?php custom_header();?>
        <div class="Status">
            <div class="status-icon"></div>
            <h4 style="text-transform: capitalize;">online</h4>
        </div>
    </header>
    <div class="side-bar">
        <div class="top">
            <!-- Personal -->
                    <!-- Yah yah I know i should have nammed icon rather then img  -->
            <div class="options" title="Personal" onclick="tohomepage()" >
                <div class="img">
                    <img src="img/icons/options/chat-30.png" alt="Chat" >
                </div>
                
            </div>
            
            <!-- group -->
            <div class="options" title="Groups" onclick="togroupchat()"> 
                <div class="img">
                    <img src="img/icons/options/group_chat-48.png" alt="Group">
                </div>
            </div>
        </div>
        
        <div class="bottom">
            <!-- Add New Chat -->
            <div class="options" title="addNewChat" onclick="_add_new_chat_form(); document.querySelector('input#username').focus()" accesskey="a">
                <div class="img">
                    <div style="font-size: 20px;"><b>+</b></div> 
                </div>
            </div>

            <!-- Notifications -->
            <div class="options" title="Noti" onclick="toggle_noti_box()" accesskey="n">
                <div class="img">
                    <img src="img/icons/options/noti.png"> 
                </div>
            </div>

            <!-- settings -->
            <div class="options" title="Settings" onclick="toggle_settings_box()" accesskey="s">
                <div class="img">
                    <img src="img/icons/options/setting-24.png"> 
                </div>
            </div>

            <!-- profile -->
            <div class="options profile"  title="Profile" onclick="toggle_settings_box()" accesskey="p">
                <div class="img">
                    <img src="/img/dp-moon.png"  onerror="defaultDp(this);"  class="avatar" title="<?= $unm?>" />
                </div>
            </div>

        </div>
    </div>
    
    <!-- Notification-box -->
    <div class="noti-box noti-box_hide">
    </div>

    <!-- settings-box -->
    <div class="settings-box settings-box_hide">
        <ul>
            <li class="" name="general">
                <div>
                    <img src="img/icons/settings/general-64.png" height="20px" width="20px" alt="" >
                </div>    
                <p>General</p>
            </li>
            <li class="" name="account">
                <div>
                    <img src="img/icons/settings/account-64.png" height="20px" width="20px" alt="" >
                </div>    
                <p>Account</p>
            </li>
            <li class="" name="chat">
                <div>
                    <img src="img/icons/settings/chat-64.png" height="20px" width="20px" alt="" >
                </div>    
                <p>Chat</p>
            </li>
            <li class="" name="help">
                <div>
                    <img src="img/icons/settings/help-64.png" height="20px" width="20px" alt="" >
                </div>    
                <p>Help</p>
            </li>
            <li class="" name="profile">
                <div>
                    <img src="img/icons/settings/profile-64.png" height="20px" width="20px" alt="" >
                </div>    
                <p>Profile</p>
            </li>
        </ul>

        <div class="settings-container">

            <div class="body" name="general-body"  style="display: none;">
                <div class="headding">General</div>
                
                
            </div>
        
            <div class="body" name="account-body" style="display: none;">
                <div class="headding">Account</div>

                <h4>Privacy</h4>
                <div class="flex checkbox" name="edit-can_see_online_status">
                    <input type="checkbox" name="can_see_online_status" id="can_see_online_status" onclick="_togle_user_data(this);" <?php if(fetch_data_from_users_details($userID , 'can_see_online_status') == '1') { echo 'checked';} ?>>
                    <label for="can_see_online_status">Everyone can see online status </label>
                </div>

                <!-- log-out -->
                <h4 class="danger">Log Out</h4>
                        <p>Log out from your account</p>
                <button class="danger-button button" onclick="_confirmation_pop_up('Log out', 'Are you sure.. You want to Log out?' , 'LogOut' , 'red');">Log Out</button>

                <!-- Delete Account -->
                <h4 class="danger">Delete Account</h4>
                    <p>Delete your account, Which means your all data in Botsapp will be no longer available , your all chats will be deleted.</p>
                <button class="danger-button button" onclick="_confirmation_pop_up('Delete Account', 'Are you sure ,You want to delete your account?' , 'DeleteAcount' , 'red');">Delete Account</button>
            </div>

            <div class="body" name="chat-body" style="display: none;">
                <div class="headding">Chat</div>

                <h4>Theme</h4>
                
                <div class="swipe-box">
                    <label for="theme">Dark</label>
                    <input type="checkbox" name="theme" id="theme" onclick="_togle_user_data(this);" <?php if(fetch_data_from_users_details($userID , 'theme') == '1') { echo 'checked';} ?> >
                    <label for="theme">Light</label>
                </div>

                <h4>Chat Wallpaper</h4>

                <a href="wallpaper.php?type=add_new" class="link">Change Wallpaper</a>

                <br><br>

                <a href="wallpaper.php?type=set_default" class="link">Set Default BotsApp Wallpaper</a>

            </div>

            <div class="body" name="help-body" style="display: none;">
                <div class="headding">Feedback</div>
                <p>So how is your experience using BotsApp web-app?</p>
                <p>Better then our competitor right?</p>
                <p>share your thoughts...</p>  
                <a href="help/ux.php?form=feedback" target="_blank" class="link">Feedback Here</a>
            
                <br><br>

                <div class="headding">Found any bugs?</div>
                <p>If you recently noticed any bug or mistacks by me please share it here,</p>
                <p>It will be very helpfull for me</p>
                <p>Thanks for helping :&#41</p>
                <a href="help/ux.php?form=bugs" target="_blank" class="link">Bugs Report</a>
            </div>

            <!-- Profile Body -->
            <div class="body" name="profile-body" style="display: none;">
                <div class="headding">Profile</div>
                <div class="profile-dp">
                    <img src="/img/dp-moon.png" onerror="defaultDp(this);" title="<?= $nm?>" class="avatar">
                </div>
                    <img src="img/icons/settings/profile/edit_img.png" class="edit_img" title="Edit Profile Picture" onclick="_upload_img_form('Upload Your new Profile picture' , `${window.location.origin}/functionality/_user_edit.php?key_pass=khulJaSimSim`);"/>
                <br>
                
                <div class="text"><?= $unm?></div>

                <p class="margin-dead">Name:</p>
                <div class="flex edit_box" name="edit-user-name">
                <input type="text" name="user-name" class="text" style="font-size: 15px;" placeholder="Enter User Name" minlength="5" maxlength="30" onkeydown="_submit_data(event)" value="<?= $nm; ?>" readonly /> 
                    <img name="edit-icon" class="edit-icon" src="img/icons/settings/profile/edit.png" title="edit"/>  
                </div>
                
                <p class="margin-dead">About:</p>
                <div class="flex edit_box" name="edit-about" style="margin:30px 0">
                    <textarea name="about" class="text" style="font-size: 13px;min-height: 65px; max-height: 65px; height:65px;" maxlength="30" onkeydown="_submit_data(event)" placeholder="Enter About Yourself" readonly><?= fetch_data_from_users_details($userID , 'about');?></textarea>
                    <img name="edit-icon" class="edit-icon" src="img/icons/settings/profile/edit.png" title="edit" /> 
                </div>

                <p class="margin-dead">E-mail:</p>
                <div class="text"><?= fetch_data_from_users($userID , 'email' );?></div>
            </div>
        </div>
    </div>
</body>
</html>