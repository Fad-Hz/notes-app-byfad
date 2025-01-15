const bcrypt = require('bcryptjs')
const User = require('../models/User')

// Signup Controller
exports.signup = async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        if (!fullName || !email || !password) {
            return res.render('signup', {
                title: 'Daftar',
                error: 'Mohon isi semua field!'
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.render('signup', {
                title: 'Daftar',
                error: 'Email sudah terdaftar. Silakan gunakan email lain.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ fullName, email, password: hashedPassword })
        await newUser.save()

        req.session.userId = newUser._id
        res.redirect('/login')
    } catch (error) {
        console.error(error)
        res.render('signup', {
            title: 'Daftar',
            error: 'Terjadi kesalahan. Silakan coba lagi.'
        })
    }
}

exports.renderSignUp = (req, res) => {
    res.render('signup', {
        title: 'Daftar Akun Baru',
        error: null // Untuk menampilkan pesan error jika ada
    })
}

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err)
            return res.redirect('/')
        }
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
}

// POST /login
exports.login = async (req, res) => {
    try {
        // Ambil data dari form login
        const { email, password } = req.body
        if (!email || !password) {
            return res.render('signup', {
                title: 'Daftar',
                error: 'Mohon isi semua field!'
            })
        }

        // Cari user berdasarkan email
        const user = await User.findOne({ email })

        if (!user) {
            // Jika email tidak terdaftar
            return res.render('login', { title: 'Halaman Login', error: 'Email tidak ditemukan' })
        }

        // Cek apakah password cocok
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            // Jika password salah
            return res.render('login', { title: 'Halaman Login', error: 'Password salah!' })
        }

        // Simpan data user ke sesi
        req.session.userId = user._id
        req.session.user = user // Simpan seluruh objek user

        // Arahkan ke halaman beranda atau halaman lain setelah login berhasil
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('login', { title: 'Halaman Login', error: 'Terjadi kesalahan, coba lagi!' })
    }
}

exports.renderLoginPage = (req, res) => {
    // Render halaman login jika belum login
    res.render('login', { title: 'Halaman Login', error: null })
}