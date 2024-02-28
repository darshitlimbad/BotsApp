<?php
    include "interface.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Personal Chat -- BOTSAPP</title>
    
    <link rel="stylesheet" href="css/index.css" type="text/css"> 
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

                    <tr>
                        <td class="inbox-user">
                            <div class="img">
                                <img class="skeleton" src="img/default_dp.png">
                            </div>
                            <div class="details">
                                <h5 class="skeleton skeleton-text inbox-name">Name</h5> 
                                <div class="last-chat skeleton skeleton-text">This example assumes that you want to prevent the text from wrapping and display an ellipsis when it overflows. Adjust the max-width property according to your layout requirements. If you want the text to break and show ellipsis within a</div>
                            </div>
                        </td>
                    </tr>

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