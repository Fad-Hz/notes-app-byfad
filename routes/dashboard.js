const { Router } = require('express')
const {
    dashboard,
    createNote,
    getform,
    viewNote,
    updateNote,
    deleteNote,
    renderUpdateForm
} = require('../controllers/dashboard')
const { authMiddleware, adminMiddleware } = require('../middlewares/401and403')
const router = Router()

router.get('/', authMiddleware, dashboard)
router.get('/note-detail/:id', authMiddleware, viewNote)

router.get('/create-note', authMiddleware, adminMiddleware, getform)
router.post('/create-note', authMiddleware, adminMiddleware,  createNote)

router.get('/update-note/:id', authMiddleware, adminMiddleware,  renderUpdateForm)
router.post('/update-note/:id', authMiddleware, adminMiddleware,  updateNote)

router.post('/delete-note/:id', authMiddleware, adminMiddleware, deleteNote)

module.exports = router