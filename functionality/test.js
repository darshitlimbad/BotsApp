var request = indexedDB.open("Botsapp", 1);

request.onerror = (event) => {
    console.error("something went wrong");
};

request.onupgradeneeded = (event) => {
    var db = event.target.result;

    var objectStore = db.createObjectStore("session" , { keyPath: "id"});

    objectStore.createIndex("userID" , "userID" , { unique: false });

    objectStore.add({ id: 1, userID: "JohnDoe" , nonce: "nonce" });
};