
// validation
    // is user name available
    function is_unm_available() {
        var inputed_unm = user.value;
        var user_span = document.querySelector('#user_span');

        // regex
        var has_blankspace = /[ ]/.test(inputed_unm);
        var  has_at = /[@]/.test(inputed_unm);
        // 

        // pre process
            user_span.style.display='none';
            user_span.style.color = 'red';
        // 

        if( inputed_unm == "" ) {
            user_span.textContent = "Please Enter Username...";
            user_span.style.display = 'block';
        }else if( has_blankspace )  {
            user_span.textContent = "space is not allowed use '_'.";
            user_span.style.display='block';
            _submit_btn_disable();
        }else if( has_at )  {
            user_span.textContent = "@ is not allowed..";
            user_span.style.display='block';
            _submit_btn_disable();
        }else  if(inputed_unm.length < 8)  {
            user_span.textContent = "Username is too short , more then 8 cherecters required";
            user_span.style.display='block';
            _submit_btn_disable();
        }else  if(inputed_unm.length > 20)  {
            user_span.textContent = "Username is too big , only 30 charecters are allowed";
            user_span.style.display='block';
            _submit_btn_disable();
        }else  if(inputed_unm.split('').every(char => char === inputed_unm[0]))  {
            user_span.textContent = "All charecters can't be same";
            user_span.style.display='block';
            _submit_btn_disable();
        }else   {
            var request = new XMLHttpRequest();
            var URL = location.origin + "/functionality/lib/_chk_available.php?passkey=khuljasimsim&UNM="+btoa(inputed_unm);

            request.onreadystatechange = function () {
                if(request.readyState === 4 && request.status === 200)  {

                    // res == 1 = available ,  res == 0 = not available
                    var res = request.responseText;

                    if(res == 1)   {
                        user_span.style.color = '#00ff00';
                        user_span.textContent = 'AVAILABLE';
                        _submit_btn_enable();
                    }   else if(res == 0)  {
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

        // pre process
        _submit_btn_disable(); 
        email_span.style.color = 'red';

        if( email.value == "" ) {

            email_span.textContent = "Enter Your Email...";
            email_span.style.display = 'block';

        }else if( ( (email.value.indexOf('.')) == -1 || (email.value.indexOf('.') != email.value.lastIndexOf('.')) ) ||
                    ( (email.value.indexOf('@')) == -1 || (email.value.indexOf('@') != email.value.lastIndexOf('@')) ) ||
                    (email.value.indexOf('.') < email.value.indexOf('@')) )  
        {
            email_span.innerHTML = "Email is wrong!!!";
            email_span.style.display = 'block';
        }else {
            var request = new XMLHttpRequest();
            var URL = location.origin + "/functionality/lib/_chk_available.php?passkey=khuljasimsim&EMAIL="+btoa(email.value);

            request.onreadystatechange = function () {
                if(request.readyState === 4 && request.status === 200)  {
                    // res == 1 = available ,  res == 0 = not available
                    var res = request.responseText;

                    if(res == 1)   {
                        email_span.style.color = '#00ff00';
                        email_span.textContent = 'AVAILABLE';
                        _submit_btn_enable();
                    }   else if(res == 0)  {
                        email_span.textContent = 'NOT AVAILABLE';
                    }
                    user_span.style.display ='block';
                }
            }
    
            request.open('GET' , URL , true);
            request.send();
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

    if((pass.value !== con_pass.value)){
        if(con_pass.value == '' || pass.value == '' || pass_rules.style.display == 'block' )   {
            con_pass_span.innerHTML = "password is incorect!!";
        }else{
            con_pass_span.innerHTML = "password is not same!!"
        }
        
        con_pass_span.style.display = 'block';
        _submit_btn_disable();
    }else{
        con_pass_span.style.display = 'none';
        _submit_btn_enable();
    }

}

function avatar_validation() {

    var allowed_extensions = [ '.jpg' , '.jpeg' , '.png' , '.webp'];
    var img_extension = '.' + avatar.value.split('.').pop().toLowerCase();
    
    var avatar_preview = document.querySelector('.avatar_preview');
    var avatar_span = document.querySelector('#avatar_span');

    file = avatar.files[0];

    // pre action
        avatar_span.textContent = "";
        avatar_span.style.display = 'none';
        avatar_preview.src = '/img/default_dp.png';

    if(!allowed_extensions.includes(img_extension) ) {
        avatar.style.color = 'red';
        avatar_span.textContent = "Only [ .jpg, .jpeg, .png, .webp ] format is allowed.";
        avatar_span.style.display='block';
        _submit_btn_disable();
    }else if(file.size > 6485760){
        avatar.style.color = 'red';
        avatar_span.textContent = "Img is Larger then 5 MB.";
        avatar_span.style.display='block';
        _submit_btn_disable();
    }else {
        url= URL.createObjectURL(file);
        avatar_preview.src = url;
        avatar.style.color = 'var(--text-color)';
        avatar_span.style.display = 'none';
        _submit_btn_enable();
    }
}