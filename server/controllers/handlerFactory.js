const APIFeatures = require("../utils/apiFeatures")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    //404 PAGE NOT FOUND
    if(!doc) {
        return next(new AppError(`Не найден документ с id: ${req.params.id}`, 404))
     }

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.updateOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    //404 PAGE NOT FOUND
    if(!doc) {
        return next(new AppError(`Не найден документ с id: ${req.params.id}`, 404))
     }

    res.status(200).json({
        status: 'success',
        data: doc
    })
})

exports.createOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)

    res.status(201).json({
        status: 'success',
        data: doc
    })
})

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)

    if(populateOptions) {
        query = query.populate(populateOptions)
    }

    const doc = await query

    //404 PAGE NOT FOUND
    if(!doc) {
        return next(new AppError(`Не найден документ с id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        status: 'success',
        data: doc
    })
})

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
    let filter = {}

    const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

    const doc = await features.query
    
    res.status(200).json({
        status: 'success',
        data: doc
    })
})