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