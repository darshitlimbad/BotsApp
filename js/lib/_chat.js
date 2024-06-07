document.addEventListener('DOMContentLoaded' , () => {
    chat = document.querySelector(".chat");
});

// global var
    var chatStruct={
        heading:null,
        searchDiv:null,
        chatBody:null,
        footer:null,
    };

    var online = "green";
    var offline = "red";
    var user = null;

    var lastMsg = null;
// 

const openChatList = async () =>  {
    try{
        var chatType = getCookie('chat');
        if(!chatType){
            new_Alert("Something Went Wrong");
            console.error('Something Went wrong');
            return;
        }
        
        chatType = chatType.toLowerCase();

        const chatList = await _getChatList();  _flash_chatList();
        
        userStatus.checkChatListStatus();

        if(chatList !== null){
                chatList.forEach(chat => {
                    chatListTemplate(chat);
                });       
        }else{
            _chatList_isEmpty();
        }
    
        _chatList_footer();
        _st_chLi_skltn();

    }catch(err){
        console.error(err);
    }
}

const chatListTemplate = ( chat ) => {
    let chatType = getCookie('chat').toLowerCase();
    let {unm , last_msg} = chat;  

    // ummm just ignore this :) 
        let unmTitle = (unm==="You") ? getCookie("unm") : unm ;
    // 
    var inboxUser = document.createElement('td');
    inboxUser.classList.add('inbox-user');
    inboxUser.title=unmTitle;
    inboxUser.tabIndex = 0;
    if(chatType == 'group') inboxUser.id = chat.GID;
    inboxUser.onclick = ()=> (chatType == 'personal') ? openChat(unmTitle) : (chatType == 'group') ? openChat(unmTitle,chat.GID) : '';
    list.appendChild(inboxUser);

        var imgDiv= document.createElement("div");
        imgDiv.classList.add('img','dp');
        inboxUser.appendChild(imgDiv);

            var img = new Image();
            img.classList.add("skeleton");
            img.setAttribute("name","dp");
            img.onerror=()=>defaultDp(img);
            imgDiv.appendChild(img);
        
        var details = document.createElement("div");
        details.classList.add('details');
        inboxUser.appendChild(details);

            var inboxName = document.createElement('h5');
            inboxName.classList.add("skeleton","skeleton-text","inbox-name");
            inboxName.title=unmTitle;
            inboxName.textContent=unm;
            details.appendChild(inboxName);
            
            var lastChatDiv = document.createElement('div');
            lastChatDiv.classList.add("skeleton","skeleton-text","last-chat");
            lastChatDiv.title=last_msg;
            lastChatDiv.textContent=last_msg;
            details.appendChild(lastChatDiv);

            //fetching dp img
                get_dp((chatType=="personal") ? unmTitle : null,chat.GID)
                    .then(imgData=> img.src=imgData );
            //
        }

const _cht_sk_loading = () => {
    for(var i=0 ; i<8 ; i++){
        var inboxUser = document.createElement("td");
        inboxUser.classList.add('inbox-user');
        list.appendChild(inboxUser);

            var imgDiv = document.createElement("div");
            imgDiv.classList.add('img');
            inboxUser.appendChild(imgDiv);

                var span = document.createElement("span");
                span.classList.add('skeleton');
                imgDiv.appendChild(span);

            var details = document.createElement("div");
            details.classList.add('details');
            details.style.minWidth = '7em';
            inboxUser.appendChild(details);

                var inboxName = document.createElement('h5');
                inboxName.classList.add("skeleton");
                inboxName.classList.add("skeleton-text");
                inboxName.classList.add("inbox-name");
                details.appendChild(inboxName);

                var lastChatDiv = document.createElement('div');
                lastChatDiv.classList.add("skeleton");
                lastChatDiv.classList.add("skeleton-text");
                lastChatDiv.classList.add("last-chat");
                details.appendChild(lastChatDiv);
    }
} 

const _flash_chatList = () => {
    list.innerHTML = null;
}

const _chatList_isEmpty = () => {
    _flash_chatList();

    var footer=document.createElement('footer');list.appendChild(footer);
        var div = document.createElement('div');div.style.margin="50px 0";div.style.fontFamily="auto";div.textContent = "Add chatters to chat with Them :)";footer.appendChild(div);
};

