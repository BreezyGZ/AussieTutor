import fs from 'fs';
import axios from 'axios';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const CARD_FILE_PATH = path.join(__dirname, './allCards.txt');
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000

const updateCardNames = async () => {
  try {
    const response = await axios.get('https://api.scryfall.com/catalog/card-names');
    const cardNames = response.data.data;
    await fs.promises.writeFile(CARD_FILE_PATH, JSON.stringify(cardNames, null, 2), 'utf8');
    console.log("✅ Card names updated");
  } catch (error) {
    console.error('Error fetching and updating card names:', error);
  }
};

async function getAllCards() {
  const stats = await fs.promises.stat(CARD_FILE_PATH);
  const lastModifiedTime = stats.mtime.getTime();
  const currentTime = Date.now();
  if (currentTime - lastModifiedTime > UPDATE_INTERVAL) {
    console.log('File is outdated. Fetching new card names...');
    await updateCardNames();
  }

  const fileContent = await fs.promises.readFile(CARD_FILE_PATH, 'utf8');
  const cardNames = JSON.parse(fileContent);
  return(cardNames);
}

export { getAllCards, updateCardNames };