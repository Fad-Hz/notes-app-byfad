exports.notFound = (req, res, next) => {
    res.status(404).render('404', { 
        title: 'Halaman Tidak Ditemukan', 
    })
}

exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render('500', { 
        title: 'Kesalahan Server', 
    })
}