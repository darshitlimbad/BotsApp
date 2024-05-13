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
// 

const openChatList = async (chatType) =>  {
    try{
        chatType = chatType.toLowerCase();

        const chatList = await _getChatList(chatType);  _flash_chatList();
        if(chatList !== 0){
            chatList.forEach(chat => {
                chatListTemplate(chat['unm'], chat['last_msg']);
            });
        }else{
            _chatList_empty();
        }
    
        _chatList_footer();
        _st_chLi_skltn();

    }catch(err){
        console.error(err);
    }
}

const chatListTemplate = ( unm, lastChat) => {
    _create_new_list_box();
    
    // ummm just ignore this :) 
    let unmTitle = (unm==="You") ? getCookie("unm") : unm ;
    let lastChatPreview = (lastChat.length < 20) ? lastChat : lastChat.substring(0,17).concat("...") ;
    // 

    var inboxUser = document.createElement('td');
    inboxUser.classList.add('inbox-user');
    inboxUser.title=unmTitle;inboxUser.setAttribute("onclick","openChat(this.title)");
    tr.appendChild(inboxUser);

        var imgDiv= document.createElement("div");
        imgDiv.classList.add('img');
        inboxUser.appendChild(imgDiv);

            var img = new Image();
            img.classList.add("skeleton");
            img.setAttribute("border",0);img.setAttribute("name","dp");img.setAttribute("onerror","defaultDp(this)");
            get_dp(unmTitle).then(imgData=>img.src=imgData);
            imgDiv.appendChild(img);
        
        var details = document.createElement("div");
        details.classList.add('details');
        inboxUser.appendChild(details);

            var inboxName = document.createElement('h5');
            inboxName.classList.add("skeleton");inboxName.classList.add("skeleton-text");inboxName.classList.add("inbox-name");
            inboxName.title=unmTitle;inboxName.textContent=unm;
            details.appendChild(inboxName);
            
            var lastChatDiv = document.createElement('div');
            lastChatDiv.classList.add("skeleton");lastChatDiv.classList.add("skeleton-text");lastChatDiv.classList.add("last-chat");
            lastChatDiv.title=lastChat;lastChatDiv.textContent=lastChatPreview;
            details.appendChild(lastChatDiv);

        }

const _cht_sk_loading = () => {
    for(var i=0 ; i<8 ; i++){
        _create_new_list_box();
        var inboxUser = document.createElement("td");inboxUser.classList.add('inbox-user');tr.appendChild(inboxUser);
            var imgDiv = document.createElement("div");imgDiv.classList.add('img');inboxUser.appendChild(imgDiv);
                var span = document.createElement("span");span.classList.add('skeleton');imgDiv.appendChild(span);
            var details = document.createElement("div");details.classList.add('details');inboxUser.appendChild(details);
                var inboxName = document.createElement('h5');inboxName.classList.add("skeleton");inboxName.classList.add("skeleton-text");inboxName.classList.add("inbox-name");details.appendChild(inboxName);
                var lastChatDiv = document.createElement('div');lastChatDiv.classList.add("skeleton");lastChatDiv.classList.add("skeleton-text");lastChatDiv.classList.add("last-chat");details.appendChild(lastChatDiv);
    }
} 

const _create_new_list_box = () => {
    var list = document.querySelector('tbody.listBody');
    tr = document.createElement('tr');
    list.appendChild(tr);
}

const _flash_chatList = () => {
    list.innerHTML = null;
}

const _chatList_empty = () => {
    _flash_chatList();
    _create_new_list_box();

    var footer=document.createElement('footer');tr.appendChild(footer);
        var div = document.createElement('div');div.style.margin="50px 0";div.style.fontFamily="auto";div.textContent = "Add chatters to chat with Them :)";footer.appendChild(div);
};

