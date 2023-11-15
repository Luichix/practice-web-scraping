// es6 module
import { extract } from '@extractus/article-extractor';
import express from 'express';

const app = express();

app.get('/', async (req, res) => {
  // const url = req.query.url
  const url =
    'https://www.yelu.com.ni/company/33158/Laboratorio_De_Bioan%C3%A1lisis_Cl%C3%ADnico_San_Angel#map';

  if (!url) {
    return res.json(meta);
  }
  try {
    const data = await extract(url);
    const extra = await getQuotes();
    return res.json({
      error: 0,
      message: 'article has been extracted successfully',
      data,
      extra,
    });
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message,
      data: null,
    });
  }
});

app.listen(3100, () => {
  console.log('Server is running at http://localhost:3100');
});
