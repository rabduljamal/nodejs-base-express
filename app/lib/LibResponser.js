const success = async (res, message='success', result={}) => {
    try {
        
        res.status(200).json({
            status: 'success', 
            message: message,
            result: result
        })

    } catch (error) {
        log.error(error);
    }  
}

const error = async (res, message='error', result={}) => {
    try {
        
        res.status(200).json({
            status: 'error',
            message: message,
            result: result
        })

    } catch (error) {
        log.error(error);
    }  
}

module.exports = {
    success, error
};
