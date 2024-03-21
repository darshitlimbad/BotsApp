// Navigation start
function tohomepage()   {
    window.location.assign('/');
}

function togroupchat()  {
    window.location.assign('/group_chat.php');
}

document.addEventListener('DOMContentLoaded' , function () {

    // global var
    settings_box =  document.querySelector(".settings-box");
    noti_box = document.querySelector(".noti-box");
    notification = document.querySelector('#notification');
    Alert = document.querySelector('#alert');
    // 


    // title of the list page
    if(document.querySelector('#cname')){
        var cname = document.title.substring(0 , document.title.search('--')-1 );
        document.querySelector('#cname').innerHTML = cname;
    }

    // skeleton animation stop 
    const ani_ele = document.querySelectorAll('.list img , .list h5 , .list .last-chat');
            // animation elements
    ani_ele.forEach(function (element) {
        element.classList.remove('skeleton');
        element.classList.remove('skeleton-text');
    });

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
});

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

//notification
function new_notification(str) {
    setTimeout(() => {
        _add_notification_show(str);
        document.addEventListener('click' , _onclick_notification_hide);
    }, 100);
}

function _onclick_notification_hide(event)   {
    if((!notification.contains(event.target)) && (notification != event.target) ) {
        document.removeEventListener('click' , _onclick_notification_hide);
        _remove_notification_show();
    }
}

// show is class which shows a notifiacation
function _add_notification_show(str){
    notification.textContent = str;
    notification.classList.add('show');
}

function _remove_notification_show(){
    notification.classList.remove('show');
    setTimeout(() => {
        notification.textContent = "";
    }, 70);
}

// 

//Alert
function new_Alert(str , time = null) {
    setTimeout(() => {

        _add_Alert_show(str);
        document.addEventListener('click' , _onclick_Alert_hide);
        
    } , 100);

    if(time != null) {
        setTimeout(() => {
            _remove_Alert_show();
        } , time * 1000)
    }
}

function _onclick_Alert_hide(event)   {
    if((!Alert.contains(event.target)) && (Alert != event.target) ) {
        _remove_Alert_show();
    }
}

function _add_Alert_show(str){
    Alert.textContent = str;
    Alert.classList.add('show');
}

function _remove_Alert_show(){
    document.removeEventListener('click' , _onclick_Alert_hide);
    Alert.classList.remove('show');
    setTimeout(() => {
        Alert.textContent = "";
    }, 70); 
}

const set_profile_dp = (() => {
    dp = document.querySelectorAll(".options .avatar , .profile-dp .avatar");    
    getUserID()
        .then((userID)=>{
            get_dp(userID)
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


//

// dispose space

// document.querySelector("div[title='Settings']").addEventListener( 'click' , function () {
        
    // })
    // inbox-user chat select
    // const inbox-user = document.querySelectorAll(".inbox-user");
    // for (var i = 0; i < inbox-user.length; i++) {
    //     inbox-user[i].addEventListener('click', function () {
    //         this.classList.add('select');
    //     });
        
    // }

// function select_options(div)    {
//     const img = div.querySelector("img");
        
//         if(div.classList.contains("selected")) {
//             div.classList.remove("selected");
//         }   
//         else    {
//             div.classList.add("selected");
//         }
//         // console.log(div);
// }
