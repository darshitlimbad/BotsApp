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

// add Pop_up for show and hide
function closesettingsbox(event) {    
    if((!settings_box.contains(event.target)) &&
        (settings_box != event.target) && 
        (!event.target.closest("div[title='Settings']"))&&
        (!event.target.closest("div[title='Profile']")) &&
        (!event.target.closest("div[id='confirmation_pop_up']")) &&
        (!event.target.closest("div[id='upload_img_form']")) ) {
        
        toggle_settings_box();
        // all settings options to noramal
        settings_options_to_default();
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
        _hide_this_pop_up(confirmation_pop_up);
        _hide_this_pop_up(upload_img_form);
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
    Alert.textContent = str;
    Alert.classList.add('show');
}

function _remove_Alert_show(){
    Alert.classList.remove('show');
    setTimeout(() => {
        Alert.textContent = "";
    }, 70); 
}

// edit data by user
const _edit_user_data = (ele) => {

    var edit_table = (ele.name == 'user-name') ? "users" : "users_details" ;
    var field=ele.name;
    var value=ele.value;    
    
    if(value == "")
        window.location.assign(window.location.origin+window.location.pathname.concat('?ERROR=405'));
    
    data = JSON.stringify(
        {
        table: edit_table,
        edit_column: field,
        data : value ,
        });

    var url = window.location.origin+"/functionality/_user_edit.php".concat("?key_pass=khulJaSimSim");

    postReq(url , data) 
        .then(response => {
            if (response == 1 ){
                new_notification('data changed succesfully');
            }else{
                window.location.assign(window.location.origin+window.location.pathname.concat('?ERROR=400'));
            }
        })
        .catch(err => {
            console.error(err);
        });   
};

// togle user theme
const _togle_user_data = (ele) => {

    var field=ele.name;
    var value=(ele.checked) ? '1' : '0';    
    data = JSON.stringify(
        {
        table: 'users_details',
        edit_column: field,
        data : value 
        });

    var url = window.location.origin+"/functionality/_user_edit.php".concat("?key_pass=khulJaSimSim");

    postReq(url , data) 
        .then(response => {
            if (response == 1 ){
                new_notification('data changed succesfully');
            }else {
                ele.checked = (value == 1) ?  false : true;
                new_Alert('Something Went Wrong , Please Try Again');
            }
            })
        .catch(err => {
        console.error(err);
        });   
};

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
