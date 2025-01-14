const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

exports.connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_TOKEN)
    .then(console.log('Mongodb connected'))
    .catch(error => console.log(error))
}