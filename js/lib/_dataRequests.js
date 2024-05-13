
const sendNoti = (req , notiID) => {
    return new Promise((resolve , reject) => {
        var url = "/functionality/lib/_notification.php";
        var data = JSON.stringify({
                    req: req,
                    notiID:notiID,
                });

        postReq(url , data)
            .then(res =>{
                if(res.status == "success")
                    resolve(res);
            }).catch(err=>{
                console.error(err);
            })
    })
}

const _getChatList = async (chatType) => {
    var url = "/functionality/lib/_chat.php";
    var data = JSON.stringify({
        req: "getChatList",
        chatType: chatType,
    });

    try{
        const res = await postReq(url,data);
        if(res.status === "success")
            return res.responseText;
        else throw new Error("Something went wrong while fetching chat list of chatter");
    }catch(err){
        console.log(err);
        return 0;
    }
}

const _getMsgs = async (unm) => {
    var url = "/functionality/lib/_chat.php";
    var data = JSON.stringify({
        req: "getMsgs",
        unm: unm,
    });

    try{
        const res = await postReq(url , data);
        if(res.status == "success")
            return res.responseText;
    }catch(err){
        return 0;
    }
}

const _getDocBolb = (msgID,fileName)=> {
    var url = "/functionality/lib/_fetch_data.php";

    var data = JSON.stringify({
        req : "getDocBlob",
        msgID,
        fileName,
    });
    
    return new Promise((resolve,reject)=>{
        postReq(url,data)
            .then(res => {
                resolve(res);
            });
    });
}

const _sendMsg = async (data) =>{  
    if(!(data.type && (data.msg || (data.fileName && data.blob))))  return 0;
    var url="/functionality/lib/_chat.php";
    let {type} = data;
    data.req="sendMsg";
    data=JSON.stringify(data);


    try{
        return new Promise((resolve,reject)=>{
            if(type === "text")
                postReq(url,data).then(resObj=>resolve(resObj));
            else{
                fetch(url,{method:"POST",body:data})
                    .then(res=>{
                        if(res.ok && (res.status == 200)){
                            return res.json();}
                        else
                        resolve(400);
                    })
                    .then(res=>{
                        var resObj = {status:'success',responseText:res};
                        resolve(resObj);
                    });
            }
        });
    }catch(err){
        return 0;
    }
}

const _genNewID=async (preFix)=>{
    if(!preFix) return;

    var url = "/functionality/lib/_chat.php";
    var data=JSON.stringify({
        req:"genNewID",
        preFix,
    });

    var res =await postReq(url,data);
    return (res.status === "success") ? res.responseText : 400;
}

const _setMsgStatus = async (msgStatusImage,msgID) => {
    if(!msgID) return;
    var url = "/functionality/lib/_chat.php";
    var data=JSON.stringify({
        req:"getMsgStatus",
        msgID,
    });

    return new Promise( (resolve,reject) => {
        postReq(url,data)
            .then(res=>{
                let msgStatusURL = "/img/icons/chat/msg_status/";
                msgStatusImage.src = msgStatusURL+((res.status == "success" && res.responseText != 0) ? res.responseText:"uploading")+".svg";
            });
    });
}








// reader
// var reader = res.body.getReader();
    // var result= '';
    // async function read(){
    //     var {value,done}= await reader.read();
    //     if(done) {console.log("done"); console.log(result);}
    //     else{ 
    //         result+=new TextDecoder().decode(value);
    //         read();
    //     }
    // }
    // read();