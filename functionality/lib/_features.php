<head>
    <link rel="stylesheet" href="/css/lib/_features.css" type="text/css">
    <script type="text/javascript" src='/js/lib/_features.js'></script>
</head>
<body>
    <!-- custom-pop-up  -->
<div class="center" >
    
    <div id="confirmation_pop_up">
        <h3 class="title"></h3>
        <hr>
        <div class="input_field">
            <p class="message"></p>
        </div>

        <div class="buttons">
            <button class="pop_up_no_btn button" onclick="_hide_this_pop_up(document.querySelector('#confirmation_pop_up'))" >No</button>
            <button class="pop_up_yes_btn button" >Yes</button>
        </div>
    </div>

    <div id="upload_img_form">

        <h3 class="title"></h3>
        <hr>

        <!-- img -->
        <div class="input_field" name="avatar_field">
            <div class="input-img avatar_block">
                <img src="/img/default_dp.png" alt="" class="avatar avatar_preview">
                <input type="file" name="avatar" id="avatar" accept=".jpg, .jpeg, .png, .webp" onchange="avatar_validation()">
            </div>
            <span id="avatar_span"></span>
        </div>


        <div class="buttons">
            <button class="pop_up_no_btn button" onclick="_hide_this_pop_up(document.querySelector('#upload_img_form'))" >No</button>
            <button class="pop_up_yes_btn button" onclick="_uploadImg();"  >Yes</button>
        </div>
    </div>

    <div id="add_new_chat_form">   
        <h3 class="title">Let's Add more Chatters!</h3>
        <hr>

        <!--Input Box -->
        <!-- user -->
        <div class="input_field" name="user_field">
            <h5>@</h5>
            <div class="input">
                <input type="text" id="username" name="username" placeholder=" " autocomplete="off" onkeyup="_search_users_by_unm(this.value)" />
                <label for="username">Username</label>
                <div class="center">
                    <table  id="floatingList" >
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Buttons -->
        <div class="buttons">
            <button class="pop_up_no_btn button" onclick="_hide_this_pop_up(document.querySelector('#add_new_chat_form'))" >Cancel</button>
        </div>
    </div>


</div>
</body>

