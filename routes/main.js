const { Router } = require('express')
const { homePage } = require('../controllers/main')
const router = Router()

router.get('/', homePage)

router.get('/about', (req, res) => res.render('about', { title: 'About Page' }))

router.get('/features', (req, res) => res.render('features', { title: 'Our Features' }))

router.get('/contact', (req, res) => res.render('contact', { title: 'Contact Us' }))

module.exports = router