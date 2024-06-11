
var userStatus;
document.addEventListener('DOMContentLoaded',()=>{
    userStatus=new Status;
})

class Status {
    /*
        --colors and their values:

        - green : online
        - red   : offline
        - orange: Today was online
        - Blue  : New User
     */

    statusURL = "/functionality/lib/_status.php";
    msgStatusURL = "/img/icons/chat/msg_status/";

    #requestTime = 2000;
    intervalID={};

    isOnline = false;
    adminOnlineStatusIcon = document.querySelector('header .status');

    constructor(){
        this.setOnlineStatusUpdateInterval();
    }

    setOnlineStatusUpdateInterval=()=>{
        this.onlineStatusUpdate();
        this.intervalID.onlineStatusUpdate = setInterval(()=>this.onlineStatusUpdate(),this.#requestTime);

        window.onoffline= ()=> window.ononline= ()=>{
            this.setOnlineStatusUpdateInterval();
            if(getCookie('chat'))
                this.checkChatListStatus();
        }
    }
    
    async onlineStatusUpdate(){
        let data = {
            req:"onlineStatusUpdate",
        }
        postReq(this.statusURL,JSON.stringify(data))
            .then(res=>{
                this.isOnline = (res.status == 'success' && res.responseText == 1) ? true : false ;                
            })
            .catch(err=>{
                this.isOnline = false;
                clearInterval(this.intervalID.onlineStatusUpdate);
                this.intervalID.onlineStatusUpdate = null;
            })
            .finally(()=>{
                var replace;
                if(this.isOnline)
                    replace = new Array('red','green');
                else
                    replace = new Array('green','red');

                this.adminOnlineStatusIcon.classList.replace(...replace);
                
            })
    }

    async checkChatListStatus(){
        let chatType= getCookie('chat').toLowerCase();
        if(!this.intervalID.checkChatListStatus)
            this.intervalID.checkChatListStatus = setInterval(()=>this.checkChatListStatus(),this.#requestTime);

        let data={
            req:"checkChatListStatus",
        }
    
        postReq(this.statusURL,JSON.stringify(data))
            .then(res=>{
                if(res.status == 'success' && res.responseText != 0){
                    res.responseText.forEach(chatter => {
                        
                        let inboxUser = (chatType === 'personal') ? 
                                        chatterList.querySelector(`.inbox-user[title='${chatter.unm}']`)
                                        :chatterList.querySelector(`.inbox-user[id='${chatter.GID}']`);
                        
                        if(inboxUser){
                                let lastChatDiv = inboxUser.querySelector('.last-chat');

                            if((chatter.last_msg && lastChatDiv.title != chatter.last_msg) || chatter.last_msg == ''){
                                lastChatDiv.textContent = lastChatDiv.title = chatter.last_msg;
                            }

                            //get new messages and aa if condition ne repair kar
                            if(chatType === 'personal'){
                                let userStatusColor='null';
                                if(chatter.online)
                                    userStatusColor = 'green';
                                else if(chatter.lastOnDay){
                                    if(chatter.lastOnDay === "Today")
                                        userStatusColor = 'orange';
                                    else if(chatter.lastOnDay === "New User")
                                        userStatusColor = 'Blue';
                                    else
                                        userStatusColor = 'red';
                                }

                                inboxUser.style.setProperty('--userStatusColor',userStatusColor);
                                
                                if(getCookie('currOpenedChat') == chatter.unm){
                                    currentChatterStatus.classList.value=`status ${userStatusColor}`;

                                    if(chatter.online)
                                        currentChatterStatus.textContent = "Online";
                                    else 
                                        currentChatterStatus.textContent = chatter.lastOnDay;
                                }
                            }

                            //  when the opposite Chatter is reading msg send by us.
                            if( ((chatType === 'personal' && chatter.online == true) && (getCookie('currOpenedChat') != getCookie('unm'))) 
                                || chatType === 'group' &&  getCookie('currOpenedGID')){                            
                                
                                let msgIDs=[];
                                chat.querySelectorAll(".msgStatusIcon[data-status='send']").forEach(msgStatusSendIcon=>{
                                    msgIDs.push(msgStatusSendIcon.closest(".msgContainer").id);
                                });

                                if(msgIDs.length != 0){
                                    let msgStatusSendIcons=null;
                                    _getMsgStatus(msgIDs)
                                        .then(msgsStatus=>{
                                            msgStatusSendIcons=[];
                                            if(msgsStatus != 0) {
                                                
                                                msgsStatus
                                                    .filter(msgStatus=>msgStatus.status == 'read')
                                                    .map(msgStatus=> {
                                                        let msgStatusIcon = chat.querySelector(`#${msgStatus.msgID} .msgStatus .msgStatusIcon`);
                                                        if(msgStatusIcon)   {
                                                            msgStatusIcon.src=msgStatusIcon.src.replace('send','read');
                                                            msgStatusIcon.setAttribute('data-status','read');   
                                                        }
                                                    });

                                            }
                                        })
                                }
                            }

                            if(chatter.total_new_messages != 0){
                                inboxUser.style.setProperty('--totalNewMsg',`'${chatter.total_new_messages}'`);
                                inboxUser.style.setProperty('--display','block');

                                if((chatType === 'personal' && getCookie('currOpenedChat') == chatter.unm) 
                                    || chatType === 'group' && user && user.id == chatter.GID){

                                        _getNewMsgs()
                                        .then(msgObjs=>{
                                            if( msgObjs ){
                                                msgObjs.forEach(msgObj => addNewMsgInCurrChat(msgObj));
                                                return 1;
                                            }
                                        }).then(res=>{
                                            if(res) this.checkChatListStatus();
                                        })
                                
                                }
                            }else{
                                inboxUser.style.removeProperty('--display');
                                inboxUser.style.removeProperty('--totalNewMsg');
                            }
    
                        }
                    });
                }
            })
            .catch(err=>{
                console.error(err);
                clearInterval(this.intervalID.checkChatListStatus);
                this.intervalID.checkChatListStatus = null;
            });
    }
}


// msg status functions

    const _getMsgStatus = (msgIDs) => {
        try{
            if(!msgIDs) return;
            
            let data={
                req:"getMsgStatus",
                msgIDs,
            };
                        
            return new Promise( (resolve,reject) => {
                postReq(userStatus.statusURL,JSON.stringify(data))
                    .then(res=>{
                        if(res.status == 'success' && !res.responseText.error)
                            resolve(res.responseText);
                        else
                            reject(res.responseText);
                    });
            });
        }catch(err){
            new_Alert(err);
            console.error(err);
        }
    }

    const _placeMsgStatus = (msgStatusImage,msgID)=>{
        return new Promise((resolve,reject)=>{
            _getMsgStatus([msgID])
                .then(res=>{
                    let msgStatus = ((res != 0) ? res[0].status : "uploading");
                    msgStatusImage.src = userStatus.msgStatusURL+msgStatus+".svg";
                    msgStatusImage.setAttribute('data-status',msgStatus);
                    resolve(msgStatus);
                }).catch(err=>{
                    console.error(err);
                });
        })
        
    }
//