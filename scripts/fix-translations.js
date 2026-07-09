const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../client/src/data/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.characters.forEach(char => {
    // Revert Vietnamese name back to English
    char.name.vi = char.name.en;

    const info_en = char.details.info.en;
    const info_vi = char.details.info.vi;

    // Revert specific fields to English
    if (info_en['Stand']) info_vi['Stand'] = info_en['Stand'];
    if (info_en['Namesake']) info_vi['Namesake'] = info_en['Namesake'];
    if (info_en['Alias']) info_vi['Alias'] = info_en['Alias'];
    if (info_en['Blood Type']) info_vi['Blood Type'] = info_en['Blood Type'];

    // Improve Status translation
    if (info_vi['Status']) {
        let statusStr = info_vi['Status'].toLowerCase();
        if (statusStr.includes('chết')) {
            info_vi['Status'] = info_vi['Status'].replace(/chết/gi, 'tử trận');
        }
        if (statusStr.includes('đã chết')) {
            info_vi['Status'] = info_vi['Status'].replace(/đã chết/gi, 'Đã tử trận');
        }
        if (statusStr.includes('sống')) {
            info_vi['Status'] = info_vi['Status'].replace(/sống/gi, 'Còn sống');
        }
    }

    // Improve Nationality translation
    if (info_en['Nationality']) {
        const nat = info_en['Nationality'];
        let nat_vi = info_vi['Nationality'];
        
        if (nat === 'Japanese') nat_vi = 'Người Nhật Bản';
        if (nat === 'British American') nat_vi = 'Người Mỹ gốc Anh';
        if (nat === 'French') nat_vi = 'Người Pháp';
        if (nat === 'British') nat_vi = 'Người Anh';
        if (nat === 'Egyptian') nat_vi = 'Người Ai Cập';
        if (nat === 'American') nat_vi = 'Người Mỹ';
        if (nat === 'American-Japanese') nat_vi = 'Người Mỹ gốc Nhật';
        if (nat === 'Hongkonger') nat_vi = 'Người Hồng Kông';
        if (nat === 'Italian') nat_vi = 'Người Ý';
        if (nat === 'Unknown-Likely Egyptian') nat_vi = 'Không rõ (Có thể là người Ai Cập)';
        if (nat === 'Unknown') nat_vi = 'Không rõ';

        info_vi['Nationality'] = nat_vi;
    }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Translations patched successfully.");
