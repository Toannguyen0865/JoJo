const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const dbPath = path.join(__dirname, '../client/src/data/database.json');
const baseUrl = "https://jojowiki.com";

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchStandDetails(standName) {
    // JoJo wiki URLs use underscores
    const safeName = standName.replace(/ /g, '_').replace(/\(Temporarily\)/gi, '').replace(/Spoiler/gi, '').trim();
    if (!safeName || safeName.toLowerCase().includes('unnamed')) return null;

    const url = `${baseUrl}/${encodeURIComponent(safeName)}`;
    console.log(`Fetching ${url}...`);
    try {
        const res = await axios(url);
        const $ = cheerio.load(res.data);
        
        const stats = {};
        let cry = null;
        let abilities = "";

        // Parse infobox
        $('.pi-item[data-source]').each((i, el) => {
            const label = $(el).find('.pi-data-label').text().replace(/\[.*?\]/g, '').trim();
            let value = $(el).find('.pi-data-value').text().replace(/\[.*?\]/g, '').trim();
            
            // Clean up stat letters like "A[1]" or "A (Part 3)"
            if (['Destructive Power', 'Speed', 'Range', 'Persistence', 'Stamina', 'Precision', 'Development Potential'].includes(label)) {
                // Just grab the first letter (A-E, Infinite, None, ? etc)
                const match = value.match(/([A-E]|\?|Infinite|None)/i);
                if (match) value = match[0].toUpperCase();
                stats[label] = value;
            }
            if (label === 'Battle Cry') {
                cry = value;
            }
        });

        // Some stats might use different labels like Stamina vs Persistence
        if (stats['Stamina'] && !stats['Persistence']) stats['Persistence'] = stats['Stamina'];
        delete stats['Stamina'];

        // Try to get abilities text
        // JoJo wiki abilities are usually under h2 or h3 with id="Abilities"
        const abilitiesHeading = $('#Abilities').parent();
        if (abilitiesHeading.length > 0) {
            let nextEl = abilitiesHeading.next();
            let count = 0;
            while(nextEl.length > 0 && !nextEl.is('h2, h3') && count < 5) {
                if (nextEl.is('p')) {
                    abilities += nextEl.text().replace(/\[.*?\]/g, '').trim() + '\n\n';
                }
                nextEl = nextEl.next();
                count++;
            }
        }
        
        return {
            stats: Object.keys(stats).length > 0 ? stats : null,
            cry,
            abilities: abilities.trim() || null
        };

    } catch (e) {
        console.error(`Failed to fetch ${url}: ${e.message}`);
        return null;
    }
}

async function run() {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    let count = 0;
    
    // Collect unique stand names to avoid refetching
    const stands = new Set();
    db.characters.forEach(c => {
        if (c.details && c.details.info && c.details.info.en && c.details.info.en.Stand) {
            stands.add(c.details.info.en.Stand);
        }
    });

    console.log(`Found ${stands.size} unique stands. Fetching data...`);
    const standDataMap = {};
    
    for (const standName of stands) {
        if (standName.toLowerCase().includes("unnamed")) continue;
        const data = await fetchStandDetails(standName);
        if (data) {
            standDataMap[standName] = data;
            count++;
        }
        await delay(300); // polite rate limiting
    }

    console.log(`Fetched details for ${count} stands. Updating database...`);

    // Add stand data to characters
    db.characters.forEach(c => {
        if (c.details && c.details.info && c.details.info.en && c.details.info.en.Stand) {
            const standName = c.details.info.en.Stand;
            if (standDataMap[standName]) {
                if (!c.stand_details) c.stand_details = {};
                c.stand_details = standDataMap[standName];
            }
        }
    });

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log("Database updated with Stand details!");
}

run();
