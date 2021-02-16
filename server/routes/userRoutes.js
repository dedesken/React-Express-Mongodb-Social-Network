const express = require('express')

const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const router = express.Router()

//ROUTES
router.post('/singup', authController.singup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/isLoggedIn', authController.isLoggedIn, authController.authMe)

//Protect middleware
router.use(authController.protect)

router.get('/', userController.getAllUsers)

router.delete('/deleteMe', userController.deleteMe)
router.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe)
router.get('/me', userController.getMe, userController.getUser)
router.get('/:id', userController.getUser)

router.patch('/follow/:id', userController.followUser)
router.delete('/follow/:id', userController.unfollowUser)

router.patch('/updateMyPassword', authController.updatePassword)


//Действия только для админа
router.use(authController.restrictTo('admin'))

router.route('/:id')
    .delete(userController.deleteUser)
    .patch(userController.updateUser)

module.exports = router