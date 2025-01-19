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
        document.querySelector('.pop_up_box #Create_newGroup_Form')?.remove();

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
            member.style.cursor="pointer";
            memberList.appendChild(member);
    
            let checkBox = document.createElement('input');
            checkBox.type = "checkbox";
            checkBox.name = "member";
            member.appendChild(checkBox);
            checkBox.value = memberName;
            
            let dp = new Image(30, 30);
            dp.classList.add('avatar','skeleton');
            member.appendChild(dp);
    
            let userNameBlock = document.createElement('p');
            userNameBlock.classList.add('margin-dead');
            member.appendChild(userNameBlock);
            userNameBlock.textContent = memberName;

            member.onclick=(e)=>{if(e.target != checkBox) checkBox.checked= (checkBox.checked) ? false : true ;}
            setTimeout(() => {
                get_dp(memberName).then(dpurl=>dp.src=dpurl);                
            }, 100);
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
        if(document.querySelector('.pop_up_box').contains(this.form))
            return;

        document.querySelector('.pop_up_box').appendChild(this.form);
        this.form.onmouseenter=()=>document.onclick=null;
        this.form.onmouseleave=()=>document.onclick=()=>this.hide();
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
        await setChatBody();
    };


    setChatHeader = async (unm,ID) =>{

        let closeIconBtn = document.createElement('Button');
        closeIconBtn.classList.add("icon","center","align-center","heading_btn");
        closeIconBtn.title="Close";
        closeIconBtn.name="closeChat";
        closeIconBtn.tabIndex=0;
        closeIconBtn.onclick=()=>closeChat();
        chatStruct.heading.appendChild(closeIconBtn);
            let closeIconImg = new Image();
            closeIconImg.src="img/icons/close.png";
            closeIconImg.alt="Close";
            closeIconBtn.appendChild(closeIconImg);

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
            searchBtnDiv.classList.add("search-btn","heading_btn","icon");
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
    // setChatBody = async () =>{
    //     return new Promise(async (resolve)=>{
    //         chatStruct.chatBody.innerHTML="";
    //         lastMsg=null;

    //         setLoader(chatStruct.chatBody);
    //         try{
    //             let msgObjs= await _getAllMsgs();
    //             if(!msgObjs)  {
    //                 new_notification("Let's start new convertation.");
    //             }else{
    //                 msgObjs
    //                     .forEach(msgObj => addNewMsgInCurrChat(msgObj));
    //             }

    //         }catch(err){
    //             customError(err);
    //         }finally{
    //             removeLoader(chatStruct.chatBody);
    //             resolve();
    //         }
        
    //     });
    // }
    
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
            msgInput.spellcheck=false;
            msgInput.accessKey="/";
            msgInput.lang="en";
            msgInput.title="Type a Message";
            msgInput.disabled=true;
            msgInput.onkeydown=(e)=>msgBoxSizing(e);
            msgInput.oninput=(e)=>emojiSyntaxChecker(msgInput.value,e);
            chatStruct.footer.appendChild(msgInput);

            let sendMsgBtn = document.createElement("button");
            sendMsgBtn.classList.add("sendMsg","icon");
            sendMsgBtn.tabIndex=0;
            sendMsgBtn.disabled=true;
            sendMsgBtn.onclick = ()=>_trigerSendMsg('text');
            chatStruct.footer.appendChild(sendMsgBtn);
                let sendMsgImg= new Image();
                sendMsgImg.src="img/icons/send.png";
                sendMsgImg.alt="Send Message";
                sendMsgBtn.appendChild(sendMsgImg);
        
        function newNode(){
            let node= document.createElement("button");
            node.classList.add("node","ele");
            upDocsContainer.appendChild(node);
            node.tabIndex=0;
            return node;
        }

    };
}

class blockedChatterListBox{
    constructor(){
        document.querySelector('.pop_up_box #blocked_chatter_list')?.remove();

        this.form = document.createElement("div");
        this.form.classList.add('pop_up');
        this.form.id = "blocked_chatter_list";

        this.memberList=null;

        this.heading();
        this.displayMemberList();
    }

    heading() {
        let header= document.createElement('header');
        header.classList.add('heading');
        this.form.appendChild(header);

        let title = document.createElement('h3');
        title.textContent = "Blocked List";
        header.appendChild(title);

        let closeIconBtn = document.createElement('button');
        closeIconBtn.classList.add("icon",'ele','skeleton','closeIcon');
        closeIconBtn.style.border='none';
        closeIconBtn.title="Close";
        closeIconBtn.tabIndex=0;
        closeIconBtn.onclick=()=>this.hide();
        header.appendChild(closeIconBtn);
            let closeIconImg = new Image();
            closeIconImg.style.height="1em";
            closeIconImg.src="img/icons/close.png";
            closeIconImg.alt="Close";
            closeIconBtn.appendChild(closeIconImg);

        let hr= document.createElement('hr');
        hr.classList.add('hr','red');
        header.appendChild(hr);
    }

