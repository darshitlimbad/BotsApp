var default_dp_src = '/img/default_dp.png';
var device;

const tohomepage=()=>window.location.assign('/');
document.addEventListener('DOMContentLoaded' , function () {
    //context menu off
        document.oncontextmenu=(e)=>e.preventDefault();

    // keyboard sortcuts (_srtc stands for sortcut)
        document.addEventListener('keydown' , _srtc);
    // 

    // global var
    settings_box =  document.querySelector(".settings-box");
    noti_box = document.querySelector(".noti-box");
    // 

    //settings-box setting option toggle
    const li = document.querySelectorAll(".settings-box ul li");
    li.forEach( function (listitem) {
        listitem.addEventListener('click' , function (){
            if(!(listitem.classList.contains('selected')))    {
                remove_selected_li();
                listitem.classList.add('selected');
                show_setting_body(listitem);
            }
        })
    });

    //profile edit toggle
    document.querySelectorAll('.edit-icon').forEach( function (edit_icon) {
        edit_icon.addEventListener('click' , function (){
            profile_edit_box_toggle(edit_icon);
        })
    });

    document.querySelectorAll('.edit_box').forEach( function (box) {
        box.addEventListener('submit' , function (){
            var edit_icon= box.querySelector(".edit-icon");
            profile_edit_box_toggle(edit_icon);
        })
    });

    // responsive for mobile changes
    if(window.innerWidth < 600){
        document.querySelector('body.main').classList.add('mobile');
        device='mobile';
    }

    //delete account and logout button events
        const logOutbtn= document.querySelector("button[name='log-out']");
        logOutbtn.onclick=()=>toggle_confirmation_pop_up('log_out');

        const deleteAccount = document.querySelector("button[name='Delete-Account']");
        deleteAccount.onclick=()=>toggle_confirmation_pop_up('DeleteAccount');
    // 

    //functions to be called
    set_profile_dp();
    getNewNoti();   
});  

// 
const initiateChatBox = (chatType) => {
    if(window.location.pathname != '/'){
        setCookie("chat", chatType);
        window.location.assign('/');
    }

    // Title Names
    let heading =  document.querySelector('#cname');
    heading.textContent = chatType + " Chat";
    document.title = heading.textContent + " -- Botsapp"; 
    // 
    if(option = document.querySelector(".side-bar .top .options.selected"))
        option.classList.remove("selected");
    document.querySelector(`div[title=${chatType}]`).classList.add("selected");

    setCookie('chat', chatType);
    _flash_chatList();
    _cht_sk_loading();
    closeChat();
    openChatList();
}

// toggle add new Chatter
function toggleAddNewChatter(){
    let newChatterForm=document.querySelector("div#add_new_chat_form");
    if(newChatterForm.style.display=="none" || newChatterForm.style.display=="" ) {
        _add_new_chatter_form(); 
        document.querySelector('input#username').focus();

        // document.addEventListener('keypress',(e)=>{
        //     // if(e.keyCode )
        //     console.log(e.key);
        // });
    }else{
        _hide_this_pop_up(newChatterForm);
    }
}

// toggle settings-box
function toggle_settings_box()   {
    if (!settings_box.classList.contains('settings-box_show')) {

        settings_box.classList.replace('settings-box_hide','settings-box_show');

        var li = (!event.target.closest("div[title='Profile']")) ?
                    document.querySelector(".settings-box ul li[name='general']") :
                    document.querySelector(".settings-box ul li[name='profile']") ;

        li.classList.add('selected');
        show_setting_body(li);
        document.addEventListener('click' , closesettingsbox);

    } else {

        settings_box.classList.add('settings-box_hide');
        settings_box.classList.remove('settings-box_show');
        remove_selected_li();
        document.removeEventListener('click' , closesettingsbox);

    }
}

// toggle_confirmation_pop_up
function toggle_confirmation_pop_up(pop_up_name , title=null){
    let confirmation_pop_up=document.querySelector('div#confirmation_pop_up');

    if(confirmation_pop_up.style.display != 'block'){
        if(pop_up_name == "log_out")  _confirmation_pop_up('Log out', 'Are you sure.. You want to Log out?' , 'LogOut' , 'red');
        else if(pop_up_name == "DeleteAccount") _confirmation_pop_up('Delete Account', 'Are you sure ,You want to delete your account?' , 'DeleteAccount' , 'red');
        else if(pop_up_name == "add_new_chatter") _confirmation_pop_up( title , 'Are you sure , You want to send Chatter request to this User?' , 'addUserReqConfirm' );
    }
}

// 
function toggle_img_upload_form(pop_up_name){
    let upload_img_form=document.querySelector('div#upload_img_form');
    if(upload_img_form.style.display != "block"){
        switch(pop_up_name){
            case "upload_new_dp":
                _upload_img_form('Upload Your new Profile picture' , `USER_DP_UPDATE`);
                break;
            case "send_img":

            break;
        }
    }
}

// toggle notification-box
function toggle_noti_box()   {
    if (!noti_box.classList.contains('noti-box_show')) {

        noti_box.classList.add('noti-box_show');
        noti_box.classList.remove('noti-box_hide');

        document.addEventListener('click' , closeNotiBox);

    } else {

        noti_box.classList.add('noti-box_hide');
        noti_box.classList.remove('noti-box_show');
        document.removeEventListener('click' , closeNotiBox);

    }
}

