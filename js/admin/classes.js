class Category{

    #category_card_list={
        'account':['users-management','groups-management','reports-review'],
        'emojis':['server-emojis','pending-emojis'],
    };

    #cardIconURL_list={
        'users-management':"/img/icons/settings/profile.svg",
        'groups-management':"/img/icons/options/group_chat.svg",
        'reports-review':"/img/icons/options/report-review.svg",
        'server-emojis':"/img/icons/options/emoji-review.svg",
        'pending-emojis':"/img/icons/options/emoji.svg",
    };

    #eventList={
        'users-management': 'openUsersManagementList()',
        'groups-management':'openGroupsManagementList()',
        'reports-review':'openReportsList()',
        'server-emojis':'openDisplayServerEmojis()',
        'pending-emojis':'openPendingEmojisList()',
    }
    
    constructor(categoryName=null){
        if(!categoryName)
            return
        
        let filtered_categoryName=categoryName.toLowerCase();

        if(!this.#category_card_list.hasOwnProperty(filtered_categoryName)){
            new_Alert("Category Not Found!");
            return;
        }

        this.category= document.createElement('section');
        this.category.classList.add('category');
        this.category.setAttribute('name',filtered_categoryName);

        let categoryTitle= document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.textContent= categoryName+" :";
        this.category.appendChild(categoryTitle);
        

        this.#init_cardBody(filtered_categoryName);
    }

    #init_cardBody(category){
        try{
            this.cardBody= document.createElement('div');
            this.cardBody.classList.add("card-body");
            this.category.appendChild(this.cardBody);

            var cardsList= this.#category_card_list[category];

            if(!cardsList)
                new_Alert("Category Not Found!");

            cardsList.forEach(cardName=>this.#card(cardName));

            this.#add();
        }catch(err){
            new_Alert(err);
        }
    }

    #card(filtered_cardName=null){
        try{
            let cardName= filtered_cardName.replace('-',' ');
            
            let card= document.createElement('div');
            card.classList.add('card');
            card.onclick=()=>eval(this.#eventList[filtered_cardName]);
            this.cardBody.appendChild(card);

            let icon= new Image();
            icon.classList.add('icon');
            icon.alt=filtered_cardName;
            icon.src= this.#cardIconURL_list[filtered_cardName];
            card.appendChild(icon);

            let title= document.createElement('h3');
            title.classList.add('card-title');
            title.textContent= cardName;
            card.appendChild(title);
        }catch(err){
            new_Alert(err);
        }
    }

    #add(){
        if(!this.cardBody)
            return;

        document.querySelector('.chat-box').appendChild(this.category);
    }
}

// id   DP  Username    delete
class UsersManagementForm{
    constructor(){
        document.querySelector('.pop_up_box #users_management_form')?.remove();

        this.form = document.createElement("div");
        this.form.classList.add('pop_up','form');
        this.form.id = "users_management_form";

        this.usersListBlock=null;
        // this.currentID=this.lastID=0;

        this.heading(); 
        this.setBody()
        // this.footer();
        this.show();

        this.displayList();
    }

