/* MontagneNoireLaser — script.js
 * Chargé avec `defer` : le DOM est prêt à l'exécution.
 * Aucun gestionnaire inline dans le HTML : tout passe par des attributs data-*.
 *   data-devis-open[="Type de projet"]  ouvre la modale de devis (présélection optionnelle)
 *   data-devis-close                    ferme la modale
 *   data-carousel / data-carousel-track carrousel d'images générique
 */
(function () {
    'use strict';

    var CONTACT_EMAIL = 'mnlaser.contact@gmail.com';
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function $(selector, root) { return (root || document).querySelector(selector); }
    function $all(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

    /* ── 1. Menu mobile ─────────────────────────────────────────────────── */
    var menuBtn = $('#mobile-menu-btn');
    var menu = $('#mobile-menu');

    function setMenu(open) {
        if (!menuBtn || !menu) return;
        menu.classList.toggle('hidden', !open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        // Icône : burger <-> croix (symboles du sprite SVG de index.html)
        var icon = $('svg', menuBtn);
        var use = icon && $('use', icon);
        if (use) {
            icon.setAttribute('viewBox', open ? '0 0 384 512' : '0 0 448 512');
            use.setAttribute('href', open ? '#i-xmark' : '#i-bars');
        }
    }

    function isMenuOpen() { return !!menu && !menu.classList.contains('hidden'); }

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', function () { setMenu(!isMenuOpen()); });
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a, button')) setMenu(false);
        });
        document.addEventListener('click', function (e) {
            if (isMenuOpen() && !e.target.closest('#navbar')) setMenu(false);
        });
        // Le menu mobile n'a plus lieu d'être quand on repasse en affichage large
        var desktop = window.matchMedia('(min-width: 1024px)');
        var onDesktopChange = function (e) { if (e.matches) setMenu(false); };
        if (desktop.addEventListener) desktop.addEventListener('change', onDesktopChange);
        else if (desktop.addListener) desktop.addListener(onDesktopChange);
    }

    /* ── 2. Barre de navigation + boutons flottants au défilement ───────── */
    var navbar = $('#navbar');
    var floating = $('#floating-actions');
    var ticking = false;

    function onScroll() {
        ticking = false;
        var y = window.scrollY || window.pageYOffset;
        if (navbar) navbar.classList.toggle('scrolled', y > 80);
        if (floating) floating.classList.toggle('visible', y > 500);
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();

    /* ── 3. Apparition au défilement ────────────────────────────────────── */
    var revealEls = $all('.reveal');
    if ('IntersectionObserver' in window && !reducedMotion.matches && revealEls.length) {
        // Ce qui est déjà à l'écran reste affiché, sans clignotement
        revealEls.forEach(function (el) {
            if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('active');
        });
        document.documentElement.classList.add('reveal-on');
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) {
            if (!el.classList.contains('active')) revealObserver.observe(el);
        });
    }

    /* ── 4. Carrousel générique ─────────────────────────────────────────── */
    var ARROW_SVG = {
        prev: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg>',
        next: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7.5 4.5 13 10l-5.5 5.5"/></svg>'
    };

    function initCarousel(root) {
        var track = $('[data-carousel-track]', root);
        if (!track) return;
        var slides = Array.prototype.slice.call(track.children);
        var total = slides.length;
        if (total < 2) return;

        var current = 0;
        var dots = [];

        function goTo(index) {
            var target = (index + total) % total;
            track.scrollTo({
                left: slides[target].offsetLeft,
                behavior: reducedMotion.matches ? 'auto' : 'smooth'
            });
            setCurrent(target);
        }

        function setCurrent(index) {
            current = index;
            dots.forEach(function (dot, i) {
                if (i === index) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
        }

        function makeArrow(direction, label, step) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'carousel-arrow carousel-arrow--' + direction;
            btn.setAttribute('aria-label', label);
            btn.innerHTML = ARROW_SVG[direction];
            btn.addEventListener('click', function () { goTo(current + step); });
            return btn;
        }

        var dotsBox = document.createElement('div');
        dotsBox.className = 'carousel-dots';
        slides.forEach(function (slide, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', 'Photo ' + (i + 1) + ' sur ' + total);
            dot.addEventListener('click', function () { goTo(i); });
            dots.push(dot);
            dotsBox.appendChild(dot);
        });

        root.appendChild(makeArrow('prev', 'Photo précédente', -1));
        root.appendChild(makeArrow('next', 'Photo suivante', 1));
        root.appendChild(dotsBox);
        setCurrent(0);

        // Le balayage tactile est assuré par le défilement natif (scroll-snap) :
        // on se contente de suivre la diapositive affichée.
        var scrollTimer = null;
        track.addEventListener('scroll', function () {
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(function () {
                var width = track.clientWidth || 1;
                var index = Math.max(0, Math.min(total - 1, Math.round(track.scrollLeft / width)));
                if (index !== current) setCurrent(index);
            }, 80);
        }, { passive: true });

        root.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
            else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
            else if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
        });
    }

    $all('[data-carousel]').forEach(initCarousel);

    /* ── 5. Modale de devis ─────────────────────────────────────────────── */
    var modal = $('#devis-modal');
    var form = $('#devis-form');
    var lastFocused = null;
    var closeTimer = null;
    var successPanel = null;
    var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function isModalOpen() { return !!modal && modal.classList.contains('open'); }

    function setPageInert(inert) {
        $all('body > *').forEach(function (el) {
            if (el === modal || el.tagName === 'SCRIPT') return;
            if (inert) {
                el.setAttribute('inert', '');
                el.setAttribute('aria-hidden', 'true');
            } else {
                el.removeAttribute('inert');
                el.removeAttribute('aria-hidden');
            }
        });
    }

    function modalFocusables() {
        return $all(FOCUSABLE, modal).filter(function (el) {
            return el.offsetParent !== null && !el.closest('[hidden]');
        });
    }

    function openModal(preselect) {
        if (!modal || isModalOpen()) return;
        window.clearTimeout(closeTimer);
        lastFocused = document.activeElement;
        setMenu(false);
        resetForm();

        if (preselect) {
            var select = $('#devis-type');
            $all('option', select).forEach(function (opt) {
                if (opt.value === preselect) select.value = preselect;
            });
        }

        modal.classList.remove('hidden');
        void modal.offsetWidth; // force le rendu pour que la transition d'ouverture se joue
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        setPageInert(true);
        var closeBtn = $('#modal-close');
        if (closeBtn) closeBtn.focus({ preventScroll: true });
    }

    function closeModal() {
        if (!isModalOpen()) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
        setPageInert(false);
        // La temporisation remplace transitionend, qui ne se déclenche pas toujours
        closeTimer = window.setTimeout(function () { modal.classList.add('hidden'); },
            reducedMotion.matches ? 0 : 320);
        if (lastFocused && typeof lastFocused.focus === 'function' && document.contains(lastFocused)) {
            lastFocused.focus({ preventScroll: true });
        }
        lastFocused = null;
    }

    document.addEventListener('click', function (e) {
        var opener = e.target.closest('[data-devis-open]');
        if (opener) {
            e.preventDefault();
            openModal(opener.getAttribute('data-devis-open'));
            return;
        }
        if (e.target.closest('[data-devis-close]')) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (isModalOpen()) {
                closeModal();
            } else if (isMenuOpen()) {
                setMenu(false);
                menuBtn.focus();
            }
            return;
        }
        // Piège de focus : Tab et Maj+Tab bouclent à l'intérieur de la modale
        if (e.key === 'Tab' && isModalOpen()) {
            var items = modalFocusables();
            if (!items.length) { e.preventDefault(); return; }
            var first = items[0];
            var last = items[items.length - 1];
            var active = document.activeElement;
            if (!modal.contains(active)) {
                e.preventDefault();
                first.focus();
            } else if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    /* ── 6. Formulaire de devis (Netlify Forms, repli mailto) ───────────── */
    if (!form) return;

    var submitBtn = $('button[type="submit"]', form);
    var submitLabel = submitBtn ? submitBtn.innerHTML : '';
    var statusBox = $('#devis-status');
    var fields = $all('input:not([type="hidden"]), select, textarea', form).filter(function (el) {
        return el.name !== 'bot-field';
    });

    form.setAttribute('novalidate', ''); // validation gérée ici, avec des messages accessibles

    function errorMessage(field) {
        var value = field.value.trim();
        if (field.required && !value) {
            return field.tagName === 'SELECT' ? 'Choisissez un type de projet.' : 'Ce champ est obligatoire.';
        }
        if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            return 'Saisissez une adresse e-mail valide, par exemple nom@exemple.fr.';
        }
        if (field.type === 'tel' && value && !/^[0-9+().\s-]{6,20}$/.test(value)) {
            return 'Saisissez un numéro de téléphone valide, ou laissez le champ vide.';
        }
        return '';
    }

    function errorEl(field) {
        var id = field.id + '-error';
        var el = document.getElementById(id);
        if (!el) {
            el = document.createElement('p');
            el.id = id;
            el.className = 'field-error';
            el.hidden = true;
            field.insertAdjacentElement('afterend', el);
        }
        return el;
    }

    function validateField(field) {
        var message = errorMessage(field);
        var el = errorEl(field);
        if (message) {
            el.textContent = message;
            el.hidden = false;
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', el.id);
        } else {
            el.textContent = '';
            el.hidden = true;
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        }
        return !message;
    }

    fields.forEach(function (field) {
        field.addEventListener('blur', function () {
            if (field.value.trim() || field.hasAttribute('aria-invalid')) validateField(field);
        });
        field.addEventListener('input', function () {
            if (field.hasAttribute('aria-invalid')) validateField(field);
        });
    });

    function setStatus(message) {
        if (statusBox) statusBox.textContent = message || '';
    }

    function setLoading(loading) {
        if (!submitBtn) return;
        submitBtn.disabled = loading;
        submitBtn.setAttribute('aria-busy', loading ? 'true' : 'false');
        submitBtn.innerHTML = loading
            ? '<span class="spinner" aria-hidden="true"></span>Envoi en cours…'
            : submitLabel;
    }

    function resetForm() {
        if (!form) return;
        if (successPanel) {
            successPanel.remove();
            successPanel = null;
            form.hidden = false;
            form.reset();
        }
        fields.forEach(function (field) {
            var el = document.getElementById(field.id + '-error');
            if (el) { el.textContent = ''; el.hidden = true; }
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        });
        setStatus('');
        setLoading(false);
    }

    function value(name) {
        var field = form.elements[name];
        return field ? String(field.value || '').trim() : '';
    }

    function buildMailto() {
        var lines = [
            'Bonjour,',
            '',
            'Nom : ' + value('prenom') + ' ' + value('nom'),
            'Email de contact : ' + value('email')
        ];
        if (value('telephone')) lines.push('Téléphone : ' + value('telephone'));
        lines.push('', 'Type de projet : ' + value('type'));
        if (value('dimensions')) lines.push('Dimensions souhaitées : ' + value('dimensions'));
        lines.push('', 'Description du projet :', value('description'), '', 'Merci !');
        var subject = 'Demande de devis – ' + value('type') + ' – ' + value('prenom') + ' ' + value('nom');
        return 'mailto:' + CONTACT_EMAIL +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(lines.join('\r\n'));
    }

    function showSuccess(mode, mailto) {
        var sent = mode === 'sent';
        successPanel = document.createElement('div');
        successPanel.className = 'flex flex-col items-center justify-center px-8 py-12 text-center gap-4';
        successPanel.innerHTML =
            '<div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center" aria-hidden="true">' +
                '<svg class="icon text-green-700 text-2xl" viewBox="' + (sent ? '0 0 448 512' : '0 0 512 512') + '" aria-hidden="true" focusable="false">' +
                    '<use href="#i-' + (sent ? 'check' : 'envelope-open-text') + '"/></svg>' +
            '</div>' +
            '<h3 class="text-xl font-serif font-bold text-wood-900" tabindex="-1">' +
                (sent ? 'Demande envoyée, merci !' : 'Votre messagerie s\'ouvre…') +
            '</h3>' +
            '<p class="text-wood-800 text-sm max-w-xs">' +
                (sent
                    ? 'Votre demande de devis est bien partie. Je vous réponds par e-mail sous 24 h.'
                    : 'Un e-mail pré-rempli avec les détails de votre projet vient de s\'ouvrir : il ne reste plus qu\'à l\'envoyer pour recevoir votre devis gratuit sous 24 h.') +
            '</p>' +
            (sent ? '' :
                '<p class="text-wood-800 text-sm max-w-xs">Rien ne s\'ouvre ? ' +
                '<a class="font-bold underline" data-mailto-link href="#">Ouvrir l\'e-mail</a> ou écrivez directement à ' +
                '<span class="font-bold">' + CONTACT_EMAIL + '</span>.</p>') +
            '<button type="button" data-devis-close class="mt-2 px-7 py-3 bg-wood-900 text-white font-bold rounded-full hover:bg-wood-800 transition-colors text-sm">Fermer</button>';
        var link = $('[data-mailto-link]', successPanel);
        if (link && mailto) link.href = mailto;
        form.hidden = true;
        form.insertAdjacentElement('afterend', successPanel);
        setStatus(sent ? 'Demande de devis envoyée.' : 'Votre messagerie s\'ouvre avec un e-mail pré-rempli.');
        $('h3', successPanel).focus({ preventScroll: true });
    }

    function fallbackToMailto() {
        var mailto = buildMailto();
        showSuccess('mailto', mailto);
        window.location.href = mailto;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (submitBtn && submitBtn.disabled) return;

        var invalid = fields.filter(function (field) { return !validateField(field); });
        if (invalid.length) {
            setStatus(invalid.length === 1
                ? 'Le formulaire contient 1 erreur.'
                : 'Le formulaire contient ' + invalid.length + ' erreurs.');
            invalid[0].focus();
            return;
        }

        // Champ piège rempli = robot : on simule un succès sans rien envoyer
        if (value('bot-field')) {
            showSuccess('sent');
            return;
        }

        setLoading(true);
        setStatus('Envoi de votre demande en cours…');

        var controller = 'AbortController' in window ? new AbortController() : null;
        var timeout = window.setTimeout(function () { if (controller) controller.abort(); }, 12000);

        fetch(form.getAttribute('action') || '/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)).toString(),
            signal: controller ? controller.signal : undefined
        }).then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            setLoading(false);
            showSuccess('sent');
        }).catch(function () {
            // Site ouvert en local, formulaires Netlify inactifs, réseau coupé… :
            // la demande passe par la messagerie du visiteur, comme auparavant.
            setLoading(false);
            fallbackToMailto();
        }).then(function () {
            window.clearTimeout(timeout);
        });
    });
})();
