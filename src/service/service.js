
const path=require('path')
const fs=require('fs')

var archiver = require('archiver');
const mongorepo=require('../repository/mongodb/mongorepo')
const Ftpclient=require('../connections/ftp/connect')





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
    

    req.res.message=`Connection Established on FTP Server` 
    req.res.data=ftpServer.FTP;
    ftpServer.client.close()
    return req;
}

module.exports.ftpLists=async function (req)
{
    let ftp_host=req.body.host;
    let ftp_user=req.body.user;
    let ftp_password=req.body.password;
    let sub_dir=req.body.subDir;

    //if subDirectory is present in Payload then use that sub dir. 
    //else root dir.
    let Drive_path= sub_dir!=undefined ?`/${sub_dir}`:ftP_dir;

    let ftpServer=await Ftpclient.connect(ftp_host,ftp_user,ftp_password)
    let lists=await ftpServer.client.list(Drive_path);
    ftpServer.client.close()

    req.res.message=`Files Present in Ftp Server :${lists.length}` 
    req.res.data=lists;
    return req;
}

module.exports.downloadFileFromFtp=async function (req)
{
    let ftp_host=req.body.host;
    let ftp_user=req.body.user;
    let ftp_password=req.body.password;
    let file_name=req.body.filename;
    let download_resp;
    let sub_dir=req.body.subDir;

    let cur_dir=__dirname;
    //moving up in the dir to Destination folder.
    let destination_path=path.join(cur_dir,'..',"..","/Destination")

     let ftpServer=await Ftpclient.connect(ftp_host,ftp_user,ftp_password)

       //current ftp path.
       let ftP_dir=await ftpServer.client.pwd();

       //if subDirectory is present in Payload then use that sub dir. 
       //else root dir.
       let Drive_path= sub_dir!=undefined ?`/${sub_dir}`:ftP_dir;
   

    //if no directory present this will create a new directory.
    if (!fs.existsSync(destination_path)){
        fs.mkdirSync(destination_path, { recursive: true });
    }

    try{
       
        if(file_name.includes("."))
            download_resp=await ftpServer.client.downloadTo( destination_path+`/${file_name}`,Drive_path+"/"+file_name)
        else
            download_resp=await ftpServer.client.downloadToDir( destination_path+`/${file_name}`,Drive_path+"/"+file_name)

        console.log(download_resp)
      
    }catch(e){
        console.log(e)
    }
    finally{
        ftpServer.client.close();
    }
 

    req.res.message=`sucess` 
    req.res.filepath= destination_path+`/${file_name}`;
    return req;
}

module.exports.downloadFile=async function (req)
{
    let destination_path=path.join(__dirname,'..',"..","/Destination")

    let Filepath=req.body.path;
    let finalPath;

    if (!fs.existsSync(destination_path)){
        fs.mkdirSync(destination_path, { recursive: true });
    }

    if(Filepath.includes('.'))
        finalPath=Filepath;
    else
        finalPath=makezipFile(destination_path,Filepath);
    
   //add a delay of 5 sec so that our files are properly zipped 
    await sleep(5000)

    req.res.message=`sucess` 
    req.res.filepath= finalPath;
    return req;

   
  
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
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

module.exports.backUpDataFromFtp=async function (req)
{
    let ftp_host=req.body.host;
    let ftp_user=req.body.user;
    let ftp_password=req.body.password;
    let sub_dir=req.body.subDir;

    //connect with Ftpserver.
    let ftpServer=await Ftpclient.connect(ftp_host,ftp_user,ftp_password)
    
    //current ftp path.
    let ftP_dir=await ftpServer.client.pwd();

    //if subDirectory is present in Payload then use that sub dir. 
    //else root dir.
    let Drive_path= sub_dir!=undefined ?`/${sub_dir}`:ftP_dir;

    //Hasing all backup folder for unique dirs.
    let destination_path=path.join(__dirname,'..',"..","Destination",`Backup_${(+new Date).toString(36)}`)

       //if no directory present this will create a new directory.
       if (!fs.existsSync(destination_path)){
        fs.mkdirSync(destination_path, { recursive: true });
    }

    let lists=await ftpServer.client.list(Drive_path);

    try{
        await ftpServer.client.downloadToDir( destination_path,Drive_path)
    }catch(e){
        console.log(e)
    }
    finally{
        ftpServer.client.close();
    }

    req.res.message=`Files Present in Ftp Server :${lists.length} Are Backed UP in ${destination_path}` 
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


function makezipFile(despath,source_dir)
{
    let filename=source_dir.split('\\').slice(-1)[0]
    var output = fs.createWriteStream(despath+`/${filename}.zip`);
    var archive = archiver('zip');

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on('error', function(err){
        throw err;
    });
    
    archive.pipe(output);
    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(source_dir, false);
    // // append files from a sub-directory and naming it `new-subdir` within the archive
    // archive.directory('subdir/', 'new-subdir');

    archive.finalize();

 

     return output.path;
}