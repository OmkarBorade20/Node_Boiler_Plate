
const ftp=require('basic-ftp')
const client = new ftp.Client()
client.ftp.verbose = false
let FTP;

    async function connect(host,user,password)
    {

        try {
            FTP=await client.access({
                // host: "ftp://192.168.0.213",
                // user: "user",
                // password: "user",
                 host,
                 user,
                 password,
                secure: false
    
            })

            //console.log(FTP)
            //console.log(await client.list())
            return {FTP,client};
        }
        catch(err) {
            console.log(err)
            client.close()
        }
    
    }
  
module.exports={connect}