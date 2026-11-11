// script.js

// ── Modale de Devis ──────────────────────────────────────────────────────────
const devisModal   = document.getElementById('devis-modal');
const devisOverlay = document.getElementById('devis-overlay');
const modalClose   = document.getElementById('modal-close');
const devisForm    = document.getElementById('devis-form');
const initialDevisFormHTML = devisForm.innerHTML;
let lastFocusedElement = null;
let formShowsConfirmation = false;

function openDevisModal(preselect) {
    lastFocusedElement = document.activeElement;
    closeMobileMenu();

    if (formShowsConfirmation) {
        devisForm.innerHTML = initialDevisFormHTML;
        devisForm.reset();
        formShowsConfirmation = false;
    }

    devisModal.classList.remove('hidden');
    // Petit délai pour déclencher l'animation CSS
    requestAnimationFrame(() => {
        requestAnimationFrame(() => devisModal.classList.add('open'));
    });
    document.body.style.overflow = 'hidden';
    modalClose.focus({ preventScroll: true });

    // Pré-sélectionner un type si passé en paramètre
    if (preselect) {
        const select = document.getElementById('devis-type');
        for (let opt of select.options) {
            if (opt.value === preselect) { opt.selected = true; break; }
        }
    }
}

function closeDevisModal() {
    if (devisModal.classList.contains('hidden')) return;

    devisModal.classList.remove('open');
    devisModal.addEventListener('transitionend', () => {
        devisModal.classList.add('hidden');
        if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus({ preventScroll: true });
    }, { once: true });
    document.body.style.overflow = '';
}

devisOverlay.addEventListener('click', closeDevisModal);
modalClose.addEventListener('click', closeDevisModal);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !devisModal.classList.contains('hidden')) closeDevisModal();
});

devisForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const prenom      = document.getElementById('devis-prenom').value.trim();
    const nom         = document.getElementById('devis-nom').value.trim();
    const email       = document.getElementById('devis-email').value.trim();
    const type        = document.getElementById('devis-type').value;
    const dimensions  = document.getElementById('devis-dimensions').value.trim();
    const description = document.getElementById('devis-description').value.trim();

    const nl = '%0A';
    const dimLine = dimensions ? `Dimensions souhaitées : ${encodeURIComponent(dimensions)}${nl}` : '';
    const body =
        `Bonjour,${nl}${nl}` +
        `Nom : ${encodeURIComponent(prenom + ' ' + nom)}${nl}` +
        `Email de contact : ${encodeURIComponent(email)}${nl}${nl}` +
        `Type de projet : ${encodeURIComponent(type)}${nl}` +
        `${dimLine}${nl}` +
        `Description du projet :${nl}${encodeURIComponent(description)}${nl}${nl}` +
        `Merci !`;

    const subject = encodeURIComponent(`Demande de devis – ${type} – ${prenom} ${nom}`);

    window.location.href = `mailto:mnlaser.contact@gmail.com?subject=${subject}&body=${body}`;

    // Message de confirmation visuel
    showDevisConfirmation();
});

function showDevisConfirmation() {
    formShowsConfirmation = true;
    devisForm.innerHTML = `
        <div class="flex flex-col items-center justify-center py-10 text-center gap-4" role="status" aria-live="polite">
            <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <i class="fa-solid fa-check text-green-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-serif font-bold text-wood-900">Votre messagerie s'ouvre !</h3>
            <p class="text-gray-500 text-sm max-w-xs">Votre email est pré-rempli avec les détails de votre projet. Envoyez-le pour recevoir votre devis gratuit sous 24h.</p>
            <button type="button" onclick="closeDevisModal()" class="mt-2 px-7 py-3 bg-wood-900 text-white font-bold rounded-full hover:bg-wood-500 transition-all text-sm">
                Fermer
            </button>
        </div>
    `;
}

// ── Carrousel images cintre ──────────────────────────────────────────────────
function switchCintreImg(src) {
    const img = document.getElementById('cintre-img');
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = src;
        img.style.opacity = '1';
    }, 200);
    document.querySelectorAll('.cintre-dot').forEach(dot => {
        dot.classList.remove('active');
        dot.classList.replace('bg-white', 'bg-white/50');
    });
    const dots = document.querySelectorAll('.cintre-dot');
    const index = src === 'cintre1.jpg' ? 0 : src === 'cintre2.jpg' ? 1 : 2;
    dots[index].classList.add('active');
    dots[index].classList.replace('bg-white/50', 'bg-white');
}

function closeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenu.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Ouvrir le menu');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
}

// ── Carrousel images bouchon ─────────────────────────────────────────────────
function switchBouchonImg(src) {
    const img = document.getElementById('bouchon-img');
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = src;
        img.style.opacity = '1';
    }, 200);
    document.querySelectorAll('.bouchon-dot').forEach(dot => {
        dot.classList.remove('active');
        dot.classList.replace('bg-white', 'bg-white/50');
    });
    const dots = document.querySelectorAll('.bouchon-dot');
    const index = src === 'bouchon1.jpg' ? 0 : src === 'bouchon2.jpg' ? 1 : 2;
    dots[index].classList.add('active');
    dots[index].classList.replace('bg-white/50', 'bg-white');
}

// ── Carrousel images pétanque ────────────────────────────────────────────────
function switchPetanqueImg(src) {
    const img = document.getElementById('petanque-img');
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = src;
        img.style.opacity = '1';
    }, 200);
    document.querySelectorAll('.petanque-dot').forEach(dot => {
        dot.classList.remove('active');
        dot.classList.replace('bg-white', 'bg-white/50');
    });
    const dots = document.querySelectorAll('.petanque-dot');
    const index = src === 'petanque1.jpg' ? 0 : src === 'petanque2.jpeg' ? 1 : 2;
    dots[index].classList.add('active');
    dots[index].classList.replace('bg-white/50', 'bg-white');
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Gestion du Menu Mobile ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = mobileMenu.querySelectorAll('a');

    // Ouvrir/Fermer le menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        // Change l'icône
        const icon = mobileMenuBtn.querySelector('i');
        const isOpen = !mobileMenu.classList.contains('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
        if (!isOpen) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        }
    });

    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });


    // --- 2. Navbar Animation au Scroll ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- 3. Animation d'apparition au scroll (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Ne jouer l'animation qu'une fois
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Déclenche quand 15% de l'élément est visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
});
