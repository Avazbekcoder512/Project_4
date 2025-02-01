const express = require('express')
const { connectDB } = require("./src/database/connect")
const { appRouter } = require('./src/Router/router')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

connectDB()
const app = express()

app.use(cors());

// bodyni pars qilish
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')));

// Cookie parserni o'rnatig
app.use(cookieParser(process.env.COOKIE_PARSER_KEY))

// routerni o'rnatish
appRouter(app)
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}... `);
})