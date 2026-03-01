// ============================================
// PREMAXX AGRO TECH - MAIN JS
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ─── NAVBAR SCROLL ───────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar && navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ─── HAMBURGER MENU ──────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Mobile dropdown toggle
    document.querySelectorAll('.dropdown > .nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.closest('.dropdown').classList.toggle('open');
            }
        });
    });

    // ─── HERO SLIDESHOW ──────────────────────
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide] && dots[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide] && dots[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }

    if (slides.length > 0) {
        slideInterval = setInterval(nextSlide, 5000);
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide(i);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
        const prev = document.querySelector('.slide-prev');
        const next = document.querySelector('.slide-next');
        if (prev) prev.addEventListener('click', () => { clearInterval(slideInterval); goToSlide(currentSlide - 1); slideInterval = setInterval(nextSlide, 5000); });
        if (next) next.addEventListener('click', () => { clearInterval(slideInterval); nextSlide(); slideInterval = setInterval(nextSlide, 5000); });
    }

    // ─── STATS COUNTER ───────────────────────
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1800;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(update);
    }

    const counters = document.querySelectorAll('[data-target]');
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => observer.observe(c));
    }

    // ─── FADE UP ANIMATIONS ──────────────────
    const fadeEls = document.querySelectorAll('.fade-up');
    if (fadeEls.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 100);
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeEls.forEach(el => fadeObserver.observe(el));
    }

    // ─── LIVE CHAT ───────────────────────────
    const chatBubble = document.getElementById('chatBubble');
    const chatPopup = document.getElementById('chatPopup');
    const chatClose = document.getElementById('chatClose');
    const chatInputBar = document.getElementById('chatInputBar');
    const chatFormWrap = document.getElementById('chatFormWrap');
    const chatBody = document.getElementById('chatBody');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatSubmit = document.getElementById('chatSubmit');

    // Auto-open after 4 seconds
    setTimeout(() => {
        if (chatPopup && !chatPopup.classList.contains('open')) {
            chatPopup.classList.add('open');
            const badge = document.querySelector('.chat-badge');
            if (badge) badge.style.display = 'none';
        }
    }, 4000);

    if (chatBubble) {
        chatBubble.addEventListener('click', () => {
            chatPopup.classList.toggle('open');
            const badge = document.querySelector('.chat-badge');
            if (badge) badge.style.display = 'none';
        });
    }
    if (chatClose) {
        chatClose.addEventListener('click', () => chatPopup.classList.remove('open'));
    }

    // Quick reply buttons
    document.querySelectorAll('.qr-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const reply = this.getAttribute('data-reply');
            addUserMsg(reply);
            // Show form after a short bot response
            setTimeout(() => {
                addBotMsg("Great! Please fill in your details below and we'll get back to you shortly.");
                chatInputBar.style.display = 'none';
                chatFormWrap.style.display = 'block';
                // Remove quick reply buttons
                document.querySelectorAll('.quick-replies').forEach(el => el.remove());
            }, 600);
        });
    });

    // Chat send button
    if (chatSend) {
        chatSend.addEventListener('click', sendChatMessage);
    }
    if (chatInput) {
        chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });
    }

    function sendChatMessage() {
        const msg = chatInput.value.trim();
        if (!msg) return;
        addUserMsg(msg);
        chatInput.value = '';
        setTimeout(() => {
            addBotMsg("Thanks for reaching out! Please fill in your details below so we can assist you.");
            chatInputBar.style.display = 'none';
            chatFormWrap.style.display = 'block';
            document.querySelectorAll('.quick-replies').forEach(el => el.remove());
        }, 600);
    }

    function addUserMsg(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg user';
        div.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addBotMsg(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';
        div.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Chat form submit
    if (chatSubmit) {
        chatSubmit.addEventListener('click', () => {
            const name = document.getElementById('cf-name').value.trim();
            const email = document.getElementById('cf-email').value.trim();
            if (!name || !email) {
                alert('Please provide your name and email.');
                return;
            }
            chatFormWrap.style.display = 'none';
            addBotMsg(`Thank you, ${name}! 🌿 We've received your message and will contact you shortly.`);
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    }

    // ─── CONTACT FORM SUBMIT ─────────────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('.form-submit');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };
            fetch('/submit-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(r => r.json()).then(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                btn.style.background = '#27ae60';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }).catch(() => {
                btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                btn.disabled = false;
            });
        });
    }

    // ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const hashIndex = href.indexOf('#');
            if (hashIndex === -1) return;
            const hash = href.substring(hashIndex);
            const target = document.querySelector(hash);
            if (target) {
                if (href.startsWith('#') || window.location.pathname === href.substring(0, hashIndex) || href.substring(0, hashIndex) === '') {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

});
