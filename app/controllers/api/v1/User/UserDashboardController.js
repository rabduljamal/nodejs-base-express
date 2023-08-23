const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Validator = require(appDir + '/app/validation/User/UserDashboardValidations');
const { keycloakRestrict } = require(appDir + '/app/middleware/keycloakRestrict');

router.use(libKeycloak.protect());
router.use(keycloakRestrict);

router.get("/", async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;

    var options = {
      page: page < 1 ? 1 : page,
      paginate: per_page,
      order: [["id", "desc"]],
    };

    if(req.query.filter){
      options.where = req.query.filter
    }

    const { docs, pages, total } = await model.userDashboard.paginate(options);

    if (docs) {
        let result = {
          data: await docs,
          currentPage: page,
          nextPage: page >= pages ? false : page + 1,
          totalItems: total,
          totalPages: pages,
        }

      Responser.success(res, "Get User Successfully", result)
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

          const UserDashboard= await model.userDashboard.create(req.body, {transaction: t});

          if(req.body.image){
            const image = await s3minio.uploadFile(req.body.image, 'userDashboard', UUID('userDashboard'));

            await UserDashboard.update(
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
          
          return UserDashboard
        }).then(async(UserDashboard)=>{
            Responser.success(res, "Create User Dashboard Successfully", UserDashboard)
        })
        

    } catch (error) {
        console.log(error);
        Responser.error(res, error.message || "Error", error)
    }
});

router.patch('/:id', async (req, res, next) => {
    try {

      await model.sequelize.transaction(async (t) => {
        const UserDashboard = await model.userDashboard.findOne({where: {id: req.params.id}})
        if(!UserDashboard) {
          throw Error("User Dashboard Not Found");
        }

        let data = { 
          username: req.body.username || UserDashboard.username, 
          email: req.body.email || UserDashboard.email,
          first_name: req.body.first_name || UserDashboard.first_name,
          last_name: req.body.last_name || UserDashboard.last_name,
          phone: req.body.phone || UserDashboard.phone,
          type: req.body.type || UserDashboard.type,
          status: req.body.status || UserDashboard.status,
        }

        var tmpimage = (req.body.photo) ? await s3minio.uploadFile(req.body.photo, 'userDashboard', UUID('userDashboard')) : userDashboard.photo;
        
        data.photo = await tmpimage.path

        await UserDashboard.update(await data, { transaction: t})

        return {...await UserDashboard.get()}

       }).then(async(data) =>{

        Responser.success(res, "Update User Dashboard Successfully", data)

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
        const UserDashboard = await model.userDashboard.findOne({
            where: { id: req.params.id },
        });

        if(UserDashboard) {
          Responser.success(res, "Get User Dashboard Successfully", banner)
        } else {
          Responser.error(res, "User Dashboard Not Found")
        }
    } catch(error) {
        log.error(error)
        Responser.error(res, error.message || "Error", error)
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await model.userDashboard.findOne({
            where: { id: req.params.id },
        }).then(async (userDashboard) => {
            await userDashboard.destroy()

            if(userDashboard) {
              Responser.success(res, "Delete User Dashboard Successfully")
            }
        });
    } catch (error) {
        log.error(error)
        Responser.error(res, error.message || "Error", error)
    }
});


module.exports = router;