    async displayMemberList() {
        try{
            let members= await _getBlockedMemberList();
            if(!members.length)
                throw 411; 

            if(this.memberList)
                this.memberList.remove();
            
            this.memberList = document.createElement('div');
            this.memberList.classList.add('memberList');
            this.form.appendChild(this.memberList);
        
            members.forEach(memberName => {
                let member = document.createElement('div');
                member.classList.add('member', 'flexBox', 'input_field');
                this.memberList.appendChild(member);
        
                let dp = new Image(30, 30);
                dp.classList.add('avatar','skeleton');
                member.appendChild(dp);
        
                let userNameBlock = document.createElement('p');
                userNameBlock.classList.add('margin-dead');
                userNameBlock.textContent = memberName;
                member.appendChild(userNameBlock);

                let removeFromListBtn= document.createElement('button');
                removeFromListBtn.classList.add('red','margin-dead','btn','red');
                removeFromListBtn.textContent="UNBLOCK";
                removeFromListBtn.onclick=()=>{
                    _unblockMember(btoa(memberName))
                    .then(res=>{
                        if(res)
                            this.displayMemberList();
                    })
                };
                member.appendChild(removeFromListBtn);

                setTimeout(() => {
                    get_dp(memberName).then(dpurl=>dp.src=dpurl);                
                }, 100); 
            });

            this.show();
        }catch(err){
            this.hide();
            if(err === 411){
                new_Alert("You have no Blocked User.");
            }else{
                customError(err);
            }
        }
    }

    show(){
        if(document.querySelector('.pop_up_box').contains(this.form))
            return;

        document.querySelector('.pop_up_box').appendChild(this.form);
        this.form.onmouseenter=()=>document.onclick=null;
        this.form.onmouseleave=()=>document.onclick=()=>this.hide();
    }


    hide(){
        this.form.remove();
    }
}

class ShowEmojisList{
    constructor(from,GID){
        document.querySelector('.pop_up_box #emojis_list_form')?.remove();

        this.from=from;
        this.GID=GID;

        this.form = document.createElement("div");
        this.form.classList.add('pop_up','form');
        this.form.id = "emojis_list_form";

        this.emojisListContainer=null;

        this.heading(); 
        this.setBody()
        this.footer();
        this.show();

        this.displayList();
    }

    heading() {
        let header= document.createElement('header');
        header.classList.add('heading');
        this.form.appendChild(header);

        let title = document.createElement('h3');
        title.textContent = ((this.from=="SELF")  ? "Your ":"") + "Emojis List";
        header.appendChild(title);

        let closeIconDiv = document.createElement('button');
        closeIconDiv.classList.add("icon",'ele','skeleton','closeIcon');
        closeIconDiv.style.border='none';
        closeIconDiv.title="Close";
        closeIconDiv.onclick=()=>this.hide();
        header.appendChild(closeIconDiv);

            let closeIconImg = new Image();
            closeIconImg.style.height="1em";
            closeIconImg.src="img/icons/close.png";
            closeIconImg.alt="Close";
            closeIconDiv.appendChild(closeIconImg);

        let hr= document.createElement('hr');
        hr.classList.add('hr','green');
        header.appendChild(hr);

    }

    setBody(){
        this.body= document.createElement('div');
        this.body.classList.add('body');
        this.form.appendChild(this.body);

        setLoader(this.body);

        Object.assign(this.body.querySelector('.loader').style,{
            position:'relative',
            minHeight:'300px',
        })
    }

