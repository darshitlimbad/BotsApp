// global var
    var disabled_pop_up_btn={
        upload_img_form : true,
        upload_doc_form : true,
    };
    document.addEventListener('DOMContentLoaded' ,() => {
        List = document.querySelector("#floatingList");
        img_submit_btn = document.querySelector('#upload_img_form .pop_up_yes_btn ');
        doc_submit_btn = document.querySelector('#upload_doc_form .pop_up_yes_btn ');
    });

    // get dp function // note : this function returns Promise obj
    const get_dp =(unm,GID=null) => {
            var url_for_get_dp = '/functionality/lib/_fetch_data.php';
            var data = {
                req : "get_dp"  
            };
            if(unm && !GID)     data.unm=unm;
            else if(!unm && GID)    data.GID=GID;

            return new Promise((resolve,reject) =>{
                postReq(url_for_get_dp , JSON.stringify(data))
                    .then(res=>{
                        if(res.status == "success" && res.responseText != 0 ){
                            const { data , type } = res.responseText;
                            let base64 = `data:${type};base64,${data}`;
                            
                            _getDataURL(base64)
                                .then(res=>{
                                    if(res.status == 'success')
                                        resolve(res.url);
                                })
                                .catch(err=>{
                                    console.warn(err);
                                })
                        }else{
                            resolve("/img/default_dp.png");
                        }  
                    });
            })
    }

    const _sendAddInChatReq = (unm)=>{
        _hide_this_pop_up(document.querySelector('#confirmation_pop_up'));
        
        url = "/functionality/lib/_notification.php";
        data = JSON.stringify({
            req:'addNoti',
            unm,
            action:"addUserReq",
        });
        
        postReq(url , data)
            .then(res=>{
                if(res.status == "success")
                {
                    switch(res.responseText){
                        case 1:
                            new_notification('@'+unm.concat(" has been succesfully invited to be chatter with you."));
                            getNewNoti();
                            break;
                        case 409:
                            if(getCookie('chat').toLowerCase() != 'personal' )
                                initiateChatBox('Personal');
                            setTimeout(()=>openChat(unm),500);
                            new_notification(`'@${unm}' is already in Your Chatter List`);
                            break;
                        case 403:
                            new_Alert(`sorry,You have already send Chatter request to this '@${unm}'`);
                            break;
    
                        default:
                            new_Alert("Please try again later!! :(");
                        }
                }else if(res.status == "error") {
                    throw res.error;
                }
            }).catch(err=>{
                console.error(err);
                handler.err_400();
            })
    }

    const getNewNoti = ()=>{
        var URL = "/functionality/lib/_notification.php";

        data=JSON.stringify({
            req:"getNewNoti",
        })

        postReq(URL , data)
            .then(res=>{
                if(res.status == "success"){
                    var data=res.responseText;
                    var box = document.querySelector(".noti-box > .conteiner");box.innerHTML="";
                    if(data !== 0){
                        document.querySelector("div[title='Noti'] .img").classList.add("new_noti");
                        var i=0;
                        data.forEach(row=>{
                            box_data=document.createElement("div");box_data.classList.add("box_data");box_data.classList.add(`${row['action']}`);box.appendChild(box_data);
                            if(row['action'] == "addUserReq"){
                                box_data.innerHTML = `
                                    <h4 class="unm">@${row['unm']}</h4>
                                    <div class="hr"></div>
                
                                    <div class="msg">${row['unm']} wants to add you in the Personal chat list,</div>
                
                                    <div class="buttons">
                                        <button name="reject_btn" id="reject_btn" class="danger-button reject_btn button" onclick="_rejectChatterReq('${row['notiID']}')">Reject</button>
                                        <button name="accept_btn" id="accept_btn" class="success-button accept_btn button" onclick="_acceptChatterReq('${row['notiID']}')">Accept</button>
                                    </div> ` ;
                            }else if(row['action'] == "chatterReqRejected"){
                                box_data.innerHTML = `
                                    <h4 class="unm"  style="color:red">@${row['unm']}</h4>
                                    <div class="hr" style="background-color:red"></div>
                                    <div class="msg">${row['unm']} has rejected your chatter request.</div>
                                    <div class="buttons">
                                        <button name="delete_btn" id="delete_btn" class="danger-button delete_btn button" onclick="_deleteThisNoti('${row['notiID']}')">Delete</button>
                                    </div>` ;
                            }else if(row['action'] == "acceptedChatterReq"){
                                box_data.innerHTML = `
                                    <h4 class="unm">@${row['unm']}</h4>
                                    <div class="hr"></div>
                                    <div class="msg">${row['unm']} has Accepted your chatter request.</div>
                                    <div class="buttons">
                                        <button name="delete_btn" id="delete_btn" class="danger-button delete_btn button" onclick="_deleteThisNoti('${row['notiID']}')">Delete</button>
                                    </div>` ;
                            }
                        })
                    }else{
                        document.querySelector("div[title='Noti'] .img").classList.remove("new_noti");
                    }
                }else if(res.status == "error"){
                    throw res.error;
                }
            })
            .catch((err)=>{
                console.error(err);
            })
    }

    const _rejectChatterReq = (notiID)=>{
        var req = "rejectedChatterReq";

        sendNoti(req , notiID)
            .then(res =>{
                if(res == 1){
                    getNewNoti();
                }else{
                    handler.err_400();
                }
            }).catch(err=>{
                console.error(err);
            })
    }

    // accept chatter request
    const _acceptChatterReq = (notiID) => {
        var req = "acceptChatterReq";

        sendNoti(req , notiID )
            .then(res =>{
                if(res == 1){
                    getNewNoti();
                    initiateChatBox(currCht);
                    new_notification("Chatter added succesfully!!!")
                }else{
                    handler.err_400();
                }
            }).catch(err=>{
                console.error(err);
            })
    }

    // delete notification
    const _deleteThisNoti = (notiID) => {
        var req = "deleteThisNoti";

        sendNoti(req , notiID)
            .then(res =>{
                if(res == 1){
                    getNewNoti();
                }else{
                    handler.err_400();
                }
            }).catch(err=>{
                console.error(err);
            })
    }

