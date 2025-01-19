// js to php post reqest 
const postReq = (url, data=null ,
                    {   
                        method="POST" , 
                        async=true ,
                        Content_Type='application/json',
                        onUploadProgress=null,
                        onDownloadProgress=null,
                        onDOwnloadAbortXMLOrNot=null,
                        onUploadAbortXMLOrNot=null,
                    }={}
                ) => {  

    var promise = new Promise((resolve,reject) => {
        const XHR = new XMLHttpRequest();

        XHR.onload = (res) => {
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    try{                        
                        let resTxt = JSON.parse(res.target.responseText);
                        // console.log({ status:"success", responseText: resTxt });
                        resolve({ status:"success", responseText: resTxt });
                    }
                    catch(err){
                        resolve({ status:"success", responseText: res.target.responseText });    
                    }
                } else {
                    reject({ status: "error", error: 'Something went wrong with AJAX Request.' , code:XHR.status });
                }
            }
        };

        if(onDownloadProgress){
            XHR.onprogress = (progressEvent) => {
                let progress = new Progress(progressEvent);
                onDownloadProgress(progress);
            };
        }
        if(onUploadProgress){
            XHR.upload.onprogress = (progressEvent) => {
                let progress = new Progress(progressEvent);
                onUploadProgress(progress);
            }
        }
        if(onDOwnloadAbortXMLOrNot){
            XHR.onprogress=()=>{
                if(onDOwnloadAbortXMLOrNot()){
                    XHR.abort();
                    // reject({ status: "abort", error: 'Process has been aborted.' , code:XHR.status});
                }
            }
        }
        if(onUploadAbortXMLOrNot){
            XHR.upload.onprogress=()=>{
                if(onUploadAbortXMLOrNot()){
                    XHR.abort();
                }
            }
        }

        XHR.onerror = (err) => {
            XHR.abort();
            reject({ status: "error", error: 'Something went wrong' , code:XHR.status});
        }
        
        XHR.ontimeout= ()=>{
            XHR.abort();
            reject({ status: "error", error: 'Request Timeout.' , code:XHR.status});
        }

        XHR.onabort=()=>{
            reject({ status: "abort", error: 'Process has been aborted.' , code:XHR.status});
        }
        
        XHR.open(method, url, async);
        if(method == "POST"){
            XHR.setRequestHeader('Content-Type', Content_Type);
            XHR.send(data);
        }else if(method == "get"){
            XHR.send();
        }
    });

    return promise;
};


class Progress {
    done=false;
    loaded=null;
    total=null;
    timeStamp=null;

    constructor(progressEvent){
        this.loaded = progressEvent.loaded;
        this.total = progressEvent.total;
        this.timeStamp=progressEvent.timeStamp;

        if(this.loaded == this.total)   this.done=true;
    }
}