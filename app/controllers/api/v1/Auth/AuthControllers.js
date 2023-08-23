const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
var fs = require('fs');
const { check, validationResult } = require('express-validator');
const Validator = require(appDir + '/app/validation/Auth/AuthValidations');

router.post('/token', Validator.Login, async(req, res, next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                code: 40,
                status: "error",
                message: (errors['errors'][0].param+" "+errors['errors'][0].msg),
                result: errors['errors'],
            });
        }

        var data = req.body
        var user = await verifyuser(data.username, data.password)
        
        if(user.status == true ){
            data = {
                type: "user",
                role: user.role,
                id: user.id
            }
            var cert = fs.readFileSync(appDir + '/config/key/private.key');
            var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (1440 * 60), data: data }, cert, { algorithm: 'RS512' });
            
            var options = {
                where: {id: user.id},
                order: [["id", "desc"]],
                attributes: ["id", "role"],
                include: [{
                    model: model.profile,
                    as: 'profile',
                    attributes: ["id", "email", "phone", "first_name", "last_name", "full_name", "address"]
                }]
            };

            const userDet = await model.user.findOne(options)

            res.status(200).json({
                status: 'success',
                message: 'Successfully',
                result: {
                    token : token,
                    user : await userDet
                }
            });
        }else{
            res.status(200).json({
                status: 'error',
                message: user.message,
                result: null
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            code: 40,
            status: "error",
            message: error.name,
            result:error,
        });
    }
});


router.post('/token/client', Validator.TokenClient, async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                code: 40,
                status: "error",
                message: (errors['errors'][0].param+" "+errors['errors'][0].msg),
                result: errors['errors'],
            });
        }

        var data = req.body
        var client = await verifyclient(data.client_id, data.client_secret);
        
        if(client.status == true){
            data = {
                type: "client_credential",
                id: client.id
            }
            var cert = fs.readFileSync(appDir + '/config/key/private.key');
            var exp = Math.floor(Date.now() / 1000) + (4320 * 60)
            var token = jwt.sign({ exp: exp, data: data }, cert, { algorithm: 'RS512' });
        
            res.status(200).json({
                status: 'success',
                message: 'Successfully',
                result: {
                    token: token,
                    exp: exp
                }
            });
        }else{
            res.status(200).json({
                status: 'error',
                message: 'Unauthorized',
                result: [
                    { msg: 'client credential not register'}
                ],
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            code: 40,
            status: "error",
            message: error.name,
            result:error,
        });
    }
    

});

router.post('/register', Validator.Register, async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
            code: 40,
            status: "error",
            message: (errors['errors'][0].param+" "+errors['errors'][0].msg),
            result: errors['errors'],
            });
        }

        const data = await LibUsers.createUser(req.body);

        res.status(200).json({
            code: 1,
            status: 'success',
            message: 'Successfully',
            result: await data
        });

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            code: 40,
            status: "error",
            message: error.name,
            result:error,
        });
    }

});


router.post('/token/client/create', Validator.TokenCreate, async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                code: 40,
                status: "error",
                message: (errors['errors'][0].param+" "+errors['errors'][0].msg),
                result: errors['errors'],
            });
        }

        const oauth_credential = await generateClient('client', req.body.app_name)

        if (oauth_credential.status) {
            res.status(200).json({
                status: 'success',
                message: 'Successfully',
                result: oauth_credential.data
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(200).json({
            code: 40,
            status: "error",
            message: error.name,
            result:error,
        });
    }

});

router.get('/auth', Validator.Auth, (req, res, next) => {
    try {
        var cert_public = fs.readFileSync(appDir + '/config/key/public.key');
        var token = req.query.token;
        jwt.verify(token, cert_public, { algorithms: ['RS512'] }, async function (err, payload) {
            if (!err) {

                if(payload.data.type=="user"){
                    payload.data.user =  await model.user.findOne({
                        where: {id: payload.data.id},
                        include: [{
                            model: model.profile,
                            as: 'profile',
                        }]
                    }) 
                }

                res.status(200).json({
                    status: 'success',
                    message: 'Successfully',
                    result: payload,
                });
            } else {
                res.status(200).json({
                    status: 'error',
                    message: 'Unauthorized',
                    result: {msg: err}
                });
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            code: 40,
            status: "error",
            message: error.name,
            result:error,
        });
    }
});


var verifyclient = async(client_id, client_credential) => {
    const client = await model.oauth_credential.findOne({ 
                    where: { 
                        client_id: client_id,
                        client_secret: client_credential 
                    }});

    if(client === null){
        return { message: 'client credential terdaftar', status: false}
    }else{
        return { message: 'Berhasil Login', status: true, id: client.id }
    }

}

var verifyuser = async(username, password) => {
    const user = await model.user.findOne({ 
                    where: { username: username }});

    if(user === null){
        return { message: 'User tidak terdaftar', status: false}
    }else{
        if (decrypt(user.password) == password){
            return { message: 'Berhasil Login', status: true, id: user.id, role: user.role }
        }else{
            return { message: 'Password salah', status: false }
        }
    }

}

var generateClient = async(provider, attr, transaction) => {
    try {
        var oauth_data;
        const rsdp = Math.floor(Date.now() / 1000) + (60 * 60) + Math.floor(Math.random() * Math.floor(1000))

        if(provider == 'client'){
            oauth_data = {
                app_name: attr,
                client_id: encrypt(rsdp),
                client_secret: encrypt(rsdp),
                provider: provider
            }
        }else{
            oauth_data = {
                user_id: attr,
                client_id: encrypt(rsdp),
                client_secret: encrypt(rsdp),
                provider: provider
            }
        }

        const oauth_credential = await model.oauth_credential.create(oauth_data, {transaction: transaction});

        if(oauth_credential){
            return { message: 'Berhasil membuat oauth credential', status: true, data: oauth_credential }
        }else{
            return { message: 'Gagal membuat oauth credential', status: false }
        }
    } catch (error) {
        console.error(error);
        return { message: 'Gagal membuat oauth credential', status: false }
    }
    
}


module.exports = router;