exports.authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        // Jika belum login, render view 401.ejs
        return res.status(401).redirect('/signup')
    }
    // Jika sudah login, lanjutkan ke route berikutnya
    next()
}

exports.adminMiddleware = (req, res, next) => {
    if (!req.session.user) {
        // Jika belum login, redirect ke halaman signup
        return res.status(401).redirect('/signup')
    }

    // Periksa apakah pengguna adalah admin
    if (req.session.user.role !== 'admin' ) {
        // Jika bukan admin, render view 403.ejs
        return res.status(403).render('403', {
            title: 'Forbidden',
            message: 'Anda tidak memiliki akses ke properti ini.'
        })
    }

    // Jika user adalah admin, lanjutkan ke route berikutnya
    next()
}