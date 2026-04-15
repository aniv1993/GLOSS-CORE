/* ═══════════════════════════════════════════════════════════
   GLOSS & CORE — JavaScript
   Interactions, animations & form handling
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initBeforeAfterSlider();
    initPricingTabs();
    initCountUpAnimations();
    initContactForm();
    initSmoothScroll();
});

/* ─────────────────────────────────────────────
   PRELOADER
   ───────────────────────────────────────────── */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hide = () => {
        preloader.classList.add('is-hidden');
        setTimeout(() => preloader.remove(), 600);
    };

    // Wait for all assets to load, but minimum 1.2s for animation
    const minDelay = new Promise(resolve => setTimeout(resolve, 1200));
    const loaded = new Promise(resolve => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve);
    });

    Promise.all([minDelay, loaded]).then(hide);
}

/* ─────────────────────────────────────────────
   HEADER — transparent → solid on scroll
   ───────────────────────────────────────────── */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    const onScroll = () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ─────────────────────────────────────────────
   MOBILE MENU
   ───────────────────────────────────────────── */
function initMobileMenu() {
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!burger || !mobileMenu) return;

    const links = mobileMenu.querySelectorAll('.mobile-menu__link');

    const toggleMenu = () => {
        const isActive = burger.classList.toggle('is-active');
        mobileMenu.classList.toggle('is-active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    burger.addEventListener('click', toggleMenu);

    links.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('is-active');
            mobileMenu.classList.remove('is-active');
            document.body.style.overflow = '';
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-active')) {
            toggleMenu();
        }
    });
}

/* ─────────────────────────────────────────────
   SCROLL ANIMATIONS — Intersection Observer
   ───────────────────────────────────────────── */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────
   BEFORE / AFTER SLIDER
   ───────────────────────────────────────────── */
function initBeforeAfterSlider() {
    const slider = document.getElementById('ba-slider');
    const handle = document.getElementById('ba-handle');
    const afterLayer = document.getElementById('ba-after');
    if (!slider || !handle || !afterLayer) return;

    let isDragging = false;

    const updateSlider = (x) => {
        const rect = slider.getBoundingClientRect();
        let position = ((x - rect.left) / rect.width) * 100;
        position = Math.max(2, Math.min(98, position));

        afterLayer.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
        handle.style.left = `${position}%`;
    };

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(e.clientX);
        slider.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updateSlider(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            slider.style.cursor = 'ew-resize';
        }
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updateSlider(e.touches[0].clientX);
    }, { passive: false });

    slider.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Keyboard accessibility
    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-label', 'Сравнение до и после');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.setAttribute('aria-valuenow', '50');

    slider.addEventListener('keydown', (e) => {
        const rect = slider.getBoundingClientRect();
        const currentPos = parseFloat(handle.style.left) || 50;
        let newPos = currentPos;

        if (e.key === 'ArrowLeft') newPos = Math.max(2, currentPos - 2);
        if (e.key === 'ArrowRight') newPos = Math.min(98, currentPos + 2);

        if (newPos !== currentPos) {
            e.preventDefault();
            afterLayer.style.clipPath = `inset(0 ${100 - newPos}% 0 0)`;
            handle.style.left = `${newPos}%`;
            slider.setAttribute('aria-valuenow', Math.round(newPos));
        }
    });
}

/* ─────────────────────────────────────────────
   PRICING TABS
   ───────────────────────────────────────────── */
