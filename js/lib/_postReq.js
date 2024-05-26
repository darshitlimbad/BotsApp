// js to php post reqest 
const postReq = (url, data=null ,
                    {   method="POST" , 
                        async=true ,
                        Content_Type='application/json',
                        onUploadProgress=null,
                        onDownloadProgress=null,
                    }={}
                ) => {  

    var promise = new Promise((resolve,reject) => {
        const xml = new XMLHttpRequest();

        xml.onload = (res) => {
            if (xml.readyState === 4) {
                if (xml.status === 200) {
                    try{
                        // console.log(res.target.responseText);
                        let resTxt = JSON.parse(res.target.responseText);
                        // console.log({ status:"success", responseText: resTxt });
                        resolve({ status:"success", responseText: resTxt });
                    }
                    catch(err){
                        resolve({ status:"success", responseText: res.target.responseText });    
                    }
                } else {
                    reject({ status: "error", error: 'Something went wrong with AJAX Request.' , code:xml.status });
                }
            }
        };
        
        if(onDownloadProgress){
            xml.onprogress = (progressEvent) => {
                let progress = new Progress(progressEvent);
                onDownloadProgress(progress);
            };
        };
        if(onUploadProgress){
            xml.upload.onprogress = (progressEvent) => {
                let progress = new Progress(progressEvent);
                onUploadProgress(progress);
            }
        };

        xml.onerror = (err) => {
            xml.abort();
            reject({ status: "error", error: 'Something went wrong' , code:xml.status});
        }
        
        xml.ontimeout= ()=>{
            xml.abort();
        }
        xml.open(method, url, async);
        if(method == "POST"){
            xml.setRequestHeader('Content-Type', Content_Type);
            xml.send(data);
        }else if(method == "get"){
            xml.send();
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