class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        //1) Фильтрация
        const queryObj = { ...this.queryString }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])


        //1.2) Улучшеная фильтрация
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
            return `$${ match }`
        })

        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }
    sort() {
        //2) Сотрировка
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }

        return this
    }
    limitFields() {
        //3) Разграничение полей
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }
    paginate() {
        //4) Пагинация
        const page = +this.queryString.page || 1
        const limit = +this.queryString.limit || 10
        const skip = (page - 1) * limit

        this.query = this.query.skip(skip).limit(limit)


        return this
    }
}

module.exports = APIFeatures