import fs from 'fs';

// Replace 'data.json' with your desired filename

export const createBusinessJSON = (consolidatedData, filename) => {
  const jsonData = JSON.stringify(consolidatedData);

  fs.writeFile(`./src/data/${filename}.json`, jsonData, (err) => {
    if (err) {
      console.error('Error writing JSON file 😔:', err);
    } else {
      console.log('JSON file created successfully:', filename, '🥳');
    }
  });
};
