import { updateCategory } from './prisma.js';
import { scrappingBusiness } from './scrapping.js';
import { addBusiness } from '../services/prisma.js';

export async function fetchDataWithDelays(data) {
  const results = []; // Array to store consolidated results
  for (const item of data) {
    const isAvailable = item.able; // Implicit conversion to boolean

    if (isAvailable) {
      console.log(
        'Waiting 10 seconds before fetching data for:',
        item.id,
        item.url,
        '😗'
      );
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Delay for 10 seconds

      try {
        const businessData = await scrappingBusiness(item.url, item.id);
        const saveData = await addBusiness(businessData);
        results.push({ url: item.url, data: saveData }); // Add fetched data with url
        console.log('Business data for', item.id, item.url, '🥰');
      } catch (error) {
        const updateData = await updateCategory(item.id);

        results.push({ url: item.url, error: error.name, update: updateData }); // Add error object for failed fetches
        console.error('Update category for no available 🥺', updateData);
        console.error(
          'Error fetching business data for:',
          item.id,
          item.url,
          '😢',
          error
        );
      }
    } else {
      console.log(
        'Skipping business data fetch:',
        item.id,
        item.url,
        'not available 🥺'
      );
      results.push({ url: item.url, available: false }); // Add information for unavailable items
    }
  }
  return results; // Return the consolidated results after all fetches are complete
}