    async displayList() {
        try{
            var btnStyles={
                'position':'relative',
                'margin':'0 5px',
                'right':'0',
            }
            var rowStyles={
                display: 'grid',
                grid: 'auto-flow / 3em 5em 5em 4em 6em 7em',
                overflow:'hidden',
                overflowWrap:'anywhere',
            }
            if(this.from=="GROUP")
                rowStyles.grid='auto-flow / 3em 7em 5em 5em 4em 6em 7em';

            if(this.emojisListContainer)
                this.emojisListContainer.remove();

            this.emojisListContainer = document.createElement('table');
            this.emojisListContainer.classList.add('memberList');
            this.body.appendChild(this.emojisListContainer);

            let data={from:this.from,GID:this.GID};
            var emojisList= await _getEmojiList(data);
            this.body.querySelector('.loader')?.remove();
            if(!emojisList.length)
                throw 411; 

            // ? Form Header
            let emojiBoxHeader = document.createElement('tr');
            Object.assign(emojiBoxHeader.style,rowStyles);
            emojiBoxHeader.classList.add('emojiBoxHeader', 'flexBox', 'input_field' );
            Object.assign(emojiBoxHeader.style,{
                borderBottom: "var(--thin-wh-border)",
                flexWrap: 'nowrap',
                zIndex:'1',
            })
            this.emojisListContainer.appendChild(emojiBoxHeader);
            
            clmHeading("No.");
            if(this.from=="GROUP")
                clmHeading("Uploader");
            clmHeading("Scope");
            clmHeading("Name");
            clmHeading("Emoji");
            clmHeading("Status");

            let actionCLM=clmHeading("Action");
            actionCLM.classList.add('btn');
            Object.assign(actionCLM.style,btnStyles);
            actionCLM.style.removeProperty('width');

            function clmHeading(title){
                let nodeEle= document.createElement("th");
                nodeEle.textContent=title+":";
                nodeEle.style.color="lime";
                emojiBoxHeader.appendChild(nodeEle);
                return nodeEle;
            }
            // ?

            var count=0;
            emojisList.forEach(emojisDetails => {
                // tabler row
                let emojiBox = document.createElement('tr');
                Object.assign(emojiBox.style,rowStyles);
                emojiBox.classList.add('emojiBox', 'flexBox', 'input_field','member');
                this.emojisListContainer.appendChild(emojiBox);
                
                // index no.
                var node=nodeEle();
                let index = document.createElement('p');
                index.classList.add('margin-dead');
                index.textContent = ++count + ".";
                node.appendChild(index);

                if(this.from=="GROUP"){
                    // Uploader name.
                    var node=nodeEle();
                    let index = document.createElement('p');
                    index.classList.add('margin-dead');
                    index.textContent =  emojisDetails.uploaderUNM;
                    node.appendChild(index);
                }
                // scope of the emoji
                node=nodeEle();
                let scope = document.createElement('p');
                scope.classList.add('margin-dead');
                scope.textContent = (emojisDetails.scope == "GROUP") ? `G- '${emojisDetails.GNM}'` : emojisDetails.scope;
                node.appendChild(scope);
                
                node=nodeEle();
                    let name = document.createElement('p');
                name.classList.add('margin-dead');
                name.style.color="skyblue";
                name.textContent = emojisDetails.name;
                node.appendChild(name);
                
                node=nodeEle();
                node.classList.add('mid-img')
                let emoji = new Image();
                emoji.classList.add('img');
                emoji.src=`data:${emojisDetails.mime};base64,${emojisDetails.blob}`;
                node.appendChild(emoji);

                node=nodeEle();
                node.style.overflow="hidden";
                let status = document.createElement('p');
                status.classList.add('margin-dead');
                status.textContent = emojisDetails.status;
                status.style.color= (emojisDetails.status == "PENDING") ? "red" : 'blue';
                node.appendChild(status);
                
                node=nodeEle();
                node.style.removeProperty('width');
                    let deleteBtn= document.createElement('button');
                    deleteBtn.classList.add('red','btn');
                    Object.assign(deleteBtn.style,btnStyles);
                    deleteBtn.textContent="DELETE";
                    deleteBtn.onclick=()=>{
                        _deleteUploadedEmoji(emojisDetails.id).then(res=>{
                            if(res){
                                setLoader(this.body);
                                this.displayList();
                            }
                        });
                    };
                    node.appendChild(deleteBtn);

                function nodeEle(){
                    let nodeEle= document.createElement("td");
                    emojiBox.appendChild(nodeEle);
                    return nodeEle;
                }
            });
            
            // on scroll changing emojiBoxHeader position : absolute | static
            this.body.onscroll=()=>{
                if(this.body.scrollTop <= 10){
                    Object.assign(emojiBoxHeader.style,{
                        position:'static',
                        backgroundColor:'transparent',
                    })
                }else{
                    Object.assign(emojiBoxHeader.style,{
                        position:'absolute',
                        backgroundColor:'black',
                    })
                }
            }
        }catch(err){
            if(err === 411){
                this.#showMsg("No Emojis Found.");
                new_Alert("No Emojis Found.");
            }else{
                this.hide();
                customError(err);
            }
        }
    }

    footer(){
        let footer= document.createElement('footer');
        this.form.appendChild(footer);

        var btns= document.createElement('div');
        btns.classList.add('flexBox');  
        footer.appendChild(btns);
        
        let uploadBtn= document.createElement('button');
        uploadBtn.classList.add('green','margin-dead','btn');
        uploadBtn.textContent="Upload More Emojis";
        uploadBtn.onclick=()=>{this.hide();openUploadEmojiForm(this.from,this.GID)};
        btns.appendChild(uploadBtn);
    }

