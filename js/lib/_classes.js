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