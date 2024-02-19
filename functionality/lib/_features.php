<link rel="stylesheet" href="/css/_features.css" type="text/css">
<?php
    function custom_header() {
        ?>
        <div class="title">
            <img src="../img/botsapp_white.png" onclick="tohomepage()">
            <h1 onclick="tohomepage()">BotsApp</h1>
            <p>-A Better place for chat.</p>
        </div>
        <?php
    }

    function custom_footer() {
        ?>
            <div>
            All right reserverd by <a href="/t&c/policy.php" class="link">BotsApp</a>.
            </div>
            <a href="/help/user-help.php" class="link">Need help?</a>
        <?php
    }
?>
<!-- Notifications -->
<div id="notification" class=""></div>
<div id="alert" class=""></div>

<script>
    var url;

    const pop_up = (title , message , came_url , theme = 'blue') => {
        url=came_url;

        var pop_up = document.querySelector('#pop_up');
        
        var title_ele = pop_up.querySelector('.title');
        title_ele.style.color=theme;
        pop_up.querySelector('hr').style.border='1px solid '.concat(theme);
        title_ele.textContent=title;

        var message_ele = pop_up.querySelector('.message');
        message_ele.textContent = message;

        if(theme == 'blue'){
            pop_up.querySelector('.pop_up_yes_btn').style.backgroundColor = "rgb(102 134 247 / 52%)";
        }else if(theme == 'red'){
            pop_up.querySelector('.pop_up_yes_btn').style.backgroundColor = "rgb(241 114 114 / 53%)";

        }
        pop_up.style.display = 'block';
        setTimeout(() => {
            pop_up.style.opacity = '100%';

        }, 10);

    }
    const goToURL = () => {
        window.location.assign(url);
    }
</script>

<!-- custom-pop-up  -->
<div class="center">
    <div id="pop_up">
        <h3 class="title"></h3>
        <hr>
        <p class="message"></p>

        <div class="buttons">
            <button class="pop_up_no_btn button" onclick=" document.querySelector('#pop_up').style.display='none'" >No</button>
            <button class="pop_up_yes_btn button" onclick="goToURL()">Yes</button>
        </div>
    </div>
</div>