// the aditional features
    // edit data by user
const _edit_user_data = (ele) => {
    var field=ele.name;
    var value=ele.value;  
    var edit_table = null;
    var req;
    switch(field){
        case 'user-name': 
            edit_table = "users";
            break;
        default : 
            edit_table = "users_details";
    }
    
    if(value == "" && field == "user-name"){
        ele.value = ele.getAttribute("value");
        handler.err_405();
        return;
    }
    
    data = JSON.stringify({
        req:field,
        table: edit_table,
        edit_column: field,
        value,
        });

    var url = "/functionality/_user_edit.php".concat("?key_pass=khulJaSimSim");

    postReq(url , data) 
        .then(res => {
            if(res.status == "success"){
                if ( res.responseText == 1 ){
                    new_notification('data changed succesfully');
                }else{
                    ele.value = ele.getAttribute("value");
                    new_Alert("Something went Wrong :( , Please try again");
                }
            }
        })
        .catch(err => {
            console.error(err);
        });   
};

// togle user theme
const _togle_user_data = (ele) => {

    if(ele.id == "theme"){
        ele.checked = false;
        new_Alert("I am wannabe Backend dev , so don't expect a Light theme from me :)");
        return;
    }
    var field=ele.name;
    var value=(ele.checked) ? '1' : '0';    

    data = JSON.stringify({
        req:field,
        table: 'users_details',
        edit_column: field,
        value,
        });

    var url = "/functionality/_user_edit.php".concat("?key_pass=khulJaSimSim");

    postReq(url , data) 
        .then(res => {
                if((res.status == "success") && (res.responseText == 0)){
                    ele.checked = (value == 1) ?  false : true;
                    new_Alert('Something Went Wrong , Please Try Again');
                }
            })
        .catch(err => {
            console.error(err);
        });   
};

const _confirmation_pop_up = (title , message , action , theme = 'blue') => {

    var confirmation_pop_up = document.querySelector('#confirmation_pop_up');
    
    var title_ele = confirmation_pop_up.querySelector('.title');
    title_ele.textContent=title;
    confirmation_pop_up.querySelector('hr').style.border='1px solid '.concat(theme);

    var message_ele = confirmation_pop_up.querySelector('.message');
    message_ele.textContent = message;

    var yes_btn = confirmation_pop_up.querySelector('.pop_up_yes_btn');
    if(action == "DeleteAccount"){
        yes_btn.setAttribute('onclick' , `window.location.assign('/functionality/_delete_account.php?key_pass=khulJaSimSim')` );
    }else if(action == "LogOut"){
        yes_btn.setAttribute('onclick' , `window.location.assign('/functionality/_log_out.php?key_pass=khulJaSimSim')` );
    }else if(action == "addUserReqConfirm"){
        yes_btn.setAttribute('onclick' , `_sendAddInChatReq('${title}')`);
    }

    if(theme == 'blue'){
        yes_btn.style.backgroundColor = "rgb(0 56 254 / 52%)";
    }else if(theme == 'red'){
        yes_btn.style.backgroundColor = "rgb(255 0 0 / 53%)";
    }else {
        yes_btn.style.backgroundColor = theme;
    }

    _show_this_pop_up(confirmation_pop_up);

}


