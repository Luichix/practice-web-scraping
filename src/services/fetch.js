import { getBusiness } from './scrapping.js';

export async function fetchDataWithDelays(data) {
  const results = []; // Array to store consolidated results
  for (const item of data) {
    const isAvailable = item.able; // Implicit conversion to boolean
    console.log(item);
    if (isAvailable) {
      console.log(
        'Waiting 15 seconds before fetching data for:',
        item.url,
        '😗'
      );
      await new Promise((resolve) => setTimeout(resolve, 15000)); // Delay for 10 seconds

      try {
        const businessData = await getBusiness(item.url, item.id);
        console.log('Business data for', item.url, '🥰');
        results.push({ url: item.url, data: businessData }); // Add fetched data with url
      } catch (error) {
        console.error('Error fetching business data for:', item.url, '😢');
        results.push({ url: item.url, error: error.name }); // Add error object for failed fetches
      }
    } else {
      console.log(
        'Skipping business data fetch:',
        item.url,
        'not available 🥺'
      );
      results.push({ url: item.url, available: false }); // Add information for unavailable items
    }
  }
  return results; // Return the consolidated results after all fetches are complete
}
