url_for_fetch_data = "/functionality/lib/_fetch_data.php?key_pass=khulJaSimSim"

const _fetch_data_of_user = ( ) => {
    new Promise( (resolve , reject ) => {
        
        var users_avatar = "hello";
        
        // json data format 
        // table : columns
        var data = JSON.stringify({
            users_avatar : users_avatar
        });
        postReq(url_for_fetch_data , data)
            .then( response => {
                if(response != 0) {
                    resolve(response);
                }
            }).catch(err => {
                console.error(err);
            });
    })
}

document.addEventListener('DOMContentLoaded' ,() => {
    _fetch_data_of_user();
});
