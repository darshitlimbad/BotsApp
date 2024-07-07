async function _getUsersList(id=0){
    let URL= "/functionality/admin/admin.php";
    let data= {req:'getUsersList',id};

    try{
        const res = await postReq(URL,JSON.stringify(data));
        if(res.status === "success" && !res.responseText.error)
            return res.responseText;
        else 
            throw res.responseText;
        
    }catch(err){
        customError(err); 
        return 0;
    }
}