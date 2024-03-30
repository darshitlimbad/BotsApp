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
        // if any changes made in this also change in _chat.php for inbox footer.
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

<style>
    #notification , #alert{
    display: flex;
    opacity: 0;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    position: fixed;
    height: 50px;
    width: auto;
    bottom: 0px;
    right: -100px;
    border: 1px solid black;
    padding: 5px 30px;
    margin: 20px;
    z-index: 1;
    transition:all .5s cubic-bezier(0.4, 0.6, 0, 1.17);
    border-radius: 5px;
    font-family: var(--text-font);
}

#notification   {
    color: aliceblue;
    background-color: rgba(79, 15, 197, 0.623);
    box-shadow: 3px 3px 30px rgba(0, 0, 255, 0.296);

}

#alert {
    color: red;
    background-color: aliceblue;
    box-shadow: 3px 3px 30px rgba(255, 0, 0, 0.296);

}
</style>