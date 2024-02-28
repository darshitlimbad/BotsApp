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
            <button class="pop_up_yes_btn button" onclick="goToURL()">Yes</button>
        </div>
    </div>

    <div id="upload_img_form">

        <h3 class="title"></h3>
        <hr>

        <!-- img -->
        <div class="input_field" name="avatar_field">
            <div class="input-img avatar_block">
                <img src="../img/default_dp.png" alt="" class="avatar avatar_preview">
                <input type="file" name="avatar" id="avatar" accept=".jpg, .jpeg, .png, .webp" onchange="avatar_validation()">
            </div>
            <span id="avatar_span"></span>
        </div>


        <div class="buttons">
            <button class="pop_up_no_btn button" onclick="_hide_this_pop_up(document.querySelector('#upload_img_form'))" >No</button>
            <button class="pop_up_yes_btn button" onclick="_uploadImg()">Yes</button>
        </div>
    </div>
</div>


</body>

