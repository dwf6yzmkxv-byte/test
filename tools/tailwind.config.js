/** Configuration Tailwind — MontagneNoireLaser.
 *  Reprend à l'identique l'ancienne configuration inline (palette « wood » + polices).
 *  Après toute modification du HTML ou de script.js : `npm run build:css` (voir README.md). */
const path = require('path');
const site = path.join(__dirname, '..', 'site laser ok copie');

module.exports = {
    // Fichiers analysés pour ne garder que les classes réellement utilisées
    content: [
        path.join(site, 'index.html'),
        path.join(site, 'script.js'),
    ],
    theme: {
        extend: {
            colors: {
                wood: {
                    50:  '#f7f3ef',
                    100: '#efe6dc',
                    300: '#d4a373',
                    500: '#a98467',
                    700: '#7a6350',
                    800: '#5e503f',
                    900: '#1e1a15',
                },
                // Couleur d'action (boutons « Commander », liens forts) et fonds clairs
                ember: { 50: '#fbeee6', 500: '#b8501c', 600: '#9a4116' },
                paper: '#fbf8f3',
                sand:  '#f3ece1',
                line:  '#e6dccd',
            },
            fontFamily: {
                serif: ['"Playfair Display"', '"Playfair Display Fallback"', 'serif'],
                sans:  ['"Lato"', '"Lato Fallback"', 'sans-serif'],
            },
        },
    },
};