const _chatList_footer = ()=> {
    var footer=document.createElement('footer');
        var div = document.createElement('div');
        div.style.textAlign="center";
        div.textContent="All rights NOT -_- reserverd by ";
            var a_botsapp=document.createElement('a');a_botsapp.href="/t&c/policy.php";a_botsapp.classList.add('link');a_botsapp.textContent="BotsApp";div.appendChild(a_botsapp);
        div.append(".");
        footer.appendChild(div);
        var a_help=document.createElement('a');a_help.href="/help/user-help.php";a_help.classList.add('link');a_help.textContent="Need help?";footer.appendChild(a_help);
    list.appendChild(footer);
}

// skeleton animation stop 
const _st_chLi_skltn = () => {
    const ani_ele = document.querySelectorAll(' .list h5 , .list .last-chat');
    const ani_img = document.querySelectorAll('.list img');
            // animation elements
    ani_ele.forEach(function (element) {
        element.classList.remove('skeleton');
        element.classList.remove('skeleton-text');
    });
    ani_img.forEach((element) => {
        element.addEventListener('load' ,()=>{
            element.classList.remove('skeleton');
        })
    });
};

                                        // chat open functions //
const openChat =async (unm,ID=null) => {
    //prefix
        chat.innerHTML=""; 
        lastMsg=null;

        chatStruct.heading = document.createElement('div');
        chatStruct.heading.classList.add("heading","align-center");
        chat.appendChild(chatStruct.heading);

        chatStruct.searchDiv = document.createElement('div');
        chatStruct.searchDiv.classList.add('search');
        chatStruct.searchDiv.id="searchTxt";
        chat.appendChild(chatStruct.searchDiv);

        chatStruct.chatBody=document.createElement("div");
        chatStruct.chatBody.classList.add("chatBody");
        chat.appendChild(chatStruct.chatBody);

        chatStruct.footer=document.createElement('footer');
        chatStruct.footer.classList.add("footer","align-center");
        chat.appendChild(chatStruct.footer);

    selectChat(unm,ID);
    setCookie('currOpenedChat' ,unm);
    setLoader(chat);
    setChatHeader(unm,ID);
    removeLoader(chat);
    setLoader(chatStruct.chatBody);
    setChatFooter(unm);
    await setChatBody(ID);
    removeLoader(chatStruct.chatBody);
    
     // post-fix
    //for mobile
    if(device == 'mobile'){
        hideInbox();
    }
};
const setLoader = (loc)=>{
    let loaderDiv = document.createElement('div');loaderDiv.classList.add('loader');loaderDiv.classList.add('blank-layer-chat');loc.appendChild(loaderDiv);
        let loaderImg = new Image();loaderImg.src="/img/icons/loader.svg";loaderImg.classList.add('loader-img');loaderDiv.appendChild(loaderImg);
        let loaderText =  document.createElement('b');loaderText.classList.add('loader-text');loaderText.textContent = "Loading...";loaderDiv.appendChild(loaderText);
    
};
const removeLoader = (loc)=>{
    let loader=loc.querySelector(".loader");
    loc.removeChild(loader);

    let disabledEle = chat.querySelectorAll("footer .upDocsBtn , footer .msgInput, footer .sendMsg, .heading .search-btn");
    disabledEle.forEach(ele => ele.removeAttribute('disabled'));
}

const selectChat = (unm,ID=null) => {
    let newSelectchat = list.querySelector((ID) ? `.inbox-user[id='${ID}']` : `.inbox-user[title='${unm}']` );  
    if(user)
        user.classList.remove('selected');
    if(newSelectchat)
        newSelectchat.classList.add('selected');

    user = newSelectchat;
};

