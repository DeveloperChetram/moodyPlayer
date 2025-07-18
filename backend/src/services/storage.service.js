
var ImageKit = require("imagekit");


var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT,
});

const upload = (file)=>{
return new Promise((resolve, reject) => {
    imagekit.upload({
        file:file.buffer,
        fileName:"this is the test file"
    },(err,result)=>{
        if(err){
            reject(err);
        }
        else{
            resolve(result);
        }
    })
})
}
module.exports = upload;