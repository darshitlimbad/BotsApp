// global var
document.addEventListener('DOMContentLoaded' , () => {
    notification = document.querySelector('#notification');
    Alert = document.querySelector('#alert');
});

//notification
function new_notification(msg=null) {
    if(!msg)
        return
    setTimeout(() => {
        _add_notification_show(msg);
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
function _add_notification_show(msg){
    notification.innerHTML = msg;
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
function new_Alert(msg=null , time = null) {
    if(!msg)
        return

    setTimeout(() => {
        _add_Alert_show(msg);
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

function _add_Alert_show(msg){
    Alert.innerHTML = msg;
    Alert.classList.add('show');
}

function _remove_Alert_show(){
    document.removeEventListener('click' , _onclick_Alert_hide);
    Alert.classList.remove('show');
    setTimeout(() => {
        Alert.innerHTML = "";
    }, 70); 
}