const setChatHeader = (unm,ID) =>{

        let closeIconDiv = document.createElement('div');
        closeIconDiv.classList.add("icon","center","align-center");
        closeIconDiv.title="Close";
        closeIconDiv.name="closeChat";
        closeIconDiv.onclick=()=>closeChat();
        closeIconDiv.tabIndex=0;
        chatStruct.heading.appendChild(closeIconDiv);
            let closeIconImg = new Image();
            closeIconImg.src="img/icons/close.png";
            closeIconImg.alt="Close";
            closeIconDiv.appendChild(closeIconImg);

        let dpDiv = document.createElement('div');
        dpDiv.classList.add("dp","align-center");
        chatStruct.heading.appendChild(dpDiv);
            let dpImg = new Image();
            dpImg.alt="DP";
            get_dp(unm)
                .then(dp_url=>dpImg.src=dp_url);
            dpDiv.appendChild(dpImg);

        if(unm == getCookie('unm'))
            unm="You";

        let detailsDiv = document.createElement('div');
        detailsDiv.classList.add('details');
        chatStruct.heading.appendChild(detailsDiv);

            let name = document.createElement('div');
            name.classList.add('name');
            name.textContent=unm;
            detailsDiv.appendChild(name);

            let status = document.createElement('b');
            status.id="currentChatterStatus";
            status.classList.add("status","offline");
            detailsDiv.appendChild(status);

        let flexBox = document.createElement('div');
        flexBox.classList.add('flexBox','right-3');
        chatStruct.heading.appendChild(flexBox);

            let fullScreenIcon = document.createElement('button');
            fullScreenIcon.classList.add('fullScreenIcon');
            fullScreenIcon.title = "Full Screen View";
            fullScreenIcon.onclick=()=>fullScreen(document.querySelector('body'));
            flexBox.appendChild(fullScreenIcon);

                let fullScreenIconImg = document.createElement('div');
                fullScreenIconImg.classList.add('icon');
                fullScreenIcon.appendChild(fullScreenIconImg);

            let searchBtnDiv = document.createElement('button');
            searchBtnDiv.classList.add("search-btn","icon");
            searchBtnDiv.onclick= ()=> toggleSearchTxt();
            searchBtnDiv.disabled=true;
            flexBox.appendChild(searchBtnDiv);

                let searchBtnImg = new Image();
                searchBtnImg.src="img/icons/search.png";
                searchBtnImg.alt="Search";
                searchBtnDiv.appendChild(searchBtnImg);
    
        let searchTxtInput = document.createElement('input');
        searchTxtInput.type="search";
        searchTxtInput.name="searchTxtInput";
        searchTxtInput.placeholder="search";
        searchTxtInput.autocomplete="off";
        searchTxtInput.onkeyup=(e)=>_searchWords(e,searchTxtInput.value);
        chatStruct.searchDiv.appendChild(searchTxtInput);

        let search_found_span = document.createElement('span');
        search_found_span.classList.add('search_found_span');
        chatStruct.searchDiv.appendChild(search_found_span);
            let span= [document.createElement('span'),document.createElement('span')];
            span.forEach(s=>{s.textContent='0'});
            search_found_span.appendChild(span[0]);
            search_found_span.append('/');
            search_found_span.appendChild(span[1]);

        let moveBtnsDiv = document.createElement('div');
        moveBtnsDiv.classList.add('move');
        chatStruct.searchDiv.appendChild(moveBtnsDiv);

            let upBtn = document.createElement('button');
            upBtn.classList.add('up');
            upBtn.title="up";
            upBtn.textContent="<";
            upBtn.onclick=()=>moveSearch('up');
            upBtn.tabIndex=0;
            moveBtnsDiv.appendChild(upBtn);

            let downBtn = document.createElement('button');
            downBtn.classList.add('down');
            downBtn.title="down";
            downBtn.textContent=">";
            downBtn.onclick=()=>moveSearch('down');
            downBtn.tabIndex=0;
            moveBtnsDiv.appendChild(downBtn);
};

const setChatBody = async (ID) =>{
    const msgObjs = await _getAllMsgs(ID);
    if(!msgObjs)  {
        let chatEmptyMsg=document.querySelector('div');
        chatEmptyMsg.id="";
        chatEmptyMsg.classList.add('chatEmptyMsg');
        chatEmptyMsg.textContent="Let's start new convertation.";
        chatStruct.chatBody.appendChild(chatEmptyMsg);
        console.log(chatStruct.chatBody);
        return;
    }
    msgObjs.forEach(msgObj => addNewMsgInCurrChat(msgObj));
}

