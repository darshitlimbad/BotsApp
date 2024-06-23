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
    constructor(members=[]) {
        if(!members.length)
            return 0;
        this.members = members;

        this.form = document.createElement("div");
        this.form.id = "Create_newGroup_Form";
        this.form.classList.add("pop_up");
    
        this.createGroupNameInput();
        this.displayMemberList();
        this.displayButtons();
    }

    createGroupNameInput() {
        let header= document.createElement('header');
        header.classList.add('heading');
        this.form.appendChild(header);

        let title = document.createElement('h3');
        title.textContent = "Create a New Group";
        header.appendChild(title);

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
        createBtn.value="Create";
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
        if(this.groupNameInput.value == ''){
            this.groupNameInput.style.border='1px solid red';
            return;
        }else{
            this.groupNameInput.style.removeProperty('border');
        }

        let memberElementList= this.form.querySelectorAll(".memberList .member input[name='member']");
        if(memberElementList.length){
            var memberAddList= Array.from(memberElementList)
                                    .filter(member=>member.checked)
                                    .map(member=>member.value);

            if(memberAddList.length){
                createNewGroup(this.groupNameInput.value,memberAddList)
                    .then(res=>{
                        if(res === 1){
                            new_notification(`The Group '${this.groupNameInput.value}' Has been successfully Created.`);
                            this.hide();
                        }
                    })
            }else{
                new_Alert('To create a group you must add atleast one member');
                return;
            }
        }else{
            cancelBtn.click();
        }

    }

}



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