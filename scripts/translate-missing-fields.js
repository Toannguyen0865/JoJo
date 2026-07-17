const fs = require('fs');
const translate = require('google-translate-api-x');

const dbPath = './client/src/data/database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const fieldsToTranslate = [
  'Alias', 'Namesake*', 'Namesake', 'Birthplace', 'Affiliation', 
  'Color', 'Food', 'Hobbies', 'Dislikes', 'Residence', 
  'Movie', 'Musician', 'Athlete', 'Woman Type', 'Eye Color', 
  'Goals', 'Yearly Income', 'Marital Status', 'Date of Death', 'Cause of Death',
  'Manga Debut', 'Final Appearance', 'Anime Debut', 'OVA Debut', 'Live-Action Debut', 'Game Debut', 'FinalAppearance'
];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  const uniqueStrings = new Set();
  
  db.characters.forEach(c => {
    if (c.details && c.details.info && c.details.info.en) {
      fieldsToTranslate.forEach(f => {
        const val = c.details.info.en[f];
        if (val) {
          // Verify if it's already translated in ja and vi by checking if they are different from en
          // Actually, just collect it if ja or vi is identical to en
          const jaVal = c.details.info.ja ? c.details.info.ja[f] : null;
          const viVal = c.details.info.vi ? c.details.info.vi[f] : null;
          
          if (jaVal === val || viVal === val || !jaVal || !viVal) {
             uniqueStrings.add(val);
          }
        }
      });
    }
  });

  const strings = Array.from(uniqueStrings);
  console.log(`Found ${strings.length} unique strings to translate.`);

  const translationsJA = {};
  const translationsVI = {};

  const batchSize = 30;
  for (let i = 0; i < strings.length; i += batchSize) {
    const batch = strings.slice(i, i + batchSize);
    console.log(`Translating batch ${i/batchSize + 1} of ${Math.ceil(strings.length/batchSize)}...`);
    
    try {
      const resJA = await translate(batch, { to: 'ja' });
      const resVI = await translate(batch, { to: 'vi' });
      
      batch.forEach((str, idx) => {
        translationsJA[str] = Array.isArray(resJA) ? resJA[idx].text : resJA.text;
        translationsVI[str] = Array.isArray(resVI) ? resVI[idx].text : resVI.text;
      });
    } catch(e) {
      console.error('Translation error:', e.message);
    }
    
    await delay(1000); // 1s delay between batches
  }

  let updatedCount = 0;
  db.characters.forEach(c => {
    if (c.details && c.details.info && c.details.info.en) {
      if (!c.details.info.ja) c.details.info.ja = { ...c.details.info.en };
      if (!c.details.info.vi) c.details.info.vi = { ...c.details.info.en };
      
      fieldsToTranslate.forEach(f => {
        const val = c.details.info.en[f];
        if (val) {
          if (translationsJA[val]) {
            c.details.info.ja[f] = translationsJA[val];
            updatedCount++;
          }
          if (translationsVI[val]) {
            c.details.info.vi[f] = translationsVI[val];
          }
        }
      });
    }
  });

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Successfully updated fields using Google Translate!`);
}

run();
