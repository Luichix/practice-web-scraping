import { Router } from 'express';
import { extract } from '@extractus/article-extractor';
import { getBusiness, getCategories } from '../services/scrapping.js';
import { createCategoriesCsv } from '../utils/createCSV.js';
import { readCsvData } from '../utils/readCSV.js';
import { fetchDataWithDelays } from '../services/fetch.js';
import { createBusinessJSON } from '../utils/createJSON.js';

const routerExtract = Router();

// Ruta para extraer información de una URL dada
routerExtract.get('/', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      error: 1,
      message: 'URL missing in query parameters',
    });
  }

  try {
    const data = await extract(url);
    res.json({
      error: 0,
      message: 'Article extracted successfully',
      data,
    });
  } catch (err) {
    res.status(500).json({
      error: 1,
      message: 'Error extracting article: ' + err.message,
    });
  }
});

routerExtract.get('/categories', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      error: 1,
      message: 'URL missing in query parameters',
    });
  }

  try {
    const data = await getCategories(url);
    createCategoriesCsv(data);
    res.json({
      error: 0,
      message: 'Article extracted successfully',
      data,
    });
  } catch (err) {
    res.status(500).json({
      error: 1,
      message: 'Error extracting article: ' + err.message,
    });
  }
});

routerExtract.get('/business', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      error: 1,
      message: 'URL missing in query parameters',
    });
  }

  try {
    const data = await getBusiness(url);

    res.json({
      error: 0,
      message: 'Article extracted successfully',
      data,
    });
  } catch (err) {
    res.status(500).json({
      error: 1,
      message: 'Error extracting article: ' + err.message,
    });
  }
});

routerExtract.get('/business-list', async (req, res) => {
  const offset = req.query.offset;
  const limit = req.query.limit;

  if (!offset && !limit) {
    return res.status(400).json({
      error: 1,
      message: 'Limit or Offset missing in query parameters',
    });
  }

  try {
    const data = await readCsvData('src/data/available.csv', offset, limit); // Replace 'your_csv_file.csv' with your actual file path

    const consolidatedData = await fetchDataWithDelays(data);

    const jsonData = JSON.stringify(consolidatedData);

    createBusinessJSON(
      jsonData,
      `business-${offset}-${parseInt(limit) + parseInt(offset)}`
    );

    res.json({
      error: 0,
      message: 'Article extracted successfully',
      data: consolidatedData,
    });
  } catch (err) {
    res.status(500).json({
      error: 1,
      message: 'Error extracting article: ' + err.message,
    });
  }
});

export default routerExtract;
