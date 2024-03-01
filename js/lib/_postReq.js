// js to php post reqest 
const postReq = (url, data) => {
    return new Promise((resolve, reject) => {
        const xml = new XMLHttpRequest();

        xml.onreadystatechange = (res) => {
            if (xml.readyState === 4) {
                if (xml.status === 200) { 
                    resolve(res.target.response);
                } else {
                    reject(new Error(`HTTP status ${xml.status}`));
                }
            }
        };

        xml.open('POST', url, true);
        xml.setRequestHeader('Content-Type', 'application/json');
        xml.send(data);
    });
};