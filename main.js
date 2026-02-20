document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. INTERSECTION OBSERVER — REVEAL ANIMATION
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 2. NAVBAR — SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');

    const handleNavScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Run on init

    // 3. HERO — Parallax removed (video background)

    // ==========================================
    // 4. MEMBERSHIP FORM — SUBMIT HANDLER
    // ==========================================
    const form = document.getElementById('membership-form');
    const successMessage = document.getElementById('success-message');

    if (form && successMessage) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = form.querySelector('#input-name');
            const emailInput = form.querySelector('#input-email');

            // Basic validation
            if (!nameInput.value.trim() || !emailInput.value.trim()) return;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.style.borderBottomColor = '#EA9AB2';
                emailInput.focus();
                return;
            }

            // Animate out form, show success
            form.style.opacity = '0';
            form.style.transform = 'translateY(-10px)';
            form.style.transition = 'all 0.5s ease';

            setTimeout(() => {
                form.style.display = 'none';
                successMessage.classList.remove('hidden');
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(10px)';
                successMessage.style.transition = 'all 0.6s ease';

                requestAnimationFrame(() => {
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                });
            }, 500);
        });
    }

    // ==========================================
    // 5. SMOOTH ANCHOR SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const navH = navbar ? navbar.offsetHeight : 80;

            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - navH,
                behavior: 'smooth'
            });
        });
    });

});
