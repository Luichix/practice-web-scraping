import express from 'express';
import { extract } from '@extractus/article-extractor';

const app = express();

// Ruta principal que muestra un mensaje de bienvenida
app.get('/', (req, res) => {
  res.send('Bienvenido al servidor de extracción de artículos');
});

// Ruta para extraer información de una URL dada
app.get('/extract', async (req, res) => {
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

const PORT = 3100;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
