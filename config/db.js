const { connect } = require('mongoose')
const db = process.env.MONGO_URI
const connectDB = async() => {
    try {
        await connect(db)
        console.log('database terkoneksi')
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = connectDB