const _upload_doc_form = (title , action , theme = 'blue') => {
    _submit_btn_disable(doc_submit_btn);

    var upload_doc_form = document.querySelector('#upload_doc_form');
    upload_doc_form.querySelector("#doc").onchange=(e)=>upload_doc_validation(e.target);
    
    var title_ele = upload_doc_form.querySelector('.title');
    title_ele.style.color = 'aliceblue';
    title_ele.textContent = title;

    upload_doc_form.querySelector('hr').style.border='1px solid '.concat(theme);
    var yes_btn = upload_doc_form.querySelector(".buttons .pop_up_yes_btn");
    yes_btn.style.backgroundColor = theme;
    yes_btn.style.outlineColor=theme;

    if(action == "USER_SEND_DOC"){
        yes_btn.onclick = ()=> {
            if(!disabled_pop_up_btn.upload_doc_form){
                _submit_btn_disable(doc_submit_btn);
                _trigerSendMsg("doc");
            }
        };
    }

    _show_this_pop_up(upload_doc_form);

    function upload_doc_validation(doc_input){
        if(doc_input.value != null || doc_input.value != "")
            _submit_btn_enable(doc_submit_btn);
        else
            _submit_btn_disable(doc_submit_btn);
    }
}

const _upload_img_form = (title , action , theme = 'blue') => {
    _submit_btn_disable(img_submit_btn);

    var upload_img_form = document.querySelector('#upload_img_form');
    upload_img_form.querySelector("#avatar").onchange=()=>avatar_validation();
    
    var title_ele = upload_img_form.querySelector('.title');
    title_ele.style.color = 'aliceblue';
    title_ele.textContent = title;

    upload_img_form.querySelector('hr').style.border='1px solid '.concat(theme);
    var yes_btn = upload_img_form.querySelector(".buttons .pop_up_yes_btn");
    yes_btn.style.backgroundColor = theme;
    yes_btn.style.outlineColor=theme;

    if(action == "USER_DP_UPDATE"){
        yes_btn.addEventListener('click',_uploadDP);
    }else if(action == "USER_SEND_IMG"){
        yes_btn.onclick = ()=> {
            if(!disabled_pop_up_btn.upload_img_form){
                upload_img_form.querySelector(".avatar_preview").src="/img/icons/loader.svg";
                _submit_btn_disable(img_submit_btn);
                _trigerSendMsg("img");
            }
        };
    }

    _show_this_pop_up(upload_img_form);
}

const _uploadDP = () => {
    _submit_btn_disable(img_submit_btn); 
    img = avatar.files[0];

    _read_doc(img)
        .then( result => {
            
            img_binary_data = result.split(',').pop();
            var value = {
                img_data : img_binary_data,
                size     : img.size,
            };

            data = JSON.stringify(
                {
                    req: 'updateDP',
                    table: 'users_avatar',
                    edit_column: '',
                    value ,
                });

            var url = window.location.origin+"/functionality/_user_edit.php".concat("?key_pass=khulJaSimSim");
            postReq(url , data)
                .then(res => {
                    if(res.status == "success"){
                        if(res.responseText == 1){
                            _hide_this_pop_up(upload_img_form);
                            document.querySelectorAll('.avatar').forEach(img => {
                                img.src = result;
                            })
                            new_notification("data changed succesfully");
                        }else{
                            try{
                                handler["err_"+res]();
                            }catch(err){
                                handler["err_400"]();
                            }
                        }
                    }
                })
                .catch(err => {
                    console.error(err);
                    handler.err_400();
                });

        })
        .catch(err => {
            console.error(err);
            return;
        });
};

const _read_doc = (data, field = 'data') => {
    return new Promise( (resolve,reject) => {
        var fReader = new FileReader();

        fReader.onload = (event) => {
            if(field == 'data')
                resolve(event.target.result);
            else if(field == 'details')
                resolve(event);
        }

        fReader.onerror = ()=>reject();
        fReader.readAsDataURL(data);
    } );
}