    heading() {
        let header= document.createElement('header');
        header.classList.add('heading');
        this.form.appendChild(header);

        let title = document.createElement('h3');
        title.textContent = "BotsApp Users List";
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
            
            if(this.usersListBlock)
                this.usersListBlock.remove();

            this.usersListBlock = document.createElement('table');
            this.usersListBlock.classList.add('memberList');
            this.body.appendChild(this.usersListBlock);

            var userList= await _getUsersList();
            this.body.querySelector('.loader')?.remove();
            if(!userList.length)
                throw 411; 

            let user = document.createElement('tr');
            user.classList.add('user', 'flexBox', 'input_field' );
            Object.assign(user.style,{
                borderBottom: "var(--thin-wh-border)",
                justifyContent: "flex-start",
                flexWrap: 'wrap',
            })
            this.usersListBlock.appendChild(user);

            clmHeading("DP");
            clmHeading("UserName");
            clmHeading("Full Name");
            clmHeading("Email");


            let actionEle=clmHeading("Action");
            actionEle.classList.add('btn');

            function clmHeading(title){
                let nodeEle= document.createElement("td");
                nodeEle.textContent=title+":";
                nodeEle.style.color="lime";
                user.appendChild(nodeEle);
                return nodeEle;
            }

            
            userList.forEach(userDetails => {

                let user = document.createElement('tr');
                user.classList.add('user', 'flexBox', 'input_field' , 'member');
                user.onclick=()=>new_notification(`<span class="green">Username : </span> @${userDetails.unm} | <br> <span class="green">Full Name : </span> ${userDetails.full_name} | <br>  <span class="green">Email : </span> ${userDetails.email} | <br> `);
                this.usersListBlock.appendChild(user);
        
                let node= nodeEle();
                let dp = new Image(30, 30);
                dp.classList.add('avatar','skeleton');
                node.appendChild(dp);
        
                node=nodeEle();
                let userNameBlock = document.createElement('p');
                userNameBlock.classList.add('margin-dead');
                userNameBlock.textContent = userDetails.unm;
                node.appendChild(userNameBlock);
                
                node=nodeEle();
                let fullNameBlock = document.createElement('p');
                fullNameBlock.classList.add('margin-dead');
                fullNameBlock.textContent = userDetails.full_name;
                node.appendChild(fullNameBlock);
                
                node=nodeEle();
                let emailBlock = document.createElement('p');
                emailBlock.classList.add('margin-dead');
                emailBlock.textContent = userDetails.email;
                node.appendChild(emailBlock);

                node=nodeEle();
                let deleteUserBtn= document.createElement('button');
                deleteUserBtn.classList.add('red','margin-dead','btn');
                deleteUserBtn.textContent="DELETE";
                deleteUserBtn.onclick=()=>{
                    _deleteUser(btoa(userDetails.unm))
                    .then(res=>{
                        if(res){
                            setLoader(this.body);
                            this.displayList();
                        }
                    })
                };
                node.appendChild(deleteUserBtn);

                    setTimeout(() => {
                    get_dp(userDetails.unm).then(dpurl=>dp.src=dpurl);                
                }, 100); 


                function nodeEle(){
                    let nodeEle= document.createElement("td");
                    user.appendChild(nodeEle);
                    return nodeEle;
                }
            });
        }catch(err){
            if(err === 411){
                // this.#disable_PaginationBtns();
                this.#showMsg("No users Found.");
                new_Alert("No users Found.");
            }else{
                this.hide();
                customError(err);
            }
        }
    }

    // footer(){
    //     let footer= document.createElement('footer');
    //     this.form.appendChild(footer);

    //     var btns= document.createElement('div');
    //     btns.classList.add('flexBox');  
    //     footer.appendChild(btns);

    //     let prevBtn= document.createElement('button');
    //     prevBtn.classList.add('green','margin-dead','btn');
    //     prevBtn.textContent="Prev";
    //     prevBtn.onclick=()=>console.log("hello");
    //     btns.appendChild(prevBtn);
        
    //     let nextBtn= document.createElement('button');
    //     nextBtn.classList.add('green','margin-dead','btn');
    //     nextBtn.textContent="Next";
    //     btns.appendChild(nextBtn);


    //     this.paginationBtns= [prevBtn,nextBtn];
    // }

    show(){
        if(document.querySelector('.pop_up_box').contains(this.form))
            return;

        // if(this.usersListBlock)
        //     this.#enable_PaginationBtns;

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

    // #disable_PaginationBtns(){
    //     this.paginationBtns.forEach(btn => {
    //         btn.disabled=true;
    //     });
    // }
    // #enable_PaginationBtns(){
    //     this.paginationBtns.forEach(btn => {
    //         btn.disabled=false;
    //     });
    // }
}
class GroupsManagementForm{
    constructor(){
        document.querySelector('.pop_up_box #groups_management_form')?.remove();

        this.form = document.createElement("div");
        this.form.classList.add('pop_up','form');
        this.form.id = "groups_management_form";

        this.groupsListBox=null;
        // this.currentID=this.lastID=0;

        this.heading(); 
        this.setBody()
        // this.footer();
        this.show();

        this.displayList();
    }

