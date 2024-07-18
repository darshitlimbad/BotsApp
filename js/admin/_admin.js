document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector(`div.options[data-action="admin-panel"]`)?.classList.add("selected");

    handleResize();
    window.onresize=()=>handleResize();

    //admin panel initialization
    init_adminPanel();
});

function init_adminPanel(){
    //the list of catagories available in admin panel
    var category_list = ['account','emojis'];
    
    category_list.forEach(category=>{
        new Category(category);
    });
}

//page responsiveness handling
function handleResize(){
    if(window.outerWidth < 700){
        document.querySelector('body#admin-page-body').classList.add('mobile');
        device='mobile';
    }else{
        document.querySelector('body#admin-page-body').classList.remove('mobile');
        device='pc';
    }
}

//users Management list form function
function openUsersManagementList(){
    var obj=new UsersManagementForm();
}

function openGroupsManagementList(){
    var obj=new GroupsManagementForm();
}

function openReportsList(){
    var obj=new reportsReviewForm();
}

function openDisplayServerEmojis(){
    var obj=new displayServerEmojis();
}

function openPendingEmojisList(){
    var obj=new displayPendingEmojis();
}