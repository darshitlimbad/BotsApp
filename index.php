<?php
    include_once("interface.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Personal Chat -- BOTSAPP</title>

    <link rel="stylesheet" type="text/css" href="css/index.css">
</head>
<body>

    <div class="center">
    <!-- chat-box -->
    <div class="chat-box">
        <!-- chat-list -->
        <div class="inbox">

            <div class="page-name">
                <h2 id="cname"></h2>
            </div>
            
            <div class="hr"></div>
            
            <!-- search-box -->
            <div class="search">
                <input type="search" name="seach" placeholder="search" autocomplete="off">
            </div>

            <table class="list"> 
                <tbody class="scroll">
                    <script>
                        getChatList("<?= $userID?>");
                    </script>

                    <td>
                        <footer>
                            <?= custom_footer();?>
                        </footer>
                    </td>
                </tbody>
            </table>
        </div>

        <!-- opened-chat -->
        <div class="chat">

        </div>

    </div>
    </div>
</body>
</html>