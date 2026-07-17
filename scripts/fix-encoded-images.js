const fs = require('fs');
const path = require('path');
const db = require('../client/src/data/database.json');
let count = 0;

function sanitize(str) {
  return str.replace(/%/g, '_').replace(/"/g, '_').replace(/'/g, '_');
}

db.characters.forEach(c => {
  if (c.image && c.image.includes('%')) {
    const oldPath = path.join(__dirname, '../client/public', c.image);
    const newImage = sanitize(c.image);
    const newPath = path.join(__dirname, '../client/public', newImage);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      c.image = newImage;
      count++;
    } else if (fs.existsSync(newPath)) {
      c.image = newImage;
      count++;
    }
  }

  c.details.images.forEach((img, i) => {
    if (img && img.includes('%')) {
      const oldPath = path.join(__dirname, '../client/public', img);
      const newImage = sanitize(img);
      const newPath = path.join(__dirname, '../client/public', newImage);
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        c.details.images[i] = newImage;
        count++;
      } else if (fs.existsSync(newPath)) {
        c.details.images[i] = newImage;
        count++;
      }
    }
  });
});

if (count > 0) fs.writeFileSync('./client/src/data/database.json', JSON.stringify(db, null, 2));
console.log('Fixed', count, 'images');
