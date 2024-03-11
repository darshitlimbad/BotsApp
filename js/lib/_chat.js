const getChatList = (userID) =>  {
    chatListTemplate("dfd","dfssde," , "afetrgx");
}

const chatListTemplate = ( userID , name , lastChat) => {
    const list = document.querySelector('tbody.scroll');
    tr = document.createElement('tr');
    list.appendChild(tr);
    
    tr.innerHTML= `
        <td class="inbox-user">
            <div class="img">
                <img class="skeleton" src=""  onerror="defaultDp(this);"/>
            </div>
            <div class="details">
                <h5 class="skeleton skeleton-text inbox-name">${name}</h5> 
                <div class="last-chat skeleton skeleton-text">${lastChat}</div>
            </div>
        </td>
    `;
}