document.addEventListener('DOMContentLoaded' , function () {
        var url = decodeURI(window.location.href)
        var URL_params = new URLSearchParams(url.substring(url.indexOf('?')));
        
            
            setTimeout(() => {
                // ERROR
                if( URL_params.get('ERROR') == '400') {
                    handler.err_400();
                }
                if(URL_params.get('ACTION') == 'sign-in')    {
                    buttons[1].click();
                }
                if( (URL_params.get('ERROR') == '404') && (URL_params.get('USER')) ) {
                    new_Alert( "404 : Password is wrong!");
                }else if(URL_params.get('ERROR') == '404') {
                    new_Alert( URL_params.get('ERROR') + " : User not Found!");
                }
                if(URL_params.get('ERROR') == '409') {
                    new_Alert( URL_params.get('ERROR') + " : Username conflicts , Please contect Admin or manager");
                }
                if(URL_params.get('ERROR') == '405') {
                    handler.err_405();
                }
                if(URL_params.get('ERROR') == '1146')    {
                    new_Alert( URL_params.get('ERROR') + " : DATABASE error , Please contect Admin or manager");
                }

                // user 
                if(URL_params.get('USER')){
                    user.value = URL_params.get('USER');
                }

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

const customError = (msg, code , alert=true) => {
    try{
        if(msg && code){
            if(alert)
                new_Alert(`[ ${code} ] : ${msg}`);
            
            console.warn(`[ ${code} ] : ${msg}`);
        }else
            handler['err_'+code]();
    }catch(e){
        handler['err_400']();
    }
};

const handler={};

handler.err_400 = () => {
    new_Alert( " Something went Wrong :( , Please try again");
}
handler.err_401 = () => {
    new_Alert( " NO NETWORK, PLEASE TRY AGAIN ");
}
handler.err_405 = () => {
    new_Alert( "Name can't be Empty");
}
handler.err_415 = () => {
    new_Alert(" This Media type is not Allowed. ");
}
handler.err_413 = () => {
    new_Alert(" File Size is larger then allowed. ");
}
handler.err_500 = ()=>{
    new_Alert(" Internal Server Error ")
}