const _chatList_footer = ()=> {
    _create_new_list_box();

    var footer=document.createElement('footer');tr.appendChild(footer);
        var div = document.createElement('div');div.textContent="All right reserverd by ";
            var a_botsapp=document.createElement('a');a_botsapp.href="/t&c/policy.php";a_botsapp.classList.add('link');a_botsapp.textContent="BotsApp";div.appendChild(a_botsapp);
        div.append(".");
        footer.appendChild(div);
        var a_help=document.createElement('a');a_help.href="/help/user-help.php";a_help.classList.add('link');a_help.textContent="Need help?";footer.appendChild(a_help);
    tr.appendChild(footer);
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
const openChat =async (unm) => {
    
    //prefix
        user = document.querySelector(`.list .inbox-user[title='${unm}']`);
        chat.innerHTML=""; 
        chatStruct.heading = document.createElement('div');chatStruct.heading.classList.add("heading","align-center");chat.appendChild(chatStruct.heading);
        chatStruct.searchDiv = document.createElement('div');chatStruct.searchDiv.classList.add('search');chatStruct.searchDiv.id="searchTxt";chat.appendChild(chatStruct.searchDiv);
        chatStruct.chatBody=document.createElement("div");chatStruct.chatBody.classList.add("chatBody");chat.appendChild(chatStruct.chatBody);
        chatStruct.footer=document.createElement('footer');chatStruct.footer.classList.add("footer","align-center");chat.appendChild(chatStruct.footer);


    selectChat(unm);
    setCookie('currOpenedChat' ,unm);
    setChatHeader(unm);
    var loaderID= await setLoader(chatStruct.chatBody);
    setChatFooter(unm);
    await setChatBody(unm);
    removeLoader(chatStruct.chatBody,loaderID);
    
     // post-fix
};
const setLoader = async (loc)=>{
    let loaderDiv = document.createElement('div');loaderDiv.classList.add('loader');loaderDiv.classList.add('blank-layer-chat');loc.appendChild(loaderDiv);
        let loaderImg = new Image();loaderImg.src="/img/icons/loader.png";loaderImg.classList.add('loader-img');loaderDiv.appendChild(loaderImg);
        let loaderText =  document.createElement('b');loaderText.classList.add('loader-text');loaderText.textContent = "Loading...";loaderDiv.appendChild(loaderText);
    return loader(loc);
};
const removeLoader = (loc,loaderID)=>{
    let loader=document.querySelector(".loader");
    loc.removeChild(loader);
    clearInterval(loaderID);
}

const selectChat = (unm) => {
    var chats = list.querySelectorAll(".inbox-user");  
    chats.forEach(chat => {
        if( (chat.title == unm) && (!chat.classList.contains("selected")) )
            chat.classList.add("selected");
        else if(chat.classList.contains("selected") && (chat.title != unm) ) 
            chat.classList.remove("selected");
    })
};

const setChatHeader = (unm) =>{
    let dpData= user.querySelector('.img img').src;
    if(unm == getCookie('unm'))
        unm="You";

    // get user status

        let closeIconDiv = document.createElement('div');closeIconDiv.classList.add("icon","center","align-center");closeIconDiv.title="Close";closeIconDiv.name="closeChat";closeIconDiv.setAttribute('onclick','closeChat()');chatStruct.heading.appendChild(closeIconDiv);
            let closeIconImg = new Image();closeIconImg.src="img/icons/close.png";closeIconImg.alt="Close";closeIconDiv.appendChild(closeIconImg);
        let dpDiv = document.createElement('div');dpDiv.classList.add("dp","align-center");chatStruct.heading.appendChild(dpDiv);
            let dpImg = new Image();dpImg.src=dpData;dpImg.alt="DP";dpDiv.appendChild(dpImg);
        let detailsDiv = document.createElement('div');detailsDiv.classList.add('details');chatStruct.heading.appendChild(detailsDiv);
            let name = document.createElement('div');name.classList.add('name');name.textContent=unm;detailsDiv.appendChild(name);
            let status = document.createElement('b');status.classList.add("status","green");status.textContent="offline";detailsDiv.appendChild(status);
        let searchBtnDiv = document.createElement('div');searchBtnDiv.classList.add("search-btn","icon","align-center");searchBtnDiv.setAttribute('onclick',"toggleSearchTxt()");chatStruct.heading.appendChild(searchBtnDiv);
            let searchBtnImg = new Image();searchBtnImg.src="img/icons/search.png";searchBtnImg.alt="Search";searchBtnDiv.appendChild(searchBtnImg);
    
        let searchTxtInput = document.createElement('input');searchTxtInput.type="search";searchTxtInput.name="searchTxtInput";searchTxtInput.placeholder="search";searchTxtInput.autocomplete="off";searchTxtInput.setAttribute('oninput','_searchWords(this.value)');chatStruct.searchDiv.appendChild(searchTxtInput);
        let search_found_span = document.createElement('span');search_found_span.classList.add('search_found_span');chatStruct.searchDiv.appendChild(search_found_span);
            let span= [document.createElement('span'),document.createElement('span')];span.forEach(s=>{s.textContent='0'});search_found_span.appendChild(span[0]);search_found_span.append('/');search_found_span.appendChild(span[1]);
        let moveBtnsDiv = document.createElement('div');moveBtnsDiv.classList.add('move');chatStruct.searchDiv.appendChild(moveBtnsDiv);
            let upBtn = document.createElement('button');upBtn.classList.add('up');upBtn.title="up";upBtn.textContent="<";upBtn.setAttribute('onclick',"moveSearch('up')");moveBtnsDiv.appendChild(upBtn);
            let downBtn = document.createElement('button');downBtn.classList.add('down');downBtn.title="down";downBtn.textContent=">";downBtn.setAttribute('onclick',"moveSearch('down')");moveBtnsDiv.appendChild(downBtn);
};

const setChatBody = async (unm) =>{
    const msgs = await _getMsgs(unm);
    if(!msgs)  return;
    msgs.forEach(msgObj => addNewMsgInCurrChat(msgObj));
}

const setChatFooter= (unm) =>{

        let upDocsBtn= document.createElement("div");upDocsBtn.classList.add("upDocsBtn","ele");upDocsBtn.title="Send Documents";upDocsBtn.setAttribute("onclick","toggleDocsContainer()");upDocsBtn.textContent="+";chatStruct.footer.appendChild(upDocsBtn);
        var upDocsContainer= document.createElement("div");upDocsContainer.classList.add("upDocsContainer");chatStruct.footer.appendChild(upDocsContainer);
            let nodeImg=newNode();nodeImg.name="sendImgBtn";nodeImg.title="Send Image";nodeImg.setAttribute("onclick","_upload_img_form('Choose a Img to send','USER_SEND_IMG')");
                nodeImg.innerHTML=`
                    <svg height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 455 455" xml:space="preserve" ><path d="M0,0v455h455V0H0z M259.405,80c17.949,0,32.5,14.551,32.5,32.5s-14.551,32.5-32.5,32.5s-32.5-14.551-32.5-32.5S241.456,80,259.405,80z M375,375H80v-65.556l83.142-87.725l96.263,68.792l69.233-40.271L375,299.158V375z"/></svg>
                `;
            let nodeDoc=newNode();nodeDoc.name="sendFilesBtn";nodeDoc.title="Send Files";
            nodeDoc.onclick = ()=>{_upload_doc_form("Choose File to Send","USER_SEND_DOC")}
                nodeDoc.innerHTML=`
                    <svg width="20px" height="20px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="rgba(255, 255, 255, 0.349)" fill="none"><path d="M49.78,31.63,32,49.39c-2.09,2.09-10.24,6-16.75-.45-4.84-4.84-5.64-11.75-.95-16.58,5-5.17,15.24-15.24,20.7-20.7,2.89-2.89,7.81-4.28,12.17.07s2.41,9.44,0,11.82L27.81,43a4.61,4.61,0,0,1-6.89-.06c-2.19-2.19-1.05-5.24.36-6.66l18-17.89"/></svg>
                `;
        let msgInput=document.createElement("textarea");msgInput.classList.add("msgInput","ele");msgInput.placeholder="Type a Message";msgInput.autocomplete="off";msgInput.accessKey="/";msgInput.lang="en";msgInput.title="Type a Message";chatStruct.footer.appendChild(msgInput);
        let sendMsgDiv = document.createElement("div");sendMsgDiv.classList.add("sendMsg");chatStruct.footer.appendChild(sendMsgDiv);
            let sendMsgImg= new Image();sendMsgImg.src="img/icons/send.png";sendMsgImg.alt="Send Message";sendMsgImg.onclick = ()=>_trigerSendMsg('text');sendMsgDiv.appendChild(sendMsgImg);
    
    function newNode(){
        let node= document.createElement("div");
        node.classList.add("node","ele");
        upDocsContainer.appendChild(node);
        return node;
    }

    chatStruct.footer.querySelector(".msgInput").addEventListener( 'keydown' , msgBoxSizing);
};


const closeChat = (e=null) =>{
    if(e!=null) msgInput.removeEventListener( 'keydown' , msgBoxSizing);

    chat.innerHTML=null;
    let header= document.createElement("header");chat.appendChild(header);
        let img=new Image();img.src="../img/logo.png";header.appendChild(img);
        let b=document.createElement('b');b.textContent="BotsApp";header.appendChild(b);
        
    setCookie('currOpenedChat' ,null);
}

const _trigerSendMsg = async (type) => {
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
                break;
        }

        if(type != 'text') {
            msgObj.details={
                size : input.size,
                ext : input.name.split('.').pop().toUpperCase(),
            }

            if(msgObj.details.ext === "PDF" ) msgObj.details.pages = await _getDocPages(input);

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
            toUnm:getCookie("currOpenedChat"),
            time:Date.now(),
            type,
            ...msgObj,
        };
        
        addNewMsgInCurrChat(msgObj);
        let res= await _sendMsg(msgObj);

        if( (res.status != 'success') || (res.responseText != 1))
            throw customError('Something Went Wrong while sending the msg.',res.responseText());
        else if(res.responseText == 1){

            _setMsgStatus(msgObj.status,msgObj.msgID);
            
            switch(type){
                case 'text':
                    
            }
        }
    }catch(err){
        console.warn(`[${err.code}] , Message : ${err.message}`);
        try{
            handler['err_'+err.code]();
        }catch(e){
            handler['err_400']();
        }
    }
}

