import fs from 'fs';

export const createCategoriesCsv = (data) => {
  //   const jsonParsed = JSON.parse(data);

  let csvContent = 'href,text\n';

  data.forEach((item) => {
    csvContent += `${item.href},${item.text}\n`;
  });

  // Escribir el CSV en un archivo
  fs.writeFileSync('./src/data/categories.csv', csvContent);

  console.log('CSV creado exitosamente. 😊');
};
