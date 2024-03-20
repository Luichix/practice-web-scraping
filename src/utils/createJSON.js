import fs from 'fs';

// Replace 'data.json' with your desired filename

export const createBusinessJSON = (jsonData, filename) => {
  fs.writeFile(`./src/data/${filename}.json`, jsonData, (err) => {
    if (err) {
      console.error('Error writing JSON file 😔:', err);
    } else {
      console.log('JSON file created successfully:', filename, '🥳');
    }
  });
};
