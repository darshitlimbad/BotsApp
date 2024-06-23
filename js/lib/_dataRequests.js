
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
                    throw res.responseText;
            }).catch(err=>{
                customError(err); 
                return 0;
            })
    })
}

const _getChatList = async (chatType=null) => {
    var url = "/functionality/lib/_chat.php";
    var data = {
        req: "getChatList",
    };
    if(chatType)    data.chatType=chatType;

    try{
        const res = await postReq(url,JSON.stringify(data));
        if(res.status === "success" && !res.responseText.error)
            return res.responseText;
        else if(res.status === 'error'){
            throw res;
        }else 
            throw res.responseText;
    }catch(err){
        customError(err); 
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
        else if(res.status === 'error')
            throw res;
        else 
            throw res.responseText;
    }catch(err){
        customError(err); 
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
        else if(res.status === 'error')
            throw res;
        else 
            throw res.responseText;
    }catch(err){
        customError(err); 
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
                    throw res.responseText;
                else if(res.status == "error")
                    throw res;

                resolve(res);
            }).catch(err=>{
                customError(err); 
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

// const _genNewID= async (preFix)=>{
//     if(!preFix) return;

//     var url = "/functionality/lib/_chat.php";
//     var data=JSON.stringify({
//         req:"genNewID",
//         preFix,
//     });

//     var res =await postReq(url,data);
//     return (res.status === "success") ? res.responseText : 400;
// }

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
            if(res.status === "success" ){
                let {mime,data} = res.responseText;
                if(!mime || !data)
                    throw res.responseText;

                let base64 = `data:${mime};base64,${data}`;
                
                let a = document.createElement('a');
                a.download=fileName;
                
                _getDataURL(base64)
                    .then(res=>{
                        if(res.status=='success' && res.url){
                            a.href = res.url;
                            a.click();
                        }else{
                            throw res;
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
                throw res;
            }
        }).catch(err=>{
            customError(err); 
        })
}

function getProfile(){

    let url = '/functionality/lib/_fetch_data.php';
    let data={
        req:`getProfile`,
    }

    return new Promise((resolve)=>{
        postReq(url,JSON.stringify(data))
            .then(res=>{
                if(res.status === 'success' && !res.responseText.error){
                    resolve(res.responseText);
                }else{
                    throw res.responseText;
                }
            }).catch(err=>{
                customError(err); 
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
                    throw res.responseText;
                    // console.error(`[${res.responseText.code}] : ${res.responseText.message}`);
                    // handler['err_'+res.responseText.error.code]();
                }
            }).catch(err=>{
                customError(err);
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
                chat.querySelector(`div[data-msgid='${msgID}'`)?.remove();
            }else{
                throw res.responseText;
            }
        }).catch(err=>{
            customError(err); 
        })
}

const _deleteChat=()=>{
    let url = "/functionality/lib/_data_delete.php";
    let data={
        req:"deleteChat",
    }

    postReq(url,JSON.stringify(data))
        .then(res=>{
            if(res.status === 'success' && res.responseText === 1){
                closeChat();
                openChatList();
            }else{
                throw res.responseText;
            }
        }).catch(err=>{
            customError(err); 
        })
}

const _blockChat=()=>{
    if(!getCookie('currOpenedChat') || getCookie('chat').toLowerCase() != 'personal')
        return;

    let url = "/functionality/lib/_data_delete.php";
    let data={
        req:"blockChat",
    }

    postReq(url,JSON.stringify(data))
        .then(res=>{
            if( res.status === "success" && res.responseText === 1){
                closeChat();
                openChatList();
            }else
                throw res.responseText;
        }).catch(err=>{
            customError(err); 
        })
}

const _reportChat=(reportReason=null)=>{
    if(!reportReason || !getCookie('currOpenedChat') || getCookie('chat').toLowerCase() != 'personal')
        return;

    let url = "/functionality/lib/_data_delete.php";
    let data={
        req:"reportChat",
        reportReason,
    }

    postReq(url,JSON.stringify(data))
        .then(res=>{
            if( res.status === "success" && res.responseText === 1){
                closeChat();
                openChatList();
            }else
                throw res.responseText;
        }).catch(err=>{
            customError(err); 
        })
}

function createNewGroup(name=null,memberList=null){
    if(!name || !memberList)
        return 0;

    let url= "/functionality/lib/_insert_data.php";
    let data={
        req:'createNewGroup',
        name,
        memberList: JSON.stringify(memberList),
    }

    return new Promise((resolve)=>{
        postReq(url,JSON.stringify(data))
            .then(res=>{
                if(res.status === 'success' && res.responseText === 1)
                    resolve(1);
                else if(res.status != success)
                    throw res;
                else 
                    throw res.responseText;
                    
            }).catch(err=>{
                resolve(0);
                customError(err); 
            })
    })
            
}