    heading() {
        let header= document.createElement('header');
        header.classList.add('heading');
        this.form.appendChild(header);

        let title = document.createElement('h3');
        title.textContent = "BotsApp Groups List";
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
            
            if(this.groupsListBox)
                this.groupsListBox.remove();

            this.groupsListBox = document.createElement('table');
            this.groupsListBox.classList.add('memberList');
            this.body.appendChild(this.groupsListBox);

            var groupsList= await _getGroupsList();
            this.body.querySelector('.loader')?.remove();
            if(!groupsList.length)
                throw 411; 

            let group = document.createElement('tr');
            group.classList.add('group', 'flexBox', 'input_field' );
            Object.assign(group.style,{
                borderBottom: "var(--thin-wh-border)",
                justifyContent: "flex-start",
                flexWrap: 'wrap',
            })
            this.groupsListBox.appendChild(group);

            clmHeading("DP");
            clmHeading("Group Name");
            clmHeading("Admin");
            let actionEle=clmHeading("Action");
            actionEle.classList.add('btn');

            function clmHeading(title){
                let nodeEle= document.createElement("td");
                nodeEle.textContent=title+":";
                nodeEle.style.color="lime";
                group.appendChild(nodeEle);
                return nodeEle;
            }

            groupsList.forEach(groupDetails => {

                let group = document.createElement('tr');
                group.classList.add('group', 'flexBox', 'input_field' , 'member');
                group.onclick=()=>new_notification(`<span class="green">Group Name : </span> @${groupDetails.name} | <br> <span class="green">GID : </span> ${groupDetails.GID} | <br>  <span class="green">Admin UNM : </span> ${groupDetails.adminUNM} <br> `);
                this.groupsListBox.appendChild(group);
        
                let node= nodeEle();
                let dp = new Image(30, 30);
                dp.classList.add('avatar','skeleton');
                node.appendChild(dp);
        
                node=nodeEle();
                let nameBlock = document.createElement('p');
                nameBlock.classList.add('margin-dead');
                nameBlock.textContent = groupDetails.name;
                node.appendChild(nameBlock);
                
                node=nodeEle();
                let AdminBlock = document.createElement('p');
                AdminBlock.classList.add('margin-dead');
                AdminBlock.textContent = groupDetails.adminUNM;
                node.appendChild(AdminBlock);

                node=nodeEle();
                let deleteUserBtn= document.createElement('button');
                deleteUserBtn.classList.add('red','margin-dead','btn');
                deleteUserBtn.textContent="DELETE";
                deleteUserBtn.onclick=()=>{
                    _deleteGroup(groupDetails.GID)
                        .then(res=>{
                            if(res){
                                setLoader(this.body);
                                this.displayList();
                            }
                        })
                };
                node.appendChild(deleteUserBtn);

                setTimeout(() => {
                    get_dp(null,groupDetails.GID).then(dpurl=>dp.src=dpurl);                
                }, 100); 

                function nodeEle(){
                    let nodeEle= document.createElement("td");
                    group.appendChild(nodeEle);
                    return nodeEle;
                }
            });

        }catch(err){
            if(err === 411){
                // this.#disable_PaginationBtns();
                this.#showMsg("No Groups Found.");
                new_Alert("No Groups Found.");
            }else{
                this.hide();
                customError(err);
            }
        }
    }



    // footer(){
    //     let footer= document.createElement('footer');
    //     this.form.appendChild(footer);

    //     var btns= document.createElement('div');
    //     btns.classList.add('flexBox');  
    //     footer.appendChild(btns);

    //     let prevBtn= document.createElement('button');
    //     prevBtn.classList.add('green','margin-dead','btn');
    //     prevBtn.textContent="Prev";
    //     prevBtn.onclick=()=>console.log("hello");
    //     btns.appendChild(prevBtn);
        
    //     let nextBtn= document.createElement('button');
    //     nextBtn.classList.add('green','margin-dead','btn');
    //     nextBtn.textContent="Next";
    //     btns.appendChild(nextBtn);


    //     this.paginationBtns= [prevBtn,nextBtn];
    // }

    show(){
        if(document.querySelector('.pop_up_box').contains(this.form))
            return;

        // if(this.usersListBlock)
        //     this.#enable_PaginationBtns;

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

    // #disable_PaginationBtns(){
    //     this.paginationBtns.forEach(btn => {
    //         btn.disabled=true;
    //     });
    // }
    // #enable_PaginationBtns(){
    //     this.paginationBtns.forEach(btn => {
    //         btn.disabled=false;
    //     });
    // }
}

