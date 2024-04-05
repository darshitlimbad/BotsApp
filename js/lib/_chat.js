document.addEventListener('DOMContentLoaded' , () => {

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
    unmTitle = (unm==="You") ? window.unm.substring(1) : unm ;
    var lastChatPreview = (lastChat.length < 20) ? lastChat : lastChat.substring(0,17).concat("...") ;
    // 

    tr.innerHTML= `
        <td class="inbox-user" title="${unmTitle}" onclick="openChat('${unmTitle}')" >
            <div class="img">
                <img class="skeleton" src="${dp}"  onerror="defaultDp(this);"/>
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

// chat open functions 
const openChat = (unm) => {
    selectChat(unm);
}

const selectChat = (unm) => {
    var chats = list.querySelectorAll(".inbox-user");
    
    chats.forEach(chat => {
        if( (chat.title == unm) && (!chat.classList.contains("selected")) )
            chat.classList.add("selected");
        else if(chat.classList.contains("selected") && (chat.title != unm) ) 
            chat.classList.remove("selected");
    })
}