<?php
    include_once("interface.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Personal Chat -- BOTSAPP</title>

    <link rel="stylesheet" type="text/css" href="css/index.css">

    <script type="text/javascript" src="js/index.js"></script>
    <script type="text/javascript" src="/js/lib/_classes.js"></script>
    <script type="text/javascript" src="/js/lib/_status.js"></script>
</head>
<body>

    <div class="center">
    <!-- chat-box -->
        <main class="chat-box bg-img">
            <!-- chat-list -->
            <section class="inbox">

                <div class="page-title">
                    <h2 id="cname">Personal Chat</h2>
                    
                    <img class="icon ele createNewGroupBtn" data-show="false" src="/img/icons/options/plus.png" title="Create New Group">
                </div>
                
                <div class="hr"></div>
                
                <!-- search-box -->
                <div class="search">
                    <input type="search" name="chatSearch" placeholder="search" autocomplete="off" accesskey="f">
                </div>
                
                <table class="list" id="chatterList" title="Chatter List"> 
                    <tbody class="listBody">

                    </tbody>
                </table>
            </section>

            <!-- opened-chat -->
            <section class="chat">
            </section>

        </main>
    </div>
</body>
</html>