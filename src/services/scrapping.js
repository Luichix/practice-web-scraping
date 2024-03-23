import puppeteer from 'puppeteer';

export const getCategories = async (url) => {
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
  // - open the "URL" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });

  // Get page data
  const categories = await page.evaluate(() => {
    // Fetch the all a elements
    const anchors = document.querySelectorAll('a');

    return Array.from(anchors).map((anchor) => {
      return {
        url: anchor.href,
        name: anchor.textContent,
      };
    });
  });

  // Close the browser
  await browser.close();
  return categories;
};

export const getBusiness = async (url, categoryId) => {
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
  // - open the "URL" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });

  // Get page data

  try {
    const business = await page.evaluate(() => {
      // Fetch the all a elements
      const divElement = document.getElementById('basic-listings');

      const ulElement = divElement.querySelector('ul');
      return Array.from(ulElement.children).map((liElement) => {
        const nameAnchor = liElement.querySelector('h4 a');
        const name = nameAnchor.textContent;
        const url = nameAnchor.href;

        // Get the entire text content of the paragraph
        const paragraphText = liElement.querySelector('p').innerHTML;

        let address = '';
        let city = '';
        let phone = '';

        if (paragraphText.trim().toLowerCase().indexOf('in ') == 0) {
          city = paragraphText
            .match(/in\s+([^\d-]+)/)[0]
            .slice(2) // Extrae la ciudad hasta el primer dígito o guion
            .trim();
          phone = paragraphText.match(/((?:\d{3}-?)+(?:\d{1,}))/g)[0]; // Extrae el número de teléfono con guiones opcionales
        } else {
          // Split the paragraph text using the `<br>` as a delimiter
          const addressAndPhone = paragraphText.split(/\s*\bbr\b\s*/); // Regular expression for "<br>" with optional whitespace

          const addressAndCity = addressAndPhone[0].replace(/<$/, '').trim();
          phone = addressAndPhone[1]?.replace(/^>/, '').trim(); // Optional chaining to handle potential undefined values

          const lastInIndex = addressAndCity.toLowerCase().lastIndexOf(' in ');

          if (lastInIndex !== -1) {
            // Check if "in" was found
            // Separate the address and city using the last "in" index
            address = addressAndCity.substring(0, lastInIndex).trim();
            city = addressAndCity.substring(lastInIndex + 3).trim(); // Add 2 to skip "in "
          } else {
            address = addressAndCity.trim();
          }
        }

        const result = {
          name,
          url,
          phone,
          address,
          city,
        };

        if (categoryId) {
          result.categoryId = categoryId;
        }

        return result;
      });
    });
    return business;
  } catch (error) {
    throw new Error('Unable to find the query selector property');
  } finally {
    // Close the browser
    await browser.close();
  }
};

export const scrappingBusiness = async (url, categoryId) => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  try {
    // On this new page:
    // - open the "URL" website
    // - wait until the dom content is loaded (HTML is ready)
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    let hasNextPage = true;
    let businessData = [];
    while (hasNextPage) {
      // Get page data

      const pageBusinessData = await page.evaluate(() => {
        // Fetch the all a elements
        const divElement = document.getElementById('basic-listings');
        const ulElement = divElement.querySelector('ul');

        return Array.from(ulElement.children).map((liElement) => {
          let name = '';
          let url = '';
          let phone = '';
          let address = '';
          let city = '';

          const nameTitle = liElement.querySelector('h4');
          const nameAnchor = liElement.querySelector('h4 a');

          if (nameAnchor) {
            name = nameAnchor.textContent;
            url = nameAnchor.href;
          } else {
            name = nameTitle.textContent;
          }

          // Get the entire text content of the paragraph
          const paragraphText = liElement.querySelector('p').innerHTML;

          if (paragraphText.trim().toLowerCase().indexOf('in ') == 0) {
            city = paragraphText
              .match(/in\s+([^\d-]+)/)[0]
              .slice(2) // Extrae la ciudad hasta el primer dígito o guion
              .trim();

            const phoneMatch = paragraphText.match(/((?:\d{3}-?)+(?:\d{1,}))/g);
            phone = phoneMatch ? phoneMatch[0] : ''; // If phone number exists, assign it, otherwise assign an empty string
          } else {
            // Split the paragraph text using the `<br>` as a delimiter
            const addressAndPhone = paragraphText.split(/\s*\bbr\b\s*/); // Regular expression for "<br>" with optional whitespace
            const addressAndCity = addressAndPhone[0].replace(/<$/, '').trim();
            phone = addressAndPhone[1]?.replace(/^>/, '').trim(); // Optional chaining to handle potential undefined values
            const lastInIndex = addressAndCity
              .toLowerCase()
              .lastIndexOf(' in ');
            if (lastInIndex !== -1) {
              // Check if "in" was found
              // Separate the address and city using the last "in" index
              address = addressAndCity.substring(0, lastInIndex).trim();
              city = addressAndCity.substring(lastInIndex + 3).trim(); // Add 2 to skip "in "
            } else {
              address = addressAndCity.trim();
            }
          }

          const result = {
            name,
            url,
            phone,
            address,
            city,
          };

          return result;
        });
      });

      businessData = businessData.concat(pageBusinessData);

      // Check if there's a next page
      const pagination = await page.evaluate(async () => {
        const paginationUl = document.querySelector('.pagination');

        if (paginationUl) {
          const lastLi = paginationUl.lastElementChild;

          // Check if the last li contains an anchor element with text '»'
          const nextPageLink = lastLi.querySelector('a');

          // Perform click if the next page link exists
          if (nextPageLink && nextPageLink.textContent.trim() === '»') {
            return nextPageLink.href; // Return true to indicate that a click was performed
          }
        }
        return;
      });

      hasNextPage = pagination;

      if (hasNextPage) {
        console.log(
          'Waiting 10 seconds before fetching data for next page:',
          hasNextPage,
          '😎'
        );
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Delay for 5 seconds

        await page.goto(hasNextPage, {
          waitUntil: 'domcontentloaded',
        });
      }
    }

    return businessData.map((result) => {
      if (categoryId) {
        result.categoryId = categoryId;
      }
      return result;
    });
  } catch (error) {
    console.error(error);
    throw new Error('No get data from page business category');
  } finally {
    // Close the browser
    await browser.close();
  }
};
