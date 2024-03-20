import { getBusiness } from './scrapping.js';

export async function fetchDataWithDelays(data) {
  const results = []; // Array to store consolidated results
  for (const item of data) {
    const isAvailable = item.available === 'true'; // Implicit conversion to boolean
    console.log(item);
    if (isAvailable) {
      console.log(
        'Waiting 15 seconds before fetching data for:',
        item.href,
        '😗'
      );
      await new Promise((resolve) => setTimeout(resolve, 15000)); // Delay for 10 seconds

      try {
        const businessData = await getBusiness(item.href);
        console.log('Business data for', item.href, '🥰');
        results.push({ href: item.href, data: businessData }); // Add fetched data with href
      } catch (error) {
        console.error('Error fetching business data for:', item.href, '😢');
        results.push({ href: item.href, error: error.name }); // Add error object for failed fetches
      }
    } else {
      console.log(
        'Skipping business data fetch:',
        item.href,
        'not available 🥺'
      );
      results.push({ href: item.href, available: false }); // Add information for unavailable items
    }
  }
  return results; // Return the consolidated results after all fetches are complete
}
