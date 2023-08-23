const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var fs = require('fs');
const { Op } = require("sequelize");
const { query } = require('express');
const { keycloakRestrict } = require(appDir + '/app/middleware/keycloakRestrict');

router.use(libKeycloak.protect());
router.use(keycloakRestrict);

const column = [
    "id", "role", "def_project", "koor_id", "position"
  ];

// Get All Data
router.get("/", async (req, res, next) => {
    try {

        var search = {}
        if (req.query.list_asign) {
            search["role"] = {[Op.not]:'superadmin'};
        }
        if (req.query.role) {
            search["role"] = req.query.role;
        }
        if (req.query.project_id) {
            search["project_id"] = req.query.project_id;
        }
        if (req.query.position) {
            search["position"] = req.query.position;
        }
        if (req.query.search) {
            search2[Op.or] = {
                '$profile.email$' : {
                 [Op.like] : `%${req.query.search}%`
                },
                "$profile.phone$" : {
                 [Op.like] : `%${req.query.search}%`
                },
                "$profile.full_name$" : {
                 [Op.like] : `%${req.query.search}%`
                },
                "$profile.first_name$" : {
                 [Op.like] : `%${req.query.search}%`
                },
                "$profile.last_name$" : {
                 [Op.like] : `%${req.query.search}%`
                },
              }
        }

        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;

        var options = {
            where: search,
            attributes: column,
            page: page < 1 ? 1 : page,
            paginate: per_page,
            order: [["id", "desc"]],
            include: [{
                model: model.profile,
                as: 'profile',
            }]
        };

        const { docs, pages, total } = await model.user.paginate(options);
        if (docs) {
        res.status(200).json({
            status: "success",
            message: "Berhasil",
            result: {
            data: await docs,
            currentPage: page,
            nextPage: page >= pages ? false : page + 1,
            totalItems: total,
            totalPages: pages,
            },
        });
        }
    } catch (error) {
        log.error(error)
        res.status(400).json({
            status: "error",
            message: error.name || error,
            result:null,
            error: error,
        });
    }
});


// Get Data By ID
router.get("/:id", async (req, res, next) => {
    try {

        var options = {
            where: {id: req.params.id},
            order: [["id", "desc"]],
            attributes: ["id", "role", "def_project", "position"],
            include: [{
                model: model.profile,
                as: 'profile',
                attributes: ["id", "email", "phone", "first_name", "last_name", "full_name", "address", "photo", "photo_url"]
            },{
                model: model.user,
                as: 'koordinator',
                attributes: ["id", "role", "position"],
                include: [{
                    model: model.profile,
                    as: 'profile',
                    attributes: ["id", "email", "phone", "first_name", "last_name", "full_name", "address", "photo", "photo_url"]
                }]
            }]
        };

        const user = await model.user.findOne(options).then(async (user) => {
            var new_user = user.toJSON();
            const project = await model.project_user.findAll({
                where: {
                    user_id:  req.params.id
                },
                include: [{
                    model: model.project,
                    as: 'project',
                }],
                order: [["id", "desc"]]
            }).then(project_user => 
                project_user.map(function(prj) {
                    return {
                        id : prj.project.id,
                        name : prj.project.name,
                        default : prj.project.id==user.def_project?true:false
                    }
                })
            );
            new_user.project = project;
            return new_user
        })        

        if (user) {
            res.status(200).json({
                status: "success",
                message: "Berhasil",
                result: {
                    data: await user
                },
            });
        }
    } catch (error) {
        log.error(error)
        res.status(400).json({
            status: "error",
            message: error.name || error,
            result:null,
            error: error,
        });
    }
});


// Delete
router.delete("/:id", async (req, res, next) => {
    try {
        const id = await req.params.id;
        await model.user.destroy({
            where: {
                id: id,
            },
            individualHooks: true
        })
        .then(function(entries) {
            if (entries == 1) {
                res.status(200).json({
                    status: "success",
                    message: "Berhasil",
                    result: null,
                });
            } else {
                res.status(200).json({
                    status: "error",
                    message: "data not found",
                    result: null,
                    error: [{
                        "msg": "failed to delete ID " + req.params.id
                    }],
                });
            }
        });
      } catch (error) {
          log.error(error)
          res.status(400).json({
              status: "error",
              message: error.name || error,
              result: null,
              error: error,
          });
      }
});

module.exports = router;