class reportsReviewForm{
    constructor(){
        document.querySelector('.pop_up_box #groups_management_form')?.remove();

        this.form = document.createElement("div");
        this.form.classList.add('pop_up','form');
        this.form.id = "groups_management_form";

        this.reportsListBox=null;
        // this.currentID=this.lastID=0;

        this.heading(); 
        this.setBody()
        // this.footer();
        this.show();

        this.displayList();
    }

    heading() {
        let header= document.createElement('header');
        header.classList.add('heading');
        this.form.appendChild(header);

        let title = document.createElement('h3');
        title.textContent = "Reported Users List";
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

            if(this.reportsListBox)
                this.reportsListBox.remove();

            this.reportsListBox = document.createElement('table');
            this.reportsListBox.classList.add('memberList');
            this.body.appendChild(this.reportsListBox);

            var reportsList= await _getReportsList();
            this.body.querySelector('.loader')?.remove();
            if(!reportsList.length)
                throw 411; 

            // ? Form Header
            let report = document.createElement('tr');
            report.classList.add('report', 'flexBox', 'input_field' );
            Object.assign(report.style,{
                borderBottom: "var(--thin-wh-border)",
                justifyContent: "flex-start",
                flexWrap: 'wrap',
            })
            this.reportsListBox.appendChild(report);
            
            let reportedPersonCLM= clmHeading("Reported Person");
            reportedPersonCLM.style.color="red";
            clmHeading("Reported By");
            let actionCLM=clmHeading("Action");
            actionCLM.classList.add('btn');
            Object.assign(actionCLM.style,btnStyles);
            actionCLM.style.removeProperty('width');

            function clmHeading(title){
                let nodeEle= document.createElement("td");
                nodeEle.style.width="30%";
                nodeEle.textContent=title+":";
                nodeEle.style.color="lime";
                report.appendChild(nodeEle);
                return nodeEle;
            }
            // ?

            reportsList.forEach(reportDetails => {
                let group = document.createElement('tr');
                group.classList.add('group', 'flexBox', 'input_field' , 'member');
                group.onclick=()=>new_notification(`<span class='red'>Report Reason:</span> ${reportDetails.reason}`)
                this.reportsListBox.appendChild(group);
                
                var node=nodeEle();
                let reportedPerson = document.createElement('p');
                reportedPerson.classList.add('margin-dead');
                reportedPerson.textContent = reportDetails.reportedTo;
                node.appendChild(reportedPerson);

                node=nodeEle();
                let reportedBy = document.createElement('p');
                reportedBy.classList.add('margin-dead');
                reportedBy.textContent = reportDetails.reportedBy;
                node.appendChild(reportedBy);
                
                node=nodeEle();
                node.style.removeProperty('width');
                    let deleteUserBtn= document.createElement('button');
                    deleteUserBtn.classList.add('red','btn');
                    Object.assign(deleteUserBtn.style,btnStyles);
                    deleteUserBtn.textContent="DELETE ACCOUNT";
                    deleteUserBtn.onclick=()=>{
                        _deleteUser(btoa(reportDetails.reportedTo))
                            .then(res=>{
                                if(res){
                                    setLoader(this.body);
                                    this.displayList();
                                }
                            })
                    };
                    node.appendChild(deleteUserBtn);
                    
                    let warnBtn= document.createElement('button');
                    warnBtn.classList.add('green','btn');
                    Object.assign(warnBtn.style,btnStyles);
                    warnBtn.textContent="Warn";
                    warnBtn.onclick=()=>{
                        _warnUser(btoa(reportDetails.reportedTo))
                            .then(res=>{
                                if(res){
                                    setLoader(this.body);
                                    this.displayList();
                                }
                            })
                    };
                    node.appendChild(warnBtn);
                    
                    let reject= document.createElement('button');
                    reject.classList.add('white','btn');
                    Object.assign(reject.style,btnStyles);
                    reject.textContent="Reject";
                    reject.onclick=()=>{
                        _rejectReport(btoa(reportDetails.reportedTo))
                            .then(res=>{
                                if(res){
                                    setLoader(this.body);
                                    this.displayList();
                                }
                            })
                    };
                    node.appendChild(reject);

                setTimeout(() => {
                    get_dp(null,reportDetails.GID).then(dpurl=>dp.src=dpurl);                
                }, 100); 

                function nodeEle(){
                    let nodeEle= document.createElement("td");
                    nodeEle.style.width="30%";
                    group.appendChild(nodeEle);
                    return nodeEle;
                }
            });

        }catch(err){
            console.log(err);
            if(err === 411){
                // this.#disable_PaginationBtns();
                this.#showMsg("No Reports Found.");
            }else{
                this.hide();
                customError(err);
            }
        }
    }



    // footer(){
    //     let footer= document.createElement('footer');
    //     this.form.appendChild(footer);

    //     var btns= document.createElement('div');
    //     btns.classList.add('flexBox');  
    //     footer.appendChild(btns);

    //     let prevBtn= document.createElement('button');
    //     prevBtn.classList.add('green','margin-dead','btn');
    //     prevBtn.textContent="Prev";
    //     prevBtn.onclick=()=>console.log("hello");
    //     btns.appendChild(prevBtn);
        
    //     let nextBtn= document.createElement('button');
    //     nextBtn.classList.add('green','margin-dead','btn');
    //     nextBtn.textContent="Next";
    //     btns.appendChild(nextBtn);


    //     this.paginationBtns= [prevBtn,nextBtn];
    // }

    show(){
        if(document.querySelector('.pop_up_box').contains(this.form))
            return;

        // if(this.usersListBlock)
        //     this.#enable_PaginationBtns;

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

    // #disable_PaginationBtns(){
    //     this.paginationBtns.forEach(btn => {
    //         btn.disabled=true;
    //     });
    // }
    // #enable_PaginationBtns(){
    //     this.paginationBtns.forEach(btn => {
    //         btn.disabled=false;
    //     });
    // }
}

