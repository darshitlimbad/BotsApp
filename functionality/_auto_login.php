<?php
session_start();
if(!isset($_SESSION['userID'])) {
?>

    <script>
    var request = indexedDB.open("Botsapp", 1);
    var is_data = 1;

    request.onerror = (event) => {
        console.warn('[404] :' , "No Saved data found");
    };

    request.onupgradeneeded = (event) => {
        var db = event.target.result;

        if(db.objectStoreNames.length == 0) {
            db.close();
            indexedDB.deleteDatabase('Botsapp');
        }

        is_data = 0;
    };

    request.onsuccess = ((event) => {
        var db = event.target.result;

        if(is_data == 1){

            var transaction = db.transaction("session" , "readonly");
            var objectStore = transaction.objectStore("session");
            var count = objectStore.count();

            
            transaction.oncomplete = (() => {
                count = count.result;
                transaction = db.transaction("session" , "readonly");
                objectStore = transaction.objectStore("session");

                if(count > 0){
                    
                    var getRequest = objectStore.get("1");

                    getRequest.onsuccess = ((event) => {
                        var data = JSON.stringify({...event.target.result,keyPass:'khuljasimsim'});

                        var URL_of_setSession = '/functionality/_set_session_auto.php';

                        const xml = new XMLHttpRequest();
                        xml.onload = (response) => {
                            console.log(response.target.response);
                            if((xml.readyState == 4) && (xml.status == 200)) {
                                let res = JSON.parse(response.target.response);

                                if(res.status === 'success'){
                                    window.location.reload();
                                }else{
                                    console.warn(`[${res.code}] :` , `${res.message}`);
                                    db.close();
                                    indexedDB.deleteDatabase('Botsapp');
                                }
                            }   else    {
                                console.error("[400] :"," Bad Request , some error ocured during auto session loading , please try again");
                            }
                            
                        };

                        xml.open('POST' , URL_of_setSession , false);
                        xml.send(data);

                    });
                } else {
                    console.warn('[404] :' , "No Saved data found");
                }
        });

        }   else {
            console.warn('[404] :' , "No Saved data found");
        }

    });
</script>
<?php
}
?>