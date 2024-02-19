document.addEventListener('DOMContentLoaded' , function () {
    // globle variable
    input_field = document.querySelectorAll('.input_field');
    user = document.querySelector('#user');
    email = document.querySelector('#e-mail');
    pass = document.querySelector('#pass');
    avatar = document.querySelector('#avatar');
    submit_btn = document.querySelector('.submit input');
    buttons = document.querySelectorAll('.button-div input');
    // 

    // chnage button toggle //log-in ,sign-in toggle
    document.querySelector('input[name="change"]').addEventListener( 'click' , function (){

        let form_name = (form.attributes.name.value == 'sign-in') ? 'log-in' : 'sign-in' ;
        var toggle_field = document.querySelectorAll(".toggle_field");

        // pre actions
            form.attributes.name.value = form_name;
        // 

        if(form_name == 'log-in') {
                
            // user label change
                document.querySelector('label[for="user"]').innerHTML = "Username / E-mail";
            
            // hide sign-in fields
                toggle_field.forEach(ele => { hide(ele) });
            
            // remove user validation attribute
                user.removeAttribute('onkeyup');
                document.querySelector('#user_span').style.display = 'none' ;
            
            // remove e-mail validation attribute
                email.removeAttribute('onkeyup');
                document.querySelector('#e-mail_span').style.display = 'none' ;

            // remove password validation attribute
                pass.removeAttribute('onkeyup');
                document.querySelector('#pass_rules').style.display = 'none' ;
            
            // rememberMe_div showing
            show(document.querySelector('.rememberMe_div'));

            // enable submit button
                _submit_btn_enable();
            

        }  else if(form_name == 'sign-in'){  

            // user label change
                document.querySelector('label[for="user"]').innerHTML = "Username";
            
            // show sign-in fields
            toggle_field.forEach(ele => {show(ele)});

            // set user validation attribute
            user.setAttribute('onkeyup' , 'is_unm_available()');

            // rememberMe_div hiding
            hide(document.querySelector('.rememberMe_div'));

            // set password validation attribute
            pass.setAttribute('onkeyup' , 'pass_validation()');

        }   

        //notification 
            new_notification(form_name+' form.');

        // set form action path
            set_form_action_path();

        // content chnage
            // hading h1
            document.querySelector('.heading > h1').innerHTML = form_name;
            // buttons
            buttons[0].value = form_name.replace('-' , ' ');
            buttons[1].value = (form_name == 'sign-in') ? 'log in' : 'Register';

    });
    // 

    //load animation
    document.querySelector('.box').style.opacity='1';
    document.querySelectorAll('.fadeout').forEach( ele => {
        fade_in(ele);
    });

    form.querySelectorAll('.button-div input')[0].attributes.removeNamedItem('disabled');
    form.querySelectorAll('.button-div input')[1].attributes.removeNamedItem('disabled');
    // 

});

// set_form_action_path
function set_form_action_path() {
    let form_action_path = "/functionality/_user.php?";
    var form_action =(form.attributes.name.value == 'log-in') ? form_action_path+"action=log-in" : form_action_path+"action=sign-in";
    form.setAttribute('action' , form_action);
}

// eye img toggle   
    function toggle_pass_box(img){
        let pass = (img.classList.contains('con_eye') != true) ? document.forms['form']['pass'] : document.forms['form']['con_pass'] ;
        pass.type =  (pass.type == 'password') ? 'text' : 'password' ;
        pass.focus();
    }
// 

//toggle sign-in fields hide class
function hide(ele)  {
    ele.classList.add('hide');
}

function show(ele)  {
    ele.classList.remove('hide');
}

//swipe dowm effect
function fade_in(ele){
    ele.classList.replace('fadeout' , 'fadein');
}
function fade_out(ele){
    ele.classList.replace('fadein' , 'fadeout');
}

