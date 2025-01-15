const express = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const { notFound, errorHandler } = require('./middlewares/404and500')
require('dotenv').config()

const app = express()

// Set up EJS as the template engine
app.set('view engine', 'ejs')
app.use(expressEjsLayouts)
app.set('views', './views')
app.set('layout', './layouts/main')

// Set trust proxy for secure cookies behind proxy (e.g., load balancer, reverse proxy)
app.set('trust proxy', 1);

// Configure session middleware
app.use(session({
    secret: 'your-secret-key', // Gantilah dengan secret key yang lebih aman
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Menggunakan secure cookies hanya jika di produksi
        httpOnly: true, // Untuk mencegah akses ke cookie dari JavaScript di browser
        maxAge: 24 * 60 * 60 * 1000, // 1 hari
    }
}));

// Middleware untuk menyimpan data user dalam res.locals agar tersedia di views
app.use((req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;  // Menyimpan user yang login ke res.locals
    } else {
        res.locals.user = null; // Menyeting user sebagai null jika belum login
    }
    next();
});

// Middleware untuk body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files (CSS, JS, Images, etc.)
app.use(express.static('public'))

// Routes
app.use('/', require('./routes/main'))
app.use('/', require('./routes/auth'))
app.use('/dashboard', require('./routes/dashboard'))

// 404 dan error handler
app.use(notFound)
app.use(errorHandler)

// Menjalankan server
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server berjalan di port ${port}`))

// Menghubungkan dengan database
require('./config/db')()
