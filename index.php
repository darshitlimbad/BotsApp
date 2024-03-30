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
                    list = document.querySelector('.list .scroll');
                    for(var i=0 ; i<8 ; i++){
                        tr = document.createElement('tr');
                        list.appendChild(tr);
                        tr.innerHTML = `
                            <td class="inbox-user">
                                <div class="img">
                                    <span class="skeleton"></span>
                                </div>
                                <div class="details">
                                    <h5 class="skeleton skeleton-text inbox-name">   </h5> 
                                    <div class="last-chat skeleton skeleton-text">   </div>
                                </div>
                            </td>
                        `;
                    }
                </script>
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