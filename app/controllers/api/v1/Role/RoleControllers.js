const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Validator = require(appDir + '/app/validation/Role/RoleValidations');
const { keycloakRestrict } = require(appDir + '/app/middleware/keycloakRestrict');
const { Op } = require("sequelize");

router.use(libKeycloak.protect());
router.use(keycloakRestrict);

router.get("/", async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    
    var search = {}
    if (req.query.dashboard_id) {
      search["dashboard_id"] = {
          [Op.in]:req.query.dashboard_id.split(",")
      };
    }       
    if (req.query.search) {
      search[Op.or] = {
          '$name$' : {
           [Op.like] : `%${req.query.search}%`
          },
          "$description$" : {
           [Op.like] : `%${req.query.search}%`
          }
        }
    }
    if (req.query.status) {
      search["status"] = req.query.status;
    }


    var options = {
      where: search,
      attributes: ["id","name","description","dashboard_id","status"],
      page: page < 1 ? 1 : page,
      paginate: per_page,
      order: [["id", "desc"]],

    };

    const { docs, pages, total } = await model.role.paginate(options);

    if (docs) {
        let result = {
          data: await docs,
          currentPage: page,
          nextPage: page >= pages ? false : page + 1,
          totalItems: total,
          totalPages: pages,
        }

      Responser.success(res, "Get Role Successfully", result)
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

          const Role= await model.role.create(req.body, {transaction: t});
          
          return Role
        }).then(async(Role)=>{
            Responser.success(res, "Create Role Successfully", Role)
        })
        

    } catch (error) {
        console.log(error);
        Responser.error(res, error.message || "Error", error)
    }
});

router.patch('/:id', Validator.update, async (req, res, next) => {
    try {

      await model.sequelize.transaction(async (t) => {
        const role = await model.role.findOne({where: {id: req.params.id}})
        if(!role) {
          throw Error("Role Not Found");
        }

        let data = { 
          name: req.body.name || role.name, 
          description: req.body.description || role.description,
          status: req.body.status || role.status,
          dashboard_id: req.body.dashboard_id || role.dashboard_id,
        }

        await role.update(await data, { transaction: t})

        return {...await role.get()}

       }).then(async(data) =>{

        Responser.success(res, "Update Role Successfully", data)

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
        const role = await model.role.findOne({
            where: { id: req.params.id },
        });

        if(role) {
          Responser.success(res, "Get role Successfully", role)
        } else {
          Responser.error(res, "role Not Found")
        }
    } catch(error) {
        log.error(error)
        Responser.error(res, error.message || "Error", error)
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await model.role.findOne({
            where: { id: req.params.id },
        }).then(async (role) => {
            await role.destroy()

            if(role) {
              Responser.success(res, "Delete Role Successfully")
            }
        });
    } catch (error) {
        log.error(error)
        Responser.error(res, error.message || "Error", error)
    }
});

router.patch('/:id/status', Validator.status, async (req, res, next) => {
  try {

    await model.sequelize.transaction(async (t) => {
      const role = await model.role.findOne({where: {id: req.params.id}})
      if(!role) {
        throw Error("role Not Found");
      }

      await role.update({status: req.body.status}, { transaction: t})

      return {...await role.get()}

     }).then(async(data) =>{

      Responser.success(res, "Update Status Role Berhasil", data)

    }).catch((err) =>{
      throw Error(err.message);
    })

  } catch (error) {
      console.log(error);
      Responser.error(res, error.message || "Error", error)
  }
});


module.exports = router;