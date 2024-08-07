function _getUsersList(){
    let URL= "/functionality/admin/admin.php";
    let data= {req:'getUsersList'};

    return new Promise((resolve,reject)=>{
        postReq(URL,JSON.stringify(data))
            .then(res=>{
                if(res.status === "success" && !res.responseText.error)
                    resolve(res.responseText);
                else 
                    throw res.responseText;
            }).catch(err=>{
                customError(err); 
                resolve(0);
            })
    })
}

function _getGroupsList(){
    let URL= "/functionality/admin/admin.php";
    let data= {req:'getGroupsList'};

    return new Promise((resolve,reject)=>{
        postReq(URL,JSON.stringify(data))
            .then(res=>{
                if(res.status === "success" && !res.responseText.error)
                    resolve(res.responseText);
                else 
                    throw res.responseText;
            }).catch(err=>{
                customError(err); 
                resolve(0);
            })
    })
}

function _getReportsList(){
    let URL= "/functionality/admin/admin.php";
    let data= {req:'getReportsList'};

    return new Promise((resolve)=>{
        postReq(URL,JSON.stringify(data))
            .then(res=>{
                if(res.status === "success" && !res.responseText.error)
                    resolve(res.responseText);
                else 
                    throw res.responseText;
            }).catch(err=>{
                customError(err); 
                resolve(0);
            })
    })
}

function _deleteUser(unm){
    let URL= "/functionality/admin/admin.php";
    let data= {req:'deleteUser',unm};

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

function _warnUser(unm){
    let URL= "/functionality/admin/admin.php";
    let data= {req:'warnUser',unm};

    return new Promise((resolve,reject)=>{
        postReq(URL,JSON.stringify(data))
            .then(res=>{
                if(res.status === "success" && res.responseText === 1){
                    resolve(1);
                    new_notification("User have been warned Successfully.");
                }
                else
                    throw res.responseText;
            }).catch(err=>{
                customError(err); 
                resolve(0);
            })
    })
}

function _rejectReport(unm){
    let URL= "/functionality/admin/admin.php";
    let data= {req:'rejectReport',unm};

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

function _deleteGroup(GID){
    let URL= "/functionality/admin/admin.php";
    let data= {req:'deleteGroup',GID};

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


function _getServerEmojis(){
    let url= "/functionality/admin/admin.php";
    data= {req:"getServerEmojis"};

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

function _getPendingEmojis(){
    let url= "/functionality/admin/admin.php";
    data= {req:"getPendingEmojisList"};

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

    let URL= "/functionality/admin/admin.php";
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

function _acceptEmojiAsPublic(emojiID=null){
    if(!emojiID) return;

    let URL= "/functionality/admin/admin.php";
    let data= {req:'acceptEmojiAsPublic',emojiID};

    return new Promise((resolve,reject)=>{
        postReq(URL,JSON.stringify(data))
            .then(res=>{
                console.log(res.responseText);
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