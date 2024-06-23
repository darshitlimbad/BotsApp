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
        var chatType = getCookie('chat').toLowerCase();
        if(!chatType){
            new_Alert("Something Went Wrong");
            console.error('Something Went wrong');
            return;
        }
        // return;
        const chatList = await _getChatList();  _flash_chatList();
        userStatus.checkStatus();
        if(chatList){
            chatList.forEach(chat => chatListTemplate(chat));       
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
    inboxUser.onclick = ()=> (chatType == 'personal') ? openChat(unmTitle) : openChat(unmTitle,chat.GID);

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
                    .then(imgURL=> img.src=imgURL );
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

    var footer=document.createElement('footer');
    list.appendChild(footer);

    var div = document.createElement('div');
    Object.assign(div.style,{
        margin:"50px 0",
        fontFamily:"auto",
        textAlign:'center',
    });

    div.textContent = (getCookie('chat').toLowerCase() === 'personal') ? 
                                "Initiate a conversation by adding Chatters to the chat." :
                                "Initiate a conversation by creating group." ;
    footer.appendChild(div);
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
    if(userStatus.isOnline == false){
        handler.err_401();
        return;
    }
    
    if( (getCookie('chat').toLowerCase() === 'personal') && (getCookie('currOpenedChat') == unm) 
        || ID && ID == getCookie('currOpenedGID') )
        return;

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
    if(getCookie('chat').toLowerCase() =='group')   setCookie('currOpenedGID',user.id);
    setLoader(chat);
    setChatHeader(unm,ID);
    removeLoader(chat);
    setLoader(chatStruct.chatBody);
    setChatFooter(unm);
    await setChatBody();
    removeLoader(chatStruct.chatBody);
    
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
    if(newSelectchat){
        newSelectchat.classList.add('selected');
        user = newSelectchat;
    }else{
        user=null;
    }
};

const setChatHeader = async (unm,ID) =>{

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
            dpImg.src=user.querySelector('.dp img')?.src;
            dpImg.onerror=()=>dpImg.src=default_dp_src;
            dpDiv.appendChild(dpImg);

        if(unm == getCookie('unm'))
            unm="You";

        let detailsDiv = document.createElement('div');
        detailsDiv.classList.add('details','no-select');
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

        if(getCookie('chat').toLowerCase() == 'personal')
            detailsDiv.onclick=()=>openUserProfile(unm);
        else
            detailsDiv.onclick=()=>openGroupProfile();

};

