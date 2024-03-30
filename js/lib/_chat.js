document.addEventListener( 'DOMContentLoaded' , () => {
    list = document.querySelector('tbody.scroll');
});

const chatList = async () =>  {
    
    const chatList = await _getChatList(); _flash_chatList();
    if(chatList !== 0){
        chatList.forEach(chat => {
            chatListTemplate(chat['unm'], chat['dp'], chat['last_chat']);
        });
    }else{
        _chatList_empty();
    }

    _chatList_footer();
    _st_chLi_skltn();
}

const chatListTemplate = ( unm, dp, lastChat) => {
    _create_new_list_box();
    
    tr.innerHTML= `
        <td class="inbox-user">
            <div class="img">
                <img class="skeleton" src="${dp}"  onerror="defaultDp(this);"/>
            </div>
            <div class="details">
                <h5 class="skeleton skeleton-text inbox-name">${unm}</h5> 
                <div class="last-chat skeleton skeleton-text">${lastChat}</div>
            </div>
        </td>
    `;
}

const _create_new_list_box = () => {
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