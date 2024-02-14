const globalReponse = function (req, res) {
    const commonResponse = {
        data: {},
        message: {},
        error: {},
        timestamp: new Date().toISOString(),
        path: req.path
    }
    if (res.apiResponse.status === 'success') {
        commonResponse.status = true;
        commonResponse.statusCode = 200;
        commonResponse.data = res.apiResponse.data;
    } else {
        commonResponse.statusCode = res.apiResponse.statusCode
        commonResponse.error = res.apiResponse.error
    }
    res.status(commonResponse.statusCode).send(commonResponse)
}

module.exports = globalReponse