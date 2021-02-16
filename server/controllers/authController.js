const {promisify} = require('util')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')

//Создает токен
const singToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

//Отправляет res вместе с токеном
const sendToken = (user, statusCode, res) => {
    const token = singToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true
    }
    res.cookie('jwt', token, cookieOptions)
    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token, 
        data: {
            user: user
        }
    })
}

exports.singup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    sendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next)=>{
    const {email, password} = req.body

    //1) Проверка на существование email и password?
    if(!email || !password) {
       return next(new AppError('Пожалуйста введите email и пароль', 400))
    }
    //2) Проверка на существование пользователя и верность введенного пароля...
    const user = await User.findOne({email}).select('+password')

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Введены неверный email или пароль', 401))
    }

    //3) Если все в порядке отправка данных и токена пользователю
    sendToken(user, 200, res)
})

exports.logout =  (req, res, next) => {
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        status: 'success'
    })
}

exports.protect = catchAsync(async (req, res, next)=> {
    //1) Получение и проверка на существование токена
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if(!token) {
        return next(new AppError('Вы не авторизированы, пожалуйста авторизуйтесь и попробуйте снова.', 401))
    }

    //2) Проверка токена
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    console.log(decoded)
    //3) Проверка на существование пользователя 
    const currentUser = await User.findById(decoded.id)

    if(!currentUser) {
        return next(new AppError('Пользователь не существует.', 401))
    }
    //4) Проверка был ли изменен пароль после создания токена.
    if(await currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('Вы недавно изменили пароль, пожалуйста авторизуйтесь снова.', 401))
    }

    //Получение доступа к защищенному пути
    req.user = currentUser
    res.user = currentUser  
    next()
})

exports.isLoggedIn = async (req, res, next)=> {
    if (req.cookies.jwt) {
        try {
            //1) Проверка токена
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

            //2) Проверка на существование пользователя
            const currentUser = await User.findById(decoded.id)
            if(!currentUser) {
                return next()
            }

            //4) Проверка был ли изменен пароль после создания токена.
            if(await currentUser.changePasswordAfter(decoded.iat)) {
                return next()
            }

            res.user = currentUser  
            
            return next() 
        } catch (err) {
            return next()
        }
    }
    next()
}

exports.authMe = catchAsync(async (req, res, next) => {
    if(!res.user) {
        return next(new AppError('Вы не авторизованы, пожалуйста войдите в свой аккаунт.', 401))
    }
    res.status(200).json({
        status: "success",
        data: {
            user: res.user
        }
    })
})


exports.restrictTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('У вас нет разрешения для этого действия!', 403))
        }
        next()
    })
}

exports.updatePassword = catchAsync(async (req, res, next)=> {
    //1) Получение пользвоателя из БД
    const user = await User.findById(req.user.id).select('+password')

    //2) Проверка на правильность отправленного пароля
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Пароль неверный', 401))
    }

    //3) Если все ОК установка нового пароля
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    //4) Отправка данных
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1) Получение пользователя по email из POST запроса.
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return next('Пользователь не существует', 404)
    }

    //2) Генерация ресет токена.
    const resetToken = await user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})

    //3) Отправка на email пользователя.
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message = `Забыли пароль? Перейдите по ссылке: ${resetURL}. 
    \nЕсли это были не вы проигнорируйте сообщение.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Ваша ссылка на восстановление пароля (действительна 10 мин).',
            message
        })
    
        res.status(200).json({
            status: 'success',
            message: 'Токен отправлен!'
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({validateBeforeSave: false})

        return next(new AppError('Произошла ошибка во время отправки email, попробуйте позже.', 500))
    }
    
})
exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) Получить пользователя по токену
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gte: Date.now()}})

    //2) если пользователь существует и токен не устарел, уставновка новго пароля
    if(!user) {
        return next(new AppError('Токен неверный или устаревший.', 400))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.resetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()

    //3) Обновление changedPasswordAt свойства для пользователя.

    //4) Отправка куки авторизации
    sendToken(user, 200, res)
})