function initPricingTabs() {
    const tabs = document.querySelectorAll('.pricing__tab');
    const cards = document.querySelectorAll('.price-card');
    if (!tabs.length || !cards.length) return;

    const priceData = {
        polish:   { sedan: '15 000', crossover: '20 000', suv: '25 000' },
        ceramic:  { sedan: '25 000', crossover: '35 000', suv: '45 000' },
        ppf:      { sedan: '45 000', crossover: '65 000', suv: '90 000' },
        interior: { sedan: '8 000',  crossover: '12 000', suv: '15 000' }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('pricing__tab--active'));
            tab.classList.add('pricing__tab--active');

            const service = tab.dataset.tab;
            const prices = priceData[service];
            if (!prices) return;

            // Update prices with animation
            const vehicleTypes = ['sedan', 'crossover', 'suv'];
            cards.forEach((card, index) => {
                const amountEl = card.querySelector('.price-card__amount');
                const featuresEls = card.querySelectorAll('.price-card__features li');
                const type = vehicleTypes[index];

                if (amountEl && prices[type]) {
                    // Animate price change
                    card.style.transform = 'scale(0.98)';
                    card.style.opacity = '0.7';

                    setTimeout(() => {
                        amountEl.textContent = prices[type];
                        
                        // Update feature text
                        featuresEls.forEach(li => {
                            const newText = li.dataset[service];
                            if (newText) li.textContent = newText;
                        });

                        card.style.transform = '';
                        card.style.opacity = '';
                    }, 200);
                }
            });
        });
    });
}

/* ─────────────────────────────────────────────
   COUNT-UP ANIMATION
   ───────────────────────────────────────────── */
function initCountUpAnimations() {
    const statNumbers = document.querySelectorAll('.stat-card__number[data-target]');
    if (!statNumbers.length) return;

    const animateCount = (el) => {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = Math.round(easedProgress * target);

            el.textContent = current.toLocaleString('ru-RU');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────
   CONTACT FORM
   ───────────────────────────────────────────── */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successEl = document.getElementById('form-success');
    if (!form || !successEl) return;

    // Phone mask
    const phoneInput = document.getElementById('client-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '8') value = '7' + value.slice(1);
                if (value[0] !== '7') value = '7' + value;
            }

            let formatted = '';
            if (value.length > 0) formatted = '+7';
            if (value.length > 1) formatted += ' (' + value.slice(1, 4);
            if (value.length > 4) formatted += ') ' + value.slice(4, 7);
            if (value.length > 7) formatted += '-' + value.slice(7, 9);
            if (value.length > 9) formatted += '-' + value.slice(9, 11);

            e.target.value = formatted;
        });

        phoneInput.addEventListener('keydown', (e) => {
            // Allow backspace, delete, arrows
            if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) return;
            // Block non-digit input
            if (!/\d/.test(e.key)) e.preventDefault();
        });
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('client-name');
        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';

        // Validation
        if (!name || name.length < 2) {
            shakeInput(nameInput);
            return;
        }

        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            shakeInput(phoneInput);
            return;
        }

        const submitBtn = document.getElementById('form-submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Отправка...</span>';
        }

        try {
            // ═══ Google Sheets Integration ═══
            // Replace this URL with your deployed Google Apps Script Web App URL
            const SCRIPT_URL = '';

            if (SCRIPT_URL) {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        date: new Date().toLocaleString('ru-RU'),
                        source: 'Лендинг Gloss & Core'
                    })
                });
            }

            // Show success
            successEl.classList.add('is-visible');
            form.style.opacity = '0';
            form.style.visibility = 'hidden';

        } catch (error) {
            console.error('Form submission error:', error);
            // Still show success as no-cors won't return response
            successEl.classList.add('is-visible');
            form.style.opacity = '0';
            form.style.visibility = 'hidden';
        }
    });

    function shakeInput(input) {
        if (!input) return;
        input.style.animation = 'shake 0.4s ease';
        input.style.borderColor = '#E85D5D';
        setTimeout(() => {
            input.style.animation = '';
            input.style.borderColor = '';
        }, 600);
    }

    // Add shake keyframes
    if (!document.getElementById('shake-styles')) {
        const style = document.createElement('style');
        style.id = 'shake-styles';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-4px); }
                80% { transform: translateX(4px); }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ─────────────────────────────────────────────
   SMOOTH SCROLL
   ───────────────────────────────────────────── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;

            const headerHeight = document.getElementById('header')?.offsetHeight || 72;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}
