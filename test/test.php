<?php
    // echo time();

    $status ='dsdds';
    echo str_;
    // echo date_sub(time(), date_interval_create_from_date_string('1 day'))
    // echo date("d-m",time()) > date("d-m",time()-100000);
?>
<button class="hello"></button>
<button class="hello"></button>
<button class="hello"></button>
<button class="hello"></button>
<button class="hello"></button>
<script>
    function loop(){
        hello = document.querySelectorAll(".hello")
        for(var i=0 ;i<=5 ; i++){
            hello[i].onclick=()=>alert(i);
        }
    }
    loop();
</script>