const setChatFooter= (unm) =>{

        let upDocsBtn= document.createElement("button");
        upDocsBtn.classList.add("upDocsBtn","ele","icon");
        upDocsBtn.title="Send Documents";
        upDocsBtn.onclick=()=>toggleDocsContainer();
        upDocsBtn.textContent="+";
        upDocsBtn.tabIndex=0;
        upDocsBtn.disabled=true;
        chatStruct.footer.appendChild(upDocsBtn);

        var upDocsContainer= document.createElement("div");
        upDocsContainer.classList.add("upDocsContainer");
        chatStruct.footer.appendChild(upDocsContainer);
            let nodeImg=newNode();
            nodeImg.name="sendImgBtn";
            nodeImg.title="Send Image";
            nodeImg.onclick = ()=>_upload_img_form('Choose a Img to send','USER_SEND_IMG');
                nodeImg.innerHTML=`
                    <svg height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 455 455" xml:space="preserve" ><path d="M0,0v455h455V0H0z M259.405,80c17.949,0,32.5,14.551,32.5,32.5s-14.551,32.5-32.5,32.5s-32.5-14.551-32.5-32.5S241.456,80,259.405,80z M375,375H80v-65.556l83.142-87.725l96.263,68.792l69.233-40.271L375,299.158V375z"/></svg>
                `;

            let nodeDoc=newNode();
            nodeDoc.name="sendFilesBtn";
            nodeDoc.title="Send Files";
            nodeDoc.onclick = ()=>_upload_doc_form("Choose File to Send","USER_SEND_DOC");
                nodeDoc.innerHTML=`
                    <svg width="20px" height="20px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="rgba(255, 255, 255, 0.349)" fill="none"><path d="M49.78,31.63,32,49.39c-2.09,2.09-10.24,6-16.75-.45-4.84-4.84-5.64-11.75-.95-16.58,5-5.17,15.24-15.24,20.7-20.7,2.89-2.89,7.81-4.28,12.17.07s2.41,9.44,0,11.82L27.81,43a4.61,4.61,0,0,1-6.89-.06c-2.19-2.19-1.05-5.24.36-6.66l18-17.89"/></svg>
                `;

        let msgInput=document.createElement("textarea");
        msgInput.classList.add("msgInput","ele");
        msgInput.placeholder="Type a Message";
        msgInput.autocomplete="off";
        msgInput.accessKey="/";
        msgInput.lang="en";
        msgInput.title="Type a Message";
        msgInput.disabled=true;
        chatStruct.footer.appendChild(msgInput);

        let sendMsgBtn = document.createElement("button");
        sendMsgBtn.classList.add("sendMsg","icon");
        sendMsgBtn.tabIndex=0;
        sendMsgBtn.disabled=true;
        chatStruct.footer.appendChild(sendMsgBtn);
            let sendMsgImg= new Image();
            sendMsgImg.src="img/icons/send.png";
            sendMsgImg.alt="Send Message";
            sendMsgImg.onclick = ()=>_trigerSendMsg('text');
            sendMsgBtn.appendChild(sendMsgImg);
    
    function newNode(){
        let node= document.createElement("button");
        node.classList.add("node","ele");
        upDocsContainer.appendChild(node);
        node.tabIndex=0;
        return node;
    }

    chatStruct.footer.querySelector(".msgInput").addEventListener( 'keydown' , msgBoxSizing);
};


const closeChat = (e=null) =>{
    if(e!=null) msgInput.removeEventListener( 'keydown' , msgBoxSizing);

    chat.innerHTML=null;
    lastMsg=null;
    
    let header= document.createElement("header");
    header.classList.add('loader');
    chat.appendChild(header);
        let img=new Image();
        img.src="../img/logo.png";
        header.appendChild(img);
        
        let b=document.createElement('b');
        b.textContent="BotsApp";
        header.appendChild(b);
        
    setCookie('currOpenedChat' ,0);

    if(user)
        user.classList.remove('selected');

    //for mobile
    if(device == 'mobile'){
        showInbox();
    }
}

