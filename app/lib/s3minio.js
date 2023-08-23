var Minio = require('minio')
var Fs = require('fs');
var path = require('path');
const mime = require('mime');

var s3Client = new Minio.Client({
    endPoint:  process.env.MINIO_URL,
    accessKey: process.env.MINIO_ACCESSKEY,
    secretKey: process.env.MINIO_SECRETKEY
})

const bucketName = process.env.MINIO_BUCKET;

const uploadFile = async(file,fldr,name) => {
    try {
        if (!file) {
            return ({
                code: 40,
                status: false,
                message: "file not found"
            });
        }
        const base64Data = file.replace(/^data:([A-Za-z-+/]+);base64,/, '')
        let base64ContentArray = file.split(",")  
        const ext = base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
        response = {};
        response.type =ext;
        response.data = new Buffer(base64Data, 'base64');
        let decodedImg = response;
        let imageBuffer = decodedImg.data;
        let file_type = decodedImg.type;
        let extension = mime.extension(file_type);
        let fileName = `${fldr}/${name}.${extension}`;  
        
        if ( !fileName.match(/\.(pdf|PDF|doc|DOC|docx|DOCX|xls|XLS|xlsx|XLSX|jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|html)$/)) {
            return ({
                code: 40,
                status: false,
                message: 'Only files are allowed! PDF/SVG/JPG/PNG/DOC/XLS'
            });
        }
        var metaData = {'Content-Type': 'application/octet-stream' }
        
        const uploaad = await s3Client.putObject(bucketName, fileName , imageBuffer, imageBuffer.length, metaData, function(err, data){
            if (err) {     
              console.log('Error uploading data: ', err); 
              return ({
                  code: 40,
                  status: false,
                  path: err
              });
      
            } else {
              console.log('succesfully uploaded the image!', data);
              return ({
                  code: 40,
                  status: true,
                  path: fileName
              });
            }
      
        });   
        
        return ({
            code: 40,
            status: true,
            path: `/${bucketName}/${fileName}`
        });
    } catch (e) {
      console.log(e)
      return ({
              code: 40,
              status: false,
              message: e
          });
    }
}

const deleteFile = async (file) => {
    try {
        s3Client.removeObject(bucketName, file.replace('/bcl/', ''), function(err) {
            if (err) {
                return console.log('Unable to remove object', err)
            }
            console.log('Removed the object')
        })
    } catch (e) {
      console.log(e)
      return ({
              code: 40,
              status: false,
              message: e
          });
    }
}


const getFile = async (file, callback) => {
    try {
    var size = 0
        s3Client.getObject(bucketName, file?.path+file?.name, function(err, dataStream) {
            if (err) {
                callback(err, null);
            }
            dataStream.on('data', function(chunk) {
                size += chunk.length
                callback(null, chunk)
            })
            dataStream.on('end', function() {
                log.info('End. Total size = ' + size)
            })
            dataStream.on('error', function(err) {
                callback(err, null);
                log.error(err)
            })
        })
    } catch (e) {
      callback(e, chunk);
      console.log(e);
      return ({
              code: 40,
              status: false,
              message: e
          });
    }
}

module.exports = {
    uploadFile,
    deleteFile,
    getFile
};