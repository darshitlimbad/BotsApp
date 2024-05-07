<?php
session_start();
if(isset($_GET['key_pass']) && $_GET['key_pass'] === "khulJaSimSim") {
    log_Out();
}else{
    header('Location: /');
}

    function log_out(){
        session_destroy();
        session_abort();
?>
<script>
    var URL_Param = new URLSearchParams(window.location.search);

    var requst= indexedDB.deleteDatabase('Botsapp');

    requst.onsuccess = (event) => {
        window.location.assign('/user/?SUCCESS='.concat(URL_Param.get('SUCCESS') ? URL_Param.get('SUCCESS') : '202') );
    }
    requst.onerror = (event) => {
        console.error(event);
        window.location.assign('/user/?error=400');
    }
    
</script>

<?php
    }
?>