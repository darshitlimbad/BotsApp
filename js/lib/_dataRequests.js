
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
        else 
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

    let openedChat=getCookie('currOpenedChat');
    
        return new Promise((resolve,reject)=>{
            postReq(url, JSON.stringify(data),{
                onDOwnloadAbortXMLOrNot:()=>{
                    return (openedChat != getCookie('currOpenedChat')) ? true : false;
                }
            }).then(res=>{
                if(res.status == "success" && !res.responseText.error){
                    resolve(res.responseText);
                }else 
                    throw res.responseText;
            }).catch(err=>{
                customError(err); 
            });
        })  
}

//? using localstorage to store message data  
 // var chat= (getCookie('chat').toLowerCase() === 'personal') ? getCookie('currOpenedChat') : getCookie('currOpenedGID');
  // var cache_msgData= localStorage.getItem('cache-msgData-'+chat);
        // if(cache_msgData)
        //     return JSON.parse(decodeURIComponent(atob(cache_msgData)));
        // else{
                // localStorage.setItem('cache-msgData-'+chat, btoa(encodeURIComponent(JSON.stringify(res.responseText))) );
        // }

            // const res = await postReq(url , JSON.stringify(data));
            // if(res.status == "success" && !res.responseText.error){
            //     return res.responseText;

            // }else 
            //     throw res.responseText;

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
            progressPR.textContent = Math.ceil((progressEvent.loaded / progressEvent.total)*100)+"%";
            
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
                            a.href = res.url;//base64
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
        .then(async res=>{
            if(res.status === 'success' && res.responseText === 1){
                var openedChat= (getCookie('chat').toLowerCase() === 'personal') ? getCookie('currOpenedChat') : getCookie('currOpenedGID');

                // let cacheData= await _getAllMsgs();
                // cacheData=cacheData.filter(data=>data.msgID != msgID);
                // localStorage.setItem('cache-msgData-'+openedChat, btoa(encodeURIComponent(JSON.stringify(cacheData))));
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
                // var openedChat= (getCookie('chat').toLowerCase() === 'personal') ? getCookie('currOpenedChat') : getCookie('currOpenedGID');
                // localStorage.removeItem('cache-msgData-'+openedChat);
                closeChat();
                openChatList();
            }else{
                throw res.responseText;
            }
        }).catch(err=>{
            customError(err); 
        })
}

const _removeMember=(unm=null)=>{
    if(!unm || !getCookie('currOpenedGID') || getCookie('chat').toLowerCase() != 'group')
        return;

    let url = "/functionality/lib/_data_delete.php";
    let data={
        req:"removeMember",
        unm,
    }

    return new Promise(resolve=>{
        postReq(url,JSON.stringify(data))
            .then(res=>{
                if(res.status === 'success' && res.responseText === 1){
                    resolve(1);
                }else{
                    throw res.responseText;
                }
            }).catch(err=>{
                customError(err); 
            })
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
                // var openedChat= (getCookie('chat').toLowerCase() === 'personal') ? getCookie('currOpenedChat') : getCookie('currOpenedGID');
                // localStorage.removeItem('cache-msgData-'+openedChat);
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
                // var openedChat= (getCookie('chat').toLowerCase() === 'personal') ? getCookie('currOpenedChat') : getCookie('currOpenedGID');
                // localStorage.removeItem('cache-msgData-'+openedChat);
                _hide_this_pop_up(document.querySelector('#report_pop_up'))
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
                else 
                    throw res.responseText;
                    
            }).catch(err=>{
                resolve(0);
                customError(err); 
            })
    })
}

function _addNewMember(unmList=[]){
    if(!unmList.length || !getCookie('currOpenedGID') || getCookie('chat').toLowerCase() != 'group')
        return;

    let url= "/functionality/lib/_insert_data.php";
    let data={
        req:'addMemberInGroup',
        unmList: JSON.stringify(unmList),
    }

    return new Promise(resolve=>{
        postReq(url,JSON.stringify(data))
            .then(res=>{
                if(res.status === 'success' && res.responseText === 1){
                    resolve(1);
                }else{
                    throw res.responseText;
                }
            }).catch(err=>{
                resolve(0);
                customError(err); 
            })
    })
}

