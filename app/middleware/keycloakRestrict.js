const keycloakRestrict = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
       return Responser.error(res, 'Access Denied, missing authorization token!')
    }

    try {  
        const kauth = req.kauth.grant?.access_token?.content?.email??null
        if(!kauth){     
            return Responser.error(res, 'Token invalid')  
        }       

        // const user = await module.User.findOne({ email: user, isActive: false }).exec()
        // if (!user) {
        //     return Responser.error(res, 'User tidak terdaftar.')  
        // }

        // req.middleman = user;
        next()
    } catch (error) {
        return Responser.error(res, 'Error Authorization',error)  
      }
};

module.exports = {
    keycloakRestrict
}