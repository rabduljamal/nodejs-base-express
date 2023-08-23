var jwt = require('jsonwebtoken');
var fs = require('fs');

module.exports = () => {
  return function (req, res, next) {
    const authHeader = req.headers.authorization;
    const cert_public = fs.readFileSync(appDir + '/config/key/public.key');
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, cert_public, { algorithms: ['RS512'] }, function (err, payload) {
            if (err) {
                res.status(200).json({
                    status: 'unauthorize',
                    message: 'unauthorize 200',
                    result: null
                });
            }

            req.current_owner = payload.data;
            
            next();
        });

    } else {
        res.status(200).json({
            status: 'unauthorize',
            message: 'unauthorize 200',
            result: null
        });
    }
  }
}