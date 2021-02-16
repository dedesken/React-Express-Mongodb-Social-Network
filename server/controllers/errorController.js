const AppError = require('../utils/appError')

const handleObjectIdErrorDB = (err) => {
    const message = `Неверный ${err.path}: ${err.value}.`

    return new AppError(message, 400)
}

const handleDuplicateFields = (err) => {
    const message = `Имя: "${err.keyValue.email}" уже существует, пожалуйста выберите другое`

    return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Неверное значение поля. ${errors.join('. ')}`

    return new AppError(message, 400)
}

const sendErrorDev = (err, req, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        data: {
            error: err,
            message: err.message,
            stack: err.stack
        }
    })
}

const sendErrorProd = (err, req, res) => {
    //RENDERER WEBSITE
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            title: 'Что-то пошло не так!',
            message: err.message,
        })
    }
    console.error('ERROR: ', err)

    return res.status(500).json({
        status: 'error',
        data: {
            title: 'Что-то пошло не так!',
            message: 'Пожалуйста попробуйте еще раз позже...'
        }
    })
}

const handleWebTokenError = () => {
    return new AppError('Неверный токен, пожалуйста авторизуйтесь снова.', 401)
}

const handleExpireWebToken = () => {
    return new AppError('Неверный токен, пожалуйста авторизуйтесь снова.', 401)
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err}
        error.message = err.message

        if(error.kind === 'ObjectId') {
            error = handleObjectIdErrorDB(error)
        }
        if(error.code === 11000) {
            error = handleDuplicateFields(error)
        }
        if(error._message === "Validation failed") {
            error = handleValidationErrorDB(error)
        }
        if(error.name === 'JsonWebTokenError') {
            error = handleWebTokenError()
        }
        if(error.name === 'TokenExpiredError') {
            error = handleExpireWebToken()
        }

        sendErrorProd(error, req, res)
    }
}