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
               //console.log(corrosponding_body);
            }
        })
    });

    //profile edit toggle
    document.querySelectorAll('.edit-icon').forEach( function (edit_icon) {
        edit_icon.addEventListener('click' , function (){
            profile_edit_box_toggle(edit_icon);
        })
    });
    document.querySelectorAll('.flex').forEach( function (form) {
        form.addEventListener('submit' , function (){
            var edit_icon= form.querySelector(".edit-icon");
            profile_edit_box_toggle(edit_icon);
        })
    });


});

// toggle settings-box
function toggle_settings_box()   {
    if (!settings_box.classList.contains('settings-box_show')) {

        settings_box.classList.add('settings-box_show');
        settings_box.classList.remove('settings-box_hide');

        var li = (!event.target.closest("div[title='Profile']")) ?document.querySelector(".settings-box ul li[name='general']") :  document.querySelector(".settings-box ul li[name='profile']");

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

//remove selected from li
function remove_selected_li(){
    document.querySelectorAll(".settings-box ul li").forEach( function (row) {
        if(row.classList.contains('selected'))  {
            row.classList.remove('selected');
        }
    })
} 

function closesettingsbox(event) {    

    if((!settings_box.contains(event.target)) &&
        (settings_box != event.target) && 
        (!event.target.closest("div[title='Settings']"))&&
        (!event.target.closest("div[title='Profile']")) ) {
        toggle_settings_box();
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
    var form =  edit_icon.closest(".flex");
            if(form)    {
                var text_box = form.querySelector(".text");
                var icon = form.querySelector(".edit-icon");

                text_box.classList.toggle("edit");
                text_box.toggleAttribute('disabled');

                if(!text_box.classList.contains("edit")) {
                    form.submit();
                    icon.setAttribute("src" ,"img/icons/settings/profile/edit.png");
                }  else {
                    icon.setAttribute("src" ,"img/icons/settings/profile/right.png");
                }
            }
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
        _remove_notification_show();

        document.removeEventListener('click' , _onclick_notification_hide);
    }
}

// show is class which shows a notifiacation
function _add_notification_show(str){
    notification.innerHTML = str;
    notification.classList.add('show');
}

function _remove_notification_show(){
    notification.classList.remove('show');
    setTimeout(() => {
        notification.innerHTML = "";
    }, 70);
}

// 

//Alert
function new_Alert(str) {
    setTimeout(() => {

        _add_Alert_show(str);
        document.addEventListener('click' , _onclick_Alert_hide);
        
    } , 100);
}

function _onclick_Alert_hide(event)   {

    if((!Alert.contains(event.target)) && (Alert != event.target) ) {
        _remove_Alert_show();

        document.removeEventListener('click' , _onclick_Alert_hide);
    }
}

function _add_Alert_show(str){
    Alert.innerHTML = str;
    Alert.classList.add('show');
}

function _remove_Alert_show(){
    Alert.classList.remove('show');
    setTimeout(() => {
        Alert.innerHTML = "";
    }, 70); 
}


// default img loader functions
const defaultDp = (tag) => {
    tag.src='img/default_dp.png';
};

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
