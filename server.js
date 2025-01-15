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
    secret: process.env.SESSION_SECRET || 'default_secret', // Simpan `SESSION_SECRET` di .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Amankan cookie di production
}))

app.use((req, res, next) => {
    if (req.session && req.session.userId && req.session.user) {
        // Jika user sudah login, simpan data user di res.locals
        res.locals.user = req.session.user;
    } else {
        // Jika belum login, set res.locals.user ke null
        res.locals.user = null;
    }
    // Lanjutkan ke middleware berikutnya
    next();
});

app.use((req, res, next) => {
    // Pastikan user sudah disimpan dalam sesi sebelum diakses
    res.locals.user = req.session.user || null; // Untuk membuat data user tersedia di view
    next();
});

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