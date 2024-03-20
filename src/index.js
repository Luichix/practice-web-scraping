import express from 'express';
import routerExtract from './routes/extract.js';

const app = express();

app.use('/extract', routerExtract);

app.get('/', (_, res) => {
  res.send('Bienvenido al servidor de extracción de artículos');
});

const PORT = 3100;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT} 🚀`);
});