const _trigerSendMsg = async (type) => {
    if(userStatus.isOnline == false){
        handler.err_401();
        return;
    }

    try{
        var msgObj={};
        switch(type){
            case 'text':
                var inputBox = chatStruct.footer.querySelector(".msgInput");
                var msg=inputBox.value.trim();
                if(!msg) return;
                msgObj['msg'] = msg;
                inputBox.value = "";
                inputBox.style.height = "auto";    
                break;
            case 'img':
                var inputBox = document.querySelector("#upload_img_form");
                var input =inputBox.querySelector("#avatar").files[0];
                break;
            case 'doc':
                var inputBox = document.querySelector("#upload_doc_form");
                var input =inputBox.querySelector("#doc").files[0];
                msgObj.upload = true;
                break;
        }

        if(type != 'text') {
            msgObj.details={
                size : input.size,
                ext : input.name.split('.').pop().toUpperCase(),
            }

            if(msgObj.details.size > 16777200) throw customError("File Size is to Big.",413);
            
            msgObj.blob = (await _read_doc(input));
            if(!msgObj.blob) throw customError('Please try again',400);
            
            msgObj.mime = msgObj.blob.substring(msgObj.blob.indexOf(':')+1,msgObj.blob.indexOf(';'));

            _hide_this_pop_up(inputBox);
            
            if(input.name){
                msgObj.fileName = (type!='img')?
                                    input.name :
                                    input.name.replace(input.name.substring(input.name.indexOf('.')+1),'webp');                
            }else{ 
                let date = new Date();
                msgObj.fileName = `${type}-${date.getDay()}-${date.getMonth()+1}-${date.getFullYear()}-${Math.ceil(Math.random()*1000)}.`;
                msgObj.fileName += (type == 'img') ? 'webp' : msgObj.details.ext.toLowerCase();
            }
        } 
            
        msgObj={
            msgID:await _genNewID("msg"),
            fromUnm:getCookie("unm"),
            toUnm:getCookie("currOpenedChat"),
            time:Date.now(),
            type,
            ...msgObj,
        };
        
        if(getCookie('chat').toLowerCase() === 'group')
            msgObj.toGID = user.id;
        
        addNewMsgInCurrChat(msgObj);
        console.log(msgObj);
        _sendMsg(msgObj)
            .then(res=>{
                if( (res.status != 'success') || (res.responseText != 1)){
                    throw customError('Something Went Wrong while sending the msg.',res.responseText);
                        //delete the msg From chat
                }else if(res.responseText == 1){
                    if( (msgObj.toUnm == getCookie('unm'))){
                        updateMsgStatus(msgObj.msgID,2)
                            .then(res=>{
                                if(res==1){
                                    _placeMsgStatus(msgObj.statusIcon,msgObj.msgID)
                                        .then(res=>msgObj.status = res);
                                } 
                            })
                    }else{
                        _placeMsgStatus(msgObj.statusIcon,msgObj.msgID)
                            .then(res=>msgObj.status = res);
                    }
                    
                    switch(type){
                        case 'text':
                            break;
                        case 'img':
                            break;
                        case 'doc':
                            msgObj.msgLoad.removeChild(msgObj.msgLoad.firstChild);
                            msgObj.msgLoad.appendChild(setDocumentDownloadBtn(msgObj));
                            break;
                    }
                }
            });
    }catch(err){
        console.warn(`[${err.code}] , Message : ${err.message}`);
    }
}

