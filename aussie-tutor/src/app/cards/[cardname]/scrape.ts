import { CardDetails } from "../../interfaces.js";
import axios from 'axios';
import * as cheerio from 'cheerio';

// URL to scrape
const MTGMATE_URL = 'https://www.mtgmate.com.au/cards/search?q=';
const MAGICCARDS_URL = 'https://magiccards.com.au/search/product?search_api_views_fulltext='

async function scrapeMtgMate(card: string): Promise<any[]> {
  try {
    const { data } = await axios.get(MTGMATE_URL + card);
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
      const match = name.match(/^(.*?)\s*\((.*?)\)$/);
      let cardname = name;
      let details = null;
      // console.log(name)
      if (match) {
          cardname = match[1].trim();
          details = match[2].trim();
      }

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
        finish: parsedData[key].finish
      });
    }
    // console.log(cleanData)
    return cleanData;
  } 
  catch (error) {
    console.error(error);
    return [];
  }
}

function removeDuplicateCards(cards: CardDetails[]): CardDetails[] {
  const seen = new Set<string>();
  return cards.filter(card => {
    const identifier = `
      ${card.cardname.toLowerCase()}|
      ${(card.details?.toLowerCase() || '')}|
      ${(card.set?.toLowerCase() || '')}|
      ${(card.price)}|
      ${(card.condition?.toLowerCase() || '')}
      ${(card.stock)}
      ${(card.finish?.toLowerCase() || '')}|
    `;

      if (seen.has(identifier)) {
          return false;
      }
      seen.add(identifier);
      return true;
  });
}

export default async function scrape(card:string) {
  const hothub_res = await fetch(`http://localhost:5000/api/magiccards?card=${encodeURIComponent(card)}`);
  const hothub = await hothub_res.json();
  // console.log(hothub)

  const mate = await scrapeMtgMate(card);

  let allCards = [...hothub, ...mate]
  // let allCards = [...mate]
  const sortedCards = allCards.sort((a, b) => a.price - b.price)

  console.log(sortedCards)
  return sortedCards
}

// (async () => {
//   const card = 'Firebolt';
//   const results = await scrape(card);
//   console.log('Scrape Results:', results);
// })();

// scrape("Firebolt")