function _getDataURL(source){
    return new Promise((resolve,reject)=>{
        fetch(source)
        .then(res=>{
            if(res.ok && res.status == 200)
                return res.blob()
            else
                resolve({status:'error',error:400 });
        })
        .then(blob=>{
            let url = URL.createObjectURL(blob);
            resolve({status:'success',url:url});
        })
    })
}

const _add_new_chatter_form = () => {
    theme = 'blue';
    var add_new_chat_form = document.querySelector('#add_new_chat_form');
    add_new_chat_form.querySelector('hr').style.border='1px solid '.concat(theme);

    _show_this_pop_up(add_new_chat_form);
}

const _search_users_by_unm = (unm) => {
    const List = document.querySelector("div#floatingList");

    if(unm.length < 3){
        _closeList();
        return; 
    }

    var data = JSON.stringify({
        req :"get_unm",
        from : "add_new_chat",
        value : unm,
    });

    URL_for_search_users = "/functionality/lib/_fetch_data.php";

    postReq(URL_for_search_users , data )
        .then( res => {
            if(res.status == "success"){
                _showList();_addDataInList(res.responseText);
            }
        })
        .catch(err=>{
            console.error(err);
        })

}

const _addDataInList = (data) => {
    body = document.querySelector('#floatingList > tbody');
    List.removeChild(body);
    body = document.createElement("tbody");
    List.appendChild(body);
    if(data == '0'){
        body.setAttribute("class" , "center");
            let tr= document.createElement('tr');body.appendChild(tr);
                let td= document.createElement('td');td.style.color="red";td.textContent="No Data Found!!";tr.appendChild(td);
    }else{
        data.forEach( ele => {
            var unm = ele.unm;

            let tr= document.createElement('tr');tr.classList.add("node");tr.setAttribute("onclick",`toggle_confirmation_pop_up('add_new_chatter','${unm}')`);body.appendChild(tr);
                let tdImg=document.createElement('td');tr.appendChild(tdImg);
                    var dpImg = new Image(); dpImg.src="/img/default_dp.png"; dpImg.setAttribute("onerror","this.src='/img/default_dp.png'");tdImg.appendChild(dpImg);
                let tdUnm=document.createElement('td');tr.appendChild(tdUnm);
                    let strongTag = document.createElement("strong");tdUnm.appendChild(strongTag);strongTag.textContent=`@${ele['unm']}`;

            get_dp(unm).then(dp=>dpImg.src=dp);
        });
    }

}

function _submit_btn_disable(btn=img_submit_btn) {
    btn.style.filter = "brightness(0.05)";
    btn.setAttribute('disabled' , true);
    disabled_pop_up_btn[btn.closest('.pop_up').id] = true;
}

function _submit_btn_enable(btn=img_submit_btn) {
    btn.style.removeProperty("filter");
    btn.removeAttribute('disabled');
    disabled_pop_up_btn[btn.closest('.pop_up').id] = false;
}

function _show_this_pop_up(pop_up) {
    pop_up.style.display = 'block';

    setTimeout(() => {
        pop_up.style.transform = "translateY(0)";
        pop_up.style.opacity = '100%';
    } , 20);

    if(pop_up.id == "add_new_chat_form"){
        setTimeout(() => {
            pop_up.addEventListener('click' , _onClickCloseList);
            document.addEventListener('click' , _hide_add_new_form);                
        }, 20);
    }else if(pop_up.id == "confirmation_pop_up"){
        setTimeout(()=>{
            document.addEventListener('click',hide_confirmation_pop_up);
        }, 20);
    }else if(pop_up.id == "upload_img_form"){
        setTimeout(()=>{
            document.addEventListener('click', hide_upload_img_form)
        },20);
    }else if(pop_up.id == "upload_doc_form"){
        setTimeout(()=>{
            document.addEventListener('click', hide_upload_doc_form)
        },20);
    }
}
function _hide_this_pop_up(pop_up) {
    pop_up.style.transform = "translateY(-500px)";

    // set values to default
    if(pop_up.id == "upload_img_form"){
        avatar.value = null;
        avatar.style.color = 'aliceblue';
        avatar_span.style.display = 'none';
        document.querySelector('.avatar_preview').src = '../img/default_dp.png';
        document.removeEventListener('click', hide_upload_img_form);
    }else if(pop_up.id == "add_new_chat_form"){
        document.querySelector('input#username').value=null;
        pop_up.click();
        pop_up.removeEventListener('click' , _onClickCloseList);
        document.removeEventListener('click' , _hide_add_new_form)
    }else if(pop_up.id == "confirmation_pop_up"){
        document.removeEventListener('click',hide_confirmation_pop_up);
    }else if(pop_up.id == "upload_doc_form"){
        doc.value = null;
        doc.style.color = 'aliceblue';
        document.removeEventListener('click',hide_upload_doc_form);
    }
    setTimeout(() => {
        pop_up.style.opacity = '0%';
        pop_up.style.display='none';
    } , 100);
}

