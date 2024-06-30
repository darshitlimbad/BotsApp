class Databox {
    constructor()  {
        this.emptyIt();
    };    

    push = (ele) => {
        this.elements.push(ele);
        this.rear++;
    };

    pop = () => {
        this.rear--;
        if(this.front > this.rear)
            this.front=this.rear;
        else if(this.rear <= -1)
            this.emptyIt();
    }

    getAll = () => {
        if( this.rear == -1 ){
            return 0;
        }else{
            return this.elements;
        }
    }

    getCurr = () => {
        if((this.front < 0) || (this.front > this.rear)){
            return 0;
        }else{
            return this.elements[this.front];
        }
    }

    moveUp = () => {
        if( (this.front <= 0) || (this.front >= this.rear) ){
            return 0;
        }else{
            return this.elements[--this.front];
        }
    }

    moveDown = () => {
        if( this.front >= this.rear ){
            return 0;
        }else{
            return this.elements[++this.front];
        }
    }

    moveLast = () => {
        this.front = this.rear;
    }

    emptyIt = () => {
        this.rear = -1;
        this.front  = -1 ;
        this.elements = new Array();
    }

}

class OptionContainer {
    optionContainer;
    
    optionIconURL = "/img/icons/options/";
    constructor(){
        this.optionContainer = document.createElement('div');
        this.optionContainer.classList.add("option-container");
    }

    new_option(name,icon){
        if(!icon) icon=name;

        let option = document.createElement('div');
        option.classList.add('option');
        option.title=name;
        option.setAttribute('data-action',name);
        this.optionContainer.appendChild(option);

            let optionIcon= new Image();
            optionIcon.classList.add('option-icon','icon');
            optionIcon.src= this.optionIconURL+icon+".svg";
            option.appendChild(optionIcon);

            let optionName= document.createElement('span');
            optionName.classList.add('option-name');
            optionName.textContent= name ;
            option.appendChild(optionName);

        this.optionContainer.appendChild(option);
        return option;
    }

}


class CreateNewGroupPopUp {
    constructor(members=[],action="new_group") {
        if(!members.length)
            return 0;
        this.members = members;
        this.action= action;

        this.form = document.createElement("div");
        this.form.id = "Create_newGroup_Form";
        this.form.classList.add("pop_up");
    
        this.heading();
        this.displayMemberList();
        this.displayButtons();
    }

    heading() {
        let header= document.createElement('header');
        header.classList.add('heading');
        this.form.appendChild(header);

        let title = document.createElement('h3');
        title.textContent = (this.action === 'new_group') ? "Create a New Group" : (this.action === 'add_new_members') ? "Add new Members":'' ;
        header.appendChild(title);

        if(this.action === 'new_group'){
            let inputField = document.createElement('div');
            inputField.classList.add('input_field');
            header.appendChild(inputField);
        
            let inputDiv = document.createElement('div');
            inputDiv.classList.add('input', 'center');
            inputField.appendChild(inputDiv);
        
            this.groupNameInput = document.createElement('input');
            this.groupNameInput.type = "text";
            this.groupNameInput.name = "groupName";
            this.groupNameInput.placeholder = "Enter Group Name";
            this.groupNameInput.maxlength = "30";
            this.groupNameInput.autocomplete = "off";
            this.groupNameInput.style.position = "sticky";
            inputDiv.appendChild(this.groupNameInput);
        }
    }

    async displayMemberList() {
        let memberList = document.createElement('div');
        memberList.classList.add('memberList');
        this.form.appendChild(memberList);
    
        this.members.forEach(memberName => {
            let member = document.createElement('div');
            member.classList.add('member', 'checkBox', 'flexBox', 'input_field');
            memberList.appendChild(member);
    
            let checkBox = document.createElement('input');
            checkBox.type = "checkbox";
            checkBox.name = "member";
            member.appendChild(checkBox);
            checkBox.value = memberName;
    
            let dp = new Image(30, 30);
            dp.classList.add('avatar');
            member.appendChild(dp);
            dp.src = default_dp_src;
    
            let userNameBlock = document.createElement('p');
            userNameBlock.classList.add('margin-dead');
            member.appendChild(userNameBlock);
            userNameBlock.textContent = memberName;
        });
    }

    displayButtons(){
        let buttons= document.createElement('footer');
        buttons.classList.add('buttons');
        this.form.appendChild(buttons);

        let cancelBtn=document.createElement('button');
        cancelBtn.classList.add('pop_up_no_btn' ,'button');
        cancelBtn.onclick=()=>this.hide();
        cancelBtn.textContent="Cancel";
        buttons.appendChild(cancelBtn);

        let createBtn= document.createElement('input');
        createBtn.classList.add('pop_up_yes_btn','button');
        createBtn.type="submit";
        createBtn.value=(this.action === 'new_group') ? "Create" : "Add";
        createBtn.onclick=()=>this.submit();
        buttons.appendChild(createBtn);

    }

    show(){
        document.querySelector('.pop_up_box').appendChild(this.form);
    }

