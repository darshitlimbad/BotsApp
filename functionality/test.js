fetch( window.location.href , {
    method: "post",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        userID: "1342" , 
        key: "meHuKEY",
        nonce: "meHuNonce"
    }),
})
.then(response => {
        if(!response.ok){
            throw new Error("failed To Fetch data from session.");
        }
    })
    .catch(error => {
        console.error("session Fetch Error :", error);
    });
//why the hell this is not working? FIND OUT
    console.log(window.location.href);