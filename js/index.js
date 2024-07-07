document.addEventListener( 'DOMContentLoaded' , () => {
    // set cookies 
        // chat
        if( !getCookie("chat")){
            setCookie("chat", "Personal");
        }
    // 

    // global var
    currCht= getCookie("chat");
    list = document.querySelector('tbody.listBody');
    searchedMsgList = new Databox(); 


    //functions to be called
    _cht_sk_loading();
    initiateChatBox(currCht);
    // 

    // adding event on chat search input
    let chatSearchInput=document.querySelector('.chat-box .inbox .search input');
    chatSearchInput.onkeyup=()=>{
        if(chatSearchInput.value)
            sortChatBySearch(chatSearchInput.value);
    }

    handleResize();
    window.onresize=()=>handleResize();
});

const msgBoxSizing = (e) => {    

    const footer = document.querySelector(".chat .footer");
    let msgInput = footer.querySelector(".msgInput");
    // new_notification(device+e.shiftKey+e.keyCode);
    if( (e.keyCode == "13") && (!e.shiftKey) && (device == 'pc')){
        _trigerSendMsg("text");
        e.preventDefault();
    }

    // pre-action
    msgInput.style.alignContent= (msgInput.scrollHeight >= 80 ) ? "normal" : "center" ;

        if(msgInput.scrollHeight > 130){
            footer.style.height = '160px';
            msgInput.style.height = '130px';
            msgInput.style.overflowY= "auto";
        }else{
            setTimeout(() => {
                msgInput.style.height = 'auto';
                msgInput.style.height = `${msgInput.scrollHeight}px`;  
                msgInput.style.overflowY= "hidden";
                footer.style.height = 'auto';
            }, 0);    
        }
}

const toggleSearchTxt = () => {
    let searchTxt = document.querySelector("div#searchTxt");

    var searchBtn = document.querySelector(".search-btn");
    var searchTxtInput = searchTxt.querySelector("input");
    let icon;
    _clearSearchedWords();
    
    if(searchTxt.style.display == 'flex'){
        searchTxt.style.top = "-6%" ;
        icon = "search";
        setTimeout(()=>{
            searchTxt.style.display = "none";
        },100);
    }else{
        searchTxt.style.display = "flex";
        icon="close";
        setTimeout(()=>{
            searchTxt.style.top = "1%" ;
            searchTxtInput.focus();
        },10);
    }

    searchTxtInput.value="";
    searchBtn.querySelector('img').src = `img/icons/${icon}.png`;
}

function _searchWords(e,val) {
    val=val.trim();
    let searchTxt = document.querySelector("div#searchTxt");

    var chatBody = document.querySelector(".chatBody");
    var SfSpan = searchTxt.querySelectorAll('.search_found_span span');
    _clearSearchedWords();

    if((val.length < 3) && (e.keyCode != 13) || val == "") 
        return;

    let chatMsgs = chatBody.querySelectorAll(".msgContainer .msg .msgData, .msgContainer .msg .fileName");

    Object.entries(chatMsgs)
        .filter(msgObj=> new RegExp(val,'i').test(msgObj[1].textContent))
        .map(msgObj=> {
            msgObj[1].innerHTML = msgObj[1].innerHTML.replace(new RegExp(val , 'gi'), match => `<span class="highlight">${match}</span>`);
        });
    
        var searchedWords = chatBody.querySelectorAll("span.highlight");
        searchedWords.forEach(word=>searchedMsgList.push(word));
    
    if(searchedMsgList.rear!=-1){
        _enableMoveBtn();
        SfSpan[0].textContent = `?`;
        SfSpan[1].textContent = `${searchedMsgList.rear+1}`;
    }

    
}

const _clearSearchedWords = ()=> {
    let searchTxt = document.querySelector("div#searchTxt");
    var chatBody = document.querySelector(".chatBody");
    var SfSpan = searchTxt.querySelectorAll('.search_found_span span');
    if(searchedMsgList.rear != -1){
        try{
            var msgDataToRmHl = chatBody.querySelectorAll(".msgContainer .msg .msgData, .msgContainer .msg .fileName");

            var rmContainerClass = chatBody.querySelector("div.selectedWordContainer");

                if(rmContainerClass)
                    rmContainerClass.classList.remove('selectedWordContainer');
            
            msgDataToRmHl.forEach(msgData => {
                if(msgData.children[0] && msgData.children[0].classList.contains('highlight')){
                    msgData.textContent=msgData.textContent;
                }
            })

        }catch(err){
            console.error(err);
        }
    }    
    _disableMoveBtns();
    SfSpan.forEach(span=>span.textContent='0');
    searchedMsgList.emptyIt();
};

