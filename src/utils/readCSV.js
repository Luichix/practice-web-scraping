import fs from 'fs';

export async function readCsvData(filePath, offset = 0, limit = 0) {
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
      .slice(offset, offset + limit)
      .map((line) => {
        const values = line.trim().split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || ''; // Assign values to object with headers as keys
          return obj;
        }, {});
      });

    return results;
  } catch (error) {
    console.error(error); // Log errors
    throw new Error('Error reading CSV file');
  }
}
