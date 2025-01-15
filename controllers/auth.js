const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Signup Controller
exports.signup = [
    // Validasi dan Sanitasi Input
    body('fullName').trim().notEmpty().withMessage('Nama lengkap harus diisi.'),
    body('email').isEmail().withMessage('Email tidak valid.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter.'),
    
    async (req, res) => {
        const errors = validationResult(req);
        const { fullName, email, password } = req.body;

        if (!errors.isEmpty()) {
            return res.render('signup', {
                title: 'Daftar',
                error: errors.array()[0].msg, // Menampilkan pesan error pertama
            });
        }

        try {
            // Cek apakah email sudah terdaftar
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('signup', {
                    title: 'Daftar',
                    error: 'Email sudah terdaftar. Silakan gunakan email lain.',
                });
            }

            // Hash password dan simpan user baru
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ fullName, email, password: hashedPassword });
            await newUser.save();

            // Simpan ID user di sesi dan arahkan ke halaman login
            req.session.userId = newUser._id;
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.render('signup', {
                title: 'Daftar',
                error: 'Terjadi kesalahan. Silakan coba lagi.',
            });
        }
    },
];

exports.renderSignUp = (req, res) => {
    res.render('signup', {
        title: 'Daftar Akun Baru',
        error: null, // Untuk menampilkan pesan error jika ada
    });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Hapus cookie sesi
        res.redirect('/');
    });
};

// Login Controller
exports.login = [
    // Validasi dan Sanitasi Input
    body('email').isEmail().withMessage('Email tidak valid.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password harus diisi.'),

    async (req, res) => {
        const errors = validationResult(req);
        const { email, password } = req.body;

        if (!errors.isEmpty()) {
            return res.render('login', {
                title: 'Halaman Login',
                error: errors.array()[0].msg,
            });
        }

        try {
            // Cari user berdasarkan email
            const user = await User.findOne({ email });
            if (!user) {
                return res.render('login', {
                    title: 'Halaman Login',
                    error: 'Email tidak ditemukan.',
                });
            }

            // Periksa kecocokan password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('login', {
                    title: 'Halaman Login',
                    error: 'Password salah!',
                });
            }

            // Simpan data user ke sesi
            req.session.userId = user._id;
            req.session.user = { id: user._id, fullName: user.fullName };

            // Arahkan ke dashboard
            res.redirect('/dashboard');
        } catch (error) {
            console.error(error);
            res.render('login', {
                title: 'Halaman Login',
                error: 'Terjadi kesalahan. Silakan coba lagi.',
            });
        }
    },
];

exports.renderLoginPage = (req, res) => {
    res.render('login', {
        title: 'Halaman Login',
        error: null,
    });
};
