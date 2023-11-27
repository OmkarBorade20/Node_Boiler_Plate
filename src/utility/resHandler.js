const respHandler=(req,res,next)=>{

    let statusCode=200;
    let response={}

if(req.res.filepath !=undefined)
{
    res.status(statusCode)
    res.download(req.res.filepath);
}
else if (req.res !=undefined || req.res.data!=undefined  )
{
    statusCode=200;
    response={
        "message":req.res.message,
        "data":req.res.data!=undefined?req.res.data:[]
          
   }
   res.status(statusCode)
   res.send(response);

}
else
{
    next()
}
}

module.exports=respHandler;