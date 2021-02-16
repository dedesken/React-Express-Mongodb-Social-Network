const mongoose = require("mongoose")

const messagesSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, 'Review must contain some text.'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    from: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Сообщение должно пренадлежать пользователю.']
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Сообщение должно быть отправленно пользователю.']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//Индексирование полей from и to для ускорения поиска...
messagesSchema.index({ from:1, to: 1 })

//Добавление полей 'name' и 'photo' из документа User по ObjectId
messagesSchema.pre(/^find/, function(next){
    this.populate({
        path: 'from',
        select: 'name photo'
    })
    next()
})

const Message = mongoose.model('Message', messagesSchema)

module.exports = Message