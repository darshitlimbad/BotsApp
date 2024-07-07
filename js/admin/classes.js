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
        'groups-management':'',
        'reports-review':'',
        'server-emojis':'',
        'pending-emojis':'',
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

        var categoryTitle= document.createElement('h3');
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
        this.lastID=0;

        this.heading();
        this.displayUsersList();
    }

    heading() {
        let header= document.createElement('header');
        header.classList.add('heading');
        this.form.appendChild(header);

        let title = document.createElement('h3');
        title.textContent = "BotsApp User's List";
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

    async displayUsersList() {
        try{
            let userList= await _getUsersList(this.lastID);

            if(!userList.length)
                throw 411; 

            if(this.usersListBlock)
                this.usersListBlock.remove();
            
            this.usersListBlock = document.createElement('div');
            this.usersListBlock.classList.add('memberList');
            this.form.appendChild(this.usersListBlock);
            
            userList.forEach(userDetails => {
                let user = document.createElement('div');
                user.classList.add('user', 'flexBox', 'input_field');
                this.usersListBlock.appendChild(user);
        
                let dp = new Image(30, 30);
                dp.classList.add('avatar','skeleton');
                user.appendChild(dp);
        
                let userNameBlock = document.createElement('p');
                userNameBlock.classList.add('margin-dead');
                userNameBlock.textContent = userDetails.unm;
                user.appendChild(userNameBlock);
                
                let fullNameBlock = document.createElement('p');
                fullNameBlock.classList.add('margin-dead');
                fullNameBlock.textContent = userDetails.full_name;
                user.appendChild(fullNameBlock);
                
                let emailBlock = document.createElement('p');
                emailBlock.classList.add('margin-dead');
                emailBlock.textContent = userDetails.email;
                user.appendChild(emailBlock);

                let deleteUserBtn= document.createElement('button');
                deleteUserBtn.classList.add('red','margin-dead','btn','red');
                deleteUserBtn.textContent="UNBLOCK";
                deleteUserBtn.onclick=()=>{
                    // _unblockMember(btoa(userName))
                    // .then(res=>{
                    //     if(res)
                    //         this.displayusersList();
                    // })
                };
                user.appendChild(deleteUserBtn);

                this.lastID=userDetails.id;
                setTimeout(() => {
                    get_dp(userDetails.unm).then(dpurl=>dp.src=dpurl);                
                }, 100); 
            });

            this.show();
        }catch(err){
            this.hide();
            if(err === 411){
                new_Alert("No users Found.");
            }else{
                customError(err);
            }
        }
    }

    show(){
        if(document.querySelector('.pop_up_box').contains(this.form))
            return;

        document.querySelector('.pop_up_box').appendChild(this.form);
        setTimeout(()=>{document.onclick=()=>this.hide()},100);
        this.form.onmouseenter=()=>document.onclick=null;
        this.form.onmouseleave=()=>document.onclick=()=>this.hide();
    }

    hide(){
        this.form.remove();
    }
}