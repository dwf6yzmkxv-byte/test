/* Met à jour les numéros de version (?v=…) des liens vers assets/site.css et script.js
 * dans index.html, à partir d'une empreinte du contenu des fichiers.
 * Ainsi les navigateurs rechargent ces fichiers dès qu'ils changent, malgré la mise en cache.
 * Lancé automatiquement par `npm run build:css`. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const site = path.join(__dirname, '..', 'site laser ok copie');
const indexFile = path.join(site, 'index.html');
let html = fs.readFileSync(indexFile, 'utf8');

for (const file of ['assets/site.css', 'script.js']) {
    const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(site, file))).digest('hex').slice(0, 10);
    const pattern = new RegExp('(["\'])' + file.replace(/[.\/]/g, '\\$&') + '(\\?v=[^"\']*)?\\1');
    if (!pattern.test(html)) throw new Error('Lien vers ' + file + ' introuvable dans index.html');
    html = html.replace(pattern, '$1' + file + '?v=' + hash + '$1');
    console.log(file + ' -> ?v=' + hash);
}
fs.writeFileSync(indexFile, html);
