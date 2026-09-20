const fs = require('fs');
let file = fs.readFileSync('app/actions/missions.ts', 'utf8');
file = file.replace(/dY\?\+/g, '🏆');
fs.writeFileSync('app/actions/missions.ts', file);
console.log('Fixed emojis');
