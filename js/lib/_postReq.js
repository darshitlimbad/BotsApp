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
                    // console.log(res.target.responseText);
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