    show(){
        if(document.querySelector('.pop_up_box').contains(this.form))
            return;

        document.querySelector('.pop_up_box').appendChild(this.form);
        this.form.onmouseenter=()=>document.onclick=null;
        this.form.onmouseleave=()=>document.onclick=()=>this.hide();
    }

    hide(){
        this.form.remove();
    }

    #showMsg(msg,color="red"){
        this.usersListBlock?.remove();

        let h1= document.createElement("h1");
        Object.assign( h1.style,{
            color:color,
        })
        h1.classList.add('msg');
        h1.textContent=msg;
        this.body.appendChild(h1);
    }
}

// this claas is used to open searched emoji list at footer of the chat
class showEmojiListContainer{
    
    constructor(emojiNm=""){
        if(!chatStruct.footer || emojiNm.length < 1 || !getCookie('currOpenedChat'))
            return;

        this.searchEmojis(emojiNm);
    }

    async setBody(){
        //removing body if there is any
        this.body?.remove();

        //declaring body
        this.body = document.createElement("div");
        this.body.id="emojisListContainer";

        //seting loader in body
        setLoader(this.body);

        // creating emojis List
        this.emojisList={};

        //adding container in footer
        this.show();        
    }

    async displayList() {
        try{
            await this.setBody();
            //creating data obj for searching
            let data= {name:this.emojiName,}

            //scope selecting
            if(getCookie('chat').toLowerCase() == "group" ){
                data.scope="SELF&GROUP";
                data.GID= getCookie('currOpenedGID'); 
            }else
                data.scope="SELF";
            
            //serching emoji by name and scope
            let list= await _searchEmoji(data);
            
            this.body.querySelector('.loader')?.remove();
            if(!list)
                throw 411;

            //this function will filter the the emojis which are in list and divide in group,private and public
            //?stores it in this.emojiList obj
            this.#filterEmojiList(list);

            //? adding emojis in list.
            
            //group, private , public 
            let scopes=["private","group","public"];

            
            
            scopes.forEach(scope=>{
                if(this.emojisList[scope].length){
                    this.#setEmojiListTitle(scope);
                    this.emojisList[scope].forEach(emojiObj=> this.#appendEmoji(emojiObj));
                }
            });

        }catch(err){
            this.hide();
            if(err != 411)
                customError(err)
        }
    }

    async searchEmojis(emojiNm) {
        if(!chatStruct.footer || emojiNm.length < 1 || !getCookie('currOpenedChat')){
            this.hide();
            return;
        }
        
        this.emojiName = emojiNm;
        await this.displayList();
    }

    show(){
        this.input= chatStruct.footer.querySelector(".msgInput");

        document.querySelector('#emojisListContainer')?.remove();
        chatStruct.footer.insertBefore(this.body,chatStruct.footer.firstChild);
        // chat.insertBefore(this.body,chatStruct.footer);
    }

    hide(){
        this.body?.remove();
    }

    #filterEmojiList(list){
         //private, group , public 
        let scopes= ["private","group","public"];
        
        scopes.forEach(scope=>{
            this.emojisList[scope] = list.filter(emojiObj=>{
                if(emojiObj.scope === scope.toUpperCase())
                    return emojiObj;
            })
        });
    }

     // to set emoji list Title like Private and Group
    #setEmojiListTitle(name){
        let title= document.createElement("h5");
        title.classList.add("title")
        title.textContent=name+":";
        this.body.appendChild(title);
    }

    //to add emojiObj in list
    #appendEmoji(emojiObj){
        //a flexable container for emoji and emoji-name 
        let node= document.createElement("div");
        node.className='emoji-node flexbox member';

            //Emoji image Container
            let emoji= document.createElement('div');
            emoji.className="emoji small-img icon";
            node.appendChild(emoji);

                //emoji image
                let img= new Image();
                img.className="img";
                img.src= `data:${emojiObj.mime};base64,${emojiObj.blob}`;
                img.alt="Emoji";
                emoji.appendChild(img);

            //Emoji name Container
            let emojiNameContainer= document.createElement("div");
            emojiNameContainer.className="emoji-name";
            node.appendChild(emojiNameContainer)

                //name of the Emoji
                let emojiName = document.createElement("p");
                emojiName.className="margin-dead";
                emojiName.textContent= emojiObj.name;
                emojiNameContainer.appendChild(emojiName);

        this.body.appendChild(node);  

        //emoji node onclick event
        node.onclick=(e)=>{
            this.input.value= replaceAt(this.input.value,emoji_search_start_index,this.input.selectionEnd,emojiObj.name);
            turn_off_emoji_searching();

            this.input.focus();
        }

    }

}


/*

    next session changes (specifically fir emoji list container):

    1. set title alignment at start 
    2. test styles for mobile also( if needed add more hight for the .emoji-node )
*/