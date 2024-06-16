
const sendNoti = (req , notiID) => {
    return new Promise((resolve , reject) => {
        var url = "/functionality/lib/_notification.php";
        var data = JSON.stringify({
                    req: req,
                    notiID:notiID,
                });

        postReq(url , data)
            .then(res =>{
                if(res.status == "success" && res.responseText === 1)
                    resolve(res.responseText);
                else
                    throw new Error(res.responseText);
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
    
    try{
        const res = await postReq(url , JSON.stringify(data));
        if(res.status == "success" && !res.responseText.error)
            return res.responseText;
        else{
            throw new Error(res.responseText.code);
        }
    }catch(code){
        try{
            handler['err_'+code]();
        }catch(e){
            handler.err_400();
        }
        console.error(code);
        return 0;
    }
}

const _getNewMsgs = async () => {
    var url = "/functionality/lib/_chat.php";
    var data = {
        req: "getNewMsgs",
    };

    try{
        const res = await postReq(url , JSON.stringify(data));
        if(res.status == "success" && !res.responseText.error)
            return res.responseText;
        else{
            throw new Error(res.responseText.code);
        }
    }catch(code){
        try{
            handler['err_'+code]();
        }catch(e){
            handler.err_400();
        }
        console.error(code);
        return 0;
    }
}

const _getDocBolb = (msgID)=> {
    var url = "/functionality/lib/_fetch_data.php";

    var data = {
        req : "getDocBlob",
        msgID,
    };

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

function getProfile(){

    let url = '/functionality/lib/_fetch_data.php';
    let data={
        req:`getProfile`,
    }

    return new Promise(resolve=>{
        postReq(url,JSON.stringify(data))
            .then(res=>{
                if(res.status === 'success' && !res.responseText.error){
                    resolve(res.responseText);
                }else if(res.responseText.error){
                    console.error(`[${res.responseText.code}] : ${res.responseText.message}`);
                    handler['err_'+res.responseText.code]();
                }else{
                    throw new Error();
                }
            }).catch(err=>{
                handler.err_400();
            })
    });
}

function editGroupDetails(column,value){
    let url = "/functionality/lib/_chat.php";
    let data={
        req:"editGroupDetails",
        column,
        value,
    }

    return new Promise(resolve=>{
        postReq(url,JSON.stringify(data))
            .then(res=>{
                if(res.status === 'success' && res.responseText === 1){
                    handler.suc_dataChanged();
                    resolve(1);
                }else{
                    console.error(`[${res.responseText.code}] : ${res.responseText.message}`);
                    handler['err_'+res.responseText.error.code]();
                    resolve(0);
                }
            }).catch(err=>{
                handler.err_400();
                resolve(0);
            })
    })
}

const _deleteMsg=(msgID)=>{
    let url = "/functionality/lib/_data_delete.php";
    let data={
        req:"deleteMsg",
        msgID,
    }

    postReq(url,JSON.stringify(data))
        .then(res=>{
            if(res.status === 'success' && res.responseText === 1){
                chat.querySelector(`#${msgID}`)?.remove();
            }else if(res.responseText.error){
                console.error(`[${res.responseText.code}] : ${res.responseText.message}`);
                handler['err_'+res.responseText.code]();
            }
        }).catch(err=>{
            handler.err_400();
        })
}

const _deleteChat=()=>{
    let url = "/functionality/lib/_data_delete.php";
    let data={
        req:"deleteChat",
    }

    postReq(url,JSON.stringify(data))
        .then(res=>{
            console.log(res.responseText);
        })
}