function openUserProfile(unm){
    if(unm=='You')
        var uName= getCookie('unm');
    else
        var uName= unm;

    let userProfile = document.createElement('div');
    userProfile.classList.add('user-profile');
    chatStruct.heading.appendChild(userProfile);

        // DP
        let dp = new Image();
        dp.classList.add('avatar');
        Object.assign(dp.style,{
            minWidth: '80px',
            minHeight: '80px',
        });
        dp.src= user.querySelector('.dp img')?.src;
        dp.onerror=()=>dp.src=default_dp_src;
        userProfile.appendChild(dp);

        // Username
        let userName = document.createElement('p');
        userName.textContent='@'+unm;
        userProfile.appendChild(userName);

        // Full Name
        let detailName = document.createElement('d6');
        detailName.classList.add('margin-dead','detailName');
        detailName.textContent="Name: ";
        userProfile.appendChild(detailName);

        let fullName = document.createElement('p');
        fullName.classList.add('margin-dead');
        userProfile.appendChild(fullName);
        
        // About / bio
        detailName = document.createElement('d6');
        detailName.classList.add('margin-dead','detailName');
        detailName.textContent="About: ";
        userProfile.appendChild(detailName);

        let about= document.createElement('p');
        about.classList.add('margin-dead');
        about.style.fontSize="10px";
        userProfile.appendChild(about);

        // Email
        detailName = document.createElement('d6');
        detailName.classList.add('margin-dead','detailName');
        detailName.textContent="email: ";
        userProfile.appendChild(detailName);

        var email= document.createElement('p');
        email.classList.add('margin-dead');
        userProfile.appendChild(email);

        //User On status can be seen or not
        detailName = document.createElement('d6');
        detailName.classList.add('margin-dead','detailName');
        detailName.textContent="Users can see on status: ";
        userProfile.appendChild(detailName);

        var can_see_on_status= document.createElement('p');
        can_see_on_status.classList.add('margin-dead');
        userProfile.appendChild(can_see_on_status);

        let flexBox=document.createElement('div');
        flexBox.classList.add('flexBox');
        userProfile.appendChild(flexBox);

            var deleteBtn= document.createElement('button');
            deleteBtn.classList.add('danger-button','button');
            deleteBtn.textContent='Delete User' ;
            flexBox.appendChild(deleteBtn);

            let action="remove_chat";
            deleteBtn.onclick=()=>_confirmation_pop_up(unm,"Are You sure you want to Delete this chatter? Your all chats will be deleted also. ",action,'red');
    
        if(unm!=='You'){
            var blockBtn= document.createElement('button');
            blockBtn.classList.add('danger-button','button');
            blockBtn.textContent='Block User' ;
            flexBox.appendChild(blockBtn);

            let action="block_chat";
            blockBtn.onclick=()=>_confirmation_pop_up(unm,"Are You sure you want to Block this chatter? Your all chats will be deleted also. ",action,'red');

            var reportBtn= document.createElement('button');
            reportBtn.classList.add('danger-button','button');
            reportBtn.textContent='Report User' ;
            flexBox.appendChild(reportBtn);

            reportBtn.onclick=()=>_report_pop_up('User');
        }        

    getProfile()
        .then(res=>{
            fullName.textContent=res.name;
            email.textContent=res.email;
            about.textContent=res.about;
            can_see_on_status.textContent= (res.can_see_on_status==0)? 'No' : 'Yes';
        });
        
    setTimeout(()=>{document.onclick=(e)=>{
        if(!e?.target.closest('.user-profile'))
            userProfile.remove();
    }},100 );
}

