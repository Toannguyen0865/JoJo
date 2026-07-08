const fs = require('fs');

const dbPath = './client/src/data/database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const manualOverrides = {
    'DIO': 'ディオ',
    'Erina Joestar': 'エリナ・ジョースター',
    'Suzi Q Joestar': 'スージー・Q・ジョースター',
    'Holy Kujo': '空条 ホリィ',
    'Lisa Lisa': 'リサリサ'
};

let count = 0;
for (let c of db.characters) {
    const realJa = c.details.info.en['Japanese Name'];
    
    if (manualOverrides[c.name.en]) {
        c.name.ja = manualOverrides[c.name.en];
        count++;
    } else if (realJa && c.name.ja !== realJa) {
        c.name.ja = realJa;
        count++;
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Patched Japanese names for ${count} characters.`);
