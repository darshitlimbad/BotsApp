document.addEventListener('DOMContentLoaded' , function () {

    // set cookies 
        // chat
        if( !getCookie("chat")){
            setCookie("chat", "Personal");
        }
    // 

    // global var
    currCht= getCookie("chat");
    settings_box =  document.querySelector(".settings-box");
    noti_box = document.querySelector(".noti-box");
    list = document.querySelector('tbody.listBody');
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

    //functions to be called
    set_profile_dp();
    getNewNoti();    
    _cht_sk_loading();
    chat(currCht);

});    

const chat = (chatType) => {
    
    // Title Names
    document.querySelector('#cname').innerHTML = chatType + " Chat";
    document.title = chatType + " -- Botsapp"; 
    // 
    document.querySelectorAll(".side-bar .top .options").forEach( (ele) => {
        ele.classList.remove("selected");
    });
    document.querySelector(`div[title=${chatType}]`).classList.add("selected");

    setCookie('chat', chatType);
    _flash_chatList();
    _cht_sk_loading();
    openChatList(chatType);
}

// toggle settings-box
function toggle_settings_box()   {
    if (!settings_box.classList.contains('settings-box_show')) {

        settings_box.classList.add('settings-box_show');
        settings_box.classList.remove('settings-box_hide');

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
    var edit_box =  edit_icon.closest(".flex");
            if(edit_box)    {
                var text_box = edit_box.querySelector(".text");
                var icon = edit_box.querySelector(".edit-icon");

                text_box.classList.toggle("edit");
                text_box.toggleAttribute('readonly');

                if(!text_box.classList.contains("edit")) {
                    _edit_user_data( text_box );
                    icon.setAttribute("src" ,"img/icons/settings/profile/edit.png");
                }  else {
                    icon.setAttribute("src" ,"img/icons/settings/profile/right.png");
                }
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
    getUserID()
        .then((res)=>{
            get_dp(res)
                .then( res  => {
                    dp.forEach( (ele) => {
                        ele.src = res;
                    })
                })
        });

    
});


// default img loader functions
const defaultDp = (tag) => {
    tag.src='/img/default_dp.png';
};

// submit user data on enter press
const _submit_data = (event) => {
    (event.key === 'Enter') ? event.target.parentElement.querySelector('.edit-icon').click() : '' ;
}

// cookies store
const setCookie = (name , value , exDays = null , path = "/" ) => {
    if(exDays != null ) {
        var d=new Date();
        d.setTime(d.getTime() + ( exDays*24*60*60*1000 ) );
        var expires =  "expires=" + d.toUTCString() ;
    }

    document.cookie = `${name} = ${value} ${ (exDays != null) ? ";"+ expires : ";" } Path = ${path}`;
}

const getCookie = (name) => {
    var cookies = decodeURI(document.cookie).split(";");
    name = name+"=";
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

    return cookie_val;
}
// 

//

// dispose space

    // document.querySelector("div[title='Settings']").addEventListener( 'click' , function () {
    // })

// // user hover on chat animation  
// garbage for now
// document.querySelectorAll('.list .inbox-user').forEach( (ele) => {
//     ele.addEventListener('mousemove' , (event) => {
//             const rect = ele.getBoundingClientRect();
//             const relativeX = event.clientX - rect.x - 12;
//             const relativeY = event.clientY - rect.y - 30;
            
//             ele.classList.add("inbox-user_hover");
//             ele.style.setProperty("--inbox-user-x" , `${relativeX}px`);
//             ele.style.setProperty("--inbox-user-y" , `${relativeY}px`);         
//     }); }); 
