const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const dbPath = path.join(__dirname, '../client/src/data/database.json');
const baseUrl = "https://jojowiki.com";

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchRelativesAndSpecies(url) {
    if (!url || !url.startsWith('http')) return null;
    
    console.log(`Fetching ${url}...`);
    try {
        const res = await axios(url);
        const $ = cheerio.load(res.data);
        
        let relativesText = "";
        let species = "";

        // Parse infobox
        $('.pi-item[data-source]').each((i, el) => {
            const label = $(el).find('.pi-data-label').text().replace(/\[.*?\]/g, '').trim();
            const valueEl = $(el).find('.pi-data-value');
            
            if (label === 'Relatives' || label === 'Relationships' || label === 'Family') {
                // Relatives are usually in a list or separated by <br>
                // We'll extract text from child nodes, keeping basic formatting
                let items = [];
                valueEl.find('a').each((j, aEl) => {
                    const relationNode = aEl.nextSibling;
                    let relationText = "";
                    if (relationNode && relationNode.nodeType === 3) { // Text node
                        relationText = relationNode.nodeValue.replace(/\[.*?\]/g, '').trim();
                    }
                    if (relationText && !relationText.startsWith('(')) {
                        // Sometimes relation is before or in parentheses
                        relationText = ` ${relationText}`;
                    }
                    items.push($(aEl).text() + relationText);
                });
                
                // If the structured parsing didn't get anything good, fallback to raw text but clean it
                if (items.length === 0) {
                   relativesText = valueEl.text().replace(/\[.*?\]/g, '').trim();
                } else {
                   relativesText = items.join('\n');
                }
            }
            
            if (label === 'Species') {
                species = valueEl.text().replace(/\[.*?\]/g, '').trim();
            }
        });

        return {
            relatives: relativesText || null,
            species: species || null
        };

    } catch (e) {
        console.error(`Failed to fetch ${url}: ${e.message}`);
        return null;
    }
}

async function run() {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    let count = 0;
    
    console.log(`Fetching extra info for ${db.characters.length} characters...`);
    
    for (const char of db.characters) {
        if (!char.url) continue;
        
        const data = await fetchRelativesAndSpecies(char.url);
        if (data) {
            if (data.relatives) char.details.info.en.Relatives = data.relatives;
            if (data.species) char.details.info.en.Species = data.species;
            count++;
        }
        await delay(300); // polite rate limiting
        
        // Save incrementally
        if (count % 20 === 0) {
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        }
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log(`Finished fetching extra info. Updated ${count} characters!`);
}

run();