//remove selected from li
function remove_selected_li(){
    document.querySelectorAll(".settings-box ul li").forEach( function (row) {
        if(row.classList.contains('selected'))  {
            row.classList.remove('selected');
        }
    })
} 

// add Pop_up for show and hide
function closesettingsbox(event) {  
    if((!settings_box.contains(event.target)) &&
        (settings_box != event.target) && 
        (!event.target.closest("div[title='Settings']"))&&
        (!event.target.closest("div[title='Profile']")) &&
        (!event.target.closest("div[id='confirmation_pop_up']")) &&
        (!event.target.closest("div[id='upload_img_form']"))  ) {
        
        event.preventDefault();
        toggle_settings_box();
        // all settings options to noramal
        settings_options_to_default();
    }
}

function closeNotiBox(event) { 

    if((!noti_box.contains(event.target)) &&
        (noti_box != event.target) && 
        (!event.target.closest("div[title='Noti']"))&&
        (!event.target.closest("div[title='noti-box']")) ) {
            toggle_noti_box();
    }
}

//show related settings body
function show_setting_body(listitem)  {
    const body=document.querySelectorAll('.body');

    body.forEach( function (div){
        div.style.display = "none";
    });

    const bodyname = listitem.getAttribute("name") + "-body";
    const corrosponding_body = document.querySelector(".settings-box .settings-container .body[name="+bodyname+"]");

    corrosponding_body.style.display = "block";
};

//toggle edit box of profile 
function profile_edit_box_toggle(edit_icon) {
    var edit_box =  edit_icon.closest(".edit_box");
        if(edit_box)    {
            var text_box = edit_box.querySelector(".text");
            var icon = edit_box.querySelector(".edit-icon");
            var setIcon = "right";

            text_box.classList.toggle("edit");
            text_box.toggleAttribute('readonly');

            if(!text_box.classList.contains("edit")) {
                _edit_user_data( text_box );
                setIcon= "edit";
            }
            icon.setAttribute("src" ,`img/icons/settings/profile/${setIcon}.png`);
        }
}

// all settings options to noramal
const settings_options_to_default = () => {
    // profile settings
        boxes = document.querySelectorAll("div[name='profile-body'] > .edit_box");
        
        for(var i = 0 ; i<boxes.length ; i++){
            boxes[i].querySelector('.text').classList.remove("edit");
            boxes[i].querySelector('.text').setAttribute('readonly' , true);
            boxes[i].querySelector('.edit-icon').setAttribute("src" ,"img/icons/settings/profile/edit.png"); 
        }

    // pop_up
        _hide_all_pop_up();
}

const set_profile_dp = (() => {
    dp = document.querySelectorAll(".options .avatar , .profile-dp .avatar");    
        get_dp(getCookie('unm'))
            .then( res  => {
                dp.forEach( (ele) => {
                    ele.src = res;
                })
            })
            .catch( (e) => {
                console.error(e);
            });

    
});


// default img loader functions
const defaultDp = (tag) => {
    tag.src= default_dp_src;
};

// submit user data on enter press
const _submit_data = (event) => {
    if(event.key === 'Enter' && !event.shiftKey ) event.target.parentElement.querySelector('.edit-icon').click();
}

// cookies store
const setCookie = (name , value , exDays = null , path = "/" ) => {
    if(exDays != null ) {
        var d=new Date();
        d.setTime(d.getTime() + ( exDays*24*60*60*1000 ) );
        var expires =  "expires=" + d.toUTCString() ;
    }

    document.cookie = `${name} = ${encodeURIComponent(value)} ${ (exDays != null) ? ";"+ expires : ";" } Path = ${path}`;
}

const getCookie = (name) => {
    name+='=';
    var cookies = decodeURI(document.cookie).split(";");
    var cookie_val = 0;
    
    if(name == "PHPSESSID="){
        return cookie_val;
    }

    cookies.forEach( cookie => {
        cookie=cookie.trim();
        if(cookie.indexOf(name) == 0){
            cookie_val = cookie.substring(name.length);
        }
    })
    
    if(cookie_val!=0)
        return decodeURIComponent(cookie_val);
}
// 


// SORTCUT FUNCTIONS

    const _srtc = (e) => {
        let searchTxt = document.querySelector("div#searchTxt");

        if(e.ctrlKey){
            // msg search box toggle
            if(e.keyCode == 70){
                e.preventDefault();
                toggleSearchTxt();
            };
        }
        if(e.altKey){
            if(e.keyCode == 70){
                e.preventDefault();
            }
        }

        // btns to up down dictionary
        if((searchTxt) && (searchTxt.style.display != "none")){
            if(e.keyCode == "38"){
                moveSearch("up");
            }else if(e.keyCode == "40"){
                moveSearch("down");
            }
        }

        // Message Input box shortcut
        let msgInput=document.querySelector('.msgInput');
        if(msgInput && e.keyCode == 191 && document.activeElement!=msgInput)   {e.preventDefault();msgInput.focus();}

    };

// 

function showInbox(){
    const inbox=document.querySelector('.chat-box .inbox');

    chat.style.display='none';
    inbox.style.display='block';
}

function hideInbox(){
    const inbox=document.querySelector('.chat-box .inbox');

    chat.style.display='flex';
    inbox.style.display='none';
}