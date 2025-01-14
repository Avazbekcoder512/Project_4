const express = require('express')
const { connectDB } = require("./src/database/connect")
const { appRouter } = require('./src/Router/router')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

connectDB()
const app = express()

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5173'] // Ruxsat etilgan domenlar
}));

// bodyni pars qilish
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'public')));

// Cookie parserni o'rnatig
app.use(cookieParser(process.env.COOKIE_PARSER_KEY))

// routerni o'rnatish
appRouter(app)

app.listen(3000, () => {
    console.log(`Server is running on Port: 3000... `);
})