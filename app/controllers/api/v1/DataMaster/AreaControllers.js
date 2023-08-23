const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { keycloakRestrict } = require(appDir + '/app/middleware/keycloakRestrict');

router.use(libKeycloak.protect());
router.use(keycloakRestrict);

router.get("/province", async (req, res, next) => {
    try {
        var search = {}        
        if (req.query.search) {
            search["name"] = { [Op.like]: "%" + req.query.search + "%" };
        }     
        if (req.query.code) {
            search[Op.or] = {
                '$code$' : {
                 [Op.like] : `%${req.query.code}%`
                },
                "$code_2022$" : {
                 [Op.like] : `%${req.query.code}%`
                }
              }
        }

        var options = {
            where: search,
            attributes: ["id","name","code","code_2022"],
            order: [["id", "asc"]]
        };

        const docs = await model.province.findAll(options);
        if (docs) {
            Responser.success(res, "Get Data Provinsi Berhasil", docs)
        }
    } catch (error) {
        log.error(error)
        Responser.error(res, "Get Data Provinsi Gagal" || "Error", error.name)
    }
});

router.get("/city", async (req, res, next) => {
    try {
        var search = {}  
        if (req.query.province) {
            search["province_id"] = {
                [Op.in]:req.query.province.split(",")
            };
        }             
        if (req.query.search) {
            search["name"] = { [Op.like]: "%" + req.query.search + "%" };
        }
        if (req.query.code) {
            search[Op.or] = {
                '$code$' : {
                 [Op.like] : `%${req.query.code}%`
                },
                "$code_2022$" : {
                 [Op.like] : `%${req.query.code}%`
                }
              }
        }

        var options = {
            where: search,
            attributes: ["id","province_id","type","name","code","code_2022","area","population"],
            order: [["id", "asc"]]
        };

        const docs = await model.city.findAll(options);
        if (docs) {
            Responser.success(res, "Get Data Kabupaten/Kota Berhasil", docs)
        }
    } catch (error) {
        log.error(error)
        Responser.error(res, "Get Data Kabupaten/Kota Gagal" || "Error", error.name)
    }
});

router.get("/district", async (req, res, next) => {
    try {
        var search = {}       
        if (req.query.city) {
            search["city_id"] = {
                [Op.in]:req.query.city.split(",")
            };
        }      
        if (req.query.search) {
            search["name"] = { [Op.like]: "%" + req.query.search + "%" };
        }
        if (req.query.code) {
            search[Op.or] = {
                '$code$' : {
                 [Op.like] : `%${req.query.code}%`
                },
                "$code_2022$" : {
                 [Op.like] : `%${req.query.code}%`
                }
              }
        }

        var options = {
            where: search,
            attributes: ["id","city_id","name","code","code_2022"],
            order: [["id", "asc"]]
        };

        const docs = await model.district.findAll(options);
        if (docs) {
            Responser.success(res, "Get Data Kecamatan Berhasil", docs)
        }
    } catch (error) {
        log.error(error)
        Responser.error(res, "Get Data Kecamatan Gagal" || "Error", error.name)
    }
});

router.get("/subdistrict", async (req, res, next) => {
    try {
        var search = {}    
        if (req.query.district) {
            search["district_id"] = {
                [Op.in]:req.query.district.split(",")
            };
        }       
        if (req.query.search) {
            search[Op.or] = {
                '$name$' : {
                 [Op.like] : `%${req.query.search}%`
                }
              }
        }
        if (req.query.code) {
            search[Op.or] = {
                '$code$' : {
                 [Op.like] : `%${req.query.code}%`
                },
                "$code_2022$" : {
                 [Op.like] : `%${req.query.code}%`
                }
              }
        }

        var options = {
            where: search,
            attributes: ["id","district_id","name","code","code_2022","area","lat","long"],
            order: [["id", "asc"]]
        };

        const docs = await model.subdistrict.findAll(options);
        if (docs) {
            Responser.success(res, "Get Data Desa Berhasil", docs)
        }
    } catch (error) {
        log.error(error)
        Responser.error(res, "Get Data Desa Gagal" || "Error", error.name)
    }
});

module.exports = router;