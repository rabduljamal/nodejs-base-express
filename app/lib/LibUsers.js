var jwt = require('jsonwebtoken');
var fs = require('fs');
var generator = require('generate-password');

const generatePassword = async() => {
    return generator.generate({
        length: 8,
        numbers: true
    });
}

const generateLink = async(data) => {
    const data_token = {
        type: data.role,
        id: data.id
    }

    var cert = fs.readFileSync(appDir + '/config/key/private.key');
    var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (4320 * 60), data: data_token }, cert, { algorithm: 'RS512' });

    // let file2 = fs.readFileSync(appDir + '/template-email.html', 'utf8')
    // file2 = file2.replace('{{link_login}}', 'https://appsinstant.com/auth/'+token)

    // Mail.SendMail({
    //     to: data.profile.email,
    //     subject: 'Your Account Info',
    //     html: file2
    // });

    return token
}

const generateClient = async(provider, attr, transaction) => {
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

const createUser = async (data_user) => {
    return await model.sequelize.transaction(async (t) => {

        const user = await model.user.create({
            username: data_user.email,
            password: encrypt(data_user.password),
            role: data_user.role,
            profile: {
                email: data_user.email,
                phone: data_user.phone || null,
                first_name: data_user.first_name || '-',
                last_name: data_user.last_name,
                full_name: (data_user.first_name || '-') +' '+ (data_user.last_name || '-'),
                address: (data_user.address || '-'),
            }
        }, {
            transaction: t,
            include: [{
                association: 'profile',
            }]
        })

        const oauth_credential = await generateClient('user', user.id, t)
        
        user.oauth_credential = oauth_credential.data

        const photo = await s3minio.uploadFile(data_user.photo, 'user', UUID('USER'));

        await user.profile.update(
        {
            photo: await photo.path 
        },{
            transaction: t,
            returning: true, 
            plain: true 
        }).then((data, err) => {
            console.log(data);
        })
        
        user.profile.photo = (photo.path) ? await photo.path : null;
        return user
    }).then(async(data)=>{

        generateLink(data);
        
        return await data;
    })
}

module.exports = {
    generatePassword,
    generateClient,
    generateLink,
    createUser
};