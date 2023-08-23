const express = require('express');
const router = express.Router();
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
    
        const { docs, pages, total } = await model.mastermenu.paginate(options);
    
        if (docs) {
            let result = {
              data: await docs,
              currentPage: page,
              nextPage: page >= pages ? false : page + 1,
              totalItems: total,
              totalPages: pages,
            }
    
          Responser.success(res, "Get Menu Master Successfully", result)
        }
      } catch (error) {
        console.log(error);
        Responser.error(res, error.message || "Error", error)
      }
});

module.exports = router;