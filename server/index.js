const path = require("path");
const dotenv = require("dotenv")
const express = require("express");
const mongoose = require("mongoose")
const morgan = require("morgan");
const cookieParser = require('cookie-parser')
const helmet = require("helmet")
const cors = require("cors")
const globalErrorHandler = require('./controllers/errorController')

const userRouter = require('./routes/userRoutes')

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('DB connected successful!'))

const app = express(); // create express app

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(helmet({contentSecurityPolicy: false}))

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//body парсеры
app.use(express.json({limit: '10kb'}))
app.use(cookieParser())

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

//Routes
app.use('/api/v1/users', userRouter)

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

//Отлов ошибок
app.use(globalErrorHandler)



const port = process.env.PORT || 5000

app.listen(5000, () => {
  console.log(`server started on port ${port}`);
});