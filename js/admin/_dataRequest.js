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