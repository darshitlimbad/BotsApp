

<?php


    $imgdata = imagecreatefromjpeg('1.jpg');

    imagejpeg($imgdata , '2.jpg' , 50);
    imagedestroy($imgdata);

?>