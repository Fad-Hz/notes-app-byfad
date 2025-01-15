document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('[data-animate="fade-up"]')

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.setAttribute("data-visible", "true")
                } else {
                    entry.target.setAttribute("data-visible", "false")
                }
            })
        },
        { threshold: 0.2 }
    )

    elements.forEach((el) => observer.observe(el))
})

document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault()
    
    // Ambil nilai dari form
    const name = document.getElementById("name").value.trim()
    const message = document.getElementById("message").value.trim()
    
    if (name && message) {
        // Format pesan WhatsApp
        const whatsappURL = `https://wa.me/6288297758043?text=${encodeURIComponent(
            `Halo, nama saya ${name}. ${message}`
        )}`
        
        // Redirect ke WhatsApp
        window.open(whatsappURL, "_blank")
    } else {
        alert("Harap isi semua kolom!")
    }
})
