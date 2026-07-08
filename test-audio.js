const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://jojowiki.com/Jotaro_Kujo')
  .then(res => {
    const $ = cheerio.load(res.data);
    const audio = [];
    $('audio source').each((i, el) => audio.push($(el).attr('src')));
    const aTags = [];
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && (href.endsWith('.ogg') || href.endsWith('.mp3'))) aTags.push(href);
    });
    console.log("Audio sources:", audio);
    console.log("A tags with audio:", aTags);
  })
  .catch(console.error);
