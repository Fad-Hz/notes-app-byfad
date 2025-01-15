const { Router } = require('express')
const { signup, renderSignUp, logout, login, renderLoginPage } = require('../controllers/auth')
const router = Router()

router.get('/signup', renderSignUp)
router.post('/signup', signup)

router.get('/login', renderLoginPage)
router.post('/login', login)

router.post('/logout', logout)


module.exports = router