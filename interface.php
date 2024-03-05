<?php
    include_once('functionality/db/_conn.php');
    include 'functionality/_auto_login.php';
    include 'functionality/lib/_validation.php';

print_r($_SESSION);

    if( !isset($_SESSION['userID']) ){
        header('location: /user');
        exit();
    }else{
        is_session_valid();

        include_once('functionality/lib/_wrappers.php');
        include_once('functionality/lib/_features.php');
        include_once('functionality/lib/_fetch_data.php');
        $unm = "@".fetch_data_from_users(getDecryptedUserID() , 'unm' );
        $nm  = get_user_full_name(getDecryptedUserID()); 
        ?>
        <script>
            document.addEventListener('DOMContentLoaded' , ()=> {
                set_profile_dp("<?= getDecryptedUserID(); ?>");
            });
        </script>
        <?php
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
    <!-- Script -->
    <script type="text/javascript" src="js/interface.js"></script>
    <script type="text/javascript" src="js/_error_handling.js"></script>
    <script type="text/javascript" src="js/lib/_postReq.js"></script>
    <script type="text/javascript" src="js/lib/_validation.js"></script>
</head>
<body>
    <header>
        <?php custom_header();?>
    </header>
    <div class="side-bar">
        <div class="top">
            <!-- Personal -->
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
                    <input type="checkbox" name="can_see_online_status" id="can_see_online_status" onclick="_togle_user_data(this);" <?php if(fetch_data_from_users_details(getDecryptedUserID() , 'can_see_online_status') == '1') { echo 'checked';} ?>>
                    <label for="can_see_online_status">Everyone can see online status </label>
                </div>

                <!-- log-out -->
                <h4 class="danger">Log Out</h4>
                        <p>Log out from your account</p>
                <button class="danger-button button" onclick="_confirmation_pop_up('Log out', 'Are you sure.. You want to Log out?' , '/functionality/_log_out.php?key_pass=khulJaSimSim' , 'red');">Log Out</button>

                <!-- Delete Account -->
                <h4 class="danger">Delete Account</h4>
                    <p>Delete your account, Which means your all data in Botsapp will be no longer available , your all chats will be deleted.</p>
                <button class="danger-button button" onclick="_confirmation_pop_up('Delete Account', 'Are you sure ,You want to delete your account?' , '/functionality/_delete_account.php?key_pass=khulJaSimSim' , 'red');">Delete Account</button>
            </div>

            <div class="body" name="chat-body" style="display: none;">
                <div class="headding">Chat</div>

                <h3>Theme</h3>
                
                <div class="swipe-box">
                    <label for="theme">Dark</label>
                    <input type="checkbox" name="theme" id="theme" onclick="_togle_user_data(this);" <?php if(fetch_data_from_users_details(getDecryptedUserID() , 'theme') == '1') { echo 'checked';} ?> >
                    <label for="theme">Light</label>
                </div>

                <h3>Chat Wallpaper</h3>

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
                    <textarea name="about" class="text" style="font-size: 13px;min-height: 65px; max-height: 65px; height:65px;" maxlength="30" onkeydown="_submit_data(event)" placeholder="Enter About Yourself" readonly><?= fetch_data_from_users_details(getDecryptedUserID() , 'about');?></textarea>
                    <img name="edit-icon" class="edit-icon" src="img/icons/settings/profile/edit.png" title="edit" /> 
                </div>

                <p class="margin-dead">E-mail:</p>
                <div class="text"><?= fetch_data_from_users(getDecryptedUserID() , 'email' );?></div>
            </div>
        </div>
    </div>
    
</body>
</html>