// new message chat
const addNewMsgInCurrChat = (msgObj) => {
    let fullDate=new Date(Number(msgObj['time']));
    let date = fullDate.getDate() +'/'+ (fullDate.getMonth()+1) +'/'+ fullDate.getFullYear();
    let time= fullDate.toLocaleTimeString();

    var prevDate = document.querySelectorAll(".msgDate");
    
    if(prevDate.length != 0)    prevDate=prevDate[prevDate.length-1].textContent;
    
    if( prevDate != date ){
        var msgDate=document.createElement("div");
        msgDate.classList.add("msgDate");
        msgDate.textContent=date;

        chatStruct.chatBody.appendChild(msgDate);
        prevDate = date;
    }  

    let whichTransmit = (getCookie('unm') == getCookie('currOpenedChat')) 
                        ?   'send' : 
                        ( ( getCookie('unm') == msgObj['toUnm'] ) 
                        ? 'receive' : 'send' ) ;

    var msgContainer=document.createElement("div");
    msgContainer.classList.add('msgContainer');
    msgContainer.classList.add(whichTransmit);
    msgContainer.id=msgObj.msgID;
    
    msg=document.createElement("div");
    msg.classList.add('msg');

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
            msgImg.alt="Image";
            msgImg.src="/img/icons/loader.svg";
            msgImg.onerror=()=>msgImg.style.padding="5px";
            msg.appendChild(msgImg);
            
            if(!msgObj.blob){
                _getDocBolb(msgObj.msgID,msgObj.fileName)
                    .then(res=>{
                        if(res.status ==="success")
                            msgImg.src=`data:${msgObj.mime};base64,${res.responseText}`;
                    });
            }else{
                msgImg.src=msgObj.blob;
            }
            break;

            case 'doc':
                msg.style.flexDirection = 'row';
                let msgDoc = document.createElement('div');
                msgDoc.classList.add('msgDoc');

                    let progressDiv = document.createElement('div');
                    progressDiv.classList.add('progressDiv');
                    msgDoc.appendChild(progressDiv);
                        
                        let loader = new Image();
                        loader.classList.add('loader');
                        loader.src="/img/icons/loader.svg";
                        progressDiv.appendChild(loader);

                        let loadedPr = document.createElement('b');
                        loadedPr.classList.add("loadedPr");
                        loadedPr.textContent="65%";
                        progressDiv.appendChild(loadedPr);

                msg.appendChild(msgDoc);
    }

    if(msgObj.type != "text"){  
        let fileName = document.createElement('b');
        fileName.classList.add('fileName');
        fileName.textContent=msgObj.fileName;
        msg.appendChild(fileName); 
    }

    let optionBtn = document.createElement('div');
    optionBtn.classList.add("optionBtn");
    optionBtn.classList.add("ele");
    optionBtn.name="optionBtn";
    optionBtn.title="Options";
        optionBtn.innerHTML=`
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" >
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>`;
    msg.appendChild(optionBtn);
    
    let msgTime=document.createElement("div");
    msgTime.classList.add('msgTime');
    msgTime.textContent=time;

    if(whichTransmit == 'receive'){
        msgContainer.appendChild(msg);
        msgContainer.appendChild(msgTime);    
    }else{
        let msgStatus = document.createElement('div');
        msgStatus.classList.add('msgStatus');
        msgContainer.appendChild(msgStatus);
            msgObj.status = new Image();
            msgStatus.appendChild(msgObj.status); 

            _setMsgStatus(msgObj.status,msgObj.msgID);

        msgContainer.appendChild(msgTime);    
        msgContainer.appendChild(msg);
    }    
    chatStruct.chatBody.appendChild(msgContainer);
    setTimeout(()=>chatStruct.chatBody.scrollTop = chatStruct.chatBody.scrollHeight,100);        
}
