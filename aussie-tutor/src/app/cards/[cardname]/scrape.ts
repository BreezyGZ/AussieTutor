import { CardDetails } from "../../interfaces.js";
import axios from 'axios';
import * as cheerio from 'cheerio';
import { BACKEND_URL } from '@/app/backendConfig'
// URL to scrape
const MTGMATE_URL = 'https://www.mtgmate.com.au';
// const MAGICCARDS_URL = 'https://magiccards.com.au/search/product?search_api_views_fulltext='

async function scrapeMtgMate(cardURI: string): Promise<CardDetails[]> {
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
    const cleanData = [];

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
    // console.log("MTGMate")
    // console.log(cleanData)
    return cleanData;
  } 
  catch (error) {
    console.error("scrapeMtgMate" + error);
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

const safeJson = async (res: Response): Promise<any[]> => {
  if (!res.ok) return [];
  try {
    const text = await res.text();
    if (!text) return [];
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return [];
  }
};

export default async function scrape(card: string): Promise<CardDetails[]> {
  console.log(card)
  try {
    const [hothub_res, gamesportal_res, goodgames_res, ronin_res, mate_res] = await Promise.allSettled([
      fetch(`${BACKEND_URL}/api/magiccards?card=${encodeURIComponent(card)}`),
      fetch(`${BACKEND_URL}/api/gamesportal?card=${encodeURIComponent(card)}`),
      fetch(`${BACKEND_URL}/api/goodgames?card=${encodeURIComponent(card)}`),
      fetch(`${BACKEND_URL}/api/ronin?card=${encodeURIComponent(card)}`),
      scrapeMtgMate(card),
    ]);
    const hothub = hothub_res.status === "fulfilled" ? await safeJson(hothub_res.value) : [];
    const gamesportal = gamesportal_res.status === "fulfilled" ? await safeJson(gamesportal_res.value) : [];
    const goodgames = goodgames_res.status === "fulfilled" ? await safeJson(goodgames_res.value) : [];
    const ronin = ronin_res.status === "fulfilled" ? await safeJson(ronin_res.value) : [];
    const mate = mate_res.status === "fulfilled" ? mate_res.value : [];

    const allCards = [...hothub, ...gamesportal, ...mate, ...goodgames, ...ronin];
    console.log(allCards)
    return allCards.sort((a, b) => a.price - b.price);
  } 
  catch (error) {
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
