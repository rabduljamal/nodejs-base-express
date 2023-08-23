
const SendNotification = async (notif, serviceAccount, app_id) => {
    try {
        var appReady = admin.apps.find(app => app.name == app_id);

        if(!admin.apps.length){
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }else{
            if(appReady){
                admin.app(app_id).delete()
            }

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            }, app_id);
        }

        

        var message = {
            notification: {
                title: notif.title,
                body: notif.message,
            },
            condition: "'all' in topics || 'android' in topics || 'ios' in topics",
        };

        if(notif.imageUrl){
            message = {
                ...message,
                android: {
                    notification: {
                        imageUrl: notif.imageUrl
                    }
                }
            }
        }

        return await model.sequelize.transaction(async (t) => {

            const Notification = await model.notification.create({
                app_id: app_id,
                title: notif.title,
                message: notif.message,
                image: notif.image || null
            }, { transaction: t })

            if(appReady){
                return await admin.app(app_id).messaging()
                    .send(message)
                    .then(async(response) => {
                        console.log('Successfully sent message:', response);
                        return await Notification
                    })
                    .catch((error) => {
                        console.error('Error sending message:', error);
                        throw Error(err);
                    });
            }else{
                return await admin.messaging()
                    .send(message)
                    .then(async(response) => {
                        console.log('Successfully sent message:', response);
                        return await Notification
                    })
                    .catch((error) => {
                        console.error('Error sending message:', error);
                        throw Error(err);
                    });
            }

            
        }).then((data) =>{
            return data
        }).catch((error) => {
            console.log(error);
            throw Error(error);
        })
        
    } catch (error) {
        return error;
    }
}



module.exports = {SendNotification};
