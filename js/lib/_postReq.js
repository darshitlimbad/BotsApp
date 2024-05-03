// js to php post reqest 
const postReq = async (url, data=null ,Uheader=null) => {
    var header = {
        method:"POST" , 
        async:true ,
        'Content-Type':'application/json',
        ...Uheader 
    };
            // add option to save data in the tmp filefor better performance
    
    var promise = new Promise((resolve,reject) => {
        const xml = new XMLHttpRequest();

        xml.onload = (res) => {
            if (xml.readyState === 4) {
                if (xml.status === 200) {
                    let resTxt = JSON.parse(res.target.responseText);
                    // console.log({ status:"success", responseText: resTxt });
                    resolve({ status:"success", responseText: resTxt });
                } else {
                    reject({ status: "error", error: new Error(`HTTP status ${xml.status}`) });
                }
            }
        };

        xml.onerror = (err) => {
            reject(new Error("Something went wrong ",xml.status));
        }
        
        xml.open(header.method, url, header.async);
        if(header.method == "POST"){
            xml.setRequestHeader('Content-Type', header['Content-Type']);
            xml.send(data);
        }else if(header.method == "get"){
            xml.send();
        }
    });

    return promise;
};

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

//// work in progress
// const _getDoc = (msgID)=> {
//     var url = "/functionality/lib/_chat.php";

//     var data = JSON.stringify({
//         req : "getDoc",
//         msgID : msgID,
//     });

//     postReq(url,data)
//         .then(res => {
//             console.log(res);
//         })
// }
////

const _sendMsg = async (data) =>{
    var url="/functionality/lib/_chat.php";
    var time = Date.now();
    
    if(!(data.type && (data.msg || (data.fileName && data.blob))))  return 0;

    data = JSON.stringify({
        req:"sendMsg",
        toUnm:getCookie("currOpenedChat"),
        ...data,
    });

    try{
        // create a promise
        var resObj=null;
        if(type == "text"){
            resObj = await postReq(url,data);
            return resObj;
        }else{
            postReq(url,data,{ getHeaders:true })
                    .then(res => {
                        console.log(res);
                    });
// var reader = req.body.getReader();
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
                // console.log(req);
        }

        // return resObj;
    }catch(err){
        return 0;
    }
}