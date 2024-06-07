
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
                    resolve(res.responseText);
            }).catch(err=>{
                console.error(err);
            })
    })
}

const _getChatList = async () => {
    var url = "/functionality/lib/_chat.php";
    var data = JSON.stringify({
        req: "getChatList",
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

const _getAllMsgs = async () => {
    var url = "/functionality/lib/_chat.php";
    var data = {
        req: "getAllMsgs",
    };
    if(getCookie('chat').toLowerCase() === 'group') data.toGID = user.id;
    
    try{
        const res = await postReq(url , JSON.stringify(data));
        if(res.status == "success" && !res.responseText.error)
            return res.responseText;
        else 
            throw new Error(res.responseText);
    }catch(err){
        console.error(err);
        return 0;
    }
}

const _getNewMsgs = async () => {
    var url = "/functionality/lib/_chat.php";
    var data = {
        req: "getNewMsgs",
    };
    if(getCookie('chat').toLowerCase() === 'group') data.toGID = user.id;

    try{
        const res = await postReq(url , JSON.stringify(data));
        if(res.status == "success" && !res.responseText.error)
            return res.responseText;
        else 
            customError(res.responseText.message,res.responseText.code);
    }catch(err){
        console.warn(err);
        return 0;
    }
}

const _getDocBolb = (msgID)=> {
    var url = "/functionality/lib/_fetch_data.php";

    var data = {
        req : "getDocBlob",
        msgID,
    };

    if(getCookie('chat') == 'Group')    data.toGID = user.id;

    return new Promise((resolve,reject)=>{
        postReq(url, JSON.stringify(data))
            .then(res=>{
                if(res.responseText.error)
                    throw new Error(res.responseText);

                resolve(res);
            }).catch((err)=>{
                new_Alert(`[${err.code} : ${err.message}]`);
                console.warn(`[${err.code} : ${err.message}]`);
            })
    });
}

const _sendMsg = (data) =>{  
    if(!(data.type && (data.msg || (data.fileName && data.blob))))  return 0;
    
    var url="/functionality/lib/_chat.php";
    data.req="sendMsg";
    try{
        return new Promise((resolve,reject)=>{
            if(data.type === "text" || data.type === 'img')
                postReq(url,JSON.stringify(data)).then(resObj=>resolve(resObj));
            else{
                postReq(url, JSON.stringify(data), {
                    onUploadProgress:(progressEvent)=>{
                        var progressPR = data.msgLoad.childNodes[0].childNodes[0];
                        progressPR.textContent = Math.ceil(progressEvent.loaded*100 / progressEvent.total)+"%";
                    }
                }).then(res=>{
                    resolve(res);
                })
            }
        });
    }catch(err){
        return 0;
    }
}

const _genNewID= async (preFix)=>{
    if(!preFix) return;

    var url = "/functionality/lib/_chat.php";
    var data=JSON.stringify({
        req:"genNewID",
        preFix,
    });

    var res =await postReq(url,data);
    return (res.status === "success") ? res.responseText : 400;
}

const _downloadThisDoc = (msgID,fileName,msgLoad)=>{
    var url = "/functionality/lib/_fetch_data.php";
    
    var progressDiv = msgLoad.firstChild;
    msgLoad.removeChild(progressDiv);
    
    msgLoad.appendChild(setDocumentProgressBar());
    var progressPR = msgLoad.querySelector(".progressPR");

    var data = {
        req : "getDocBlob",
        msgID,
    };
    if(getCookie('chat') == 'Group')  data.toGID = user.id;

    postReq(url, JSON.stringify(data) , { 
        onDownloadProgress:(progressEvent) =>{
            progressPR.textContent = Math.ceil(progressEvent.loaded*100 / progressEvent.total)+"%";
            
            if(progressEvent.done)
                progressPR.remove();
        }
    })
        .then(res=>{
            if(res.status == "success"){
                let {mime,data} = res.responseText;
                let base64 = `data:${mime};base64,${data}`;
                
                let a = document.createElement('a');
                a.download=fileName;
                
                _getDataURL(base64)
                    .then(res=>{
                        if(res.status=='success'){
                            a.href = res.url;
                            a.click();
                        }else{
                            try{
                                handler['err'+res.error]();
                            }catch(e){
                                handler.err_400();
                            }
                        }

                        if(device === 'mobile')
                            backToDownloadBtn();
                        else
                            window.onfocus= ()=> backToDownloadBtn();
                        
                    });

                    function backToDownloadBtn(){
                        msgLoad.firstChild.remove();
                        msgLoad.appendChild(progressDiv);

                        if(res.url)
                            URL.revokeObjectURL(res.url);
                    }
                
            }else{
                handler.err_400();
            }
        });
}