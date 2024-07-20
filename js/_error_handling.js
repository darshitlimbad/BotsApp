document.addEventListener('DOMContentLoaded' , function () {
        var url = decodeURI(window.location.href)
        var URL_params = new URLSearchParams(url.substring(url.indexOf('?')));
        
            setTimeout(() => {
                if(URL_params.get('ACTION') == 'sign-in')    {
                    buttons[1].click();
                }
                if( (URL_params.get('ERROR') && URL_params.get('msg')) && handler['err_'+URL_params.get('ERROR')] ){
                        new_Alert(URL_params.get('msg'));
                }else if( (URL_params.get('ERROR') == '404') && (URL_params.get('USER')) ) {
                    new_Alert( "Password is wrong!");
                }else if(URL_params.get('ERROR') == '404') {
                    new_Alert(" User not Found!");
                }else if(URL_params.get('ERROR') == '409') {
                    new_Alert(" Username conflicts , Please contect Admin or manager");
                }else if(URL_params.get('ERROR') == '1146')    {
                    new_Alert(" DATABASE error , Please contect Admin or manager");
                }else if(handler['err_'+URL_params.get('ERROR')])
                    handler['err_'+URL_params.get('ERROR')]();

                // succes status messages
                if(URL_params.get('SUCCESS') == '201')    {
                    new_notification("'" + URL_params.get('USER') + "' User Created Successfully.");
                }
                if(URL_params.get('SUCCESS') == '202')    {
                    new_notification(" You have Successfully Logged Out.");
                }
                if(URL_params.get('SUCCESS') == '203')    {
                    new_notification(" Your Accout has Successfully Deleted.");
                }

            },10);
});

const customError = (err) => {
    console.error(err);
    if(err.code && handler['err_'+err.code])
        handler['err_'+err.code]();
    else
        handler.err_400();
};


const handler={};

//Alerts
handler.err_400 = () => {
    new_Alert( " Something went Wrong :( , Please try again");
}
handler.err_401 = () => {
    new_Alert( " NO NETWORK, PLEASE TRY AGAIN LATER");
}
handler.err_405 = () => {
    new_Alert( "Name can't be Empty");
}
handler.err_409 = () => {
    new_Alert( " Invalid Scope!!! ");
}
handler.err_410 = () => {
    new_Alert( " Unauthorised Access Denied !!! ");
}
handler.err_411 = ()=>{
    new_Alert(" No Data Found !! ")
}
handler.err_412 = ()=>{
    new_Alert(" Data Already Exists !! ")
}
handler.err_413 = () => {
    new_Alert(" File Size is larger then allowed. ");
}
handler.err_414 = ()=>{
    new_Alert(" Username is Invalid! ")
}
handler.err_415 = () => {
    new_Alert(" This Media type is not Allowed. ");
}
handler.err_500 = ()=>{
    new_Alert(" Internal Server Error ")
}

//Notifications
handler.suc_dataChanged =()=>{
    new_notification('data changed succesfully');
}

