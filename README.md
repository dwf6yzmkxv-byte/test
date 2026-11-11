# MontagneNoireLaser — site vitrine

Site statique d'une page (artisan graveur laser à Mazamet), hébergé sur Netlify.
Aucune ressource tierce n'est chargée : CSS, polices et icônes sont servis par le site lui-même.

## Structure

```
netlify.toml              Configuration Netlify (dossier publié, pas de build côté hébergeur)
site laser ok copie/      ← LE SITE PUBLIÉ (tout ce dossier, et lui seul, est mis en ligne)
  index.html              Page d'accueil (contient aussi le sprite des icônes SVG, en début de <body>)
  mentions-legales.html   Mentions légales / confidentialité / CGV (champs [À COMPLÉTER])
  404.html                Page d'erreur
  script.js               Menu mobile, carrousels, modale et formulaire de devis
  assets/site.css         Feuille de style unique, GÉNÉRÉE (ne pas modifier à la main)
  assets/404.css, legal.css   Styles des deux pages annexes (modifiables à la main)
  fonts/                  Polices auto-hébergées (Lato 400/700, Playfair Display 700)
  images/                 Images optimisées (AVIF + WebP, plusieurs largeurs)
  _headers, _redirects    En-têtes HTTP (cache, sécurité, CSP) et redirections Netlify
  serve.py                Petit serveur local de prévisualisation
tools/                    Outillage (non publié) : compilation du CSS avec Tailwind
  src/input.css           SOURCE du CSS : polices, styles du site, directives Tailwind
  tailwind.config.js      Couleurs « wood » et polices
  stamp-version.js        Met à jour les ?v=… de site.css et script.js dans index.html
  images-manifest.json    Inventaire des images optimisées (informatif)
sources-images/           Photos d'origine en haute définition (non publiées)
```

## Modifier le site

Le HTML utilise des classes Tailwind (`text-wood-300`, `px-4`…). Seules les classes réellement
présentes dans `index.html` et `script.js` existent dans `assets/site.css`. **Après toute
modification de `index.html`, de `script.js` ou de `tools/src/input.css`, recompiler le CSS :**

```bash
cd tools
npm install          # la première fois seulement (Node.js 18 ou plus)
npm run build:css
```

Cette commande régénère `site laser ok copie/assets/site.css` (minifié) et met à jour les numéros
de version `?v=…` dans `index.html`, pour que les visiteurs reçoivent bien les nouveaux fichiers.
Pendant une séance de travail, `npm run watch:css` recompile à chaque enregistrement
(relancer `npm run build:css` à la fin).

Prévisualiser en local : `python3 "site laser ok copie/serve.py"` puis ouvrir http://localhost:8080
(en local, le formulaire de devis bascule sur l'ouverture de la messagerie : c'est normal).

Ajouter une icône : copier le `<path>` et le `viewBox` de l'icône voulue depuis
`tools/node_modules/@fortawesome/fontawesome-free/svgs/` dans un nouveau `<symbol id="i-nom">` du
sprite (début de `<body>`), puis l'utiliser avec
`<svg class="icon" viewBox="…" aria-hidden="true"><use href="#i-nom"/></svg>`.

Ajouter un service externe (statistiques, vidéo, carte…) : l'autoriser dans la ligne
`Content-Security-Policy` de `site laser ok copie/_headers`, sinon le navigateur le bloquera.
Les styles et scripts « inline » (`<style>`, `style="…"`, `<script>` sans `src`, `onclick`) sont
eux aussi bloqués par cette politique : passer par les fichiers CSS/JS.

## Déployer

- **Via Git (recommandé)** : pousser sur la branche suivie par Netlify. `netlify.toml` indique de
  publier le dossier `site laser ok copie` tel quel ; Netlify ne lance aucun build, il faut donc
  avoir lancé `npm run build:css` et inclure `assets/site.css` et `index.html` dans le commit.
- **Sans Git** : glisser-déposer le dossier `site laser ok copie` dans l'interface Netlify
  (Deploys → « Drag and drop »), ou `netlify deploy --prod --dir "site laser ok copie"`.

Le formulaire de devis utilise Netlify Forms : activer la détection des formulaires dans
l'interface Netlify (Forms → Enable form detection) et configurer la notification par e-mail.

## Crédits

- Icônes : Font Awesome Free 6 (CC BY 4.0) — https://fontawesome.com
- Polices : Lato et Playfair Display (SIL Open Font License 1.1), fichiers issus de Fontsource
- CSS : Tailwind CSS 3.4 (MIT)
