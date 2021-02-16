const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/userModel')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')
const catchAsync = require('../utils/catchAsync')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        return  cb(null, true)
    }
    cb(new AppError('Не изображение! Пожалуйста загружайте только изображения.', 400), false)
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto = (req, res, next) =>{
    if(!req.file) {
        return next()
    }

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/img/users/${req.file.filename}`)

    next()
}

const filterObj = (obj, ...fields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if(fields.includes(el)) {
            newObj[el] = obj[el]
        } 
    })
    return newObj
}

exports.getAllUsers = factory.getAll(User)

exports.getUser = factory.getOne(User)

exports.updateMe = catchAsync(async (req, res, next) => {
    //1) Создание ошибки, если пользователь пытается поменять пароль
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This rout is now for password update. Please use "updateMyPassword"', 400))
    }

    //2) Фильтрация нежелаемых данных если они есть
    const filtredBody = filterObj(req.body, 'name', 'email')
    
    // Если есть файл (фото), добавляем его в отфильтрованное тело
    if(req.file) {
        filtredBody.photo = req.file.filename
    }
    
    //3) Обновление документа пользователя
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filtredBody, {new: true, runValidators: true})

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async (req, res, next)=> {
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

exports.followUser = catchAsync(async (req, res, next) => {
   // Пользователь не может подписаться на себя
    if (req.user.id === req.params.id) {
        return next(new AppError('Вы не можете подписаться на себя.', 400))
    }

    if(req.user.following.includes(req.params.id)) {
        return next(new AppError('Пользователь находиться в подписках.', 400))
    }

    // Добавление id в массив подписок
    const updated = await User.findByIdAndUpdate(req.user.id, {
        $push: {
            following: req.params.id
        }
    }, { new: true})


    // Добавление пользователя в массив подписчиков
    const secondUpdated = await User.findByIdAndUpdate(req.params.id, {
        $push: {
            followers: req.user.id
        }
    }, { new: true})

    if (!updated || !secondUpdated) {
        return next(new AppError('Вы не можете подписаться на этого пользователя.', 400))
    }

    res.status(200).json({
        status: 'success',
        data: updated
    })
})

exports.unfollowUser = catchAsync(async (req, res, next) => {
    // Проверка на наличие пользователя в подписках
    if(!req.user.following.includes(req.params.id)) {
        return next(new AppError('Пользователь не находиться в подписках.', 400))
    }

    // Добавление id в массив подписок
    const updated = await User.findByIdAndUpdate(req.user.id, {
        $pull: {
            following: req.params.id
        }
    }, { new: true})


    // Добавление пользователя в массив подписчиков
    const secondUpdated = await User.findByIdAndUpdate(req.params.id, {
        $pull: {
            followers: req.user.id
        }
    }, { new: true})

    if (!updated || !secondUpdated) {
        return next(new AppError('Вы не можете отписаться от этого пользователя.', 400))
    }

    res.status(200).json({
        status: 'success',
        data: updated
    })
})

exports.updateUser = factory.updateOne(User)

exports.deleteUser = factory.deleteOne(User)