class displayServerEmojis{
    constructor(){
        document.querySelector('.pop_up_box #emojis_list_form')?.remove();

        this.form = document.createElement("div");
        this.form.classList.add('pop_up');
        this.form.id = "emojis_list_form";

        this.emojisListContainer=null;

        this.heading(); 
        this.setBody()
        this.show();

        this.displayList();
    }

    heading() {
        let header= document.createElement('header');
        header.classList.add('heading');
        this.form.appendChild(header);

        let title = document.createElement('h3');
        title.textContent = "Emojis List";
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
                grid: 'auto-flow / 3em 7em 5em 7em 4em 6em 7em',
                overflow:'hidden',
                overflowWrap:'anywhere',
            }

            if(this.emojisListContainer)
                this.emojisListContainer.remove();

            this.emojisListContainer = document.createElement('table');
            this.emojisListContainer.classList.add('memberList');
            this.body.appendChild(this.emojisListContainer);

            var emojisList= await _getServerEmojis();
            this.body.querySelector('.loader')?.remove();

            if(!emojisList.length)
                throw 411; 

            // ? Form Header
            let emojiBox = document.createElement('tr');
            Object.assign(emojiBox.style,rowStyles);
            emojiBox.classList.add('emojiBox', 'flexBox', 'input_field' );
            Object.assign(emojiBox.style,{
                borderBottom: "var(--thin-wh-border)",
                flexWrap: 'nowrap',
            })
            this.emojisListContainer.appendChild(emojiBox);
            
