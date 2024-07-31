
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
    msgStatusPath = "/img/icons/chat/msg_status/";

    #requestTime = 2000;
    intervalID={};

    isOnline = false;
    adminOnlineStatusIcon = document.querySelector('header .status');

    constructor(){
        this.setOnlineStatusUpdateInterval();
    }

    setOnlineStatusUpdateInterval=()=>{
        this.onlineStatusUpdate();
        this.intervalID.onlineStatusUpdate = setInterval(()=>{this.onlineStatusUpdate()},this.#requestTime);
        
        window.onoffline= ()=> {window.ononline= ()=>{
            this.setOnlineStatusUpdateInterval();
            if(getCookie('chat'))
                this.checkStatus();
            }
        }
    }
    
    async onlineStatusUpdate(){
        getNewNoti();
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

    checkStatus(){
        let chatType= getCookie('chat').toLowerCase();
        if(!this.intervalID.checkStatus)
            this.intervalID.checkStatus = setInterval(()=>{this.checkStatus()},this.#requestTime);

        let data={
            req:"checkStatus",
        }
    
        postReq(this.statusURL,JSON.stringify(data))
            .then(res=>{
                if(res.status == 'success' && res.responseText != 0){
                    res.responseText.forEach(chatter => {
                        
                        let inboxUser = (chatType === 'personal') ? 
                                        chatterList.querySelector(`.inbox-user[title='${chatter.unm}']`)
                                        :chatterList.querySelector(`.inbox-user[id='${chatter.GID}']`);
                        
                        if(inboxUser){
                                
                            if(chatter.lastMsgData){
                                let lastChatDiv = inboxUser.querySelector('.last-chat');
                                let lastMsgData= JSON.parse(chatter.lastMsgData);
                                let chatLastMsgTime= inboxUser.getAttribute("data-lastMsgTime");
                                
                                if(chatLastMsgTime != lastMsgData.time){
                                    lastChatDiv.textContent = lastChatDiv.title = lastMsgData.msg;
                                    inboxUser.setAttribute("data-lastMsgTime", lastMsgData.time);
                                    sortChatByTime();
                                }
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
                            if(((chatType === 'personal') && getCookie('currOpenedChat') 
                                && getCookie('currOpenedChat') == chatter.unm 
                                && (getCookie('currOpenedChat') != getCookie('unm'))) 
                                    && ((chatter.online == true) 
                                        || (chatter.can_not_see_online_status) )
                                    || (chatType === 'group' &&  getCookie('currOpenedGID')) ){

                                let msgIDs=[];
                                chat.querySelectorAll(".msgStatusIcon[data-status='send']").forEach(msgStatusSendIcon=>{
                                    msgIDs.push(msgStatusSendIcon.closest(".msgContainer").getAttribute('data-msgID'));
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
                                                        let msgStatusIcon = chat.querySelector(`.msgContainer[data-msgID='${msgStatus.msgID}'] .msgStatus .msgStatusIcon`);
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

                                if((chatType === 'personal' && getCookie('currOpenedChat') == chatter.unm && chatter.unm != getCookie('unm')) 
                                    || chatType === 'group' && user && user.id == chatter.GID){
                                        _getNewMsgs()
                                        .then(msgObjs=>{
                                            if( msgObjs ){
                                                msgObjs.forEach(msgObj => addNewMsgInCurrChat(msgObj));
                                                return 1;
                                            }
                                        }).then(res=>{
                                            if(res) this.checkStatus();
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
                clearInterval(this.intervalID.checkStatus);
                this.intervalID.checkStatus = null;
            });
    }
}


// msg status functions

    const _getMsgStatus = (msgIDs=[]) => {
        try{
            if(!msgIDs.length) return;
            
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
                            throw res.responseText;
                    });
            });
        }catch(err){
            // new_Alert(err);
            customError(err);
        }
    }

    const _placeMsgStatus = (msgStatusImage,msgID)=>{
        return new Promise(async (resolve,reject)=>{
                if( msgID ){
                    var res= await _getMsgStatus([msgID]);
                    var msgStatus = ((res != 0) ? res[0].status : "uploading");
                }else{
                    var msgStatus = "uploading";
                }
                msgStatusImage.src = userStatus.msgStatusPath+msgStatus+".svg";
                msgStatusImage.setAttribute('data-status',msgStatus);
                resolve(msgStatus);
        })
    }

    const _getMsgSeenData=(msgID=null)=>{
        if(!msgID)
            return;

        let data={
            req:"getMsgSeenData",
            msgID,
        };

        return new Promise( (resolve,reject) => {
            postReq(userStatus.statusURL,JSON.stringify(data))
                .then(res=>{
                    if(res.status == 'success' && !res.responseText.error)
                        resolve(res.responseText);
                    else
                        throw res.responseText;
                }).catch(err=>{
                    customError(err);
                })
        });
    }
//