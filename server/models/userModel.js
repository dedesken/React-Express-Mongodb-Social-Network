const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Пользователь должен иметь имя!'],
        maxlength: [20, 'Имя должно иметь менее 20 символов!'],
        minlength: [4, 'Имя должно иметь 4 и более символов!']
    },
    email: {
        type: String,
        required: [true, 'Пользователь должен иметь email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Неправильный email адрес!']
    }, 
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Пользователь должен иметь пароль!'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Подтвердите пароль!'],
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: 'Пароли не совпадают!'
        }
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    following: [{ 
        type: mongoose.Schema.ObjectId, 
        ref: 'User' 
    }],
    followers: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    }],
    status: {
        type: String,
        trim: true,
        maxlength: [100, 'Статус должен быть менее 100 символов!']
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

userSchema.virtual('followersCount').get(function() {
    return this.followers.length
})

userSchema.virtual('followingCount').get(function() {
    return this.following.length
})

userSchema.methods.changePasswordAfter = async function(JWTTimeStamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        console.log(changedTimestamp)
        return JWTTimeStamp < changedTimestamp
    }
    return false
}

userSchema.pre('save', async function(next) {
    //Если поле пароля не менялось или не создавалось вызвать следующий middleware
    if(!this.isModified('password')) {
        return next()
    }
    //При создании или модификации пароля перед сохранением в БД используется шифрование
    this.password = await bcrypt.hash(this.password, 12)

    //Удалить поле passwordConfirm
    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password') || this.isNew)  {
        return next()
    }
    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.pre(/^find/, async function(next) {
    //Фильтрация "неактивных" пользователей
    this.find({active: {$ne: false}})
    next()
})

//Метод сравнения используемый при аутентификации пользователя, сравнивает введенный пароль и пароль из БД (с учетом шифрования)
userSchema.methods.correctPassword = async function(candidataPassword, userPassword) {
    return await bcrypt.compare(candidataPassword, userPassword)
}

userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    console.log({resetToken}, this.passwordResetToken)
    
    return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User