<?php
    function chatListTemplate($name , $lastChat , $imgData) {
    ?>
        <tr>
            <td class="inbox-user">
                <div class="img">
                    <img class="skeleton" src="/img/default_dp.png" />
                </div>
                <div class="details">
                    <h5 class="skeleton skeleton-text inbox-name">Name</h5> 
                    <div class="last-chat skeleton skeleton-text">This example assumes that you want to prevent the text from wrapping and display an ellipsis when it overflows. Adjust the max-width property according to your layout requirements. If you want the text to break and show ellipsis within a</div>
                </div>
            </td>
        </tr>
    <?php
    }

?>