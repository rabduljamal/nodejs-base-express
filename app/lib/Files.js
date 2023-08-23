// upload images
var fs = require('fs');

const uploadFile = async (file,type,id) => {
  try {
    if (!file) {
      return ({
          code: 40,
          status: false,
          message: "file not found"
      });
    }
    
    if ( !file.name.match(/\.(pdf|jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      return ({
          code: 40,
          status: false,
          message: 'Only files are allowed! PDF/JPG/PNG'
      });
    }
    const file_path = appDir+'/public/files/' + type + '-' + id + path.parse(file.name).ext;
    await file.mv(file_path, (err) => {   
      return ({
          code: 40,
          status: false,
          message: err
      });         
    });  
      
    return ({
        code: 40,
        status: true,
        path: file_path.replace(appDir+'/public/', '/')
    });
  } catch (e) {
    console.error(e)
    return false
  }
}

// upload images
const uploadImage = async (image,type,id) => {
  try {
    if(!image){
      new Error('image not found');
    }

    const imgdata = image;
    const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    const extension = imgdata.match(/[^:/]\w+(?=;|,)/)[0];
    const path = appDir+'/public/images/'+type+"-"+id+"."+extension
    await fs.writeFileSync(path, base64Data,  {encoding: 'base64'});
    return path.replace(appDir+'/public/', '/');
  } catch (e) {
    console.error(e)
    return false
  }
}

// delete image
const deleteImage = async (image) => {
  try {
    await fs.unlink(appDir+'/public'+image, (err) => {
      if (err){
        return false
      } 
      console.log(`${image} was deleted`);
    });
    return true
  } catch (e) {
    log.error(e)
    return false
  }
}

module.exports = {
  uploadFile, uploadImage, deleteImage
};