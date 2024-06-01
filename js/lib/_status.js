
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
    
    onlineStatusUpdate(){
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

    checkChatListStatus(){
        let chatType= getCookie('chat');
        if(!this.intervalID.checkChatListStatus)
            this.intervalID.checkChatListStatus = setInterval(()=>this.checkChatListStatus(),this.#requestTime);

        let data={
            req:"checkChatListStatus",
        }

        postReq(this.statusURL,JSON.stringify(data))
            .then(res=>{
                console.log(res.responseText);
                if(res.status == 'success' && res.responseText != 0){
                    res.responseText.forEach(chatter => {
                        
                        let inboxUser = (chatType == 'Personal') ? 
                                        chatterList.querySelector(`.inbox-user[title='${chatter.unm}']`)
                                        :chatterList.querySelector(`.inbox-user[id='${chatter.GID}']`);
                        
                        if(inboxUser){
                                let lastChatDiv = inboxUser.querySelector('.last-chat');
                            if(chatter.last_msg && lastChatDiv && lastChatDiv.title != chatter.last_msg){
                                lastChatDiv.textContent = chatter.last_msg;
                                lastChatDiv.title =  chatter.last_msg;
                            }

                            if(chatType == 'Personal'){
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
                                //  when the opposite Chatter is reading msg send by us.
                                if((chatter.online == true)&& (getCookie('currOpenedChat') != getCookie('unm'))){
                                    let msgStatusSendIcons = chat.querySelectorAll(".msgStatusIcon[data-status='send']");
                                
                                    if(msgStatusSendIcons[0] != null){
                                        let msgIDs=[];

                                        msgStatusSendIcons.forEach(msgStatusSendIcon=>{
                                            msgIDs.push(msgStatusSendIcon.closest(".msgContainer").id);
                                        });
                                        msgStatusSendIcons=null;
    
                                        _getMsgStatus(msgIDs)
                                            .then(msgsStatus=>{
                                                msgStatusSendIcons=[];
                                                if(msgsStatus != 0) {
                                                    msgsStatus
                                                        .filter(msgStatus=>msgStatus.status == 'read')
                                                        .map(msgStatus=> {
                                                            let msgStatusIcon = chat.querySelector('#'+msgStatus.msgID+" .msgStatus .msgStatusIcon");
                                                            if(msgStatusIcon)   {
                                                                msgStatusIcon.src=msgStatusIcon.src.replace('send','read');
                                                                msgStatusIcon.setAttribute('data-status','read');   
                                                            }
                                                        });
                                                }
                                            })
                                    }
                                }
                            }

                            if(chatter.total_new_messages != 0){
                                inboxUser.style.setProperty('--display','block');
                                inboxUser.style.setProperty('--totalNewMsg',"'"+chatter.total_new_messages+"'");

                                if(getCookie('currOpenedChat') == chatter.unm){
                                    _getNewMsgs()
                                        .then(msgObjs=>{
                                            if( msgObjs )
                                                msgObjs.forEach(msgObj => addNewMsgInCurrChat(msgObj));
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

            if(getCookie('chat') === 'Group')
                if(!user)
                    throw new Error("Message status could not be loaded");
                else
                    data.toGID = user.id;
            
            return new Promise( (resolve,reject) => {
                postReq(userStatus.statusURL,JSON.stringify(data))
                    .then(res=>{
                        if(res.status == 'success' && !res.responseText.code)
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

        /*
            status values can be = 0, 1, 2
            0:uploading
            1:send
            2:read
        */
        function updateMsgStatus(msgID,status){
            if(typeof status != 'number' || msgID == null)
                return;

            let data={
                req: 'updateMsgStatus',
                msgID,
                status,
            }

            return new Promise((resolve,reject)=>{
                postReq(userStatus.statusURL, JSON.stringify(data))
                    .then(res=>{
                        console.log(res.responseText);
                        if(res.status == 'success' && res.responseText == 1)
                            resolve(res.responseText);
                        else{
                            console.warn(res);
                            reject();
                        }
                    })
                    .catch(err=>{
                        console.warn(err);
                        reject(err);
                    })
            });
        }
//