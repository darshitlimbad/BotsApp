<?php
session_start();
?>
    <script>
    var request = indexedDB.open("Botsapp", 1);
    var is_data = 1;

    request.onerror = (event) => {
        console.error("something went wrong");
    };

    request.onupgradeneeded = (event) => {
        var db = event.target.result;
        var objectStore = db.createObjectStore("session" , { keyPath: "id"});
        objectStore.createIndex("id" , "id" , { unique: true });

        console.warn("No saved Session found.");
        is_data = 0;
    };

    request.onsuccess = (event) => {
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
                        data = JSON.stringify(event.target.result);
                        xml = new XMLHttpRequest();
                        URL = window.location.origin+"/functionality/_set_session_auto.php?entryPass=khuljasimsim";
                        xml.open('POST' , URL , false);
                        
                        xml.onreadystatechange = (response) => {
                            if(!(xml.readyState == 4) && !(xml.status == 200)) {
                                console.error("auto Session loading failed.")
                            }
                        };

                        xml.send(data);
                    });
                }
            });
        }   else {
            console.warn("No saved Session found."); 
        }

    };
    </script>