const Follows = require("../models/followedModel")
const Followers = require("../models/followersModel")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

exports.followUser = catchAsync(async (req, res, next) => {
    // Пользователь не может подписаться на себя
     if (req.user.id === req.params.id) {
         return next(new AppError('Вы не можете подписаться на себя.', 400))
     }

     const followed = await Follows.findById(req.user.following)
 
     if(followed.includes(req.params.id)) {
         return next(new AppError('Пользователь находиться в подписках.', 400))
     }
 
     // Добавление id в массив подписок
     const followedUpdated = await followed.follows.push(req.params.id).save()
 
     // Добавление пользователя в массив подписчиков
     const followersUpdated = await Followers.findByIdAndUpdate(req.params.id, {
         $push: {
             followers: req.user.id
         }
     }, { new: true})
 
     if (!followedUpdated || !followersUpdated) {
         return next(new AppError('Вы не можете подписаться на этого пользователя.', 400))
     }
 
     res.status(200).json({
         status: 'success',
         data: followedUpdated
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