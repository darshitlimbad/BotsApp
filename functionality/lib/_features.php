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

<script>
    pop_up(title , message , URL) => {
        
    }
</script>

<!-- Notifications -->
<div id="notification" class=""></div>
<div id="alert" class=""></div>
