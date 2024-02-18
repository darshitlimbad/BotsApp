<?php
session_start();
if(isset($_GET['get_pass']) && $_GET['get_pass'] === "khulJaSimSim") {
    session_destroy();
    session_abort();
}
?>
<script>
    var URL_Param = new URLSearchParams(window.location.search);
    console.log(URL_Param);
    var requst= indexedDB.deleteDatabase('Botsapp');

    requst.onsuccess = (event) => {
        window.location.assign('/');
    }
    requst.onerror = (event) => {
        console.log(event);
    }
</script>
