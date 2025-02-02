import { CardDetails } from "../../interfaces.js";
import axios from 'axios';
import * as cheerio from 'cheerio';

// URL to scrape
const MTGMATE_URL = 'https://www.mtgmate.com.au';
// const MAGICCARDS_URL = 'https://magiccards.com.au/search/product?search_api_views_fulltext='

async function scrapeMtgMate(cardURI: string): Promise<any[]> {
  const card = decodeURIComponent(cardURI);
  try {
    const { data } = await axios.get(`${MTGMATE_URL}/cards/search?q=${card}`);
    const $ = cheerio.load(data);
    const reactProps = $('div[data-react-class="FilterableTable"]').attr('data-react-props');

    if (!reactProps) {
      console.error('No data-react-props found.');
      return [];
    }
    const parsedData = JSON.parse(reactProps).uuid;
    // console.log(parsedData)
    let cleanData = [];

    for (const key in parsedData) {
      // console.log(parsedData[key])
      const name = parsedData[key].name;
      const stock = parsedData[key].quantity;
      const price = parsedData[key].price / 100;
      const link = `${MTGMATE_URL}${parsedData[key].link_path}`
      const match = name.match(/^(.*?)\s*\((.*?)\)$/);
      let cardname = name;
      let details = null;
      // console.log(name)
      if (match) {
          cardname = match[1].trim();
          details = match[2].trim();
      }
      // console.log(`Looking for: ${card}, Found: ${cardname}`)
      if (stock === 0) {
        continue;
      }
      else if (cardname.toLowerCase() !== card.toLowerCase()) {
        continue;
      }
      cleanData.push({
        store: "MTGMate",
        cardname,
        details,
        set: parsedData[key].set_name,
        price,
        condition: parsedData[key].condition,
        stock,
        finish: parsedData[key].finish,
        image: parsedData[key].image,
        link
      });
    }
    console.log("MTGMate")
    console.log(cleanData)
    return cleanData;
  } 
  catch (error) {
    console.error(error);
    return [];
  }
}

// function removeDuplicateCards(cards: CardDetails[]): CardDetails[] {
//   const seen = new Set<string>();
//   return cards.filter(card => {
//     const identifier = `
//       ${card.cardname.toLowerCase()}|
//       ${(card.details?.toLowerCase() || '')}|
//       ${(card.set?.toLowerCase() || '')}|
//       ${(card.price)}|
//       ${(card.condition?.toLowerCase() || '')}
//       ${(card.stock)}
//       ${(card.finish?.toLowerCase() || '')}|
//     `;

//       if (seen.has(identifier)) {
//           return false;
//       }
//       seen.add(identifier);
//       return true;
//   });
// }

export default async function scrape(card: string): Promise<CardDetails[]> {
  try {
    // Fetch data from both APIs concurrently
    const [hothub_res, gamesportal_res, mate] = await Promise.all([
      fetch(`http://localhost:5000/api/magiccards?card=${encodeURIComponent(card)}`),
      fetch(`http://localhost:5000/api/gamesportal?card=${encodeURIComponent(card)}`),
      scrapeMtgMate(card),
    ]);

    const hothub = hothub_res.ok ? await hothub_res.json() : [];
    const gamesportal = gamesportal_res.ok ? await gamesportal_res.json() : [];

    const allCards = [...hothub, ...gamesportal, ...mate];
    return allCards.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error("Error scraping card data:", error);
    return [];
  }
}

// (async () => {
//   const card = 'Firebolt';
//   const results = await scrape(card);
//   console.log('Scrape Results:', results);
// })();

// scrape("Firebolt")