            clmHeading("No.");
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
                let nodeEle= document.createElement("td");
                nodeEle.textContent=title+":";
                nodeEle.style.color="lime";
                emojiBox.appendChild(nodeEle);
                return nodeEle;
            }
            // ?

            var count=0;
            emojisList.forEach(emojisDetails => {
                let emojiBox = document.createElement('tr');
                Object.assign(emojiBox.style,rowStyles);
                emojiBox.classList.add('emojiBox', 'flexBox', 'input_field','member');
                this.emojisListContainer.appendChild(emojiBox);
                
                var node=nodeEle();
                let index = document.createElement('p');
                index.classList.add('margin-dead');
                index.textContent = ++count + ".";
                node.appendChild(index);

                node=nodeEle();
                    let uploader = document.createElement('p');
                    uploader.classList.add('margin-dead');
                    uploader.textContent = emojisDetails.uploaderUNM ;
                    node.appendChild(uploader);

                node=nodeEle();
                let scope = document.createElement('p');
                scope.classList.add('margin-dead');
                scope.textContent = emojisDetails.scope +( (emojisDetails.scope == "GROUP") ? "-"+emojisDetails.GNM : "" );
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

class displayPendingEmojis{
    constructor(){
        document.querySelector('.pop_up_box #emojis_list_form')?.remove();

        this.form = document.createElement("div");
        this.form.classList.add('pop_up');
        this.form.id = "emojis_list_form";

        this.emojisListContainer=null;

        this.heading(); 
        this.setBody()
        this.show();

        this.displayList();
    }

    heading() {
        let header= document.createElement('header');
        header.classList.add('heading');
        this.form.appendChild(header);

        let title = document.createElement('h3');
        title.textContent = "Pending Emojis List";
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
                'margin':'6px',
                padding:'5px',
                width:'3rem',
                'right':'0',
            }
            var rowStyles={
                display: 'grid',
                grid: 'auto-flow / 3em 7em 5em 7em 4em 6em 8em',
                overflow:'hidden',
                overflowWrap:'anywhere',
            }

            if(this.emojisListContainer)
                this.emojisListContainer.remove();

            this.emojisListContainer = document.createElement('table');
            this.emojisListContainer.classList.add('memberList');
            this.body.appendChild(this.emojisListContainer);

            var emojisList= await _getPendingEmojis();
            this.body.querySelector('.loader')?.remove();

            if(!emojisList.length)
                throw 411; 

            // ? Form Header
            let emojiBox = document.createElement('tr');
            Object.assign(emojiBox.style,rowStyles);
            emojiBox.classList.add('emojiBox', 'flexBox', 'input_field' );
            Object.assign(emojiBox.style,{
                borderBottom: "var(--thin-wh-border)",
                flexWrap: 'nowrap',
            })
            this.emojisListContainer.appendChild(emojiBox);
            
            clmHeading("No.");
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
                let nodeEle= document.createElement("td");
                nodeEle.textContent=title+":";
                nodeEle.style.color="lime";
                emojiBox.appendChild(nodeEle);
                return nodeEle;
            }
            // ?

            var count=0;
            emojisList.forEach(emojisDetails => {
                let emojiBox = document.createElement('tr');
                Object.assign(emojiBox.style,rowStyles);
                emojiBox.classList.add('emojiBox', 'flexBox', 'input_field','member');
                this.emojisListContainer.appendChild(emojiBox);
                
                var node=nodeEle();
                let index = document.createElement('p');
                index.classList.add('margin-dead');
                index.textContent = ++count + ".";
                node.appendChild(index);

                node=nodeEle();
                    let uploader = document.createElement('p');
                    uploader.classList.add('margin-dead');
                    uploader.textContent = emojisDetails.uploaderUNM ;
                    node.appendChild(uploader);

                node=nodeEle();
                let scope = document.createElement('p');
                scope.classList.add('margin-dead');
                scope.textContent = emojisDetails.scope +( (emojisDetails.scope == "GROUP") ? "-"+emojisDetails.GNM : "" );
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

                    let acceptBtn= document.createElement('button');
                    acceptBtn.classList.add('blue','btn');
                    Object.assign(acceptBtn.style,btnStyles);
                    acceptBtn.textContent="Accept";
                    acceptBtn.onclick=()=>{
                        _acceptEmojiAsPublic(emojisDetails.id).then(res=>{
                            if(res){
                                setLoader(this.body);
                                this.displayList();
                            }
                        });
                    };
                    node.appendChild(acceptBtn);
                    
                    let rejectBtn= document.createElement('button');
                    rejectBtn.classList.add('red','btn');
                    Object.assign(rejectBtn.style,btnStyles);
                    rejectBtn.textContent="Reject";
                    rejectBtn.onclick=()=>{
                        _deleteUploadedEmoji(emojisDetails.id).then(res=>{
                            if(res){
                                setLoader(this.body);
                                this.displayList();
                            }
                        });
                    };
                    node.appendChild(rejectBtn);

                function nodeEle(){
                    let nodeEle= document.createElement("td");
                    emojiBox.appendChild(nodeEle);
                    return nodeEle;
                }
            });
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