function _getBlockedMemberList(){
    let url= "/functionality/lib/_fetch_data.php";
    let data={ req:'getBlockedMemberList' };

    return new Promise(resolve=>{
        postReq(url,JSON.stringify(data))
            .then(res=>{
                if(res.status === 'success' && !res.responseText.error){
                    resolve(res.responseText);
                }else{
                    throw res.responseText;
                }
            }).catch(err=>{
                resolve(0);
                customError(err); 
            })
    })
}

function _unblockMember(unm=null){
    if(!unm) return;

    let url= "/functionality/lib/_data_delete.php";
    let data={ req:'unBlockChatter',unm };

    return new Promise(resolve=>{
        postReq(url,JSON.stringify(data))
            .then(res=>{
                if(res.status === 'success' && res.responseText == 1){
                    resolve(res.responseText);
                }else{
                    throw res.responseText;
                }
            }).catch(err=>{
                resolve(0);
                customError(err); 
            })
    });
}

function _uploadEmoji(data=null){
    if(!data) return;

    let url= "/functionality/lib/_insert_data.php";
    data.req="add_emoji";

    postReq(url,JSON.stringify(data)).then(res=>{
        if(res.responseText == 1){
            new_notification("Your emoji uploaded succesfully.");
        }else{
            throw res.responseText;
        }
    }).catch(err=>{
        console.error(err);
        new_Alert(err.message);
    })
}

function _getEmojiList(data=null){
    if(!data) return;

    let url= "/functionality/lib/_fetch_data.php";
    data.req="getEmojisDetails";

    return new Promise(resolve=>{
        postReq(url,JSON.stringify(data)).then(res=>{
            if(!res.responseText.error){
                resolve(res.responseText);
            }else{
                throw res.responseText;
            }
        }).catch(err=>{
            resolve(0);
            customError(err);
        })
    })
    
}

function _deleteUploadedEmoji(emojiID=null){
    if(!emojiID) return;

    let URL= "/functionality/lib/_data_delete.php";
    let data= {req:'deleteEmoji',emojiID};

    return new Promise((resolve,reject)=>{
        postReq(URL,JSON.stringify(data))
            .then(res=>{
                if(res.status === "success" && res.responseText === 1)
                    resolve(1);
                else
                    throw res.responseText;
            }).catch(err=>{
                customError(err); 
                resolve(0);
            })
    })
}

function _searchEmoji(data=null){
    if(!data) return;

    let url= "/functionality/lib/_fetch_data.php";
    data.req="searchEmojis";

    return new Promise(resolve=>{
        postReq(url,JSON.stringify(data)).then(res=>{
            if(!res.responseText.error){
                resolve(res.responseText);
            }else{
                throw res.responseText;
            }
        }).catch(err=>{
            resolve(0);
            customError(err);
        })
    })
    
}

function _fetchEmoji(data=null){
    //format
    // data={
    //     name:':duar:',
    //     scope:'SELF&GROUP',
    //     GID:,
    //     emojiUser:'test#234',
    // }
    if(!data) return;

    let url= "/functionality/lib/_fetch_data.php";
    data.req="fetchEmoji";

    return new Promise(resolve=>{
        let key= 'cache-emoji-'+data.name+'_'+data.emojiUser;
        let encryptedEmojiURL= localStorage.getItem(key);

        if(encryptedEmojiURL){
            resolve(atob(encryptedEmojiURL));
        }else{
            postReq(url,JSON.stringify(data)).then(res=>{

                if(res.responseText && !res.responseText.error){
                    let {mime,blob}= res.responseText;
                    let base64= `data:${mime};base64,${blob}`;

                    _getDataURL(base64)
                        .then(res=>{
                            localStorage.setItem(key, btoa(res.url));
                            resolve(res.url);
                        })

                }else if(res.responseText === 0){
                    resolve(0);
                }else{
                    throw res.responseText;
                }
            }).catch(err=>{
                resolve(0);
                customError(err);
            })
        }
    })
    
}

async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();        

        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}