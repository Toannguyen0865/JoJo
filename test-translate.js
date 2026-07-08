const translate = require('google-translate-api-x');

async function test() {
    try {
        const names = Array(150).fill('Jotaro Kujo');
        const start = Date.now();
        const res = await translate(names, {to: 'ja'});
        console.log(`Translated ${res.length} items in ${Date.now() - start}ms`);
    } catch (e) {
        console.error(e);
    }
}
test();
