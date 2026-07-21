const fs = require('fs');
const path = require('path');
const sharp = require('../client/node_modules/sharp');

const publicDir = path.join(__dirname, '../client/public');
const databasePath = path.join(__dirname, '../client/src/data/database.json');

// Recursive function to get files
function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}

async function convertImages() {
  console.log('Scanning for images in', publicDir);
  const allFiles = getFiles(publicDir);
  
  const imageFiles = allFiles.filter(file => 
    file.toLowerCase().endsWith('.png') || 
    file.toLowerCase().endsWith('.jpg') || 
    file.toLowerCase().endsWith('.jpeg')
  );

  console.log(`Found ${imageFiles.length} images to convert.`);

  let convertedCount = 0;
  for (const file of imageFiles) {
    try {
      const parsedPath = path.parse(file);
      const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
      
      // Convert to webp
      await sharp(file)
        .webp({ quality: 80 })
        .toFile(webpPath);
        
      // Delete original
      fs.unlinkSync(file);
      convertedCount++;
      
      if (convertedCount % 50 === 0) {
        console.log(`Converted ${convertedCount}/${imageFiles.length}...`);
      }
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err);
    }
  }

  console.log(`Conversion complete! Converted ${convertedCount} images.`);
}

function updateDatabase() {
  console.log('Updating database.json...');
  if (fs.existsSync(databasePath)) {
    let data = fs.readFileSync(databasePath, 'utf8');
    
    // Replace .png, .jpg, .jpeg with .webp (case-insensitive) inside quotes
    data = data.replace(/\.(png|jpg|jpeg)("|')/gi, '.webp$2');
    
    fs.writeFileSync(databasePath, data, 'utf8');
    console.log('Database updated successfully.');
  } else {
    console.warn(`Could not find database at ${databasePath}`);
  }
}

async function run() {
  await convertImages();
  updateDatabase();
  console.log('All tasks completed successfully!');
}

run();