//
async function openGroupProfile(){

    let profile= await getProfile();
    let unm=getCookie('unm');
    var admin= (profile.admin === unm)? 1 : 0;

    let userProfile = document.createElement('div');
    userProfile.classList.add('user-profile');

        // DP
        let dp = new Image();
        dp.classList.add('avatar');
        Object.assign(dp.style,{
            minWidth: '80px',
            minHeight: '80px',
        });
        dp.src= user.querySelector('.dp img')?.src;
        dp.onerror=()=>dp.src=default_dp_src;
        userProfile.appendChild(dp);

        let changeDPIcon= new Image();
        changeDPIcon.classList.add('icon');
        Object.assign(changeDPIcon.style, {
            height: '1.4em',
            width: '1.4em',
            backgroundColor:'aliceblue',
            borderRadius:'5px',
            position:'absolute',
            top:'25%',
            left:'25%',
        });
        if(device === 'mobile') changeDPIcon.style.top='10%';
        changeDPIcon.src='/img/icons/settings/profile/edit_img.png';
        changeDPIcon.onclick=()=>_upload_img_form("Upload New Group DP","UPLOAD_GROUP_DP")
        userProfile.appendChild(changeDPIcon);

        // Full Name
        let detailName = document.createElement('d6');
        detailName.classList.add('margin-dead','detailName');
        detailName.textContent="Name: ";
        userProfile.appendChild(detailName);

        let flexBox=document.createElement('div');
        flexBox.classList.add('flexBox');
        flexBox.style.justifyContent='space-between';
        userProfile.appendChild(flexBox);

            let fullName = document.createElement('input');
            fullName.value=profile.name;
            fullName.maxLength=30;
            fullName.readOnly=true;
            flexBox.appendChild(fullName);

            let SaveNameIcon= new Image();
            SaveNameIcon.classList.add('icon');
            SaveNameIcon.src='/img/icons/settings/profile/edit.png';
            flexBox.appendChild(SaveNameIcon);

            var oldVal;
            SaveNameIcon.onclick=(e)=>{
                if(fullName.readOnly){
                    oldVal= fullName.value;
                    fullName.readOnly=false;
                    SaveNameIcon.src='img/icons/send.png';
                }else{
                    if(fullName.value != oldVal) 
                        editGroupDetails('name',fullName.value).then(res=>{
                                if(res==0)
                                    fullName.value=oldVal;
                                else if(res==1){
                                    let groupHeadings= document.querySelectorAll('.inbox-user.selected .inbox-name, .chat .heading .details .name');
                                    groupHeadings.forEach(heading=>heading.textContent=fullName.value);
                                }
                            })
                    fullName.readOnly=true;
                    SaveNameIcon.src='/img/icons/settings/profile/edit.png';
                }
            }

        // Admin
        detailName = document.createElement('d6');
        detailName.classList.add('detailName');
        detailName.textContent="Admin: ";
        userProfile.appendChild(detailName);

        flexBox=document.createElement('div');
        flexBox.classList.add('member','flexBox');
        userProfile.appendChild(flexBox);

            //Admin DP
            let adminDP = new Image();
            adminDP.classList.add('avatar');
            get_dp(profile.admin).then(res=>adminDP.src=res);
            flexBox.appendChild(adminDP);

            let groupAdmin= document.createElement('p');
            groupAdmin.textContent= (profile.admin == unm) ? 'You' : '@'+profile.admin;
            groupAdmin.classList.add('margin-dead');
            flexBox.appendChild(groupAdmin);
        
        // members
        detailName = document.createElement('d6');
        detailName.classList.add('detailName');
        detailName.textContent="Members: ";
        userProfile.appendChild(detailName);

        if(profile.members){
            JSON.parse(profile.members).forEach(member=>{

                flexBox=document.createElement('div');
                flexBox.classList.add('member','flexBox');
                flexBox.style.justifyContent='flex-start';
                userProfile.appendChild(flexBox);

                    //members DP
                    let memberDP = new Image();
                    memberDP.classList.add('avatar');
                    get_dp(member).then(res=>memberDP.src=res);
                    flexBox.appendChild(memberDP);

                    let groupMember= document.createElement('p');
                    groupMember.textContent= (member == unm) ? 'You' : '@'+member;
                    groupMember.classList.add('margin-dead');
                    flexBox.appendChild(groupMember);

                    if(admin){
                        var removeMemberBtn= new Image();
                        removeMemberBtn.classList.add('icon');
                        removeMemberBtn.src="/img/icons/options/delete.svg";
                        flexBox.appendChild(removeMemberBtn);
                    }
            })
        }

        flexBox=document.createElement('div');
        flexBox.classList.add('flexBox');
        userProfile.appendChild(flexBox);

            var deleteBtn= document.createElement('button');
            deleteBtn.classList.add('danger-button','button');
            deleteBtn.textContent= (admin) ? 'Delete Group' : 'Leave Group' ;
            flexBox.appendChild(deleteBtn);

            let action="remove_chat";
            let message = `Are You sure you want to ${deleteBtn.textContent}? Your all chats with this group will be deleted also.`;
            deleteBtn.onclick=()=>_confirmation_pop_up(unm,message,action,'red');
        
    setTimeout(()=>{
        chatStruct.heading.appendChild(userProfile);
        document.onclick=(e)=>{
        if(!e?.target.closest('.user-profile',''))
            userProfile.remove();
    }},200 );
}

const setChatBody = () =>{
    return new Promise((resolve)=>{
        _getAllMsgs()
            .then(msgObjs=>{
                
            if(!msgObjs)  {
                new_notification("Let's start new convertation.");
            }else{
                msgObjs
                    .forEach(msgObj => addNewMsgInCurrChat(msgObj));
            }
            resolve();
        })
    });
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
            nodeImg.onclick = ()=> _upload_img_form('Choose a Img to send','USER_SEND_IMG');
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
        msgInput.onkeydown=(e)=>msgBoxSizing(e);
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

    // chatStruct.footer.querySelector(".msgInput").addEventListener( 'keydown' , msgBoxSizing);
};


