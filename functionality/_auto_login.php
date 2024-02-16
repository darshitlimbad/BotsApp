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
                        data = event.target.result;

                        //finding a way to send data to php in same file
                        
                    })
                }
                
            });
        }   else {
            console.warn("No saved Session found."); 
        }

    };
    </script>
<?php

// if(isset($_SESSION['userID'])) {
//     //echo "hello world";
// }else{
//     //echo "<script>alert('hi')</script>";
// }
?>