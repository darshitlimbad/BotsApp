<?php
    include 'functionality/_auto_login.php';
    include 'functionality/lib/_features.php';
    include 'functionality/lib/_fetch_img.php';

    // ask about the what to do for the delay 
    print_r($_SESSION); 

    if( !isset($_SESSION['userID']) && !isset($_SESSION['sessionDataReady'])){
       header('location: /user');
       exit();
     }
?>
<!-- bots app -->
<!DOCTYPE html>
<html lang="en" >
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- <link rel="icon" href="img/BotsApp_white.png" type="image/png">  no need-->
    <!-- Style -->  
    <link rel="stylesheet" href="css/interface.css" type="text/css">
    <!-- Script -->
    <script type="text/javascript" src="js/interface.js"></script>
    <script type="text/javascript" src="js/_error_handling.js"></script>
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
                    <img src="img/default_dp.png">    <!-- insert php code to change profile img and title -->
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
                <div class="checkbox">
                    <input type="checkbox" name="last-seen-online" id="last-seen-online">
                    <label for="last-seen-online">Last seen and online status </label>
                </div>
                <div class="checkbox">
                    <input type="checkbox" name="can-see-profile-photo" id="can-see-profile-photo">
                    <label for="can-see-profile-photo">Can see Profile photo</label>
                </div>
                <div class="checkbox">
                    <input type="checkbox" name="can-see-about-section" id="can-see-about-section">
                    <label for="can-see-about-section">Can see about section</label>
                </div>
                
                <!-- log-out -->
                <h4 class="danger">Log Out</h4>
                        <p>Log out from your account</p>
                <button class="danger-button button" onclick="pop_up('Log out', 'Are you sure.. You want to Log out?' , '/functionality/_log_out.php?key_pass=khulJaSimSim' , 'red');">Log Out</button>

                <!-- Delete Account -->
                <h4 class="danger">Delete Account</h4>
                    <p>Delete your account, Which means your all data in Botsapp will be no longer available , your all chats will be deleted.</p>
                <button class="danger-button button" onclick="pop_up('Delete Account', 'Are you sure ,You want to delete your account?' , '/functionality/_delete_account.php?key_pass=khulJaSimSim' , 'red');">Delete Account</button>
            </div>
           
           <div class="body" name="chat-body" style="display: none;">
                <div class="headding">Chat</div>

                <h3>Theme</h3>
                
                <div class="swipe-box">
                    <label for="day-night-mode">Dark</label>
                    <input type="checkbox" name="day-night-mode" id="day-night-mode">
                    <label for="day-night-mode">Light</label>
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
                    <img src="<?php get_dp($_SESSION['userID']);?>" onerror="defaultDp(this);" height="80px" width="80px">
                </div>

                <br>
                <form action="functionality/edit.php?edit=name" method="post" class="flex" name="edit-user-name">
                    <input type="text" name="user-name" class="text" style="font-size: 15px;" placeholder="Enter User Name" value="Darshit_limbad" disabled /> 
                    <img name="edit-icon" class="edit-icon" src="img/icons/settings/profile/edit.png" title="edit"/>  
                </form>
                
                <p>About</p>
                <form action="functionality/edit.php?edit=name" method="post" class="flex" name="edit-about">
                    <textarea name="about" class="text" style="font-size: 13px;min-height: 30px;" placeholder="Enter About Yourself" disabled>Limbad darshit.</textarea>
                    <img name="edit-icon" class="edit-icon" src="img/icons/settings/profile/edit.png" title="edit" /> 
                </form>

                <p>E-mail</p>
                <div class="text">darshitlimbad@gmail.com</div>
           </div>
        </div>
    </div>
    
</body>
</html>