const _disableMoveBtns = (btn="both")=>{
    let searchTxt = document.querySelector("div#searchTxt");
    var moveBtns = searchTxt.querySelectorAll(".move button");

    btn = btn.toLowerCase();
    var btns=[];
    try{
        if(btn=="both"){
            btns=moveBtns;
        }else{
            btns[0] = (btn == 'up') ? moveBtns[0] : moveBtns[1] ;
        }  

        btns.forEach(btn => {
            btn.setAttribute('disabled',true);
        });
    }catch(e){
        console.error(e);
    }
};

const _enableMoveBtn = (btn="both")=>{
    let searchTxt = document.querySelector("div#searchTxt");
    var moveBtns = searchTxt.querySelectorAll(".move button");

    btn = btn.toLowerCase();
    var btns=[];
    try{
        if(btn=="both"){
            btns=moveBtns;
        }else{
            btns[0] = (btn == 'up') ? moveBtns[0] : moveBtns[1] ;
        }  

        btns.forEach(btn => {
            btn.removeAttribute('disabled');
        });
    }catch(e){
        console.error(e);
    }
}

function moveSearch(dir){
    let searchTxt = document.querySelector("div#searchTxt");
    var SfSpan = searchTxt.querySelectorAll('.search_found_span span');

    if(!searchedMsgList)
        return;

    dir=dir.toLowerCase().trim();

    if(searchedMsgList.front != -1){
        // pre Actions
        let selectedWord = searchedMsgList.getCurr();
        if(selectedWord.classList.contains('selectedWord')){
            selectedWord.classList.remove("selectedWord");
            selectedWord.closest("div.msgContainer").classList.remove("selectedWordContainer");    
        }
    }

    if(searchedMsgList.rear != -1){
        if(dir == "up"){
            if(SfSpan[0].textContent == '?' && searchedMsgList.front != 0){
                searchedMsgList.front=0;
            }
            else if(searchedMsgList.front > 0){
                searchedMsgList.front--;
            }
            
        }else if(dir == "down"){
            if( (SfSpan[0].textContent == '?') && (searchedMsgList.front != searchedMsgList.rear)){
                searchedMsgList.front=searchedMsgList.rear;
            }
            else if(searchedMsgList.front < searchedMsgList.rear){
                searchedMsgList.front++;
            }
        }

        // post Actions
        try{
            let selectedWord = searchedMsgList.getCurr();
            selectedWord.scrollIntoView();
            selectedWord.classList.add("selectedWord");
            selectedWord.closest("div.msgContainer").classList.add("selectedWordContainer");
        }catch(e){
            console.error(e);
        }
    }

    SfSpan[0].textContent = searchedMsgList.front+1;
    ( (searchedMsgList.front == 0) || ( searchedMsgList.front == -1))?_disableMoveBtns("up"):_enableMoveBtn("up");
    (searchedMsgList.front == searchedMsgList.rear)?_disableMoveBtns("down"):_enableMoveBtn("down");
}

const toggleDocsContainer = () => {
    var upDocsContainer = document.querySelector("div.upDocsContainer");
    var upDocsBtn = document.querySelector(".upDocsBtn");
    
    if(upDocsContainer.style.display == 'flex'){
        upDocsContainer.style.bottom = "0%" ;
        upDocsBtn.style.outline = "none";

        setTimeout(()=>{ 
            upDocsBtn.style.rotate = "0deg";
            upDocsContainer.style.zIndex = "-1";
            upDocsContainer.style.display = "none";
        },100);

    document.removeEventListener('click' , toggleDocsContainer);

    }else{
        upDocsContainer.style.display = "flex";
        upDocsBtn.style.outline = "1px solid aliceblue";
        setTimeout(()=>{
            upDocsBtn.style.rotate = "45deg";
            upDocsContainer.style.zIndex = "1";
            upDocsContainer.style.bottom = "110%" ;
            document.addEventListener('click' , toggleDocsContainer);
        },10);
    }

}

// responsive for mobile changes
function handleResize(){
    if(window.outerWidth < 700){
        document.querySelector('body.main').classList.add('mobile');
        device='mobile';
        (!chatOpened)? showInbox() : hideInbox();
    }else{
        document.querySelector('body.main').classList.remove('mobile');
        showChatBox();
        device='pc';
    }
}

function showInbox(){
    const inbox=document.querySelector('.chat-box .inbox');

    chat.style.display='none';
    inbox.style.display='block';
}

function hideInbox(){
    const inbox=document.querySelector('.chat-box .inbox');

    chat.style.display='flex';
    inbox.style.display='none';
}

function showChatBox(){
    const inbox=document.querySelector('.chat-box .inbox');

    chat.style.display='flex';
    inbox.style.display='block';
}