    hide(){
        this.form.remove();
    }

    submit(){
        if(this.action === 'new_group'){
            if(this.groupNameInput.value == ''){
                this.groupNameInput.style.border='1px solid red';
                return;
            }else{
                this.groupNameInput.style.removeProperty('border');
            }
        }

        let memberElementList= this.form.querySelectorAll(".memberList .member input[name='member']");
        if(memberElementList.length){
            var memberAddList= Array.from(memberElementList)
                                    .filter(member=>member.checked)
                                    .map(member=>btoa(member.value));

            if(memberAddList.length){
                this.hide();
                if(this.action === 'new_group'){
                    createNewGroup(this.groupNameInput.value,memberAddList)
                        .then(res=>{
                            if(res === 1){
                                new_notification(`The Group '${this.groupNameInput.value}' Has been successfully Created.`);
                            }
                        })
                }else if(this.action === 'add_new_members'){
                    _addNewMember(memberAddList)
                        .then(res=>{
                            if(res === 1){
                                new_notification('The members have been succesfully added to the group.');
                            }
                        })
                }
            }else{
                new_Alert('To create a group you must add atleast one member');
                return;
            }
        }else{
            cancelBtn.click();
        }

    }
}


class openChatClass{
    constructor(unm,ID=null){
        if(userStatus.isOnline == false){
            handler.err_401();
            return;
        }
        if( ((getCookie('chat').toLowerCase() === 'personal') && (getCookie('currOpenedChat') == unm))
            || ID && ID == getCookie('currOpenedGID') )
            return;

        this.openChat(unm,ID);
    }

    openChat =async (unm,ID=null) => {
        chatOpened=true;
        chat.innerHTML=""; 
        lastMsg=null;
        //for mobile
        if(device == 'mobile'){
            hideInbox();
        }
    
        // chatStruct.heading.remove();
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
        await setCookie('currOpenedChat' ,unm);
        if(getCookie('chat').toLowerCase() =='group')   setCookie('currOpenedGID',user.id);
        setLoader(chat);
        this.setChatHeader(unm,ID);
        removeLoader(chat);
        this.setChatFooter();
        await this.setChatBody();
    };


    setChatHeader = async (unm,ID) =>{

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

    // chatLoading=null;
    setChatBody = async () =>{
        return new Promise(async (resolve)=>{
            chatStruct.chatBody.innerHTML="";
            lastMsg=null;

            setLoader(chatStruct.chatBody);
            try{
                let msgObjs= await _getAllMsgs();
                if(!msgObjs)  {
                    new_notification("Let's start new convertation.");
                }else{
                    msgObjs
                        .forEach(msgObj => addNewMsgInCurrChat(msgObj));
                }

            }catch(err){
                customError(err);
            }finally{
                removeLoader(chatStruct.chatBody);
                resolve();
            }
        
        });
    }
    
    setChatFooter= () =>{

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
}

// class msgInfo{
//     constructor(){
//         this.constructTemplate();
//         console.log(this.box);
//         document.querySelector('.pop_up_box').appendChild(this.box);
//     }

//     constructTemplate(){
//         this.box=document.createElement('div');
//         this.box.classList.add('pop_up','info');

        
//         // <div class="buttons">
//         //     <button class="pop_up_no_btn button" onclick="_hide_this_pop_up(document.querySelector('#add_new_chat_form'))">
//         //     <img src="/img/icons/close.png" alt="Close" height="15px" width="15px" style="top: 2px;position: relative;"></button>
//         // </div>

//         this.header= document.createElement('header');
//         this.header.classList.add('heading');
//         this.box.appendChild(this.header);

//         let h3= document.createElement('h3');
//         h3.textContent="Info";
//         this.header.appendChild(h3);

//         this.body= document.createElement('div');
//         this.body.classList.add('body');
//         this.box.appendChild(this.body);

//         this.footer= document.createElement('footer');
//         this.footer.classList.add('footer');
//         this.box.appendChild(this.footer);

//         // let buttons= document.createElement('div');
//         // buttons.classList.add('buttons');
//         // header.appendChild(buttons)

//         // buttons.
//     }

  
// }

// class pop_up {
//     /*
//     !popUp Names which can be created by this class
//     - confirmation_pop_up
//     - upload_img_form
//     - upload_doc_form
//     - add_new_chat_form
//     */
    
//     center= document.createElement('div');
//     pop_up= document.createElement('div');
//     title= document.createElement('h3');

//     constructor(pop_up_name=null){
//         this.center.classList.add('center');
//         this.pop_up.classList.add('pop_up');
//         this.title.classList.add('title');

//         if(!pop_up_name)
//             return;

//         this.pop_up.id=pop_up_name;
//     }  

//     show(){
//         this.center.appendChild(this.pop_up);
//         document.appendChild(this.center);
//     }
    
//     title(title= null){
//         this.title.textContent=title;
//         this.pop_up.appendChild(this.title);
//     }
    
// }