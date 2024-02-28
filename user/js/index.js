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

    //all validation of the form at _validation.js in root js folder. 

    function _submit_btn_disable() {
        submit_btn.setAttribute('disabled' , 'true');
    }

    function _submit_btn_enable() {
        var validation_input = document.querySelectorAll('.validation input');
        var validation_span = document.querySelectorAll('.validation > span , .validation #pass_rules');

        var fleg = 0;

        if( (validation_span[1].style.display == "block") && (validation_span[1].textContent != "AVAILABLE" ) && (validation_input[1].textContent != '' ) ||
            (validation_span[2].style.display == "block") && (validation_span[2].textContent != "AVAILABLE" ) && (validation_input[2].textContent != '' ) )  {
            _submit_btn_disable();
            fleg = 1;
        }
        
        for(var i=0 ; i<validation_span.length ; i++)   {
            if(i==1 || i==2){}
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

