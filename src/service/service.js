const mongorepo=require('../repository/mongodb/mongorepo')
const Ftpclient=require('../connections/ftp/connect')
const path=require('path')
const fs=require('fs')

module.exports.dirLists=async function (req)
{
    let des_path=path.join(__dirname,'..',"..","/Destination")

    if (!fs.existsSync(des_path)){
        fs.mkdirSync(des_path);
    }
    let list=fs.readdirSync(des_path, {withFileTypes: true});
    // .filter(item => !item.isDirectory())
    // .map(item => item.name)

    req.res.message=`Total Files Present in Local File :${list.length}`
    req.res.data= list;
    return req;
}

module.exports.fptConnection=async function (req)
{
    let ftp_host=req.body.host;
    let ftp_user=req.body.user;
    let ftp_password=req.body.password;

    let ftpServer=await Ftpclient.connect(ftp_host,ftp_user,ftp_password)
    ftpServer.client.close()

    req.res.message=`Connection Established on FTP Server :${ftpServer.FTP}` 
    return req;
}

module.exports.ftpLists=async function (req)
{
    let ftp_host=req.body.host;
    let ftp_user=req.body.user;
    let ftp_password=req.body.password;

    let ftpServer=await Ftpclient.connect(ftp_host,ftp_user,ftp_password)
    let lists=await ftpServer.client.list();
    ftpServer.client.close()

    req.res.message=`Files Present in Ftp Server :${lists.length}` 
    req.res.data=lists;
    return req;
}

module.exports.downloadFile=async function (req)
{
    let ftp_host=req.body.host;
    let ftp_user=req.body.user;
    let ftp_password=req.body.password;
    let file_name=req.body.filename;
    let download_resp;

    let cur_dir=__dirname;
    //moving up in the dir to Destination folder.
    let destination_path=path.join(cur_dir,'..',"..","/Destination")
   

    let ftpServer=await Ftpclient.connect(ftp_host,ftp_user,ftp_password)
    let ftp_idr=await ftpServer.client.pwd()
    try{
        //let directory=await  ftpServer.client.ensureDir(ftp_idr+file_name);
        if(file_name.includes("."))
            download_resp=await ftpServer.client.downloadTo( destination_path+`/${file_name}`,file_name)
        else
            download_resp=await ftpServer.client.downloadToDir( destination_path+`/${file_name}`,ftp_idr+file_name)

        console.log(download_resp)
        ftpServer.client.close();
    }catch(e){
        console.log(e)
    }
 

    req.res.message=`sucess` 
    req.res.filepath= destination_path+`/${file_name}`;
    return req;
}

module.exports.uploadFile=async function (req)
{
    let ftp_host=req.body.host;
    let ftp_user=req.body.user;
    let ftp_password=req.body.password;

    let ftpServer=await Ftpclient.connect(ftp_host,ftp_user,ftp_password)
    //console.log(ftpServer)
    let lists=await ftpServer.client.list();


    req.res.message=`Files Present in Ftp Server :${lists.length}` 
    req.res.data=lists;
    return req;
}



module.exports.findByQuery=async function (req)
{
    let input=req.body;
    let data=await mongorepo.findQuery(input.collection,input.query)
    req.res.message=`Data Fetched!!`
    req.res.data=data;
    return req;
}

module.exports.InsertMany=async function (req)
{
    let input=req.body;
    let data=await mongorepo.insertMany(input.collection,input.data)

    req.res.message=`Sucess`
    req.res.data=data;
    return req;
}

module.exports.InsertOne=async function (req)
{
    let input=req.body;
    let data=await mongorepo.insertOne(input.collection,input.data)
    req.res.message=`sucess`
    req.res.data=data;
    return req;
}
