// js to php post reqest 
const postReq = (url, data , method="POST") => {
    return new Promise((resolve, reject) => {
        const xml = new XMLHttpRequest();

        xml.onreadystatechange = (res) => {
            if (xml.readyState === 4) {
                if(xml.status === 200) {
                    resolve(JSON.parse(res.target.response));
                } else {
                    reject(new Error(`HTTP status ${xml.status}`));
                }
            }
        };

        xml.open(method, url, true);
        if(method == "POST"){
            xml.setRequestHeader('Content-Type', 'application/json');
            xml.send(data);
        }else if(method == "get"){
            xml.send();
        }
        
    });
};

const getUserID = () => {
    return new Promise((resolve , reject) => {
        getUserID_URL = "/functionality/lib/_validation.php";
        data = JSON.stringify({
            action:"userID",
        });

        postReq(getUserID_URL , data)
            .then(res=>{
                resolve(res);
            }).catch(err=>{
                reject(err);
            })
    })    
}