const express=require('express')
const morgan=require('morgan')
const cors=require('cors')
const bodyParser = require('body-parser')
const app=express()
const router=require('./src/router/index')
const mongo=require('./src/connections/mongodb/mongo')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger/swagger.json');
const ftp=require('./src/connections/ftp/connect')


let count=0;
morgan.token('id',function getId(req){
    return req.id;
})

function assignId(req,res,next)
{
    req.id=count++;
    next();
}
app.use(assignId)
app.use(morgan('   :id |   :method | :url | :status | :response-time ms | :date[web] '));

mongo.connect((err,db)=>{
    if(err)
        console.log(`Mongo Error :${err}`)
    else
     console.log(`Db :${db}`)
 })


// let ftpClient=ftp.connect("ftp://192.168.0.213","user","user");
// console.log(ftpClient)

 app.use(cors())
 app.use(bodyParser.urlencoded({ extended: false }))


 app.use(bodyParser.json({limit: '50mb'}))
 swaggerDocument.servers[0].url= process.env.swaggerurl || swaggerDocument.servers[0].url;
 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 app.use(router)


const PORT=process.env.port ||3000;

app.listen(PORT,()=>{
    console.log(`Listening to Port :${PORT}`)
})



//1.add logic to read data from config
//2.add swagger docs 
//3.add generic functions to use 
//4.add more curd operations in mongo repo.

