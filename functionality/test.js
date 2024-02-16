var request = indexedDB.open("Botsapp", 1);

request.onerror = (event) => {
    console.error("something went wrong");
};

request.onupgradeneeded = (event) => {
    var db = event.target.result;

    var objectStore = db.createObjectStore("session" , { keyPath: "id"});

    objectStore.createIndex("id" , "id" , { unique: true });
};

request.onsuccess = (event) => {
    var db = event.target.result;

    var transaction = db.transaction("session" , "readonly");
    var objectStore = transaction.objectStore("session");
    var count = objectStore.count();
    transaction.oncomplete = (() => {
        count = count.result;
        transaction = db.transaction("session" , "readwrite");
        objectStore = transaction.objectStore("session");
        if(count > 0) {
            objectStore.clear();
            console.log(count);
        }

        objectStore.add({id: "1" , userID : "abc" , key : "def" , nonce : "e"});

    });
    transaction.close;
};