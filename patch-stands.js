const fs = require('fs');

const dbPath = './client/src/data/database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const standMap = {
  'Star Platinum': 'スタープラチナ',
  'Hermit Purple': 'ハーミットパープル',
  "Magician's Red": 'マジシャンズレッド',
  'Hierophant Green': 'ハイエロファントグリーン',
  'Silver ChariotAnubis (Temporarily)SpoilerChariot Requiem': 'シルバーチャリオッツ / アヌビス神 / チャリオッツ・レクイエム',
  'The Fool': 'ザ・フール',
  "The WorldJonathan's Stand": 'ザ・ワールド / ジョナサンのスタンド',
  'Tower of Gray': 'タワー・オブ・グレー',
  'Dark Blue Moon': 'ダークブルームーン',
  'Strength': 'ストレングス',
  'Ebony Devil': 'エボニーデビル',
  'Yellow Temperance': 'イエローテンパランス',
  'Hanged Man': 'ハングドマン',
  'Emperor': 'エンペラー',
  'Empress': 'エンプレス',
  'Wheel of Fortune': 'ホウィール・オブ・フォーチュン',
  'Justice': 'ジャスティス',
  'Lovers': 'ラバーズ',
  'Sun': 'サン',
  'Death Thirteen': 'デス・サーティーン',
  'Judgement': 'ジャッジメント',
  'High Priestess': 'ハイプリエステス',
  'Geb': 'ゲブ神',
  'Khnum': 'クヌム神',
  'Tohth': 'トト神',
  'Anubis (Temporarily)': 'アヌビス神',
  'Bastet': 'バステト女神',
  'Sethan': 'セト神',
  'Osiris': 'オシリス神',
  'Horus': 'ホルス神',
  'Atum': 'アトゥム神',
  'Cream': 'クリーム',
  'Unnamed Stand': '名前のないスタンド',
  'Tenore Sax': 'ティナー・サックス',
  'Unnamed Stand (Postmortem)': '名前のないスタンド（死後）',
  'The House of Earth (Novel)': 'ハウス・オブ・アース'
};

let count = 0;
for (let c of db.characters) {
    const standEn = c.details.info.en['Stand'];
    if (standEn && standMap[standEn]) {
        if (c.details.info.ja['Stand'] !== standMap[standEn]) {
            c.details.info.ja['Stand'] = standMap[standEn];
            count++;
        }
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Patched Japanese Stand names for ${count} characters.`);
