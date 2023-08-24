const { validationResult } = require('express-validator');


const get = async(req, res, callback) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    
    var search = {}           

    var options = {
      where: search,
      page: page < 1 ? 1 : page,
      paginate: per_page,
      order: [["id", "desc"]],
    };

    const { docs, pages, total } = await model.banner.paginate(options);

    if (docs) {
      let data = {
        data: await docs,
        currentPage: page,
        nextPage: page >= pages ? false : page + 1,
        totalItems: total,
        totalPages: pages,
      }
      callback(data, '');
    }
  } catch (error) {
    log.error(error)
    callback('', error);
  }
};

const create = async(req, res, callback) => {
    try {

      await model.sequelize.transaction(async (t) => {

        const Banner= await model.banner.create(req.body, {transaction: t});

        if(req.body.image){
          const image = await s3minio.uploadFile(req.body.image, 'banner', UUID('banner'));

          await Banner.update(
          {
            image: await image.path 
          },{
              transaction: t,
              returning: true, 
              plain: true 
          }).then((data, err) => {
              console.log(data);
          })
        }
        
        return Banner
      }).then(async(Banner)=>{
          callback(Banner, '')
      })
        

    } catch (error) {
      log.error(error)
      callback('', error)
    }
}

const patch = async (req, res, callback) => {
    try {

      await model.sequelize.transaction(async (t) => {
        const banner = await model.banner.findOne({where: {id: req.params.id}})
        if(!banner) {
          throw Error("Banner Not Found");
        }

        let data = { 
          title: req.body.title || banner.title, 
          sort: req.body.sort || banner.sort,
          url: req.body.url || banner.url,
          status: req.body.status || banner.status
        }

        var tmpimage = (req.body.image) ? await s3minio.uploadFile(req.body.image, 'banner', UUID('banner')) : banner.image;
        
        data.image = await tmpimage.path

        await banner.update(await data, { transaction: t})

        return {...await banner.get()}

      }).then(async(data) =>{

        callback(data, '')

      }).catch((err) =>{
        throw Error(err.message);
      })

    } catch (error) {
      log.error(error)
      callback(''. error)
    }
};

const getById = async (req, res, callback) => {
    try {
        const banner = await model.banner.findOne({
            where: { id: req.params.id },
        });

        if(banner) {
          callback(banner)
        } else {
          callback('', 'Banner not found');
        }
    } catch(error) {
        log.error(error)
        callback('', error);
    }
};

const destroy = async (req, res, callback) => {
    try {
        await model.banner.findOne({
            where: { id: req.params.id },
        }).then(async (banner) => {
            await banner.destroy()

            if(banner) {
              callback('Delete Banner Successfully', '')
            }
        });
    } catch (error) {
        log.error(error)
        callback('', error);
    }
};


module.exports = { get, create, patch, destroy, getById };