const hide_confirmation_pop_up = (e=null)=>{
    if( e!=null && (!e.target.closest('#confirmation_pop_up')))  _hide_this_pop_up(document.querySelector('div#confirmation_pop_up'));
};
const hide_upload_img_form = (e)=>{
    if( e!=null && (!e.target.closest('#upload_img_form'))) _hide_this_pop_up(document.querySelector('div#upload_img_form'));
};
const hide_upload_doc_form = (e)=>{
    if( e!=null && (!e.target.closest('#upload_doc_form'))) _hide_this_pop_up(document.querySelector('div#upload_doc_form'));
};

const _hide_all_pop_up = () => {
    _ClosePopUp(confirmation_pop_up);
    _ClosePopUp(upload_img_form);
    _ClosePopUp(add_new_chat_form);
}

const _hide_add_new_form=(event)=>{
    if( (!event.target.closest("#add_new_chat_form")) &&
        (!event.target.closest("#confirmation_pop_up")) ){
        _hide_this_pop_up(document.querySelector('#add_new_chat_form'));
    }
};

const _ClosePopUp = (pop_up) => {
    if(pop_up.style.display == 'block') _hide_this_pop_up(pop_up);
}

const _onClickCloseList= (event) => {
    if(!event.target.closest("input#username") &&
        !event.target.closest("#confirmation_pop_up") &&
        !event.target.closest("#floatingList") ){
        _closeList();
    }
}

const _showList = () => {
    List.style.display='flex';
    List.style.opacity = 1;
}

const _closeList = () => {
    List.style.opacity = 0;

    setTimeout( ()=>{
        List.style.display='none';
    } , 100) 
}

function convert_bytes(size){
    if (size == null) {
        return;
    }

    count = 0; 
    while( size >= 1024){
        size /= 1024;
        count++;
    }
    regExp = /\./;
    if(regExp.test(size))   size=size.toFixed(2);

    switch(count){
        case 1:
            size += " KB";
            break;
        case 2:
            size += " MB";
            break;
        case 3:
            size += " GB";
            break;  
    }

    return size;
}

function previewImg(imgUrl,imgName,imgSize){   
    let preview = document.createElement('div');
    preview.id="preview";
    preview.classList.add('fullScreen');

        let details = document.createElement('div');
        details.classList.add('details');
        preview.appendChild(details);
        
            let name = document.createElement('h4');
            name.classList.add('name');
            name.textContent= imgName;
            details.appendChild(name);
            
            let size = document.createElement('span');
            size.classList.add('size');
            size.textContent= imgSize;
            details.appendChild(size);
        
        let imgObj = new Image();
        imgObj.classList.add('img');
        imgObj.alt="Image was not able to load, Please try again."
        imgObj.src=imgUrl;
        preview.appendChild(imgObj);

        let flexBox = document.createElement('div');
        flexBox.classList.add('flexBox');
        preview.appendChild(flexBox);

            let fullScreenIcon = document.createElement('button');
            fullScreenIcon.classList.add('fullScreenIcon','ele');
            fullScreenIcon.title = "Full Screen View";
            fullScreenIcon.tabIndex= '0';
            fullScreenIcon.onclick=()=>fullScreen(preview);
            flexBox.appendChild(fullScreenIcon);

                let fullScreenIconImg = document.createElement('div');
                fullScreenIconImg.classList.add('icon');
                fullScreenIcon.appendChild(fullScreenIconImg);

            let close = document.createElement('button');
            close.classList.add('close','ele');
            close.title = "Close";
            close.tabIndex= '0';
            close.onclick=()=>preview.remove();
            flexBox.appendChild(close);

                let imgClose=new Image();
                imgClose.src="img/icons/close.png";
                imgClose.alt="Close";
                close.appendChild(imgClose);
    
    chat.appendChild(preview);
    return 1;
}

function fullScreen(node){
    if(document.fullscreenElement === node)
        document.exitFullscreen();
    else
        node.requestFullscreen();
}