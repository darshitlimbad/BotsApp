document.addEventListener('DOMContentLoaded' , () => {
    chat = document.querySelector(".chat");
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
        setTimeout(() => {
            chatBody.scrollTop = chatBody.scrollHeight;        
        }, 0);
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
    console.log(msgs);
    chat.innerHTML+=`

        <div class="chatBody">

            <div class="msgDate">23/2/24</div>
            
            <div class="msgContainer receive">
                <div class="msg">
                    hello brother how are you hello  newbi hello hello hello hello doing in life hope yor will be fine :)
                    see you soon
                </div>
                <div class="msgTime">6:00 PM</div>
            </div>

            <div class="msgContainer send">
                <div class="msgTime">0:00 PM</div>
                <div class="msg">i am fine hello thanks</div>
            </div>
            <div class="center">
                <div class="msgDate">23/2/24</div>
            </div>
            
            <div class="msgContainer receive">
                <div class="msg">hello brother how hello are you doing in life hope yor will be fine :)
                    see you soon
                </div>
                <div class="msgTime">6:00 PM</div>
            </div>

        </div>

    `;
}

const setChatFooter= (unm) =>{

    chat.innerHTML+=`
        <div class="footer align-center">
            <div class="upDocsBtn ele">+</div>

            <textarea class="msgInput ele" placeholder="Type a Message" autocomplete="off" accesskey="m" lang="en" title="Type a Message" name="txtMsg"></textarea>

            <div class="sendMsg">
                <img src="img/icons/send.png" alt="Send Message" onclick="_trigerSendMsg('text')">
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
    if(type=="text"){
        var inputBox = document.querySelector(".chat .footer .msgInput");
        var input=inputBox.value.trim();
    }

    if(!input)
        return;
    
    let res= await _sendMsg(type, input);
    
    console.log(res);
    if(!res)
        err_400();

    if(type == "text"){
        inputBox.value = "";
        inputBox.style.height = "auto";    
    }
}

