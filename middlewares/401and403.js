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
        return res.status(401).redirect('/signup');
    }

    // Periksa apakah user memiliki peran 'admin'
    const { role } = req.session.user;
    if (role !== 'admin') {
        console.warn(`Akses ditolak untuk user: ${req.session.user.email}`); // Log peringatan
        return res.status(403).render('403', {
            title: 'Forbidden',
            message: 'Anda tidak memiliki akses ke properti ini.',
        });
    }

    // Jika user adalah admin, lanjutkan ke route berikutnya
    next();
};
