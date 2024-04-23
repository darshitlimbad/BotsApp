// js to php post reqest 
const postReq = (url, data=null , method="POST" , async = true) => {
    return new Promise((resolve, reject) => {
        const xml = new XMLHttpRequest();

        xml.onreadystatechange = (res) => {
            if (xml.readyState === 4) {
                if(xml.status === 200) {
                    console.log(res.target.response);
                    resolve(JSON.parse(res.target.response));
                } else {
                    reject(new Error(`HTTP status ${xml.status}`));
                }
            }
        };

        xml.open(method, url, async);
        if(method == "POST"){
            xml.setRequestHeader('Content-Type', 'application/json');
            xml.send(data);
        }else if(method == "get"){
            xml.send();
        }
        
    });
};

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

const _getChatList = async (chatType) => {
    var url = "/functionality/lib/_chat.php"
    data = JSON.stringify({
        req: "getChatList",
        chatType: chatType,
    });

    try{
        const chatList = await postReq(url , data);
        return chatList;
    }catch(err){
        console.log(err);
        return 0;
    }
}

const _getMsgs = async (unm) => {
    var url = "/functionality/lib/_chat.php";
    data = JSON.stringify({
        req: "getMsgs",
        unm: unm,
    });

    try{
        return await postReq(url , data);
    }catch(err){
        return 0;
    }
}

const _sendMsg = async (type, input) =>{
    var url="/functionality/lib/_chat.php";

    var data = JSON.stringify({
        req:"sendMsg",
        toUnm:getCookie("currOpenedChat"),
        type:type,
        input:input,
        time: Date.now().toFixed(),
    });
console.log(data);
    try{
        return await postReq(url,data);
    }catch(err){
        return 0;
    }
}