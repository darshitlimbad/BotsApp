// js to php post reqest 
const postReq = (url, data , method="POST") => {
    return new Promise((resolve, reject) => {
        const xml = new XMLHttpRequest();

        xml.onreadystatechange = (res) => {
            if (xml.readyState === 4) {
                if(xml.status === 200) {
                    // console.log(res.target.response);
                    resolve(JSON.parse(res.target.response));
                } else {
                    reject(new Error(`HTTP status ${xml.status}`));
                }
            }
        };

        xml.open(method, url, true);
        if(method == "POST"){
            xml.setRequestHeader('Content-Type', 'application/json');
            xml.send(data);
        }else if(method == "get"){
            xml.send();
        }
        
    });
};

const getUserID = () => {
    return new Promise((resolve , reject) => {
        getUserID_URL = "/functionality/lib/_validation.php";
        data = JSON.stringify({
            action:"userID",
        });

        postReq(getUserID_URL , data)
            .then(res=>{
                resolve(res);
            }).catch(err=>{
                reject(err);
            })
    })    
}

const sendNoti = (req , notiID) => {
    return new Promise((resolve , reject) => {
        var url = "/functionality/lib/_notification.php"
        data = JSON.stringify({
            req: req,
            notiID:notiID,
        })

        postReq(url , data)
            .then(res =>{
                resolve(res);
            }).catch(err=>{
                console.error(err);
            })
    })
}

const _getChatList = async () => {
    var url = "/functionality/lib/_chat.php"
    data = JSON.stringify({
        req: "getChatList",
    })

    try{
        const chatList = await postReq(url , data);
        return chatList;
    }catch(err){
        console.log(err);
        return 0;
    }
    // postReq(url , data)
    //     .then(res =>{
    //         return res;
    //     }).catch(err=>{
    //         console.error(err);
    //         return 0;
    //     })
}