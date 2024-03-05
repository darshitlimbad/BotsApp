
<form action="#" method="post" enctype="multipart/form-data">

    <input type="file" name="img" >

    <button type="submit">d</button>

</form>

<?php

    $img =$_FILES['img'];

    echo $img['size'];
    $data=$img['tmp_name'];
    $imgdata = imagecreatefromjpeg($data);
    unlink($data);
    imagejpeg($imgdata , $data , 50);
    imagedestroy($imgdata);

    

?>