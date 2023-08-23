const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Validator = require(appDir + '/app/validation/Dashboard/DashboardValidations');
const { Op } = require("sequelize");
const { keycloakRestrict } = require(appDir + '/app/middleware/keycloakRestrict');

router.use(libKeycloak.protect());
router.use(keycloakRestrict);

router.get("/", async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;

        var search = {}        
        var search_province = {}        
        var search_city = {}        
        var search_district = {}        
        var search_subdistrict = {}   

        if (req.query.search) {
            search["title"] = { [Op.like]: "%" + req.query.search + "%" };
        }
        // if (req.query.province) {
        //     search["provinces"] = {
        //         [Op.in]:req.query.province.split(",")
        //     };
        // }
        if (req.query.status) {
            search["status"] = req.query.status;
        }
        if (req.query.province_id) {
            search_province["id"] = {
                [Op.in]:req.query.province_id.split(",")
            };
        }
        
        if (req.query.city_id) {
            search_city["id"] = {
                [Op.in]:req.query.city_id.split(",")
            };
        }
        if (req.query.district_id) {
            search_district["id"] = {
                [Op.in]:req.query.district_id.split(",")
            };
        }
        if (req.query.subdistrict_id) {
            search_subdistrict["id"] = {
                [Op.in]:req.query.subdistrict_id.split(",")
            };
        }

        var options = {
            where: search,
            attributes: ["id","title","headline","wildcard","logo","logo_url","emblem","emblem_url","tema","provinces","cities","districts","subdistricts","status","mastermenu_id"],
            page: page < 1 ? 1 : page,
            paginate: per_page,
            order: [["id", "desc"]],
            include: [{
                model: model.province, 
                as : "province", 
                attributes: ["id","name","code","code_2022"],
                where: search_province,
                required: false
            },{
                model: model.city, 
                as : "city", 
                attributes: ["id","province_id","type","name","code","code_2022","area","population"],
                where: search_city,
                required: false
            },{
                model: model.district, 
                as : "district", 
                attributes: ["id","city_id","name","code","code_2022"],
                where: search_district,
                required: false
            },{
                model: model.subdistrict, 
                as : "subdistrict", 
                attributes: ["id","district_id","name","code","code_2022","area","lat","long"],
                where: search_subdistrict,
                required: false
            }]
        };

        const { docs, pages, total } = await model.dashboard.paginate(options);

        if (docs) {
            let result = {
            data: await docs,
            currentPage: page,
            nextPage: page >= pages ? false : page + 1,
            totalItems: total,
            totalPages: pages,
            }

        Responser.success(res, "Get Dashboard Successfully", result)
        }
    } catch (error) {
        log.error(error)
        Responser.error(res, "Get Data Dashboard Gagal" || "Error", error.name)
    }
});

router.post('/', Validator.create, async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return Responser.error(res, errors['errors'][0].param+" "+errors['errors'][0].msg, errors['errors'])
        }

        return await model.sequelize.transaction(async (t) => {
            const Dashboard= await model.dashboard.create(req.body, {transaction: t});

            if(req.body.provinces){
                var provinces = req.body.provinces.split(",")
                await provinces.map(async(province)=>{
                    await model.dashboard_province.create({ province_id: province, dashboard_id: Dashboard.id });
                })
            }

            if(req.body.cities){
                var cities = req.body.cities.split(",")
                await cities.map(async(city)=>{
                    await model.dashboard_city.create({ city_id: city, dashboard_id: Dashboard.id });
                })
            }

            if(req.body.districts){
                var districts = req.body.districts.split(",")
                await districts.map(async(district)=>{
                    await model.dashboard_district.create({ district_id: district, dashboard_id: Dashboard.id });
                })
            }

            if(req.body.subdistricts){
                var subdistricts = req.body.subdistricts.split(",")
                await subdistricts.map(async(subdistrict)=>{
                    await model.dashboard_subdistrict.create({ subdistrict_id: subdistrict, dashboard_id: Dashboard.id });
                })
            }

          if(req.body.logo){
            const logo = await s3minio.uploadFile(req.body.logo, 'dashboard', UUID('dashboard'));

            await Dashboard.update(
            {
              logo: await logo.path 
            },{
                transaction: t,
                returning: true, 
                plain: true 
            }).then((data, err) => {
                console.log(data);
            })
          }
          if(req.body.emblem){
            const emblem = await s3minio.uploadFile(req.body.emblem, 'dashboard', UUID('dashboard'));

            await Dashboard.update(
            {
              emblem: await emblem.path 
            },{
                transaction: t,
                returning: true, 
                plain: true 
            }).then((data, err) => {
                console.log(data);
            })
          }
          
          return Dashboard
        }).then(async(Dashboard)=>{
            Responser.success(res, "Create Dashboard Successfully", Dashboard)
        })
        

    } catch (error) {
        console.log(error);
        Responser.error(res, error.message || "Error", error)
    }
});

