const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Validator = require(appDir + '/app/validation/Banner/BannerValidations');
const { keycloakRestrict } = require(appDir + '/app/middleware/keycloakRestrict');

router.use(libKeycloak.protect());
router.use(keycloakRestrict);

router.get("/", async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    
    var search = {}  
    if (req.query.dashboard) {
        search["dashboard_id"] = req.query.dashboard;
    }       

    if (req.query.status) {
        search["status"] = req.query.status;
    }            

    var options = {
      where: search,
      page: page < 1 ? 1 : page,
      paginate: per_page,
      order: [["id", "desc"]],
    };

    const { docs, pages, total } = await model.banner.paginate(options);

    if (docs) {
        let result = {
          data: await docs,
          currentPage: page,
          nextPage: page >= pages ? false : page + 1,
          totalItems: total,
          totalPages: pages,
        }

      Responser.success(res, "Get Banner Successfully", result)
    }
  } catch (error) {
    console.log(error);
    Responser.error(res, error.message || "Error", error)
  }
});

router.post('/', Validator.create, async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return Responser.error(res, errors['errors'][0].param+" "+errors['errors'][0].msg, errors['errors'])
        }

        return await model.sequelize.transaction(async (t) => {

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
            Responser.success(res, "Create Banner Successfully", Banner)
        })
        

    } catch (error) {
        console.log(error);
        Responser.error(res, error.message || "Error", error)
    }
});

router.patch('/:id', Validator.update, async (req, res, next) => {
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

        Responser.success(res, "Update Banner Successfully", data)

      }).catch((err) =>{
        throw Error(err.message);
      })

    } catch (error) {
        console.log(error);
        Responser.error(res, error.message || "Error", error)
    }
});


router.patch('/:id/status', Validator.status, async (req, res, next) => {
  try {

    await model.sequelize.transaction(async (t) => {
      const banner = await model.banner.findOne({where: {id: req.params.id}})
      if(!banner) {
        throw Error("Banner Not Found");
      }

      await banner.update({status: req.body.status}, { transaction: t})

      return {...await banner.get()}

     }).then(async(data) =>{

      Responser.success(res, "Update Status Banner Berhasil", data)

    }).catch((err) =>{
      throw Error(err.message);
    })

  } catch (error) {
      console.log(error);
      Responser.error(res, error.message || "Error", error)
  }
});

router.get("/:id", async (req, res, next) => {
    try {
        const banner = await model.banner.findOne({
            where: { id: req.params.id },
        });

        if(banner) {
          Responser.success(res, "Get Banner Successfully", banner)
        } else {
          Responser.error(res, "Banner Not Found")
        }
    } catch(error) {
        log.error(error)
        Responser.error(res, error.message || "Error", error)
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await model.banner.findOne({
            where: { id: req.params.id },
        }).then(async (banner) => {
            await banner.destroy()

            if(banner) {
              Responser.success(res, "Delete Banner Successfully")
            }
        });
    } catch (error) {
        log.error(error)
        Responser.error(res, error.message || "Error", error)
    }
});


module.exports = router;