
const STATUS_CODE  = require('../constants/response')

class Response{
    
    Success = (res, message, data) => {
        let status = STATUS_CODE.STATUS_OK;
        return res.status(status).json({
            status,
            message,
            data
        })
    }

    Error = (res, message, data) => {
        let status = STATUS_CODE.STATUS_BAD_REQUEST;
        return res.status(status).json({
            status,
            message,
            data
        })
    }

    Catch = (res, error) => {
        let status = STATUS_CODE.STATUS_INTERNAL_SERVER_ERROR;
        let message = "Internal Server Error";
        return res.status(status).json({
        status,
        message,
        error
        });
    }
}

module.exports = new Response();