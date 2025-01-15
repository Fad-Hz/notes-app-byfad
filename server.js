const express = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const { notFound, errorHandler } = require('./middlewares/404and500')
require('dotenv').config()

const app = express()

app.set('view engine', 'ejs')
app.use(expressEjsLayouts)
app.set('views', './views')
app.set('layout', './layouts/main') 

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}))
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? req.session.user : null
    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/', require('./routes/main'))
app.use('/', require('./routes/auth'))
app.use('/dashboard', require('./routes/dashboard'))

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT
app.listen(port, () => console.log('server berjalan'))
require('./config/db')()