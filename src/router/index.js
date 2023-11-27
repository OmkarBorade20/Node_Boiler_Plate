const express=require('express')
const router=express.Router()
const RespHandler=require('../utility/resHandler')
const errorHandler=require('../utility/errorHandler')
const controller=require('../controller/contorller')

//all ftp related routes
router.post('/fptConnection',controller.fptConnection)
router.post('/ftpLists',controller.ftpLists)
router.post('/downloadFileFromFtp',controller.downloadFileFromFtp)
router.post('/backUpDataFromFtp',controller.backUpDataFromFtp)

// router.post('/uploadFile',controller.uploadFile)

//all local Destination apis
router.get('/dirLists',controller.dirLists)
router.post('/downloadFile',controller.downloadFile)
//all mongoDb related routes
router.post('/findByQuery',controller.findByQuery)
router.post('/InsertMany',controller.InsertMany)
router.post('/InsertOne',controller.InsertOne)


router.use(RespHandler)
router.use(errorHandler)
module.exports=router;