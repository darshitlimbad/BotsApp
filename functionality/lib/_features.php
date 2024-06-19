<html>
<head>
    <link rel="stylesheet" href="/css/lib/_features.css" type="text/css">
    <script type="text/javascript" src='/js/lib/_features.js'></script>
</head>
<body>
    <!-- custom-pop-up  -->
<div class="center" >
    
    <div id="confirmation_pop_up" class="pop_up">
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

    <div id="report_pop_up" class="pop_up">
        <h3 class="title" style="color:red">Report </h3>
        <hr color="red">

        <!--Input Box -->
        <div class="input_field">
            <p class="message">Report spam/bully or any other things.</p>
            <p class="message">Your chat history will be Deleted.</p>

            <div class="input">
                <input type="text" name="reportReason" placeholder="Enter Your reason to report" autocomplete="off" style="position:sticky" />
            </div>
        </div>

        <div class="buttons">
            <button class="pop_up_no_btn button"  onclick="_hide_this_pop_up(document.querySelector('#report_pop_up'))" >No</button>
            <button class="pop_up_yes_btn button danger-button" >Report And Block</button>
        </div>
    </div>

    <div id="upload_img_form" class="pop_up">

        <h3 class="title"></h3>
        <hr>

        <!-- img -->
        <div class="input_field" name="avatar_field">
            <div class="input-img avatar_block">
                <img src="/img/default_dp.png" alt="" class="avatar avatar_preview">
                <input type="file" name="avatar" id="avatar" accept=".jpg, .jpeg, .png, .webp">
            </div>
            <span id="avatar_span"></span>
        </div>


        <div class="buttons">
            <button class="pop_up_no_btn button" onclick="_hide_this_pop_up(document.querySelector('#upload_img_form'))" >No</button>
            <button class="pop_up_yes_btn button">Yes</button>
        </div>
    </div>

    <div id="upload_doc_form" class="pop_up">

        <h3 class="title"></h3>
        <hr>

        <!-- img -->
        <div class="input_field" name="doc_field">
            <div class="input-doc">
                <input type="file" name="doc" id="doc" accept="*">
            </div>
        </div>


        <div class="buttons">
            <button class="pop_up_no_btn button" onclick="_hide_this_pop_up(document.querySelector('#upload_doc_form'))" >No</button>
            <button class="pop_up_yes_btn button">Yes</button>
        </div>
    </div>

    <div id="add_new_chat_form" class="pop_up">   
        <h3 class="title">Let's Add more Chatters!</h3>

        <!-- Buttons -->
        <div class="buttons">
            <button class="pop_up_no_btn button" onclick="_hide_this_pop_up(document.querySelector('#add_new_chat_form'))"><img src="/img/icons/close.png" alt="Close" height="15px" width="15px" style="top: 2px;position: relative;"></button>
        </div>

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
    </div>

</div>
</body>
</html>