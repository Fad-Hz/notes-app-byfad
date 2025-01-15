// Middleware untuk memeriksa apakah pengguna sudah login
exports.authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        // Jika belum login, redirect ke halaman signup
        return res.status(401).redirect('/signup');
    }
    // Jika sudah login, lanjutkan ke route berikutnya
    next();
};

// Middleware untuk memeriksa apakah pengguna adalah admin
exports.adminMiddleware = (req, res, next) => {
    if (!req.session.user) {
        // Jika belum login, redirect ke halaman signup
        console.warn("User tidak ditemukan di sesi.");
        return res.status(401).redirect('/signup');
    }

    // Periksa apakah 'role' ada dalam sesi user dan apakah itu 'admin'
    const { role, email } = req.session.user;
    if (!role || role !== 'admin') {
        console.warn(`Akses ditolak untuk user: ${email || 'Tidak Diketahui'}`); // Log peringatan
        return res.status(403).render('403', {
            title: 'Forbidden',
            message: 'Properti ini hanya milik admin',
        });
    }

    // Jika user adalah admin, lanjutkan ke route berikutnya
    next();
};
