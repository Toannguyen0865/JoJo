const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
dotenv.config();
app.use(
    bodyParser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 50000 })
);

let db = null;
try {
    const data = fs.readFileSync('./data/database.json', 'utf8');
    db = JSON.parse(data);
    console.log(`Database loaded with ${db.characters.length} characters.`);
} catch (e) {
    console.error("Could not load database.json. Please run seed.js first.");
}

app.get("/v1", (req, res) => {
    if (!db) return res.status(500).json({ message: "Database not loaded", data: [] });
    const lang = req.query.lang || 'en';
    
    const list = db.characters.map(c => ({
        id: c.id,
        name: c.name[lang] || c.name.en,
        url: c.url,
        image: c.image
    }));
    
    res.status(200).json({
        message: "Success",
        data: list
    });
});

app.get("/v1/character", (req, res) => {
    if (!db) return res.status(500).json({ message: "Database not loaded", data: null });
    const urlQuery = req.query.url;
    const lang = req.query.lang || 'en';
    
    if (!urlQuery) return res.status(400).json({ status: "error", message: "Missing url parameter" });

    const char = db.characters.find(c => c.url === urlQuery);
    if (!char) return res.status(404).json({ status: "error", message: "Character not found" });

    const details = {
        images: char.details.images,
        audio: char.details.audio,
        ...char.details.info[lang]
    };

    res.status(200).json({
        status: "success",
        data: details
    });
});

// Image proxy — vượt qua hotlink protection của jojowiki.com
app.get("/proxy-image", async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send("Missing url param");

    try {
        const response = await axios({
            url: imageUrl,
            responseType: "stream",
            headers: {
                "Referer": "https://jojowiki.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });
        res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        response.data.pipe(res);
    } catch (err) {
        console.error("Proxy image error:", err.message);
        res.status(500).send("Failed to fetch image");
    }
});

app.listen(8000, () => {
    console.log("Server running on port 8000");
});