const closeChat = (e=null) =>{
    // if(e!=null) msgInput.removeEventListener( 'keydown' , msgBoxSizing);

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
    setCookie('currOpenedGID' ,0);
    

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

            if(msgObj.details.size > 16777200) throw [code=413];
            
            msgObj.blob = (await _read_doc(input));
            if(!msgObj.blob) throw [code=400];
            
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
            msgID:null,
            fromUnm:getCookie("unm"),
            toUnm:getCookie("currOpenedChat"),
            time:Date.now(),
            type,
            ...msgObj,
        };
        
        addNewMsgInCurrChat(msgObj);
        _sendMsg(msgObj)
            .then(res=>{
                if( (res.status == 'success') && res.responseText.msgSend == 1){
                    msgObj.msgID=res.responseText.msgID;
                    msgObj.msgContainer.setAttribute('data-msgid', msgObj.msgID);
                    
                    _placeMsgStatus(msgObj.msgContainer.querySelector("img.msgStatusIcon"),msgObj.msgID)
                        .then(res=>msgObj.status = res);
                    
                    let action={
                        req:"delete_this_msg",
                        msgID:msgObj.msgID,
                    };

                    msgObj.msgContainer.querySelector(".option-container .option[data-action='delete']").onclick=
                        ()=>_confirmation_pop_up("Delete","Are You sure you want to delete this message?",action,'red');

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
                }else{
                    throw res.responseText;
                }
            });
    }catch(err){
        customError(err);
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
    msgContainer.setAttribute('data-msgid', msgObj.msgID)
    if(msgObj.msgID === null)
        msgObj.msgContainer=msgContainer;   

    msg=document.createElement("div");
    msg.classList.add('msg');
    msg.setAttribute('data-type',msgObj.type);

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
            msgImg.classList.add("msgImg","no-select");
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
            console.error(0,"Not a valid Type");
            return;
    }

    let optionBtn = document.createElement('div');
    optionBtn.classList.add("optionBtn","ele",'icon');
    optionBtn.name="optionBtn";
    optionBtn.title="Options";
        optionBtn.innerHTML=`
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" >
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>`;    
    
    let msgOptionMenu = new OptionContainer();
    optionBtn.appendChild(msgOptionMenu.optionContainer);

    //options
    let deleteOption = msgOptionMenu.new_option("delete");

        if(whichTransmit == 'receive')
            deleteOption.children[1].textContent= "Delete For Me";
            
        if(msgObj.msgID){
            let action={
                req:"delete_this_msg",
                msgID:msgObj.msgID,
            }
            deleteOption.onclick=()=>_confirmation_pop_up(deleteOption.textContent,"Are You sure you want to delete this message?",action,'red');
        }

    let info= msgOptionMenu.new_option("info");
    //
    optionBtn.addEventListener('click',()=>toggleOptionContainer(optionBtn));
    msg.addEventListener('contextmenu',()=>toggleOptionContainer(optionBtn));

    let msgTime=document.createElement("div");
    msgTime.classList.add('msgTime');
    msgTime.textContent=time;

    if(whichTransmit == 'send'){
        let msgStatus = document.createElement('div');
        msgStatus.classList.add('msgStatus');
        msgContainer.appendChild(msgStatus);
            
            let statusIcon = new Image();
            statusIcon.classList.add('msgStatusIcon');
            msgStatus.appendChild(statusIcon); 

            _placeMsgStatus(statusIcon,msgObj.msgID)
                .then(res=> msgObj.status = res);
    }

    if(whichTransmit == 'receive'){
        msgContainer.appendChild(msg);
        msgContainer.appendChild(optionBtn);
        msgContainer.appendChild(msgTime); 
    }else{
        msgContainer.appendChild(msgTime);    
        msgContainer.appendChild(optionBtn);    
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