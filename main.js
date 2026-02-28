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

    // 3. HANDWRITTEN TYPEWRITER EFFECT
    // ==========================================
    const typeElements = document.querySelectorAll('.typewrite');
    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.typed) {
                entry.target.dataset.typed = "true";
                const textToType = entry.target.getAttribute('data-text');
                let charIndex = 0;

                entry.target.classList.add('typing');

                const typeInterval = setInterval(() => {
                    if (charIndex < textToType.length) {
                        entry.target.textContent += textToType.charAt(charIndex);
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                        setTimeout(() => entry.target.classList.remove('typing'), 2000);
                    }
                }, 100);
            }
        });
    }, observerOptions);

    typeElements.forEach(el => typeObserver.observe(el));
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
            const birthYearInput = form.querySelector('#input-birth-year');
            const locationInput = form.querySelector('#input-location');

            // Basic validation
            if (!nameInput.value.trim() || !emailInput.value.trim() || !birthYearInput.value.trim() || !locationInput.value.trim()) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.style.borderBottomColor = '#EA9AB2';
                emailInput.focus();
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'A processar...';
            submitBtn.disabled = true;

            // Call API
            fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    birth_year: parseInt(birthYearInput.value.trim()),
                    location: locationInput.value.trim()
                })
            })
                .then(async (response) => {
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || 'Erro no servidor');

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
                })
                .catch(error => {
                    console.error('API Error:', error);
                    alert('Ocorreu um erro ao registar o seu lugar. Por favor, tente novamente mais tarde.');
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
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
