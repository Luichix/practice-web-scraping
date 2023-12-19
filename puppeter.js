import puppeteer from 'puppeteer';

export const getQuotes = async (url) => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto(
    'https://www.yelu.com.ni/company/33158/Laboratorio_De_Bioan%C3%A1lisis_Cl%C3%ADnico_San_Angel#map',
    {
      waitUntil: 'domcontentloaded',
    }
  );

  // Get page data
  const quotes = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    const detailsList = document.querySelectorAll('.info');

    // Fetch the sub-elements from the previously fetched quote element
    // Get the displayed text and return it (`.innerText`)
    // const text = quote.querySelector('.info').innerText;
    // const author = quote.querySelector('.author').innerText;

    // return { text };

    return Array.from(detailsList).map((quote) => {
      // Fetch the sub-elements from the previously fetched quote element
      // Get the displayed text and return it (`.innerText`)
      //   const text = quote.querySelector('.info').innerText;
      // const author = quote.querySelector(".author").innerText;

      const text = quote.innerHTML;

      return { text };
    });
  });

  // Display the quotes
  console.log(quotes);
  // Close the browser
  await browser.close();
  return quotes;
};

// Start the scraping
getQuotes();
