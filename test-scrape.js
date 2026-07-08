const axios = require('axios');
const cheerio = require('cheerio');

axios('https://jojowiki.com/Jotaro_Kujo').then(r => {
    const $ = cheerio.load(r.data);
    const images = [];
    $('.pi-item[data-source="image"] img').each((i, el) => {
        let src = $(el).attr('src');
        if (src) {
           if (src.startsWith('/')) src = "https://jojowiki.com" + src;
           images.push(src);
        }
    });
    console.log(images);
}).catch(console.error);
