// global var
    document.addEventListener('DOMContentLoaded' , () => {
        submit_btn = document.querySelectorAll('.pop_up_yes_btn');
    });

const goToURL = () => {
    window.location.assign(url);
}

const _confirmation_pop_up = (title , message , came_url , theme = 'blue') => {
    url=came_url;

    var confirmation_pop_up = document.querySelector('#confirmation_pop_up');
    
    var title_ele = confirmation_pop_up.querySelector('.title');
    title_ele.style.color=theme;
    title_ele.textContent=title;
    confirmation_pop_up.querySelector('hr').style.border='1px solid '.concat(theme);

    var message_ele = confirmation_pop_up.querySelector('.message');
    message_ele.textContent = message;

    if(theme == 'blue'){
        confirmation_pop_up.querySelector('.pop_up_yes_btn').style.backgroundColor = "rgb(0 56 254 / 52%)";
    }else if(theme == 'red'){
        confirmation_pop_up.querySelector('.pop_up_yes_btn').style.backgroundColor = "rgb(255 0 0 / 53%)";
    }else {
        confirmation_pop_up.querySelector('.pop_up_yes_btn').style.backgroundColor = theme;
    }

    _show_this_pop_up(confirmation_pop_up);

}

const _upload_img_form = (title , came_url , theme = 'blue') => {
    
    url = came_url;

    var upload_img_form = document.querySelector('#upload_img_form');

    var title_ele = upload_img_form.querySelector('.title');
    title_ele.style.color = 'aliceblue';
    title_ele.textContent = title;

    upload_img_form.querySelector('hr').style.border='1px solid '.concat(theme);
    upload_img_form.querySelector('.pop_up_yes_btn').style.backgroundColor = theme;

    _show_this_pop_up(upload_img_form);
}

const _uploadImg = () => {
    
    img = avatar.files[0];

    _get_img_data(img)
        .then( result => {
            img_binary_data = result.split(',').pop();

            var value = {
                img_type : img.type,
                img_data : img_binary_data,
            };

            data = JSON.stringify(
                {
                    table: 'users_avatar',
                    edit_column: '',
                    data : value ,
                });

            var url = window.location.origin+"/functionality/_user_edit.php".concat("?key_pass=khulJaSimSim");

            postReq(url , data)
                .then(response => {
                    if(response == 1){
                        _hide_this_pop_up(upload_img_form);
                        document.querySelectorAll('.avatar').forEach(img => {
                            img.src = result;
                        })
                        new_notification("data changed succesfully");
                    }else{
                        new_Alert('somethinng went wrong while uploading Profile img :( , please try again.');
                    }
                })
                .catch(err => {
                    console.error(err);
                });

        })
        .catch(err => {
            console.error(err);
            return;
        });
};

const _get_img_data = (img) => {
    return new Promise( (resolve,reject) => {
        var fReader = new FileReader();

        fReader.onload = (event) => {
            resolve(event.target.result);
        }

        fReader.onerror = () => {
            reject();
        }

        fReader.readAsDataURL(img);
    } );
}

function _submit_btn_disable() {
    submit_btn[1].setAttribute('disabled' , true);
}

function _submit_btn_enable() {
    submit_btn[1].removeAttribute('disabled');
}

function _show_this_pop_up(pop_up) {
    pop_up.style.display = 'block';

    setTimeout(() => {
        pop_up.style.transform = "translateY(0)";
        pop_up.style.opacity = '100%';
    } , 10);

}
function _hide_this_pop_up(pop_up) {
    pop_up.style.transform = "translateY(-500px)";
    pop_up.style.opacity = '0%';
    
    // set values to default
        avatar.value = null;
        avatar.style.color = 'aliceblue';
        document.querySelector('.avatar_preview').src = '../img/default_dp.png';
        avatar_span.style.display = 'none';

    setTimeout(() => {
        pop_up.style.display='none';
    } , 10);
}