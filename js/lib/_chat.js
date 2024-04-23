document.addEventListener('DOMContentLoaded' , () => {
    chat = document.querySelector(".chat");
    chatBody = null;
});

const openChatList = async (chatType) =>  {
    try{
        chatType = chatType.toLowerCase();
        const chatList = await _getChatList(chatType);  _flash_chatList();
        if(chatList !== 0){
            chatList.forEach(chat => {
                chatListTemplate(chat['unm'], chat['dp'], chat['last_msg']);
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

const chatListTemplate = ( unm, dp, lastChat) => {
    _create_new_list_box();
    
    // ummm just ignore this :) 
    let unmTitle = (unm==="You") ? getCookie("unm") : unm ;
    let lastChatPreview = (lastChat.length < 20) ? lastChat : lastChat.substring(0,17).concat("...") ;
    // 

    tr.innerHTML= `
        <td class="inbox-user" title="${unmTitle}" onclick="openChat('${unmTitle}')" >
            <div class="img">
                <img class="skeleton" src="${dp}" name="dp" onerror="defaultDp(this);"/>
            </div>
            <div class="details">
                <h5 class="skeleton skeleton-text inbox-name" title="@${unmTitle}">${unm}</h5> 
                <div class="last-chat skeleton skeleton-text" title="${lastChat}">${lastChatPreview}</div>
            </div>
        </td>
    `;
}

const _cht_sk_loading = () => {
    for(var i=0 ; i<5 ; i++){
        _create_new_list_box();
        tr.innerHTML = `
            <td class="inbox-user">
                <div class="img">
                    <span class="skeleton"></span>
                </div>
                <div class="details">
                    <h5 class="skeleton skeleton-text inbox-name">   </h5> 
                    <div class="last-chat skeleton skeleton-text">   </div>
                </div>
            </td>
        `;
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

    tr.innerHTML = `
        <footer>
            <div style="margin:50px 0" > Add chatters to chat with Them :)</div>
        </footer>
    `;
};

const _chatList_footer = ()=> {
    _create_new_list_box();

    tr.innerHTML = `
        <footer>
            <div>
                All right reserverd by <a href="/t&c/policy.php" class="link">BotsApp</a>.
            </div>
            <a href="/help/user-help.php" class="link">Need help?</a>
        </footer>
    `;
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
    
    var loaderID=setLoaderOnChat();
    selectChat(unm);
    setCookie('currOpenedChat' ,unm);
    setChatHeader(unm);
    await setChatBody(unm);
    setChatFooter(unm);
    removeLoaderOnChat(loaderID);
    

    
     // post-fix
        chatBody = document.querySelector(".chat .chatBody");
        msgInput = document.querySelector(".chat .footer .msgInput");
        msgInput.addEventListener( 'keydown' , msgBoxSizing);
        chatBody.scrollTop = chatBody.scrollHeight;        
};
const setLoaderOnChat = ()=>{
    chat.innerHTML+=`<div class='blank-layer-chat loader' id='loader'> 
                            <img src="/img/icons/loader.png" class="loader-img">
                            <b class="loader-text">Loading...</b>
                        </div>`;
    return loader(chat);
};
const removeLoaderOnChat = (loaderID)=>{
    let loader=document.querySelector("#loader");
    chat.removeChild(loader);
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
    let dp= user.querySelector('.img img').src;
    if(unm == getCookie('unm'))
        unm="You";

    // get user status

    chat.innerHTML+=`
        <div class="headding align-center">
            
            <div class="icon center align-center" title="Close" name="closeChat" onclick="closeChat()">
                <img src="img/icons/close.png" alt="close">
            </div>
            <div class="dp align-center">
                <img src=${dp} alt="DP">
            </div>
            <div class="details">
                <div class="name">${unm}</div>                    
                <b class="status green">offline</b>
            </div>
            <div class="search-btn icon align-center" onclick="toggleSearchTxt();">
                <img src="img/icons/search.png" alt="seach">
            </div>
            
        </div>

        <div class="search" id="searchTxt">
                <input type="search" name="seachTxtInput" placeholder="search" autocomplete="off" oninput="_searchWords(this.value.trim())" >
                <span class="search_found_span"><span>0</span>/<span>1</span></span>
                <div class="move">
                    <button class="up" title="Up" onclick="moveSearch(this.title)"> < </button>
                    <button class="down" title="Down" onclick="moveSearch(this.title)" > > </button>
                </div>
        </div>
    `;
};

const setChatBody = async (unm) =>{

    const msgs = await _getMsgs(unm);
    chatBody=document.createElement("div");chatBody.classList.add("chatBody");
    chat.appendChild(chatBody);

    if(!msgs)
        return;
    
    msgs.forEach(msgObj => {
        addNewMsgInCurrChat(msgObj);
    });
}

const setChatFooter= (unm) =>{
    chat.innerHTML+=`
    <div class="footer align-center">
        <div class="upDocsBtn ele" title="send Documents" onclick="toggleDocsContainer()">+</div>

        <div class="upDocsContainer">
            <div class="node ele" name="sendImgBtn" title="Send Image" onclick="_upload_img_form('Choose a Img to send', 'USER_SEND_IMG')" >
                <svg height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 455 455" xml:space="preserve" >
                    <path d="M0,0v455h455V0H0z M259.405,80c17.949,0,32.5,14.551,32.5,32.5s-14.551,32.5-32.5,32.5s-32.5-14.551-32.5-32.5
                    S241.456,80,259.405,80z M375,375H80v-65.556l83.142-87.725l96.263,68.792l69.233-40.271L375,299.158V375z"/>
                </svg>
            </div>
            <div class="node ele" name="sendFilesBtn" title="Send Files">
                <svg width="20px" height="20px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="rgba(255, 255, 255, 0.349)" fill="none"><path d="M49.78,31.63,32,49.39c-2.09,2.09-10.24,6-16.75-.45-4.84-4.84-5.64-11.75-.95-16.58,5-5.17,15.24-15.24,20.7-20.7,2.89-2.89,7.81-4.28,12.17.07s2.41,9.44,0,11.82L27.81,43a4.61,4.61,0,0,1-6.89-.06c-2.19-2.19-1.05-5.24.36-6.66l18-17.89"/></svg>
            </div>
        </div>

        <textarea class="msgInput ele" placeholder="Type a Message" autocomplete="off" accesskey="m" lang="en," title="Type a Message"></textarea>

        <div class="sendMsg">
            <img src="img/icons/send.png" alt="Send Message"  onclick="_trigerSendMsg('text')">
        </div>
    </div>
    `;      
};


const closeChat = (e=null) =>{
    if(e!=null)
        msgInput.removeEventListener( 'keydown' , msgBoxSizing);
    
    chat.innerHTML=`
        <header class="">
                <img src="../img/logo.png" onclick="tohomepage()">
                <b>Botsapp</b>
        </header>`;
    
        setCookie('currOpenedChat' ,null);
}

const _trigerSendMsg = async (type) => {
    switch(type){
        case 'text':
            var inputBox = document.querySelector(".chat .footer .msgInput");
            var input=inputBox.value.trim();
            break;
        case 'img':
            var inputBox = document.querySelector("#upload_img_form");
            var input = {
                size : inputBox.querySelector("#avatar").files[0].size,
                img_data : (await _get_img_data(inputBox.querySelector("#avatar").files[0])).split(',').pop(),
            }
            break;
    }

    if(!input)
        return;
    
    let res= await _sendMsg(type, input);
        
    if(!res){
        err_400();
        return;
    }
    
    var msgObj={
        unm:getCookie('unm'),
        time:Date.now(),
        type:type,
    };

    if(type == "text"){
        msgObj['msg'] = inputBox.value;
        inputBox.value = "";
        inputBox.style.height = "auto";    
    }
    addNewMsgInCurrChat(msgObj);
}

// new message chat
const addNewMsgInCurrChat = (msgObj) => {

    let fullDate=new Date(Number(msgObj['time']));
    let date = fullDate.getDate() +'/'+ fullDate.getMonth() +'/'+ fullDate.getFullYear();
    let time= fullDate.toLocaleTimeString();

    var prevDate = document.querySelectorAll(".msgDate");
    
    if(prevDate.length != 0)
        prevDate=prevDate[prevDate.length-1].textContent;
    
    if( prevDate != date ){
        var msgDate=document.createElement("div");msgDate.classList.add("msgDate");msgDate.textContent=date;
        chatBody.appendChild(msgDate);
        prevDate = date;
    }  

    let whichTransmit = ( getCookie('unm') != msgObj['unm'] ) ? 'receive' : 'send' ;

    var msgContainer=document.createElement("div");msgContainer.classList.add('msgContainer');msgContainer.classList.add(whichTransmit);
    
    if(msgObj['type'] == 'text'){
        msg=document.createElement("div");msg.classList.add(`msg`);msg.textContent=msgObj['msg'];
    }
    var msgTime=document.createElement("div");msgTime.classList.add(`msgTime`);msgTime.textContent=time;

    chatBody.appendChild(msgContainer);

    if(whichTransmit == 'receive'){
        msgContainer.appendChild(msg);
        msgContainer.appendChild(msgTime);    
    }else{
        msgContainer.appendChild(msgTime);    
        msgContainer.appendChild(msg);
    }       
    chatBody.scrollTop = chatBody.scrollHeight;        
}

