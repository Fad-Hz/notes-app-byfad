const mongo = 'mongodb+srv://user:dbUserPassword@cluster2.bht3f.mongodb.net/'
const mongoose = require('mongoose')
const connectDB = async() => {
    try {
        await mongoose.connect(mongo)
        console.log('database terkoneksi')
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = connectDB