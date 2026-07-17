const axios = require('axios');
const cheerio = require('cheerio');

axios('https://jojowiki.com/Star_Platinum').then(res => {
    const $ = cheerio.load(res.data);
    const statsMap = {
        'destpower': 'Destructive Power',
        'speed': 'Speed',
        'range': 'Range',
        'stamina': 'Persistence',
        'precision': 'Precision',
        'potential': 'Development Potential'
    };
    
    const stats = {};
    
    // Sometimes stats are in data-source="[statname]"
    $('[data-source]').each((i, el) => {
        const source = $(el).attr('data-source');
        if (statsMap[source] && !stats[statsMap[source]]) {
            // JoJo wiki often hides the stat inside a span, a div, or an image title.
            // Let's print the entire text of the parent and see if we can extract A-E.
            let text = $(el).text();
            console.log("Found source:", source);
            console.log("Text:", text);
            console.log("HTML:", $(el).html());
        }
    });
});
