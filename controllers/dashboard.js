const Note = require('../models/Notes')

// Controller untuk menampilkan dashboard
exports.dashboard = async (req, res) => {
    try {
        // Ambil semua catatan dari database, termasuk informasi pembuat
        const notes = await Note.find().populate('createdBy', 'fullName email')

        res.render('dashboard', {
            title: 'Dashboard',
            notes
        })
    } catch (error) {
        console.error('Error fetching notes:', error)
        res.status(500).render('500', { title: 'Terjadi Kesalahan' })
    }
}

exports.viewNote = async (req, res) => {
    const { id } = req.params
    try {
        const note = await Note.findById(id).populate('createdBy', 'fullName email')

        if (!note) {
            return res.status(404).render('404', {
                title: 'Catatan Tidak Ditemukan'
            })
        }

        res.render('dashboard/note-detail', {
            title: 'Detail Catatan',
            note
        })
    } catch (error) {
        console.error('Error fetching note:', error)
        res.status(500).render('500', { title: 'Terjadi Kesalahan' })
    }
}


// Controller untuk membuat catatan baru
exports.createNote = async (req, res) => {
    try {
        const { title, description } = req.body

        // Validasi data
        if (!title || !description) {
            return res.status(400).render('dashboard/create-note', {
                title: 'Buat Catatan',
                error: 'Judul dan deskripsi harus diisi'
            })
        }

        // Buat catatan baru
        const newNote = new Note({
            title,
            description,
            createdBy: req.session.user._id // Menggunakan ID user dari sesi
        })

        await newNote.save()

        // Redirect ke dashboard dengan pesan sukses
        res.redirect('/dashboard')
    } catch (error) {
        console.error('Error creating note:', error)
        res.status(500).render('dashboard/create-note', {
            title: 'Buat Catatan',
            error: 'Terjadi kesalahan saat menyimpan catatan'
        })
    }
}

// Controller untuk menampilkan form pembuatan catatan
exports.getform = (req, res) => {
    res.render('dashboard/create-note', { title: 'Buat Catatan', error: null })
}

exports.renderUpdateForm = async (req, res) => {
    const { id } = req.params // ID dari note yang akan diperbarui

    try {
        // Cari note berdasarkan ID
        const note = await Note.findById(id)

        if (!note) {
            return res.status(404).render('dashboard/update-note', { 
                note: null, 
                error: 'Note not found', 
                title: 'Update Note' 
            })
        }

        // Render form update dengan data note
        res.render('dashboard/update-note', { 
            note, 
            error: null, 
            title: 'Update Note' 
        })
    } catch (error) {
        console.error(error)
        res.status(500).render('dashboard/update-note', { 
            note: null, 
            error: 'An error occurred while loading the update form', 
            title: 'Update Note' 
        })
    }
}

exports.updateNote = async (req, res) => {
    const { id } = req.params // ID dari note
    const { title, description } = req.body // Data baru untuk note

    try {
        // Validasi input
        if (!title || !description) {
            const note = await Note.findById(id)
            return res.status(400).render('dashboard/update-note', { 
                note, 
                error: 'Both title and description are required', 
                title: 'Update Note' 
            })
        }

        // Cari dan perbarui note berdasarkan ID
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, description },
            { new: true, runValidators: true } // Mengembalikan note yang diperbarui
        )

        if (!updatedNote) {
            return res.status(404).render('dashboard/update-note', { 
                note: null, 
                error: 'Note not found', 
                title: 'Update Note' 
            })
        }

        // Redirect ke dashboard setelah berhasil diperbarui
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        const note = await Note.findById(id)
        res.status(500).render('dashboard/update-note', { 
            note, 
            error: 'An error occurred while updating the note', 
            title: 'Update Note' 
        })
    }
}


// Delete note
exports.deleteNote = async (req, res) => {
    const notes = await Note.find().populate('createdBy', 'fullName email')
    const { id } = req.params // ID dari note

    try {
        // Cari dan hapus note berdasarkan ID
        const deletedNote = await Note.findByIdAndDelete(id)

        res.render('dashboard/index', { title: 'Update Note', notes })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred while deleting the note', error: error.message })
    }
}
