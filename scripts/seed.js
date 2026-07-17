const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const translate = require('google-translate-api-x');

const baseUrl = "https://jojowiki.com";
const partsUrls = [
  { part: 1, url: "https://jojowiki.com/Category:Part_1_Characters" },
  { part: 2, url: "https://jojowiki.com/Category:Part_2_Characters" },
  { part: 3, url: "https://jojowiki.com/Category:Part_3_Characters" },
  { part: 4, url: "https://jojowiki.com/Category:Part_4_Characters" },
  { part: 5, url: "https://jojowiki.com/Category:Part_5_Characters" },
  { part: 6, url: "https://jojowiki.com/Category:Part_6_Characters" }
];

const manualNameOverrides = {
    'ja': {
        'Noriaki Kakyoin': '花京院典明'
    }
};

const keysToTranslate = ['Age', 'Nationality', 'Occupation', 'Status', 'Gender', 'Zodiac Sign', 'Height', 'Weight'];

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchCharacterList(listUrl, partNum) {
    console.log(`Fetching character list for Part ${partNum}...`);
    const res = await axios(listUrl);
    const $ = cheerio.load(res.data);
    const characters = [];
    $('.charbox').each((i, el) => {
        const name = $(el).find('a').attr('title');
        const urlPath = $(el).find('a').attr('href');
        let image = $(el).find('a > img').attr('src');
        if (image && image.startsWith('/')) image = baseUrl + image;
        
        if (name && urlPath) {
            characters.push({
                id: urlPath.replace('/', ''),
                name_en: name,
                url: baseUrl + urlPath,
                image: image || null,
                part: partNum
            });
        }
    });
    console.log(`Found ${characters.length} characters in Part ${partNum}.`);
    return characters;
}

async function fetchCharacterDetails(url) {
    const res = await axios(url);
    const $ = cheerio.load(res.data);
    const info = {};
    $('.pi-item[data-source]').each((i, el) => {
        const k = $(el).find('.pi-data-label').text().replace(/\[.*?\]/g, '').trim();
        const v = $(el).find('.pi-data-value').text().replace(/\[.*?\]/g, '').trim();
        if(k && v) info[k] = v;
    });
    const audio = [];
    $('audio source').each((i, el) => {
        const src = $(el).attr('src');
        if (src) audio.push(src);
    });
    const images = [];
    $('.pi-item[data-source="image"] img').each((i, el) => {
        let src = $(el).attr('src');
        if (src) {
            if (src.startsWith('/')) src = baseUrl + src;
            images.push(src);
        }
    });
    return { info, audio, images };
}

async function run() {
    try {
        let allChars = [];
        for (const p of partsUrls) {
            const chars = await fetchCharacterList(p.url, p.part);
            allChars = allChars.concat(chars);
        }
        
        // Remove duplicates if a character appears in multiple parts, or just keep the first occurrence?
        // Actually it's okay to just fetch all, but we might want to deduplicate by id.
        const seen = new Set();
        const chars = [];
        for (const c of allChars) {
            if (!seen.has(c.id)) {
                seen.add(c.id);
                chars.push(c);
            }
        }
        
        const db = { characters: [] };
        let count = 0;

        for (const c of chars) {
            count++;
            console.log(`[${count}/${chars.length}] Processing ${c.name_en}...`);
            
            // 1. Fetch details
            let details;
            try {
                details = await fetchCharacterDetails(c.url);
            } catch (e) {
                console.error(`Failed to fetch details for ${c.name_en}`, e.message);
                details = { info: {}, audio: [], images: [] };
            }

            // 2. Translate Name
            let name_ja = c.name_en;
            let name_vi = c.name_en;
            
            try {
                let t_ja = await translate(c.name_en, {to: 'ja'});
                name_ja = (manualNameOverrides['ja'] && manualNameOverrides['ja'][c.name_en]) ? manualNameOverrides['ja'][c.name_en] : t_ja.text;
            } catch(e) {}
            if (manualNameOverrides['vi'] && manualNameOverrides['vi'][c.name_en]) {
                name_vi = manualNameOverrides['vi'][c.name_en];
            }

            // 3. Translate Info
            const info_en = details.info;
            const info_ja = { ...info_en };
            const info_vi = { ...info_en };

            const valsToTranslate = [];
            const keysFound = [];
            for (let k of keysToTranslate) {
                if (info_en[k]) {
                    valsToTranslate.push(info_en[k]);
                    keysFound.push(k);
                }
            }

            if (valsToTranslate.length > 0) {
                try {
                    const res_ja = await translate(valsToTranslate, {to: 'ja'});
                    res_ja.forEach((t, i) => info_ja[keysFound[i]] = t.text);
                } catch(e) {}
                try {
                    const res_vi = await translate(valsToTranslate, {to: 'vi'});
                    res_vi.forEach((t, i) => info_vi[keysFound[i]] = t.text);
                } catch(e) {}
            }

            // 4. Build final object
            const charRecord = {
                id: c.id,
                url: c.url,
                image: c.image,
                name: {
                    en: c.name_en,
                    ja: name_ja,
                    vi: name_vi
                },
                part: c.part,
                details: {
                    images: details.images,
                    audio: details.audio,
                    info: {
                        en: info_en,
                        ja: info_ja,
                        vi: info_vi
                    }
                }
            };

            db.characters.push(charRecord);
            
            // Wait to avoid rate limits
            await delay(500); 
        }

        fs.writeFileSync('./client/src/data/database.json', JSON.stringify(db, null, 2));
        console.log("Database seeded successfully at ./client/src/data/database.json");
    } catch (err) {
        console.error("Seed failed:", err);
    }
}

run();
