// global var
    var disabled_img_pop_up_btn=true;
    document.addEventListener('DOMContentLoaded' , () => {
        List = document.querySelector("#floatingList");
        submit_btn = document.querySelectorAll('#upload_img_form .pop_up_yes_btn ');
    });

    // get dp function // note : this function returns Promise obj
    const get_dp =async (unm) => {
            var url_for_get_dp = '/functionality/lib/_fetch_data.php';
            var data = JSON.stringify({
                unm: unm,
                action : "get_dp"  
            });

            var res= await postReq(url_for_get_dp , data);
                if(res.status == "success"){
                    const { data , type } = res.responseText;
                    return `data:${type};base64,${data}`;
                }
    }

    const _sendAddInChatReq = async (unm)=>{
        _hide_this_pop_up(document.querySelector('#confirmation_pop_up'));
        
        url = "/functionality/lib/_notification.php";
        data = JSON.stringify({
            req:'addNoti',
            unm:unm,
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
                            new_Alert(`oops,'@${unm}' is already in Your Chatter List`);
                            break;
                        case 403:
                            new_Alert(`oops,You have already send Chatter request to this '@${unm}'`);
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
                                    <div class="msg"> Do you want to add him/her as a chatter?</div>
                
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

    switch(field){
        case 'user-name': 
            edit_table = "users";
            break;
        default : 
            edit_table = "users_details";
    }

    console.log(ele);
    
    if(value == "" && field == "user-name"){
        ele.value = ele.getAttribute("value");
        handler.err_405();
        return;
    }
    
    data = JSON.stringify({
        table: edit_table,
        edit_column: field,
        data : value ,
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
    data = JSON.stringify(
        {
        table: 'users_details',
        edit_column: field,
        data : value 
        });

    var url = window.location.origin+"/functionality/_user_edit.php".concat("?key_pass=khulJaSimSim");

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

const _upload_img_form = (title , action , theme = 'blue') => {
    _submit_btn_disable();

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
            if(!disabled_img_pop_up_btn){
                _submit_btn_disable();
                _trigerSendMsg("img");
            }
        };
    }

    _show_this_pop_up(upload_img_form);

}

const _uploadDP = () => {
    _submit_btn_disable(); 
    img = avatar.files[0];

    _read_img(img)
        .then( result => {
            
            img_binary_data = result.split(',').pop();
            var value = {
                img_data : img_binary_data,
                size     : img.size,
            };

            data = JSON.stringify(
                {
                    table: 'users_avatar',
                    edit_column: '',
                    data : value ,
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

const _read_img = (img, field = 'data') => {
    return new Promise( (resolve,reject) => {
        var fReader = new FileReader();

        fReader.onload = (event) => {
            if(field == 'data')
                resolve(event.target.result);
            else if(field == 'details')
                resolve(event);
        }
        fReader.onerror = ()=>reject();
        fReader.readAsDataURL(img);
    } );
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
        action :"get_unm",
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
        console.log(data);
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

function _submit_btn_disable() {
    submit_btn.forEach( (ele)=>{
        ele.style.filter = "brightness(0.05)";
        ele.setAttribute('disabled' , true);
    })
    disabled_img_pop_up_btn =true; 
}

function _submit_btn_enable() {
    submit_btn.forEach( (ele)=>{
        ele.style.removeProperty("filter");
        ele.removeAttribute('disabled');
    })

    disabled_img_pop_up_btn =false; 
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
    if( e!=null && (!e.target.closest('#upload_img_form'))) _hide_this_pop_up(document.querySelector('div#upload_img_form'))
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

const getImgDimension = (imgFile) => {
    return new Promise((resolve,reject)=>{
        var newImg = new Image();
        newImg.src = URL.createObjectURL(imgFile);
    
        newImg.onload= ()=>{
            var dimension={
                w:newImg.width,
                h:newImg.height,
            }
            resolve(dimension);
        };
    });
    
}