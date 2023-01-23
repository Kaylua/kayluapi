// Chargement du fichier .env
require('dotenv').config();

// Chargement sur serveur HTTP
exports.http = require('http');

exports.TOKEN=process.env.BOT_TOKEN;//clé du boot discord

<<<<<<< HEAD:Bot/core/config.js
exports.PREFIX ="+";//préfix d'appel du boot
=======
exports.PREFIX ="+";//préfix d'appel du boot
>>>>>>> c80c7c8cd458877ccbf076cc2be5797424fd91a9:BOT/core/config.js
