const { check, validationResult } = require('express-validator');
const  passwordValidator = require('password-validator');

const Login = [
    check('username').isLength({ min: 1 }).withMessage('Not empty'),
    check('password').isLength({ min: 1 }).withMessage('Not empty')
];

const TokenClient = [
    check('client_id').isLength({ min: 1 }).withMessage('Not empty'),
    check('client_secret').isLength({ min: 1 }).withMessage('Not empty')
];

const Register = [
    check('first_name').isLength({ min: 1 }).withMessage('Not empty min 1 char'),
    check('last_name').isLength({ min: 1 }).withMessage('Not empty min 1 char'),
    check('email').notEmpty().isEmail().custom(async (email,{req}) => { 
        const existingUser =  await model.user.findOne({
          where: { username: email },
        }) 
        if (existingUser) { 
            throw new Error('sudah terdaftar') 
        } 
    }),
    check('role').isIn(['superadmin', 'admin', 'user']),
    check('password').notEmpty().custom(async(password, {req})=>{
        var schema = new passwordValidator();
        schema.is().min(8)                                    // Minimum length 8

        if(!schema.validate(password)) {
            throw schema.validate(password, { details: true })
        }
    }),
    check('password_confirmation').notEmpty().custom(async(password_confirmation, {req})=>{
        if(password_confirmation !== req.body.password){
            throw new Error('Password must be same') 
        }
    })

];

const MagicLink = [
    check('email').isEmail().withMessage('harus format email')
];

const TokenCreate = [
    check('app_name').isLength({ min: 3 }).withMessage('Not empty min 4 char'),
];

const Auth = [
    check('token').isLength({ min: 1 }).withMessage('Not empty')
];

module.exports = {
  Login, TokenClient, Register, MagicLink, TokenCreate, Auth,
}