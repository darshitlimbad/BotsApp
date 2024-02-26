// js to php post reqest 
const postReq = (url, data) => {
    return new Promise((resolve, reject) => {
        const xml = new XMLHttpRequest();

        xml.onreadystatechange = () => {
            if (xml.readyState === 4) {
                if (xml.status === 200) {
                    var response = JSON.parse(xml.responseText);
                    resolve(response);
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


// edit data by user
const _edit_user_data = (ele) => {
        // ele is the html ele of the dom to change there also
        
        // field is the column name to edit 
        var field=ele.name;
        // value is the value of thet column
        var value=ele.value;    

        console.log(field);
    url = window.location.origin+"/functionality/_user_edit.php?edit=".concat(field);
    data = JSON.stringify({data : value});

    postReq(url , data) 
    .then(response => {
        if(response == 0){
            window.location.assign(window.location.origin+window.location.pathname.concat('?ERROR=400'));
        }else if (response == 1 ){
            new_notification('data changed');
        }
    })
    .catch(err => {
        console.error(err);
    });   

};

// togle user theme
const _togle_user_data = (ele) => {
    
    var field=ele.name;
    var value=(ele.checked) ? '1' : '0';    
url = window.location.origin+"/functionality/_user_edit.php?edit=".concat(field);
data = JSON.stringify({data : value});

postReq(url , data) 
.then(response => {
    if(response == 0){
        ele.checked = (value == 1) ?  false : true;
        new_Alert('Something Went Wrong , Please Try Again');
    }else if (response == 1 ){
        new_notification('data changed');
    }
})
.catch(err => {
    console.error(err);
});   

};
