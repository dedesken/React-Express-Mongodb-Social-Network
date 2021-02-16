//Для уменьшения try/catch блоков внутри async functions

module.exports = (fn) => {
    return (req, res, next) =>{
        fn(req, res, next).catch(err => next(err))
    }
}