router.patch('/:id', Validator.update, async (req, res, next) => {
    try {

      await model.sequelize.transaction(async (t) => {
        const dashboard = await model.dashboard.findOne({where: {id: req.params.id}})
        if(!dashboard) {
          throw Error("Dashboard Not Found");
        }
        
        let data = { 
            title: req.body.title || dashboard.title, 
            headline: req.body.headline || dashboard.headline, 
            wildcard: req.body.wildcard || dashboard.wildcard, 
            logo: req.body.logo || dashboard.logo, 
            emblem: req.body.emblem || dashboard.emblem, 
            tema: req.body.tema || dashboard.tema, 
            provinces: req.body.provinces || dashboard.provinces, 
            cities: req.body.cities || dashboard.cities, 
            districts: req.body.districts || dashboard.districts, 
            subdistricts: req.body.subdistricts || dashboard.subdistricts, 
            status: req.body.status || dashboard.status,
            mastermenu_id: req.body.mastermenu_id || dashboard.mastermenu_id,
        }

        var tmplogo = (req.body.logo) ? await s3minio.uploadFile(req.body.logo, 'dashboard', UUID('dashboard')) : dashboard.logo;
        
        data.logo = await tmplogo.path

        var tmpemblem = (req.body.emblem) ? await s3minio.uploadFile(req.body.emblem, 'dashboard', UUID('dashboard')) : dashboard.emblem;
        
        data.emblem = await tmpemblem.path
        
        await dashboard.update(await data, { transaction: t})

        if(req.body.provinces){
            const dashboard_province = await model.dashboard_province.findAll({where: {dashboard_id: req.params.id}})
            await dashboard_province.forEach(async(province) => {
                await model.dashboard_province.findOne({
                    where: { id: province.id },
                }).then(async (dashboard_province) => {
                    await dashboard_province.destroy({force: true})
                });
            });
            var provinces = req.body.provinces.split(",")
            await provinces.map(async(province)=>{
                await model.dashboard_province.create({ province_id: province, dashboard_id: req.params.id });
            })
        }

        if(req.body.cities){
            const dashboard_city = await model.dashboard_city.findAll({where: {dashboard_id: req.params.id}})
            await dashboard_city.forEach(async(city) => {
                await model.dashboard_city.findOne({
                    where: { id: city.id },
                }).then(async (dashboard_city) => {
                    await dashboard_city.destroy({force: true})
                });
            });
            var cities = req.body.cities.split(",")
            await cities.map(async(city)=>{
                await model.dashboard_city.create({ city_id: city, dashboard_id: req.params.id });
            })
        }

        if(req.body.districts){
            const dashboard_district = await model.dashboard_district.findAll({where: {dashboard_id: req.params.id}})
            await dashboard_district.forEach(async(district) => {
                await model.dashboard_district.findOne({
                    where: { id: district.id },
                }).then(async (dashboard_district) => {
                    await dashboard_district.destroy({force: true})
                });
            });
            var districts = req.body.districts.split(",")
            await districts.map(async(district)=>{
                await model.dashboard_district.create({ district_id: district, dashboard_id: req.params.id });
            })
        }

        if(req.body.subdistricts){
            const dashboard_subdistrict = await model.dashboard_subdistrict.findAll({where: {dashboard_id: req.params.id}})
            await dashboard_subdistrict.forEach(async(subdistrict) => {
                await model.dashboard_subdistrict.findOne({
                    where: { id: subdistrict.id },
                }).then(async (dashboard_subdistrict) => {
                    await dashboard_subdistrict.destroy({force: true})
                });
            });
            var subdistricts = req.body.subdistricts.split(",")
            await subdistricts.map(async(subdistrict)=>{
                await model.dashboard_subdistrict.create({ subdistrict_id: subdistrict, dashboard_id: req.params.id });
            })
        }

        return {...await dashboard.get()}

       }).then(async(data) =>{

        Responser.success(res, "Update Dashboard Successfully", data)

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
        const dashboard = await model.dashboard.findOne({
            where: { id: req.params.id },
            include: [{
                model: model.province, 
                as : "province", 
                attributes: ["id","name","code","code_2022"],
                required: false
            },{
                model: model.city, 
                as : "city", 
                attributes: ["id","province_id","type","name","code","code_2022","area","population"],
                required: false
            },{
                model: model.district, 
                as : "district", 
                attributes: ["id","city_id","name","code","code_2022"],
                required: false
            },{
                model: model.subdistrict, 
                as : "subdistrict", 
                attributes: ["id","district_id","name","code","code_2022","area","lat","long"],
                required: false
            }]
        });

        if(dashboard) {
          Responser.success(res, "Get Dashboard Successfully", dashboard)
        } else {
          Responser.error(res, "Dashboard Not Found")
        }
    } catch(error) {
        log.error(error)
        Responser.error(res, error.message || "Error", error)
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await model.dashboard.findOne({
            where: { id: req.params.id },
        }).then(async (dashboard) => {
            await dashboard.destroy()

            if(dashboard) {
              Responser.success(res, "Delete Dashboard Successfully")
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
        const dashboard = await model.dashboard.findOne({where: {id: req.params.id}})
        if(!dashboard) {
          throw Error("Dashboard Not Found");
        }
  
        await dashboard.update({status: req.body.status}, { transaction: t})
  
        return {...await dashboard.get()}
  
       }).then(async(data) =>{
  
        Responser.success(res, "Update Status Dashboard Berhasil", data)
  
      }).catch((err) =>{
        throw Error(err.message);
      })
  
    } catch (error) {
        console.log(error);
        Responser.error(res, error.message || "Error", error)
    }
  });

  router.get("/wildcard/:wildcard", async (req, res, next) => {
    console.log(req.params.wildcard)
    try {
        const dashboard = await model.dashboard.findOne({
            where: { wildcard: req.params.wildcard },
            include: [{
                model: model.province, 
                as : "province", 
                attributes: ["id","name","code","code_2022"],
                required: false
            },{
                model: model.city, 
                as : "city", 
                attributes: ["id","province_id","type","name","code","code_2022","area","population"],
                required: false
            },{
                model: model.district, 
                as : "district", 
                attributes: ["id","city_id","name","code","code_2022"],
                required: false
            },{
                model: model.subdistrict, 
                as : "subdistrict", 
                attributes: ["id","district_id","name","code","code_2022","area","lat","long"],
                required: false
            }]
        });

        if(dashboard) {
          Responser.success(res, "Get Dashboard Successfully", dashboard)
        } else {
          Responser.error(res, "Dashboard Not Found")
        }
    } catch(error) {
        log.error(error)
        Responser.error(res, error.message || "Error", error)
    }
});

module.exports = router;