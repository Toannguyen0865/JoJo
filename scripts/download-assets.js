const fs = require('fs');
const path = require('path');
const axios = require('axios');

const dbPath = path.join(__dirname, '../client/src/data/database.json');
const publicDir = path.join(__dirname, '../client/public');
const imagesDir = path.join(publicDir, 'images');
const audioDir = path.join(publicDir, 'audio');

// Ensure directories exist
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

async function downloadFile(url, destPath) {
    if (fs.existsSync(destPath)) {
        return; // Already downloaded
    }
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000
        });
        const writer = fs.createWriteStream(destPath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (e) {
        console.error(`Failed to download ${url}: ${e.message}`);
    }
}

function getExt(url) {
    const ext = url.split('.').pop().split('?')[0].split('#')[0];
    if (ext.length > 5) return 'png'; // default fallback if parsing fails
    return ext;
}

async function run() {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    let count = 0;
    
    for (const char of db.characters) {
        count++;
        console.log(`[${count}/${db.characters.length}] Processing assets for ${char.name.en}...`);

        // 1. Main image
        if (char.image && char.image.startsWith('http')) {
            const ext = getExt(char.image);
            const fileName = `${char.id}_main.${ext}`;
            await downloadFile(char.image, path.join(imagesDir, fileName));
            char.image = `/images/${fileName}`;
        }

        // 2. Detail images
        for (let i = 0; i < char.details.images.length; i++) {
            const url = char.details.images[i];
            if (url && url.startsWith('http')) {
                const ext = getExt(url);
                const fileName = `${char.id}_${i}.${ext}`;
                await downloadFile(url, path.join(imagesDir, fileName));
                char.details.images[i] = `/images/${fileName}`;
            }
        }

        // 3. Detail audio
        for (let i = 0; i < char.details.audio.length; i++) {
            const url = char.details.audio[i];
            if (url && url.startsWith('http')) {
                const ext = getExt(url);
                const fileName = `${char.id}_${i}.${ext}`;
                await downloadFile(url, path.join(audioDir, fileName));
                char.details.audio[i] = `/audio/${fileName}`;
            }
        }
        // Save incrementally so the UI updates
        if (count % 5 === 0 || count === db.characters.length) {
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        }
    }

    console.log("Assets downloaded and database updated successfully!");
}

run();
