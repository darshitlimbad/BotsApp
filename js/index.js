document.addEventListener( 'DOMContentLoaded' , () => {
    msgInput = document.querySelector(".chat .footer .msgInput");

    msgInput.addEventListener( 'keydown' , msgBoxSizing);
});

const msgBoxSizing = (e) => {    
    const footer = document.querySelector(".chat .footer");
    const msgInput = footer.querySelector(".msgInput");

    if(e.keyCode == "13"){
        if(e.shiftKey){
            
        }else{
            console.log(msgInput.value);
            msgInput.value = "";
            msgInput.style.height = "auto";
            e.preventDefault();
        }
    }
    
        // pre-action
        msgInput.style.alignContent= (msgInput.scrollHeight > 50) ? "normal" : "center";

        if(msgInput.scrollHeight > 100){
            footer.style.height = '160px';
            msgInput.style.height = '100px';
            msgInput.style.overflowY= "auto";
        }else{
            setTimeout(() => {
                footer.style.height = 'auto';
                msgInput.style.height = 'auto';
                msgInput.style.height = `${msgInput.scrollHeight}px`;  
                msgInput.style.overflowY= "hidden";
            }, 0);    
        }
}