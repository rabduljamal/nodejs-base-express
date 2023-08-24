const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const Validator = require(appDir + '/app/validation/Banner/BannerValidations');
const repBanner = require(appDir + '/app/repository/Banner/Banner');


router.get("/", async (req, res, next) => {

  repBanner.get(req, res, (data, error) =>{
    if(!error){
      Responser.success(res, "Get Banner Successfully", data)
    }else{
      Responser.error(res, "Error Get Banner", error)
    }
  })

});

router.post('/', Validator.create, async(req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Responser.error(res, errors['errors'][0].param+" "+errors['errors'][0].msg, errors['errors'])
  }

  repBanner.create(req, res, (data, error) =>{
    if(!error){
      Responser.success(res, "Create Banner Successfully", data)
    }else{
      Responser.error(res, "Error Create Banner", error)
    }
  })

});

router.patch('/:id', Validator.update, async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Responser.error(res, errors['errors'][0].param+" "+errors['errors'][0].msg, errors['errors'])
  }

  repBanner.patch(req, res, (data, error) =>{
    if(!error){
      Responser.success(res, "Update Banner Successfully", data)
    }else{
      Responser.error(res, "Error Update Banner", error)
    }
  })

});


router.get("/:id", async (req, res, next) => {

  repBanner.getById(req, res, (data, error) =>{
    if(!error){
      Responser.success(res, "Get Banner Successfully", data)
    }else{
      Responser.error(res, "Error Get Banner", error)
    }
  })

});

router.delete("/:id", async (req, res, next) => {

  repBanner.destroy(req, res, (data, error) =>{
    if(!error){
      Responser.success(res, "Delete Banner Successfully", data)
    }else{
      Responser.error(res, "Error Delete Banner", error)
    }
  })
});


module.exports = router;