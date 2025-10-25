// public/js/app.js
document.addEventListener('DOMContentLoaded', function () {
    "use strict";

    // ==========================
    // Função utilitária de sanitização
    // ==========================
    function sanitizeInput(value) {
        return value
            .replace(/[<>]/g, '') // remove tags HTML
            .replace(/javascript:/gi, '') // previne JS injection
            .trim();
    }

    // ==========================
    // Smooth scrolling para links da navegação
    // ==========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================
    // Contador de caracteres do textarea
    // ==========================
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const charCounter = document.querySelector('.char-counter');

    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = 600;
            charCount.textContent = currentLength;
            charCounter.classList.remove('warning', 'limit');

            if (currentLength >= maxLength) {
                this.value = this.value.substring(0, maxLength);
                charCounter.classList.add('limit');
            } else if (currentLength >= maxLength * 0.8) {
                charCounter.classList.add('warning');
            }
        });
    }

    // ==========================
    // Formulário de contato + envio seguro para WhatsApp
    // ==========================
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // coleta e sanitiza dados
            const name = sanitizeInput(document.getElementById('name').value);
            const email = sanitizeInput(document.getElementById('email').value);
            const phone = sanitizeInput(document.getElementById('phone').value);
            const plan = sanitizeInput(document.getElementById('plan').value);
            const message = sanitizeInput(document.getElementById('message').value);

            // validações básicas
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{8,15}$/;

            if (name.length < 3) return alert("Por favor, insira um nome válido.");
            if (!emailRegex.test(email)) return alert("Insira um email válido.");
            if (!phoneRegex.test(phone)) return alert("O telefone deve conter apenas números (8–15 dígitos).");
            if (message.length < 5) return alert("Digite uma mensagem mais detalhada.");

            // constrói mensagem segura
            const text =
                `👋 *Opa! Gostaria de fazer um pedido* 👇\n\n` +
                `📌 *Nome:* ${name}\n` +
                `📧 *Email:* ${email}\n` +
                `📞 *Telefone:* ${phone}\n` +
                `💼 *Plano de Interesse:* ${plan}\n` +
                `💬 *Mensagem:* ${message}\n\n` +
                `✅ Aguardo seu retorno!`;

            const whatsappURL = `https://wa.me/5581989490518?text=${encodeURIComponent(text)}`;

            // abre WhatsApp com segurança
            try {
                window.open(whatsappURL, '_blank', 'noopener,noreferrer');
                form.reset();
                if (charCount) charCount.textContent = '0';
                if (charCounter) charCounter.classList.remove('warning','limit');
            } catch (err) {
                console.error("Erro ao abrir o WhatsApp:", err);
                alert("Erro ao enviar. Tente novamente mais tarde.");
            }
        });
    }

    // ==========================
    // Botões de seleção de plano
    // ==========================
    document.querySelectorAll('.plan-button').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.plan-card');
            if (!card) return;
            const planName = card.querySelector('.plan-name')?.textContent?.trim() || '';
            const planSelect = document.getElementById('plan');
            const planMap = { 'Básico':'basico', 'Profissional':'profissional', 'Premium':'premium' };
            if (planSelect) {
                planSelect.value = planMap[planName] || '';
                document.getElementById('contato')?.scrollIntoView({ behavior:'smooth' });
            }
        });
    });

    // ==========================
    // Navbar scroll effect
    // ==========================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (!navbar) return;
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (window.scrollY > 100) {
            navbar.style.background = isDarkMode ? 'rgba(15,15,35,0.25)' : 'rgba(255,255,255,0.25)';
            navbar.style.boxShadow = isDarkMode ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 20px rgba(106,76,255,0.1)';
        } else {
            navbar.style.background = isDarkMode ? 'rgba(15,15,35,0.1)' : 'rgba(255,255,255,0.05)';
            navbar.style.boxShadow = isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(106,76,255,0.08)';
        }
    });

    // ==========================
    // Theme Toggle
    // ==========================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    if ((localStorage.getItem('theme') || 'light') === 'dark') body.classList.add('dark-mode');
    themeToggle?.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode')?'dark':'light');
        this.style.transform = 'scale(0.95)';
        setTimeout(()=>{ this.style.transform = 'scale(1)'; },150);
    });

    // ==========================
    // Animação de entrada dos elementos
    // ==========================
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.style.opacity='1';
                entry.target.style.transform='translateY(0)';
            }
        });
    }, { threshold:0.1, rootMargin:'0px 0px -50px 0px' });

    document.querySelectorAll('.step, .plan-card, .example-card').forEach(el=>{
        el.style.opacity='0';
        el.style.transform='translateY(30px)';
        el.style.transition='all 0.6s ease';
        observer.observe(el);
    });

    // ==========================
    // (Opcional) Cloudflare challenge
    // ==========================
    // Mantido como está — não altere se já usa Cloudflare
});
