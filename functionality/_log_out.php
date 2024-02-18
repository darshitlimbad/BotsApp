<?php
session_start();
if(isset($_GET['key_pass']) && $_GET['key_pass'] === "khulJaSimSim") {
    session_destroy();
    session_abort();
}
?>
<script>
    var URL_Param = new URLSearchParams(window.location.search);
    if(URL_Param.get('key_pass') && (URL_Param.get('key_pass') == "khulJaSimSim")){
        var requst= indexedDB.deleteDatabase('Botsapp');

        requst.onsuccess = (event) => {
            window.location.assign('/');
        }
        requst.onerror = (event) => {
            console.log(event);
        }
    }else{
        window.location.assign('/');
    }
    
</script>
