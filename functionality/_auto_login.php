<?php
session_start();
if(!isset($_SESSION['userID'])) {
?>

    <script>
    var request = indexedDB.open("Botsapp", 1);

    request.onerror = (event) => {
        console.warn('[404] :' , "No Saved data found");
    };

    request.onupgradeneeded = (event) => {
        var db = event.target.result;

        if(!db.objectStoreNames.contains('session')) {
            db.close();
            indexedDB.deleteDatabase('Botsapp');
        }
    };

    request.onsuccess = ((event) => {
        var db = event.target.result;
        if(db.objectStoreNames.contains('session')){

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
                            try{
                                // console.log(response.target.response);
                                if((xml.readyState == 4) && (xml.status == 200)) {
                                    let res = JSON.parse(response.target.response);

                                    if(res.status === 'success'){
                                        window.location.reload();
                                    }else{
                                        throw res;
                                    }
                                }else{
                                    throw ("[400] :"+" Bad Request");
                                }
                            }catch(err){
                                if(err?.code)
                                    console.warn(`[${err.code}] :` , `${err.message}`);
                                else
                                    console.warn(err);
                                db.close();
                                // indexedDB.deleteDatabase('Botsapp');
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