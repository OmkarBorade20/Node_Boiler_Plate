const service=require('../service/service')

module.exports.dirLists=async function (req,res,next)
{
    try{
        await service.dirLists(req)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.fptConnection=async function (req,res,next)
{
    try{
        await service.fptConnection(req)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.downloadFileFromFtp=async function (req,res,next)
{
    try{
        await service.downloadFileFromFtp(req)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.downloadFile=async function (req,res,next)
{
    try{
        await service.downloadFile(req)
        next()
    }catch(e){
        next(e)
    }
}


module.exports.uploadFile=async function (req,res,next)
{
    try{
        await service.uploadFile(req)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.ftpLists=async function (req,res,next)
{
    try{
        await service.ftpLists(req)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.backUpDataFromFtp=async function (req,res,next)
{
    try{
        await service.backUpDataFromFtp(req)
        next()
    }catch(e){
        next(e)
    }
}


module.exports.findByQuery=async function (req,res,next)
{
    try{
        await service.findByQuery(req)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.InsertMany=async function (req,res,next)
{
    try{
        await service.InsertMany(req)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.InsertOne=async function (req,res,next)
{
    try{
        await service.InsertOne(req)
        next()
    }catch(e){
        next(e)
    }
}