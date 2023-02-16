const express=require('express')
const router=express.Router()
const RespHandler=require('../utility/resHandler')
const errorHandler=require('../utility/errorHandler')
const controller=require('../controller/hello')

router.get('/hello',controller.hello)
router.post('/findByQuery',controller.findByQuery)
router.post('/InsertMany',controller.InsertMany)
router.post('/InsertOne',controller.InsertOne)


router.use(RespHandler)
router.use(errorHandler)
module.exports=router;