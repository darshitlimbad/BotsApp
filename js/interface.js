var default_dp_src = '/img/default_dp.png';
var device;

const tohomepage=()=>window.location.assign('/');

document.addEventListener('DOMContentLoaded' , function () {

    let header= document.createElement("header");
    header.classList.add('loader',"main-loader");
    document.querySelector("body").appendChild(header);
        let img=new Image();
        img.src="../img/loading-screen.png";
        header.appendChild(img);

        setTimeout(() => {
            document.querySelector("body").removeChild(header);
        }, 500);

    //context menu off
        document.oncontextmenu=(e)=>e.preventDefault();

    // keyboard sortcuts (_srtc stands for sortcut)
        document.addEventListener('keydown' , _srtc);
    // 

    // global var
    settings_box =  document.querySelector(".settings-box");
    noti_box = document.querySelector(".noti-box");
    chat = document.querySelector(".chat");
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
        if(edit_icon.classList.contains('newAdminUnmInputBtn'))
            return;
        edit_icon.onclick=()=>profile_edit_box_toggle(edit_icon);
    });

    document.querySelectorAll('.edit_box').forEach( function (box) {
        box.addEventListener('submit' , function (){
            var edit_icon= box.querySelector(".edit-icon");
            profile_edit_box_toggle(edit_icon);
        })
    });

    

    //delete account and logout button events
        const logOutbtn= document.querySelector("button[name='log-out']");
        logOutbtn.onclick=()=>toggle_confirmation_pop_up('log_out');

        const deleteAccount = document.querySelector("button[name='Delete-Account']");
        deleteAccount.onclick=()=>toggle_confirmation_pop_up('DeleteAccount');
    // 

    // blocked list open buttons event
        const blockedListOpenBtn= document.querySelector("button[name='blocked-list-open-btn']");
        blockedListOpenBtn.onclick=()=>toggleBlockedChatterList();
    //
    
    // Upload Emojis open button event
        const emojiUploadBtn= document.querySelector("button[name='emoji-upload-btn']");
        emojiUploadBtn.onclick=()=>openUploadEmojiForm();
    //
    
    // Emojis list open button event
        const emojisListOpenBtn= document.querySelector("button[name='emoji-list-open-btn']");
        emojisListOpenBtn.onclick=()=>showEmojisList();
    //

    //option btns actions
    const optionActionList= {
        'personal':"initiateChatBox('Personal')",
        'group':"initiateChatBox('Group')",
        'admin-panel':"window.location.assign('/_admin.php')",
        'add-new-chat':"toggleAddNewChatter()",
        'noti':"toggle_noti_box()",
        'settings':"toggle_settings_box()",
    };

        document.querySelectorAll(".options").forEach(option=>{
            const optionAction= option.getAttribute('data-action');
            if(optionActionList.hasOwnProperty(optionAction))
                option.onclick=()=>eval(optionActionList[optionAction]);
        });
    //

    // Wallpapers settings Actions
    const wallpaperActionList={
        'change':"changeWP()",
        'set_default':"defaultWP()",
    }

    document.querySelectorAll(".settings-box .settings-container .body[name='chat-body'] a.Wallpaper_Btn").forEach(btn=>{
        var data_type= btn.getAttribute('data-type');
        if(wallpaperActionList.hasOwnProperty(data_type))
            btn.onclick=()=> eval(wallpaperActionList[data_type]);
    })

    //functions to be called
    set_profile_dp();  
    checkForUserWallpaper();
});  

//?clearing localstorage on load localstorage
localStorage.clear();

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

    if(chatType.toLowerCase() === 'personal'){
        document.querySelector('.page-title .createNewGroupBtn')?.setAttribute('data-show','false')
    }else if(chatType.toLowerCase() === 'group'){
        let createNewGroupBtn=document.querySelector('.page-title .createNewGroupBtn');
        createNewGroupBtn?.setAttribute('data-show','true');
        createNewGroupBtn.onclick=()=>createNewGroupForm();
    }

    document.querySelector('.chat-box .inbox .search input').value=null;
    
    // 
    if(option = document.querySelector(".side-bar .top .options.selected"))
        option.classList.remove("selected");
    document.querySelector(`div[title=${chatType}]`)?.classList.add("selected");

    setCookie('chat', chatType);
    _flash_chatList();
    _cht_sk_loading();
    closeChat();
    openChatList();

}

// toggle add new Chatter
function toggleAddNewChatter(){
    if(window.location.pathname != "/")
        window.location.assign('/');
    
    let newChatterForm=document.querySelector("div#add_new_chat_form");
    if(newChatterForm.style.display=="none" || newChatterForm.style.display=="" ) {
        _add_new_chatter_form(); 
        document.querySelector('input#username').focus();
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
function closesettingsbox(event=null) {  
    if(
        !event || ( event && (!settings_box.contains(event.target)) &&
        (settings_box != event.target) && 
        (!event.target.closest("div[title='Settings']"))&&
        (!event.target.closest("div[title='Profile']")) &&
        (!event.target.closest("div[id='confirmation_pop_up']")) &&
        (!event.target.closest("div[id='upload_img_form']")))
    ) {
        
        if(event)
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
        // _hide_all_pop_up();
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
                if(chatOpened)
                    toggleSearchTxt();
                else
                    document.querySelector('.chat-box .inbox .search input')?.focus();
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

        if(e.target.closest("input[name='searchTxtInput']"))
            return;
        // Message Input box shortcut
        let msgInput=document.querySelector('.msgInput');
        if(msgInput && e.keyCode == 191 && document.activeElement != msgInput)   {e.preventDefault();msgInput.focus();}

    };

    function setLoader(loc){
        loc.querySelector(".loader")?.remove();
        
        let loaderDiv = document.createElement('div');
        loaderDiv.classList.add('loader','blank-layer-chat');
        loc.appendChild(loaderDiv);
            let loaderImg = new Image();
            loaderImg.src="/img/icons/loader.svg";
            loaderImg.classList.add('loader-img');
            loaderDiv.appendChild(loaderImg);
            let loaderText =  document.createElement('b');
            loaderText.classList.add('loader-text');
            loaderText.textContent = "Loading...";
            loaderDiv.appendChild(loaderText);
    };
// 



