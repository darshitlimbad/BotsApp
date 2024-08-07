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
            var dataToSend = {
                req : "get_dp",
            };

            (GID) ? dataToSend.GID=GID : dataToSend.unm=unm ;

            return new Promise(async (resolve,reject) =>{
                try{
                    var key= 'cache-dp-'+ ((GID) ? GID : unm);
                    var base64= localStorage.getItem(key);
                    if(base64){
                        base64= atob(base64);
                    }else{
                        let res= await postReq(url_for_get_dp , JSON.stringify(dataToSend));
                        if(res.status != "success" || res.responseText == 0 || !res.responseText.data )
                            throw res.responseText;
                        
                        const { data , mime } = res.responseText;
                        base64 = `data:${mime};base64,${data}`;
                        _getDataURL(base64)
                            .then(res=>{
                                if(res.status == 'success')
                                    localStorage.setItem(key, btoa(res.url));
                            })
                            .catch(err=>{
                                console.warn(err);
                            })
                    }

                    resolve(base64)
                }catch(err){
                    resolve("/img/default_dp.png");
                }
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
                if(res.status == "success" && !res.responseText.error){
                    switch(res.responseText){
                        case 1:
                            new_notification('@'+unm.concat(" has been succesfully invited to be chatter with you."));
                            break;
                        case 409:
                            if(getCookie('chat').toLowerCase() != 'personal' )
                                initiateChatBox('Personal');
                            setTimeout(()=> new openChatClass(unm),500);
                            new_notification(`'@${unm}' is already in Your Chatter List`);
                            break;
                        case 403:
                            new_Alert(`sorry,You have already send Chatter request to this user '@${unm}'`);
                            break;
                        default:
                            new_Alert("Please try again later!! :(");
                            throw res.responseText;
                        }
                }else if(res.status == "error") {
                    throw res;
                }else{
                    throw res.responseText;
                }
            }).catch(err=>{
                if(handler['err_'+err.code])
                    handler['err_'+err.code]();
                else
                    handler.err_400();
                console.error(err);
            })
    }

    const getNewNoti = ()=>{
        var URL = "/functionality/lib/_notification.php";

        let data=JSON.stringify({
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
                            // adding green color font span to to emojis related messages (if there is any)
                            if(row.msg?.msg)
                                row.msg.msg.replace(new RegExp(/:\w+:/,'gi'),match=>`<span class='green'>${match}</span>`);


                            if(row['action'] == "addUserReq"){
                                box_data=document.createElement("div");box_data.classList.add("box_data");
                                box_data.classList.add(`${row['action']}`);
                                box.appendChild(box_data);

                                box_data.innerHTML = `
                                    <h4 class="unm">@${row['unm']}</h4>
                                    <div class="hr"></div>
                
                                    <li class="msg">${row['unm']} wants to add you in the Personal chat list,</li>
                
                                    <div class="buttons">
                                        <button name="reject_btn" id="reject_btn" class="danger-button reject_btn button" onclick="_rejectChatterReq('${row['notiID']}')">Reject</button>
                                        <button name="accept_btn" id="accept_btn" class="success-button accept_btn button" onclick="_acceptChatterReq('${row['notiID']}')">Accept</button>
                                    </div> ` ;
                            }else if(row['action'] == "chatterReqRejected"){
                                box_data=document.createElement("div");box_data.classList.add("box_data");
                                box_data.classList.add(`${row['action']}`);
                                box.appendChild(box_data);

                                box_data.innerHTML = `
                                    <h4 class="unm"  style="color:red">@${row['unm']}</h4>
                                    <div class="hr" style="background-color:red"></div>
                                    <li class="msg">${row['unm']} has rejected your chatter request.</li>
                                    <div class="buttons">
                                        <button name="delete_btn" id="delete_btn" class="danger-button delete_btn button" onclick="_deleteThisNoti('${row['notiID']}')">Delete</button>
                                    </div>` ;
                            }else if(row['action'] == "acceptedChatterReq"){
                                box_data=document.createElement("div");box_data.classList.add("box_data");
                                box_data.classList.add(`${row['action']}`);
                                box.appendChild(box_data);
                                
                                box_data.innerHTML = `
                                    <h4 class="unm">@${row['unm']}</h4>
                                    <div class="hr"></div>
                                    <li class="msg"><span class='highlight'>${row['unm']}</span> has Accepted your chatter request.</li>
                                    <div class="buttons">
                                        <button name="delete_btn" id="delete_btn" class="danger-button delete_btn button" onclick="_deleteThisNoti('${row['notiID']}')">Delete</button>
                                    </div>` ;
                            }else if(row['action'] == "groupMemberAdded"){
                                box_data=document.createElement("div");box_data.classList.add("box_data");
                                box_data.classList.add(`${row['action']}`);
                                box.appendChild(box_data);
                                
                                box_data.innerHTML = `
                                    <li class="msg">You have been added to the group <span class='highlight'>'${row.msg.gName}'</span> by @${row.unm}.</li>
                                    <div class="buttons">
                                        <button name="delete_btn" id="delete_btn" class="danger-button delete_btn button" onclick="_deleteThisNoti('${row['notiID']}')">Delete</button>
                                    </div>` ;
                            }else if(row['action'] == "groupRemovedMember"){
                                box_data=document.createElement("div");box_data.classList.add("box_data");
                                box_data.classList.add(`${row['action']}`);
                                box.appendChild(box_data);

                                box_data.innerHTML = `
                                    <li class="msg">You have been <span class='highlight red'>Removed</span> from the group <span class='highlight'>'${row.msg.gName}'</span> by @${row.unm}.</li>
                                    <div class="buttons">
                                        <button name="delete_btn" id="delete_btn" class="danger-button delete_btn button" onclick="_deleteThisNoti('${row['notiID']}')">Delete</button>
                                    </div>` ;
                            }else if(row['action'] === 'reloadChat'){
                                _deleteThisNoti(row.notiID);
                                let chat= getCookie('chat').toLowerCase();
                                let currOpenedChat= getCookie('currOpenedChat');
                                if( chat === row.msg.chat && currOpenedChat
                                    && (( chat === 'personal' && currOpenedChat === row.unm) 
                                    || ( chat === 'group' && currOpenedChat === row.msg.gName )))
                                    closeChat();
                                    
                                openChatList();
                            }else if(row['action'] === 'msgDeleted'){
                                _deleteThisNoti(row.notiID);

                                if( (getCookie('chat').toLowerCase() === 'personal' 
                                    && getCookie('currOpenedChat') === row.unm) || getCookie('chat').toLowerCase() === 'group'  )
                                        chat.querySelector(`div[data-msgid='${row.msg.msgID}'`)?.remove();
                                    
                                // if(getCookie('chat').toLowerCase() === 'personal'){
                                //     var cacheData= JSON.parse(decodeURIComponent(atob(localStorage.getItem('cache-msgData-'+row.unm))));
                                //     if(cacheData){
                                //         cacheData=cacheData.filter(data=>data.msgID != msgID);
                                //         localStorage.setItem('cache-msgData-'+openedChat, btoa(encodeURIComponent(JSON.stringify(cacheData))));
                                //         localStorage.removeItem('cache-msgData-'+row.unm);
                                //     }
                                    
                                // }
                                
                            }else if(row['action'] === "warning"){
                                box_data=document.createElement("div");
                                box_data.classList.add("box_data",`${row['action']}`);
                                box.appendChild(box_data);

                                box_data.innerHTML = `
                                    <h4 class="unm"  style="color:red">@${row['unm']}</h4>
                                    <div class="hr" style="background-color:red"></div>
                                    <li class="msg">${row.msg.msg}</li>
                                    <div class="buttons">
                                        <button name="delete_btn" id="delete_btn" class="danger-button delete_btn button" onclick="_deleteThisNoti('${row['notiID']}')">Delete</button>
                                    </div>` ;
                            }else if(row['action'] === "info"){
                                box_data=document.createElement("div");
                                box_data.classList.add("box_data",`${row['action']}`);
                                box.appendChild(box_data);

                                box_data.innerHTML = `
                                    <h4 class="unm"  style="color:green">@${row['unm']}</h4>
                                    <div class="hr" style="background-color:green"></div>
                                    <li class="msg">${row.msg.msg}</li>
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
            .then(res=>{
                getNewNoti();
            });
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
                }
            }).catch(err=>{
                console.error(err);
            })
    }

    // delete notification
    const _deleteThisNoti = (notiID) => {
        var req = "deleteThisNoti";

        sendNoti(req , notiID)
            .then(res=>{
                getNewNoti();
            });
    }

// the aditional features
    // edit data by user
const _edit_user_data = (ele) => {
    var field=ele.name;
    var value=ele.value;
    
    if(value == "" && field == "user-name"){
        ele.value = ele.getAttribute("value");
        handler.err_405();
        return;
    }
    
    let data = {
        req:field,
        edit_column: field,
        value,
        };


    var url = "/functionality/_user_edit.php".concat("?key_pass=khulJaSimSim");
    postReq(url , JSON.stringify(data)) 
        .then(res => {
            if(res.status == "success"){
                if ( res.responseText == 1 ){
                    handler.suc_dataChanged();
                }else{
                    ele.value = (ele.name == 'about')? ele.getAttribute('data-oldValue'): ele.getAttribute("value");
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
    const confirmation_pop_up = document.querySelector('#confirmation_pop_up');
    
    let imgEle=confirmation_pop_up.querySelector('img');
    imgEle.style.display="none";

    var title_ele = confirmation_pop_up.querySelector('.title');
    title_ele.textContent=title;
    confirmation_pop_up.querySelector('hr').style.border='1px solid '.concat(theme);

    var message_ele = confirmation_pop_up.querySelector('.message');
    message_ele.innerHTML = message;

    var yes_btn = confirmation_pop_up.querySelector('.pop_up_yes_btn');

    if(action === "DeleteAccount"){
        yes_btn.onclick=()=> window.location.assign('/functionality/_delete_account.php?key_pass=khulJaSimSim');
    }else if(action === "LogOut"){
        yes_btn.onclick=()=> window.location.assign('/functionality/_log_out.php?key_pass=khulJaSimSim');
    }else if(action === "addUserReqConfirm"){
        let imgEle=confirmation_pop_up.querySelector('img');
        imgEle.style.display="block";
        get_dp(title).then(url=>imgEle.src=url);
        yes_btn.onclick=()=> _sendAddInChatReq(`${title}`);
    }else if(action === "remove_chat"){
        yes_btn.onclick=()=>{
            _hide_this_pop_up(document.querySelector('#confirmation_pop_up'));
            _deleteChat();
        }
    }else if(action === "block_chat"){
        yes_btn.onclick=()=>{
            _hide_this_pop_up(document.querySelector('#confirmation_pop_up'));
            _blockChat();
        }
    }else if(action.req == "delete_this_msg"){
        yes_btn.onclick=()=> {
            _deleteMsg(action.msgID);
            _hide_this_pop_up(document.querySelector('#confirmation_pop_up'));
        }
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

const _report_pop_up = (chatterType) => {
    const report_pop_up = document.querySelector('#report_pop_up');
    const reportReasonInput= report_pop_up.querySelector('.input_field input');
    
    var title_ele = report_pop_up.querySelector('.title');
    title_ele.textContent='report '+chatterType;
    
    var yes_btn = report_pop_up.querySelector('.pop_up_yes_btn');
    yes_btn.disabled=true;

    reportReasonInput.value="";
    reportReasonInput.onkeyup=()=>{
        yes_btn.disabled= (!reportReasonInput.value)? true : false;
        reportReasonInput.style.border= (yes_btn.disabled) ? "1px solid red" : 'none';
    }

    yes_btn.onclick=()=>{
        if(!reportReasonInput.value){
            reportReasonInput.style.border= "1px solid red";
            yes_btn.disabled=true;
            return;
        }

        _reportChat(reportReasonInput.value);
    }

    _show_this_pop_up(report_pop_up);

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
        if(doc_input.files[0]){
            if(doc_input.files[0].size > 16777216){
                doc_span.textContent="Maximum File Size is 16 MB";
                doc_span.style.display='block';
            }else{
                _submit_btn_enable(doc_submit_btn);
                doc_span.style.display='none';
                return;
            }
        }
        _submit_btn_disable(doc_submit_btn);
    }
}

const _upload_img_form = (title , action , theme = 'blue') => {
    _submit_btn_disable(img_submit_btn);

    var upload_img_form = document.querySelector('#upload_img_form');

    upload_img_form.querySelector("div.input_field[name='textInputField'")?.remove();
    upload_img_form.querySelector(".radio_field")?.remove();

    let avatar_input=upload_img_form.querySelector("#avatar");
    avatar_input.onchange=()=>avatar_validation();
    
    var title_ele = upload_img_form.querySelector('.title');
    title_ele.style.color = 'aliceblue';
    title_ele.textContent = title;

    upload_img_form.querySelector('hr').style.border='1px solid '.concat(theme);
    var yes_btn = upload_img_form.querySelector(".buttons .pop_up_yes_btn");
    yes_btn.style.backgroundColor = theme;
    yes_btn.style.outlineColor=theme;

        if(action == "USER_DP_UPDATE"){
            yes_btn.onclick=()=>_uploadDP();
        }else if(action == "USER_SEND_IMG"){
            yes_btn.onclick = ()=> {
                if(!disabled_pop_up_btn.upload_img_form){
                    _submit_btn_disable(img_submit_btn);
                    _trigerSendMsg("img");
                }
            };
        }else if(action === "UPLOAD_GROUP_DP"){
            yes_btn.onclick = async ()=> {
                if(!disabled_pop_up_btn.upload_img_form){
                    _submit_btn_disable(img_submit_btn);
                    if(!avatar.files[0])
                        return;
                    else{
                        let blob= (await _read_doc(avatar.files[0]));
                        editGroupDetails('dp',blob)
                            .then(res=>{
                                if(res === 1){
                                    let imgURL= upload_img_form.querySelector('.avatar_preview').src;
                                    let selectedGroupImgNodes=document.querySelectorAll( '.inbox-user.selected .dp img, .chat .dp img');
                                    selectedGroupImgNodes.forEach(node=>node.src=imgURL);
                                    _hide_this_pop_up(upload_img_form);
                                    localStorage.clear('cache-dp-'+getCookie('currOpenedGID'));
                                }
                            })
                        
                }
                }
            }
        }else if(action.action == "UPLOAD_EMOJI" ){
            var input_field= upload_img_form.querySelector(".input_field");
            
            //input_field_text
            let input_field_text= document.createElement("div");
            input_field_text.classList.add("input_field",);
            input_field_text.setAttribute("name","textInputField");
            upload_img_form.insertBefore(input_field_text,input_field);

            //input_field_div for label
            let inputDiv= document.createElement("div");
            inputDiv.classList.add("input");
            inputDiv.style.transform="translateY(-28px)"
            input_field_text.appendChild(inputDiv);

            //emoji name input
            let input=  document.createElement("input");
            input.type="text";
            input.name="emoji Name";
            input.placeholder="Enter Emoji name";
            input.autocomplete='off';
            inputDiv.appendChild(input);

            input_field.style.padding="25px";
            input_field_text.style.padding="25px";

            //emoji name rules field
            let rules= document.createElement("span");
            Object.assign(rules.style,{
                display:'block',
                textAlign:"start",
            })
            rules.innerHTML=`
                1. Name length should be between 1 to 15. <br>
                2. Name can have only Words and _ ( ex.: a,z,0,9,_);
            `;
            input_field_text.appendChild(rules);

            if(action.from == "SELF"){
                //scope radio button field
                let radioField=document.createElement('div');
                radioField.classList.add('radio_field');
                upload_img_form.insertBefore(radioField,input_field);

                //scope field title
                let title= label("Choose Emoji Scope:");
                Object.assign(title.style,{
                    'fontFamily':"sans-serif"
                })
                radioField.appendChild(title);

                //radio button div
                let radioDiv= document.createElement('div');
                radioDiv.classList.add("checkBox");
                radioDiv.style.justifyContent="space-evenly";
                radioField.appendChild(radioDiv);

                //scope = private
                let container=document.createElement("div");
                radioDiv.appendChild(container);
                    var radioPrivate= document.createElement("input");
                    radioPrivate.type="radio";
                    radioPrivate.value="PRIVATE";
                    radioPrivate.name="scope";
                    radioPrivate.id="PRIVATE";
                    radioPrivate.style.borderRadius="20px";
                    radioPrivate.checked=true;
                    container.appendChild(radioPrivate);
                    container.appendChild(label("PRIVATE"));
                
                //scope = public
                container=document.createElement("div");
                radioDiv.appendChild(container);
                    var radioPublic= document.createElement("input");
                    radioPublic.type="radio";
                    radioPublic.value="PUBLIC";
                    radioPublic.id="PUBLIC";
                    radioPublic.name="scope";
                    radioPublic.style.borderRadius="20px";
                    container.appendChild(radioPublic);
                    container.appendChild(label("PUBLIC"));
            }

            function label(name){
                let label= document.createElement("label");
                label.textContent=name;
                label.setAttribute('for',name);
                return label;
            }

            yes_btn.onclick = async ()=> {
                if(!disabled_pop_up_btn.upload_img_form){
                    let emojiName=input.value;
                    let avatar= input_field.querySelector("#avatar");

                    if(emojiName.length > 15 || /\W+/.test(emojiName) || !input.value){
                        input.style.border="1px solid red";
                        return;
                    }else{
                        _submit_btn_disable(img_submit_btn);

                        let data={
                            scope:(action.from == "SELF")? ((radioPrivate.checked)? "PRIVATE": "PUBLIC") : "GROUP",
                            GID:action.GID,
                            name:emojiName,
                            blob:(await _read_doc(avatar.files[0])),
                        };
                        _uploadEmoji(data);

                        setTimeout(()=>_hide_this_pop_up(upload_img_form),500);
                    }
                    
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

            let data = JSON.stringify({
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
                            localStorage.setItem("cache-dp-"+getCookie("unm") , result);
                            document.querySelectorAll('.avatar').forEach(imgEle => {
                                imgEle.src = result;
                            })
                            
                            handler.suc_dataChanged();
                        }else{
                            throw res.responseText;
                        }
                    }
                })
                .catch(err => {
                    customError(err);
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

    let input= add_new_chat_form.querySelector('#username');
    input.onkeyup=()=>_search_users_by_unm(input.value);
    
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

    let URL_for_search_users = "/functionality/lib/_fetch_data.php";

    postReq(URL_for_search_users , data )
        .then( res => {
            if(res.status == "success"){
                if(res.responseText.error)
                    throw res.responseText;

                _showList();
                _addDataInList(res.responseText);
            }else{
                throw res;
            }
        }).catch(code=>{
            console.error(code);
            try{
                handler['err_'+code]();
            }catch(e){
                handler.err_400();
            }
        })

}

const _addDataInList = (data) => {
    let body = document.querySelector('#floatingList > tbody');
    List.removeChild(body);
    body = document.createElement("tbody");
    List.appendChild(body);
    if(data == '0'){
        body.setAttribute("class" , "center");
            let tr= document.createElement('tr');body.appendChild(tr);
                let td= document.createElement('td');td.style.color="red";td.textContent="No Data Found!!";tr.appendChild(td);
    }else{
        data.forEach( ele => {
            let tr= document.createElement('tr');
            tr.classList.add("node");
            tr.onclick=()=>toggle_confirmation_pop_up('add_new_chatter',ele.unm);
            body.appendChild(tr);
            
            let tdImg=document.createElement('td');
            tr.appendChild(tdImg);
                var dpImg = new Image(); 
                dpImg.src=default_dp_src; 
                dpImg.onerror=()=>dpImg.src=default_dp_src;
                tdImg.appendChild(dpImg);

            let tdUnm=document.createElement('td');
            tr.appendChild(tdUnm);
                let strongTag = document.createElement("strong");
                tdUnm.appendChild(strongTag);
                strongTag.textContent=`@${ele.unm}`;

            get_dp(ele.unm).then(dp=>dpImg.src=dp);
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
        // pop_up.style.transform = "translateY(0)";
        pop_up.style.opacity = '1';
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
    }else if(pop_up.id == "report_pop_up"){
        setTimeout(()=>{
            document.addEventListener('click', hide_report_pop_up)
        },20);
    }
}
function _hide_this_pop_up(pop_up) {
    // pop_up.style.transform = "translateY(-500px)";

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
    }else if(pop_up.id == "report_pop_up"){
        document.removeEventListener('click',hide_report_pop_up);
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

const hide_report_pop_up = (e)=>{
    if( e!=null && (!e.target.closest('#report_pop_up'))) _hide_this_pop_up(document.querySelector('div#report_pop_up'));
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

function toggleOptionContainer(optionBtn) {    
    if(!optionBtn.getAttribute('data-option-show')){ 
        optionBtn.setAttribute('data-option-show','true');
        if(document.onclick)
            document.onclick();
        setTimeout(()=>document.onclick=()=>hideOptionBtn(optionBtn),200);
    }else{
        hideOptionBtn(optionBtn);
    }
}
        
const hideOptionBtn=(optionBtn)=>{
    optionBtn.removeAttribute('data-option-show');
    document.onclick=null;
}

async function createNewGroupForm(){
    try{
        let userMemberList= await _getChatList('personal');
        if(!userMemberList.length)
            throw 411;

        userMemberList=userMemberList
                        .map(member=>member.unm)
                        .filter(member=>member!='You');
        if(!userMemberList.length)
            throw 411; 

        let formObj= new CreateNewGroupPopUp(userMemberList);
        formObj.show();
        
    }catch(err){
        if(err === 411){
            new_Alert("Your contact list currently doesn't contain any members who can be directly added to a new group.");
        }else{
            console.error(err);
        }
    }
}

async function addNewMemberForm(){
    try{
        let userMemberList= await _getChatList('personal');
        let groupProfile= await getProfile(); 
        if(!userMemberList.length || !groupProfile)
            throw 411; 

        let groupMembers= JSON.parse(groupProfile.members);
        groupMembers.push(groupProfile.admin);

        userMemberList=userMemberList
                            .map(member=>member.unm)
                            .filter(member=>member!='You' && !groupMembers.includes(member));

        if(!userMemberList.length)
            throw 411;
        
        let formObj= new CreateNewGroupPopUp(userMemberList,'add_new_members');
        formObj.show();
    }catch(err){
        if(err === 411){
            new_Alert("Your contact list currently doesn't contain any members who can be directly added to a new group.");
        }else{
            console.error(err);
        }
    }
}

//blocked list display function
function toggleBlockedChatterList(){
    let pop_up;
    if(pop_up=document.querySelector('.pop_up_box #blocked_chatter_list')){
        pop_up.remove();
        return;
    }
    let blockedChatterListObj= new blockedChatterListBox();
}

//open upload emoji form function
function openUploadEmojiForm(from="SELF",GID=null){
    closesettingsbox();
    let action= {action:"UPLOAD_EMOJI",from,GID};
    _upload_img_form("Upload Your Emoji",action);
}
//emojis list display function
function showEmojisList(from="SELF",GID=null){
    closesettingsbox();
    let showEmojisListObj= new ShowEmojisList(from,GID);
}

//action can me be by lastMsgTime and by user searched input name
function sortChatByTime(){
    if(document.querySelector(".inbox .search input[name='chatSearch']").value)
        return;
    var allChats= document.querySelectorAll(".chat-box .inbox .inbox-user");
    
    if(allChats.length != 0){
        for(let i=0 ; i< allChats.length ; i++){
            let lastMsgTimeChat1= allChats[i].getAttribute('data-lastMsgTime');
            for (j=i+1 ; j< allChats.length ; j++){
                let lastMsgTimeChat2= allChats[j].getAttribute('data-lastMsgTime');

                if(lastMsgTimeChat1 != "undefined" && lastMsgTimeChat2 == "undefined")
                    continue;

                if(lastMsgTimeChat1 < lastMsgTimeChat2 || (lastMsgTimeChat1 == "undefined" && lastMsgTimeChat2 !="undefined")){
                    // allChats[i].remove();
                    allChats[j].after(allChats[i]);
                }
            }
        }
    }    
}

function sortChatBySearch(unm){
    var allChats= document.querySelectorAll(".chat-box .inbox .inbox-user");
    if(allChats.length == 0)
        return 

    unm=unm.replace(/\\/g,'\\\\');
    var searchWord=new RegExp(unm,'i');
    for(let i=0 ; i< allChats.length ; i++){
        for (j=i+1 ; j< allChats.length ; j++){
            if(allChats[j].title.search(searchWord) != -1 || allChats[j].querySelector(".inbox-name")?.textContent.search(searchWord) != -1){
                // allChats[i].remove();
                allChats[j].after(allChats[i]);
            }
        }
    }
    // sortChatByTime();
}

//this function is used to replace a word within a string with using indices
//str is a string 
// start is a strting index
// end is a ending index
// replacement is word which we want to replace
function replaceAt( str="", start=0, end=0, replacement="" ){
    if( start >= str.length || end > str.length){
        return str;
    }
    return str.slice(0,start) + replacement + str.slice(end,); 
}

var emojiContainer=null;
var emoji_search_start_index= null;
var emoji_searching=false;

const turn_off_emoji_searching=()=>{
    emoji_searching=false;
    emoji_search_start_index=null;
    emojiContainer?.hide();
}

const turn_on_emoji_searching=(start_index)=>{
    emoji_searching=true;
    emoji_search_start_index=start_index;
}

// this function check for the emoji syntax :\w+ in a string at user input cursor 
// if it founds it start searching for the emoji 
// if the process is already in searching phase and user input is either space or : it will end the search 
// if in uper case user input is ':' then it will highlight the emoji name part (by calling a function) in the str so user can know emoji has found
function emojiSyntaxChecker(str=null,e=null){
    if(!e)
        return

    //creating a emoji container object
    if(!emojiContainer)
        emojiContainer=new showEmojiListContainer();

    //user input is : or not    || user input is space or enter with emoji_searching on or not
    if(e.data == ":" || ( (!e.data || e.data==" ") && emoji_searching && e.inputType != "deleteContentBackward")){
        if(emoji_searching){
            //this executes when emoji searching is true        
            turn_off_emoji_searching();
        }else{
            //thist part is executed when emoji searching is false
            const regex = new RegExp(/(?<=^|\s):/,'i');
            if(str.slice(e.target.selectionStart-2,e.target.selectionStart).match(regex))
                turn_on_emoji_searching(e.target.selectionStart-1);
        }
    }

    if(emoji_searching){

        // fetching the emoji name from the str
        if(str.length > 1)
            str= str.slice(emoji_search_start_index,e.target.selectionStart)
    
        //if no emoji name found then turn off the emoji searching
        if(!str){
            turn_off_emoji_searching();
            return;
        }

        //search emoji
        emojiContainer.searchEmojis(str);
    }else{

        //if emoji_searching is off then hide() the emoji container
        emojiContainer.hide();
    }
}