// new message chat
const addNewMsgInCurrChat = (msgObj) => {
    let whichTransmit = ( getCookie('unm') == msgObj['fromUnm'] ) ? 'send' : 'receive';

    let currFullDate = new Date();
    let fullDate=new Date(Number(msgObj['time']));
    let time= fullDate.toLocaleTimeString();
    let date = fullDate.getDate() +'/'+ (fullDate.getMonth()+1) +'/'+ fullDate.getFullYear();

    let prevDate = null;
    
    if(lastMsg != null ){
        let prevFullDate=new Date(Number(lastMsg['time']));
        prevDate = prevFullDate.getDate() +'/'+ (prevFullDate.getMonth()+1) +'/'+ prevFullDate.getFullYear();
    }

    if( prevDate != date ){
        
        if((currFullDate.getMonth()+1 == fullDate.getMonth()+1) 
            && (currFullDate.getFullYear() == fullDate.getFullYear())){
    
                if(currFullDate.getDate() == fullDate.getDate())
                    date='Today';
                else if(currFullDate.getDate()-1 == fullDate.getDate())
                    date='Yesterday';
        }

        let msgDate=document.createElement("div");
        msgDate.classList.add("msgDate");
        msgDate.style.setProperty('--date',`'${date}'`);
        chatStruct.chatBody.appendChild(msgDate);
    }  


    let msgContainer=document.createElement("div");
    msgContainer.classList.add('msgContainer',whichTransmit);
    msgContainer.id=msgObj.msgID;

    msg=document.createElement("div");
    msg.classList.add('msg');

    // type == 'img' || type == 'doc' //
    if(msgObj.type != "text"){ 
        var detailsDiv = document.createElement('div');
        detailsDiv.classList.add('details');
        msg.appendChild(detailsDiv);
        
            var fileName = document.createElement('b');
            fileName.classList.add('fileName');
            fileName.textContent=msgObj.fileName;
            detailsDiv.appendChild(fileName);
    }

    // for groups to show msg sender usernames.
    if(getCookie('chat').toLowerCase() === "group" 
        && (!lastMsg || (lastMsg && lastMsg.fromUnm != msgObj.fromUnm) ) ){
        
        let msgUserDiv = document.createElement('div');
        msgUserDiv.classList.add('msgUserDiv');
        
        if(whichTransmit == 'receive')
            msgUserDiv.onclick=()=>toggle_confirmation_pop_up('add_new_chatter',msgObj.fromUnm);

        (msgObj.type != 'text') ?
            fileName.before(msgUserDiv):
            msg.appendChild(msgUserDiv);

            let msgUserDP = new Image();
            msgUserDP.src = default_dp_src;
            msgUserDP.classList.add('msgUserDP');
            msgUserDiv.appendChild(msgUserDP);

            let msgUserUnm= document.createElement('b');
            msgUserUnm.classList.add('msgUserUnm');
            msgUserUnm.title= msgObj.fromUnm;
            msgUserUnm.textContent= (whichTransmit == 'send') ? 'You' : '@'+msgObj.fromUnm;
            msgUserDiv.appendChild(msgUserUnm);

            // fetching dp
            get_dp(msgObj.fromUnm)
                .then(imgURL => {
                    msgUserDP.src=imgURL;
                });
    }

    switch(msgObj['type']){
        case 'text':
            let msgData = document.createElement("p");
            msgData.classList.add("msgData");
            msgData.textContent=msgObj.msg;
            msg.appendChild(msgData);

            break;
        
        case 'img':                
            let msgImg = new Image();
            msgImg.classList.add("msgImg");
            msgImg.alt="Image Error";
            msgImg.src="/img/icons/loader.svg";
            msgImg.onerror=()=>msgImg.style.padding="5px";
            msg.appendChild(msgImg);
            
            if(!msgObj.blob){
                var observer=new IntersectionObserver((entries)=>{
                    entries.every(async entry=>{
                        if(entry.isIntersecting){
                            _getDocBolb(msgObj.msgID)
                                .then(res=>{
                                    if(res.status ==="success" ){
                                        _getDataURL(`data:${res.responseText.mime};base64,${res.responseText.data}`)
                                            .then(res=>{
                                                if(res.status == "success"){
                                                    addMsgImgUrl(res.url);
                                                    observer.unobserve(msgContainer);
                                                }
                                            })
                                    }else{
                                        msgImg.src = "";
                                    }
                                });
                        }
                    })
                },{threshold:0.2});

                observer.observe(msgContainer);
            }else{
                _getDataURL(msgObj.blob)
                    .then(res=>{
                        if(res.status == "success")
                            addMsgImgUrl(res.url);
                    })
            }

            const addMsgImgUrl=(url)=>{
                msgImg.src=url;
                msgImg.onclick=()=>previewImg(url,msgObj.fileName,convert_bytes(msgObj.details.size));
            }

            break;

        case 'doc':
            msg.style.flexDirection = 'row';
            msgObj.msgLoad = document.createElement('div');
            msgObj.msgLoad.classList.add('msgLoad');

                progressDiv = (msgObj.upload)?
                                        setDocumentProgressBar() :
                                        setDocumentDownloadBtn(msgObj);

            msgObj.msgLoad.appendChild(progressDiv);

            msg.appendChild(msgObj.msgLoad);

            let node = document.createElement('div');
            node.classList.add('node');
            detailsDiv.appendChild(node);

            let {size,pages,ext} = msgObj.details;
            let detailsStr = "";

            detailsStr += convert_bytes(size) + "   |   " + ext;

            node.textContent = detailsStr;

            break;

        default:
            customError("Not a valid Type",0);
            return;
    }

    let optionBtn = document.createElement('div');
    optionBtn.classList.add("optionBtn","ele");
    optionBtn.name="optionBtn";
    optionBtn.title="Options";
        optionBtn.innerHTML=`
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" >
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>`;
    
    // optionBtn.setAttribute('onclick',())
        if(msgObj.type == 'doc'){
            optionBtn.style.position="relative";
            optionBtn.style.alignSelf="start";
        }
    msg.appendChild(optionBtn);
    
    // optionContainer();
    function optionContainer(){

        let optionContainer = document.createElement('div');
        optionContainer.id="option-container";
        optionContainer.classList.add("option-container");
        optionBtn.appendChild(optionContainer);
    
            let optionIconURL = "/img/icons/chat/options/";
            let deleteOption = new_option("delete");
    
            function new_option(optionName){

                let option = document.createElement('div');
                option.classList.add('option');

                    let optionIcon= new Image();
                    optionIcon.classList.add('option-icon');
                    optionIcon.src= optionIconURL+optionName+".svg";
                    option.appendChild(optionIcon);

                    // let optionName= document.createElement('div');
                    //coninue
                
                return option;
            }
            // <div id="option-container" class="option-container">
            //     <div class="option">
            //         <img class="option-icon" src="/img/icons/chat/options/delete.svg">
                    
            //         <b class="option-name">
            //             Delete for me
            //         </b>
            //     </div>
            //     <div class="option">
            //         <img class="option-icon" src="/img/icons/chat/options/info.svg">
                    
            //         <b class="option-name">
            //             Info
            //         </b>
            //     </div>
            // </div>
    }

    let msgTime=document.createElement("div");
    msgTime.classList.add('msgTime');
    msgTime.textContent=time;

    if(whichTransmit == 'send'){
        let msgStatus = document.createElement('div');
        msgStatus.classList.add('msgStatus');
        msgContainer.appendChild(msgStatus);
            msgObj.statusIcon = new Image();
            msgObj.statusIcon.classList.add('msgStatusIcon');
            msgStatus.appendChild(msgObj.statusIcon); 

            _placeMsgStatus(msgObj.statusIcon,msgObj.msgID)
                .then(res=>{
                    msgObj.status = res
                    if((msgObj.toUnm == getCookie('unm')) && msgObj.status == "send"){
                        updateMsgStatus(msgObj.msgID,2)
                            .then(res=>{
                                if(res == 1)
                                    _placeMsgStatus(msgObj.statusIcon,msgObj.msgID)
                                        .then(res=>msgObj.status = res);
                            });
                    }
                });
    }else{
        _getMsgStatus([msgObj.msgID])
            .then(res=>{
                if(res != 0) {
                    msgObj.status = res[0].status;
                    if(msgObj.status == "send"){
                        updateMsgStatus(msgObj.msgID,2)
                            .then(res=>{
                                if(res==1)
                                    msgObj.status = 'read';
                            });
                    }
                }
            });
    }

    if(whichTransmit == 'receive'){
        msgContainer.appendChild(msg);
        msgContainer.appendChild(msgTime);    
    }else{
        msgContainer.appendChild(msgTime);    
        msgContainer.appendChild(msg);
    }  

    chatStruct.chatBody.appendChild(msgContainer);
    lastMsg = msgObj;
    scrollToBottom();        
}

const scrollToBottom = () => setTimeout(()=>chatStruct.chatBody.scrollTop = chatStruct.chatBody.scrollHeight,100);        

function setDocumentDownloadBtn(msgObj){
    var progressDiv = document.createElement('div');
    progressDiv.classList.add('progressDiv','download','ele');
        let {msgID,fileName} = msgObj;
        progressDiv.onclick = () => _downloadThisDoc(msgID,fileName,msgObj.msgLoad);
    return progressDiv;
}

function setDocumentProgressBar(){
    var progressDiv = document.createElement('div');
    progressDiv.classList.add('progressDiv','loader');
        let progressPR = document.createElement('b');
        progressPR.classList.add("progressPR");
        progressPR.textContent="0%";
        progressDiv.appendChild(progressPR);

    return progressDiv;
}