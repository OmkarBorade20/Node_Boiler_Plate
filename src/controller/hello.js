const service=require('../service/index')

module.exports.hello=async function (req,res,next)
{
    try{
        await service.hello(req)
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