// validation
    // is user name available
    function is_unm_available() {
        var inputed_unm = user.value;
        var user_span = document.querySelector('#user_span');


        // regex
        var has_blankspace = /[ ]/.test(inputed_unm);
        // 

        // pre process
            user_span.style.display='none';
            user_span.style.color = 'red';
        // 

        if( has_blankspace )  {
            user_span.textContent = "space is not allowed use '_'.";
            user_span.style.display='block';
            _submit_btn_disable();
        }else  if(inputed_unm.length < 8)  {
            user_span.textContent = "Username is too short , more then 8 cherecters required";
            user_span.style.display='block';
            _submit_btn_disable();
        }else  if(inputed_unm.split('').every(char => char === inputed_unm[0]))  {
            user_span.textContent = "All charecters can't be same";
            user_span.style.display='block';
            _submit_btn_disable();
        }else   {

            var request = new XMLHttpRequest();
            var URL = location.origin + "/functionality/_chk_unm_available.php?UNM="+inputed_unm;
    
            request.onreadystatechange = function () {
                if(request.readyState === 4 && request.status === 200)  {
                    // availability == 1 = available ,  availability == 0 = not available
                    var availability = request.responseText;
            console.log(availability);

                    if(availability == 1)   {
                        user_span.style.color = '#00ff00';
                        user_span.textContent = 'AVAILABLE';
                        _submit_btn_enable();
                    }   else if(availability == 0)  {
                        user_span.textContent = 'NOT AVAILABLE';
                    }
                    user_span.style.display ='block';
                }
            }
    
            request.open('GET' , URL , true);
            request.send();

        }
    }
    
    // e-mail 
    function email_validation() {
        var email_span = document.querySelector('#e-mail_span');

        _submit_btn_disable(); 
        if( email.value == "" ) {

            email_span.innerHTML = "Enter Your Email...";
            email_span.style.display = 'block';

        }else if( ( (email.value.indexOf('.')) == -1 || (email.value.indexOf('.') != email.value.lastIndexOf('.')) ) ||
                  ( (email.value.indexOf('@')) == -1 || (email.value.indexOf('@') != email.value.lastIndexOf('@')) ) ||
                  (email.value.indexOf('.') < email.value.indexOf('@')) ) 
        {
            email_span.innerHTML = "Email is wrong!!!";
            email_span.style.display = 'block';
        }   else {
            email_span.style.display = 'none';
            _submit_btn_enable(); 
        }
    }

    // password validation
    function pass_validation()  {
        var pass_rules = document.querySelector('#pass_rules');

        // regex
        var has_uppercase = /[A-Z]/.test(pass.value);
        var has_lowercase = /[a-z]/.test(pass.value);
        var has_digits = /[\d]/.test(pass.value);
        var has_symbols = /[@#$%]/.test(pass.value);
        // 

        // prefix
        pass_rules.style.display='block';
        pass_rules.querySelectorAll('span').forEach(ele => {ele.style.display = 'none'});
        _submit_btn_disable();
        // 

        // conditions
        if(pass.value == "")    {
            pass_rules.querySelector('span[name="1"]').style.display = "block";
        }else if(pass.value.length < 8) {
            pass_rules.querySelector('span[name="2"]').style.display = "block";
        }else if(_is_all_char_same(pass.value)){
            pass_rules.querySelector('span[name="3"]').style.display = "block";
        }else if( !has_uppercase || !has_lowercase || !has_digits || !has_symbols)  {
            pass_rules.querySelector('span[name="4"]').style.display = "block";
        }else   {
            pass_rules.style.display='none';
            _submit_btn_enable();
        }
        // 

    }

    function _is_all_char_same(str)  {
        var first_char = str[0];

        if(str.length == 1) {
            return false;
        }
        
        for(let i=0 ; i<str.length ; i++)  {
            if(first_char != str[i]) {
                return false;
            }
        }
        return true;
    }

    // check does password and confirm password field is same or not
    function con_pass_validation()  {
        var con_pass = document.querySelector('#con_pass');
        var con_pass_span = document.querySelector('#con_pass_span');
        var pass_rules = document.querySelector('#pass_rules');

        
        if(con_pass.value == '' || pass.value == '' || pass_rules.style.display == 'block' )   {
            con_pass_span.innerHTML = "password is incorect!!";
        }else{
            con_pass_span.innerHTML = "password is not same!!"
        }
        
        con_pass_span.style.display = (pass.value !== con_pass.value) ? 'block' : 'none';

    }

    function avatar_validation()    {
        var allowed_extensions = [ '.jpg' , '.jpeg' , '.png' , '.webp'];
        var img_extension = '.' + avatar.value.split('.').pop().toLowerCase();
        var avatar_span = document.querySelector('#avatar_span');

       if(!allowed_extensions.includes(img_extension))  {
            avatar.style.color = 'red';
            avatar_span.style.display='block';
            _submit_btn_disable();
       }else {
            avatar.style.color = 'aliceblue';
            avatar_span.style.display = 'none';
            _submit_btn_enable();
       }

    }

    function _submit_btn_disable() {
        submit_btn.setAttribute('disabled' , 'true');
    }

    function _submit_btn_enable() {
        var validation_input = document.querySelectorAll('.validation input');
        var validation_span = document.querySelectorAll('.validation > span , .validation #pass_rules');
        var fleg = 0;

        if( (validation_span[1].style.display == "block") && (validation_span[1].textContent != "AVAILABLE" ) && (validation_input[1].textContent != '' ) )  {
            _submit_btn_disable();
            fleg = 1;
            console.log(fleg);
        }
        
        for(var i=0 ; i<validation_span.length ; i++)   {
            if(i==1){}
            else if( (validation_span[i].style.display == 'block') && (validation_input[i] != '' ) )  {
                _submit_btn_disable();
                fleg = 1;
            }
        }

        if(fleg == 0) {
            submit_btn.removeAttribute('disabled');
        }
        
    }

    function check_all_fields() {
        if(form.attributes.name.value == 'log-in')   {

            if(user.value == '' || pass.value == ''){  
                new_Alert('Username or/and Password is Empty!!!');
                return false;
            }

        }else if(form.attributes.name.value == 'sign-in')    {
           
            all_input_fields = document.querySelectorAll('.input_field #user , .input_field #surname , .input_field #name , .input_field #e-mail , .input_field #pass , .input_field #con_pass , .input_field #avatar');
            var fleg=-1;
            all_input_fields.forEach(field => {
                if(field.value == ''){
                    new_Alert('All fields required!!!');
                    fleg++;
                }
            })

            if(fleg != -1)  {
                return false;
            }
        }
        
        return true;
    }

// 

