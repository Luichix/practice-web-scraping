import fs from 'fs';

export async function readCsvData(filePath, offset = 0, limit) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8'); // Read CSV file asynchronously
    const lines = data.split('\n'); // Split lines

    // Handle potential errors:
    if (lines.length === 0) {
      throw new Error('Empty CSV file');
    }

    const headers = lines[0].trim().split(','); // Extract headers from first line

    // Skip header row and apply offset and limit:
    const results = lines
      .slice(1)
      .slice(offset, limit && offset + limit)
      .map((line) => {
        const values = line.trim().split(',');
        return headers.reduce((obj, header, index) => {
          let value = values[index] || ''; // Assign values to object with headers as keys

          // Convert boolean strings to actual boolean values
          if (value.toLowerCase() === 'true' || value === '1') {
            value = true;
          } else if (value.toLowerCase() === 'false' || value === '0') {
            value = false;
          }

          obj[header] = value;
          return obj;
        }, {});
      });

    return results;
  } catch (error) {
    console.error(error); // Log errors
    throw new Error('Error reading CSV file');
  }
}
